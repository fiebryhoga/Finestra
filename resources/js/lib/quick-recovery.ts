import type {
    ClinicalInsight,
    DailyMetricRecord,
    RecoveryStatusValue,
} from '@/types';

export type BaseFitnessPreview = {
    hr_max: number;
    hr_ratio: number;
    vo2_max: number;
    peak_power: number;
};

export type RecoveryPreview = {
    score: number;
    status: RecoveryStatusValue;
    shortLabel: string;
};

export type RecoveryStatusMeta = {
    label: string;
    dotClass: string;
    textClass: string;
};

function roundTo(value: number, decimals: number): number {
    const factor = 10 ** decimals;

    return Math.round(value * factor) / factor;
}

export function calculateBaseMetricsPreview(
    age: number,
    rhr: number,
    weight: number,
    vj: number,
): BaseFitnessPreview {
    const safeAge = Number.isFinite(age) && age > 0 ? age : 0;
    const safeRhr = Number.isFinite(rhr) && rhr > 0 ? rhr : 0;
    const safeWeight = Number.isFinite(weight) && weight > 0 ? weight : 0;
    const safeVj = Number.isFinite(vj) && vj > 0 ? vj : 0;

    const hrMax = safeAge > 0 ? roundTo(208 - 0.7 * safeAge, 2) : 0;
    const exactRatio = safeRhr > 0 && hrMax > 0 ? hrMax / safeRhr : 0;
    const hrRatio = roundTo(exactRatio, 2);
    const vo2Max = safeRhr > 0 && hrMax > 0 ? roundTo(15.3 * exactRatio, 2) : 0;
    const peakPower =
        safeVj > 0 && safeWeight > 0
            ? roundTo(60.7 * safeVj + 45.3 * safeWeight - 2055, 3)
            : 0;

    return {
        hr_max: hrMax,
        hr_ratio: hrRatio,
        vo2_max: vo2Max,
        peak_power: peakPower,
    };
}

export function scoreSpo2(spo2: number): number {
    if (spo2 >= 99) return 6;
    if (spo2 >= 98) return 5;
    if (spo2 >= 97) return 4;
    if (spo2 >= 96) return 3;
    if (spo2 >= 95) return 2;

    return 1;
}

export function scoreRhrDeviation(rhrDiff: number): number {
    if (rhrDiff <= 0.9) return 10;
    if (rhrDiff <= 1.9) return 9;
    if (rhrDiff <= 2.9) return 8;
    if (rhrDiff <= 3.9) return 7;
    if (rhrDiff <= 4.9) return 6;
    if (rhrDiff <= 5.9) return 5;
    if (rhrDiff <= 6.9) return 4;
    if (rhrDiff <= 7.9) return 3;
    if (rhrDiff <= 8.9) return 2;

    return 1;
}

export function calculateRecoveryPreview(
    rhr: number,
    spo2: number,
    baselineRhr: number | null,
): RecoveryPreview {
    if (
        !Number.isFinite(rhr) ||
        !Number.isFinite(spo2) ||
        rhr <= 0 ||
        spo2 <= 0
    ) {
        return {
            score: 0,
            status: 'KOSONG',
            shortLabel: 'Kosong',
        };
    }

    const effectiveBaseline =
        baselineRhr !== null && Number.isFinite(baselineRhr) && baselineRhr > 0
            ? baselineRhr
            : rhr;
    const spo2Ratio = scoreSpo2(spo2) / 6;
    const rhrRatio = scoreRhrDeviation(rhr - effectiveBaseline) / 10;
    const rawScore = ((spo2Ratio + rhrRatio) / 2) * 100;
    const score = Math.round(Math.max(0, Math.min(100, rawScore)));

    if (score >= 75) {
        return { score, status: 'RECOVERY BAIK', shortLabel: 'Baik' };
    }

    if (score >= 35) {
        return { score, status: 'RECOVERY CUKUP', shortLabel: 'Cukup' };
    }

    return { score, status: 'RECOVERY KURANG', shortLabel: 'Kurang' };
}

export function getRecoveryStatusMeta(
    status: RecoveryStatusValue,
): RecoveryStatusMeta {
    switch (status) {
        case 'RECOVERY BAIK':
            return {
                label: 'Recovery Baik',
                dotClass: 'bg-emerald-500',
                textClass: 'text-emerald-700 dark:text-emerald-400',
            };
        case 'RECOVERY CUKUP':
            return {
                label: 'Recovery Cukup',
                dotClass: 'bg-amber-500',
                textClass: 'text-amber-700 dark:text-amber-400',
            };
        case 'RECOVERY KURANG':
            return {
                label: 'Recovery Kurang',
                dotClass: 'bg-rose-500',
                textClass: 'text-rose-700 dark:text-rose-400',
            };
        case 'MENGHITUNG...':
            return {
                label: 'Menghitung...',
                dotClass: 'bg-sky-500',
                textClass: 'text-sky-700 dark:text-sky-400',
            };
        default:
            return {
                label: 'Belum Diisi',
                dotClass: 'bg-muted-foreground/50',
                textClass: 'text-muted-foreground',
            };
    }
}

