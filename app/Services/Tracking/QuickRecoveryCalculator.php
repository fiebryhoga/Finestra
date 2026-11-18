<?php

namespace App\Services\Tracking;

use App\Enums\RecoveryStatus;
use App\Models\Athlete;
use App\Models\DailyMetric;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

class QuickRecoveryCalculator
{
    /**
     * Calculate base physiological & neuromuscular metrics from daily inputs.
     *
     * @return array{hr_max: float, hr_ratio: float, vo2_max: float, peak_power: float}
     */
    public function calculateBaseMetrics(int $age, float $rhr, float $weight, float $vj): array
    {
        $hrMax = round(208 - (0.7 * $age), 2);
        $exactHrRatio = $rhr > 0 ? $hrMax / $rhr : 0.0;
        $hrRatio = round($exactHrRatio, 2);
        $vo2Max = $rhr > 0 ? round(15.3 * $exactHrRatio, 2) : 0.0;
        $peakPower = ($vj > 0 && $weight > 0)
            ? round((60.7 * $vj) + (45.3 * $weight) - 2055, 3)
            : 0.0;

        return [
            'hr_max' => $hrMax,
            'hr_ratio' => $hrRatio,
            'vo2_max' => $vo2Max,
            'peak_power' => $peakPower,
        ];
    }

    /**
     * Calculate program calendar week/day label relative to training_start_date.
     */
    public function calculateWeekLabel(?CarbonInterface $trainingStartDate, CarbonInterface $recordDate): string
    {
        if ($trainingStartDate === null) {
            return 'Belum Set Tanggal Mulai';
        }

        $start = $trainingStartDate->copy()->startOfDay();
        $target = $recordDate->copy()->startOfDay();

        if ($target->lt($start)) {
            return 'Sebelum Program';
        }

        $diffInDays = (int) $start->diffInDays($target);
        $week = intdiv($diffInDays, 7) + 1;
        $day = ($diffInDays % 7) + 1;

        return "Week {$week}, Day {$day}";
    }

    /**
     * Score SpO2 on a 1–6 scale (range-safe for decimal inputs).
     */
    public function scoreSpo2(float $spo2): int
    {
        return match (true) {
            $spo2 >= 99.0 => 6,
            $spo2 >= 98.0 => 5,
            $spo2 >= 97.0 => 4,
            $spo2 >= 96.0 => 3,
            $spo2 >= 95.0 => 2,
            default => 1,
        };
    }

    /**
     * Score RHR deviation from baseline on a 1–10 scale.
     */
    public function scoreRhrDeviation(float $rhrDiff): int
    {
        return match (true) {
            $rhrDiff <= 0.9 => 10,
            $rhrDiff <= 1.9 => 9,
            $rhrDiff <= 2.9 => 8,
            $rhrDiff <= 3.9 => 7,
            $rhrDiff <= 4.9 => 6,
            $rhrDiff <= 5.9 => 5,
            $rhrDiff <= 6.9 => 4,
            $rhrDiff <= 7.9 => 3,
            $rhrDiff <= 8.9 => 2,
            default => 1,
        };
    }

    /**
     * Compute Quick Recovery Score (0–100) and RecoveryStatus.
     *
     * @return array{score: int, status: RecoveryStatus}
     */
    public function calculateRecoveryScore(float $rhr, float $spo2, float $baselineRhr): array
    {
        if ($rhr <= 0 || $spo2 <= 0) {
            return [
                'score' => 0,
                'status' => RecoveryStatus::Empty,
            ];
        }

        $spo2Ratio = $this->scoreSpo2($spo2) / 6;
        $rhrDiff = $rhr - $baselineRhr;
        $rhrRatio = $this->scoreRhrDeviation($rhrDiff) / 10;

        $rawRecovery = (($spo2Ratio + $rhrRatio) / 2) * 100;
        $score = (int) round(max(0.0, min(100.0, $rawRecovery)));

        return [
            'score' => $score,
            'status' => RecoveryStatus::fromScore($score),
        ];
    }

    /**
     * Resolve the baseline RHR for an athlete from chronological daily metrics.
     *
     * @param  Collection<int, DailyMetric>  $chronologicalMetrics
     */
    public function resolveBaselineRhr(Athlete $athlete, Collection $chronologicalMetrics): ?float
    {
        if ($athlete->training_start_date !== null) {
            $startMetric = $chronologicalMetrics->first(
                fn (DailyMetric $metric): bool => $metric->rhr > 0
                    && $metric->record_date->isSameDay($athlete->training_start_date),
            );

            if ($startMetric !== null) {
                return $startMetric->rhr;
            }
        }

        $firstFilled = $chronologicalMetrics->first(
            fn (DailyMetric $metric): bool => $metric->rhr > 0,
        );

        return $firstFilled?->rhr;
    }

    /**
     * Recalculate calendar week labels and Quick Recovery Scores across an athlete's full history.
     */
    public function recalculateForAthlete(Athlete $athlete): void
    {
        $metrics = $athlete->dailyMetrics()
            ->orderBy('record_date')
            ->get();

        if ($metrics->isEmpty()) {
            return;
        }

        $baselineRhr = $this->resolveBaselineRhr($athlete, $metrics);

        foreach ($metrics as $metric) {
            $weekLabel = $this->calculateWeekLabel($athlete->training_start_date, $metric->record_date);
            $effectiveBaseline = $baselineRhr ?? $metric->rhr;
            $recovery = $this->calculateRecoveryScore($metric->rhr, $metric->spo2, $effectiveBaseline);

            $dirty = $metric->week !== $weekLabel
                || $metric->quick_recovery_score !== $recovery['score']
                || $metric->recovery_status !== $recovery['status'];

            if ($dirty) {
                $metric->update([
                    'week' => $weekLabel,
                    'quick_recovery_score' => $recovery['score'],
                    'recovery_status' => $recovery['status'],
                ]);
            }
        }
    }

    /**
     * Generate clinical insights from non-empty chronological metrics (oldest -> newest).
     *
     * @param  Collection<int, DailyMetric>  $filledMetrics
     * @return array<int, array{category: string, level: 'optimal'|'warning'|'risk'|'info', title: string, summary: string, value: string}>
     */
    public function generateClinicalInsights(Collection $filledMetrics, ?float $baselineRhr): array
    {
        if ($filledMetrics->isEmpty()) {
            return [];
        }

        $avgRecovery = (int) round((float) ($filledMetrics->avg('quick_recovery_score') ?? 0));
        $avgRhr = round((float) ($filledMetrics->avg('rhr') ?? 0), 1);
        $avgVo2 = round((float) ($filledMetrics->avg('vo2_max') ?? 0), 1);

        $oldestMetric = $filledMetrics->sortBy('record_date')->first();
        $effectiveBaseline = $baselineRhr ?? ($oldestMetric !== null ? $oldestMetric->rhr : $avgRhr);
        $avgRhrDiff = round($avgRhr - $effectiveBaseline, 1);

        $recoveryInsight = match (true) {
            $avgRecovery >= 75 => [
                'category' => 'Recovery Overview',
                'level' => 'optimal',
                'title' => 'Pemulihan Sangat Baik (Excellent Recovery)',
                'summary' => 'Rata-rata kesiapan pemulihan berada di zona optimal. Atlet siap menjalani beban latihan penuh sesuai program.',
                'value' => "{$avgRecovery}%",
            ],
            $avgRecovery >= 50 => [
                'category' => 'Recovery Overview',
                'level' => 'warning',
                'title' => 'Pemulihan Cukup (Fair Recovery)',
                'summary' => 'Pemulihan berada pada level moderat. Perhatikan kualitas tidur, hidrasi, dan penyesuaian intensitas latihan.',
                'value' => "{$avgRecovery}%",
            ],
            default => [
                'category' => 'Recovery Overview',
                'level' => 'risk',
                'title' => 'Pemulihan Kurang (Poor Recovery)',
                'summary' => 'Skor pemulihan rendah menunjukkan akumulasi kelelahan. Evaluasi segera beban latihan, istirahat, dan nutrisi atlet.',
                'value' => "{$avgRecovery}%",
            ],
        };

        $diffSign = $avgRhrDiff > 0 ? '+' : '';
        $rhrInsight = match (true) {
            $avgRhrDiff <= 2.0 => [
                'category' => 'Analisis Klinis BHR',
                'level' => 'optimal',
                'title' => 'BHR Stabil terhadap Baseline',
                'summary' => "Rata-rata BHR ({$avgRhr} bpm) konsisten dengan baseline ({$effectiveBaseline} bpm), menandakan respons otonom terkendali.",
                'value' => "{$diffSign}{$avgRhrDiff} bpm",
            ],
            $avgRhrDiff <= 5.0 => [
                'category' => 'Analisis Klinis BHR',
                'level' => 'warning',
                'title' => 'Peningkatan BHR Moderat (Elevated BHR)',
                'summary' => "Rata-rata BHR meningkat {$diffSign}{$avgRhrDiff} bpm di atas baseline ({$effectiveBaseline} bpm). Pantau tanda kelelahan kardiovaskular.",
                'value' => "{$diffSign}{$avgRhrDiff} bpm",
            ],
            default => [
                'category' => 'Analisis Klinis BHR',
                'level' => 'risk',
                'title' => 'Lonjakan BHR Signifikan (BHR Spike)',
                'summary' => "Lonjakan BHR {$diffSign}{$avgRhrDiff} bpm dari baseline ({$effectiveBaseline} bpm) merupakan indikator awal overtraining atau kurang istirahat.",
                'value' => "{$diffSign}{$avgRhrDiff} bpm",
            ],
        };

        $vo2Insight = match (true) {
            $avgVo2 >= 55.0 => [
                'category' => 'Kapasitas Aerobik VO₂ Max',
                'level' => 'optimal',
                'title' => 'Kapasitas Aerobik Elit',
                'summary' => "Estimasi rata-rata VO₂ Max ({$avgVo2} ml/kg/min) menunjukkan daya tahan kardiorespirasi sangat tinggi.",
                'value' => "{$avgVo2} ml/kg/min",
            ],
            $avgVo2 >= 45.0 => [
                'category' => 'Kapasitas Aerobik VO₂ Max',
                'level' => 'info',
                'title' => 'Kapasitas Aerobik Baik',
                'summary' => "Estimasi rata-rata VO₂ Max ({$avgVo2} ml/kg/min) berada pada tingkat kebugaran kompetitif yang baik.",
                'value' => "{$avgVo2} ml/kg/min",
            ],
            default => [
                'category' => 'Kapasitas Aerobik VO₂ Max',
                'level' => 'warning',
                'title' => 'Kapasitas Aerobik Dasar (Average)',
                'summary' => "Estimasi rata-rata VO₂ Max ({$avgVo2} ml/kg/min) masih dapat ditingkatkan melalui program pengkondisian aerobik terstruktur.",
                'value' => "{$avgVo2} ml/kg/min",
            ],
        };

        return [$recoveryInsight, $rhrInsight, $vo2Insight];
    }
}