export function computeClinicalInsightsForPeriod(
    filledMetrics: DailyMetricRecord[],
    baselineRhr: number | null,
): ClinicalInsight[] {
    if (filledMetrics.length === 0) {
        return [];
    }

    const total = filledMetrics.length;
    const avgRecovery = Math.round(
        filledMetrics.reduce((sum, m) => sum + m.quick_recovery_score, 0) /
            total,
    );
    const avgRhr = roundTo(
        filledMetrics.reduce((sum, m) => sum + m.rhr, 0) / total,
        1,
    );
    const avgVo2 = roundTo(
        filledMetrics.reduce((sum, m) => sum + m.vo2_max, 0) / total,
        1,
    );

    const oldest = [...filledMetrics].sort((a, b) =>
        a.record_date.localeCompare(b.record_date),
    )[0];
    const effectiveBaseline = baselineRhr ?? oldest?.rhr ?? avgRhr;
    const avgRhrDiff = roundTo(avgRhr - effectiveBaseline, 1);
    const diffSign = avgRhrDiff > 0 ? '+' : '';

    const recoveryInsight: ClinicalInsight =
        avgRecovery >= 75
            ? {
                  category: 'Recovery Overview',
                  level: 'optimal',
                  title: 'Pemulihan Sangat Baik (Excellent Recovery)',
                  summary:
                      'Rata-rata kesiapan pemulihan berada di zona optimal. Atlet siap menjalani beban latihan penuh sesuai program.',
                  value: `${avgRecovery}%`,
              }
            : avgRecovery >= 50
              ? {
                    category: 'Recovery Overview',
                    level: 'warning',
                    title: 'Pemulihan Cukup (Fair Recovery)',
                    summary:
                        'Pemulihan berada pada level moderat. Perhatikan kualitas tidur, hidrasi, dan penyesuaian intensitas latihan.',
                    value: `${avgRecovery}%`,
                }
              : {
                    category: 'Recovery Overview',
                    level: 'risk',
                    title: 'Pemulihan Kurang (Poor Recovery)',
                    summary:
                        'Skor pemulihan rendah menunjukkan akumulasi kelelahan. Evaluasi segera beban latihan, istirahat, dan nutrisi atlet.',
                    value: `${avgRecovery}%`,
                };

    const rhrInsight: ClinicalInsight =
        avgRhrDiff <= 2.0
            ? {
                  category: 'Analisis Klinis RHR',
                  level: 'optimal',
                  title: 'RHR Stabil terhadap Baseline',
                  summary: `Rata-rata RHR (${avgRhr} bpm) konsisten dengan baseline (${effectiveBaseline} bpm), menandakan respons otonom terkendali.`,
                  value: `${diffSign}${avgRhrDiff} bpm`,
              }
            : avgRhrDiff <= 5.0
              ? {
                    category: 'Analisis Klinis RHR',
                    level: 'warning',
                    title: 'Peningkatan RHR Moderat (Elevated RHR)',
                    summary: `Rata-rata RHR meningkat ${diffSign}${avgRhrDiff} bpm di atas baseline (${effectiveBaseline} bpm). Pantau tanda kelelahan kardiovaskular.`,
                    value: `${diffSign}${avgRhrDiff} bpm`,
                }
              : {
                    category: 'Analisis Klinis RHR',
                    level: 'risk',
                    title: 'Lonjakan RHR Signifikan (RHR Spike)',
                    summary: `Lonjakan RHR ${diffSign}${avgRhrDiff} bpm dari baseline (${effectiveBaseline} bpm) merupakan indikator awal overtraining atau kurang istirahat.`,
                    value: `${diffSign}${avgRhrDiff} bpm`,
                };

    const vo2Insight: ClinicalInsight =
        avgVo2 >= 55.0
            ? {
                  category: 'Kapasitas Aerobik VO₂ Max',
                  level: 'optimal',
                  title: 'Kapasitas Aerobik Elit',
                  summary: `Estimasi rata-rata VO₂ Max (${avgVo2} ml/kg/min) menunjukkan daya tahan kardiorespirasi sangat tinggi.`,
                  value: `${avgVo2} ml/kg/min`,
              }
            : avgVo2 >= 45.0
              ? {
                    category: 'Kapasitas Aerobik VO₂ Max',
                    level: 'info',
                    title: 'Kapasitas Aerobik Baik',
                    summary: `Estimasi rata-rata VO₂ Max (${avgVo2} ml/kg/min) berada pada tingkat kebugaran kompetitif yang baik.`,
                    value: `${avgVo2} ml/kg/min`,
                }
              : {
                    category: 'Kapasitas Aerobik VO₂ Max',
                    level: 'warning',
                    title: 'Kapasitas Aerobik Dasar (Average)',
                    summary: `Estimasi rata-rata VO₂ Max (${avgVo2} ml/kg/min) masih dapat ditingkatkan melalui program pengkondisian aerobik terstruktur.`,
                    value: `${avgVo2} ml/kg/min`,
                };

    return [recoveryInsight, rhrInsight, vo2Insight];
}

export function addDaysToIsoDate(isoDate: string, days: number): string {
    const parts = isoDate.split('-').map(Number);

    if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
        return isoDate;
    }

    const utc = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] + days));
    const y = utc.getUTCFullYear();
    const m = String(utc.getUTCMonth() + 1).padStart(2, '0');
    const d = String(utc.getUTCDate()).padStart(2, '0');

    return `${y}-${m}-${d}`;
}
