import { Activity, Flame, HeartPulse, Wind } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AnalyticsCharts } from '@/components/tracking/analytics-charts';
import { Input } from '@/components/ui/input';
import {
    addDaysToIsoDate,
    computeClinicalInsightsForPeriod,
} from '@/lib/quick-recovery';
import { cn } from '@/lib/utils';
import type {
    ClinicalInsight,
    ClinicalInsightLevel,
    DailyMetricRecord,
} from '@/types';

type PeriodMode = 'all' | 'daily' | 'monthly';

type Props = {
    metrics: DailyMetricRecord[];
    baselineRhr: number | null;
    defaultReferenceDate: string;
    fullInsights: ClinicalInsight[];
};

function getInsightAccent(level: ClinicalInsightLevel): {
    borderClass: string;
    dotClass: string;
    valueClass: string;
} {
    switch (level) {
        case 'optimal':
            return {
                borderClass: 'border-l-emerald-500',
                dotClass: 'bg-emerald-500',
                valueClass: 'text-emerald-700 dark:text-emerald-400',
            };
        case 'warning':
            return {
                borderClass: 'border-l-amber-500',
                dotClass: 'bg-amber-500',
                valueClass: 'text-amber-700 dark:text-amber-400',
            };
        case 'risk':
            return {
                borderClass: 'border-l-rose-500',
                dotClass: 'bg-rose-500',
                valueClass: 'text-rose-700 dark:text-rose-400',
            };
        default:
            return {
                borderClass: 'border-l-sky-500',
                dotClass: 'bg-sky-500',
                valueClass: 'text-sky-700 dark:text-sky-400',
            };
    }
}

export function AnalyticsTab({
    metrics,
    baselineRhr,
    defaultReferenceDate,
    fullInsights,
}: Props) {
    const [period, setPeriod] = useState<PeriodMode>('all');
    const [referenceDate, setReferenceDate] = useState(defaultReferenceDate);

    const filledMetrics = useMemo(
        () => metrics.filter((m) => m.recovery_status !== 'KOSONG'),
        [metrics],
    );

    const filteredMetrics = useMemo(() => {
        if (period === 'all' || !referenceDate) {
            return filledMetrics;
        }

        if (period === 'daily') {
            const start = addDaysToIsoDate(referenceDate, -6);

            return filledMetrics.filter(
                (m) => m.record_date >= start && m.record_date <= referenceDate,
            );
        }

        // monthly: filter same YYYY-MM as referenceDate
        const monthPrefix = referenceDate.slice(0, 7);

        return filledMetrics.filter((m) =>
            m.record_date.startsWith(monthPrefix),
        );
    }, [filledMetrics, period, referenceDate]);

    const summary = useMemo(() => {
        if (filteredMetrics.length === 0) {
            return {
                avgRecovery: null as number | null,
                avgRhr: null as number | null,
                maxPeakPower: null as number | null,
                avgVo2Max: null as number | null,
            };
        }

        const count = filteredMetrics.length;
        const avgRecovery =
            Math.round(
                (filteredMetrics.reduce(
                    (sum, m) => sum + m.quick_recovery_score,
                    0,
                ) /
                    count) *
                    10,
            ) / 10;
        const avgRhr =
            Math.round(
                (filteredMetrics.reduce((sum, m) => sum + m.rhr, 0) / count) *
                    10,
            ) / 10;
        const maxPeakPower = Math.round(
            Math.max(...filteredMetrics.map((m) => m.peak_power)),
        );
        const avgVo2Max =
            Math.round(
                (filteredMetrics.reduce((sum, m) => sum + m.vo2_max, 0) /
                    count) *
                    10,
            ) / 10;

        return { avgRecovery, avgRhr, maxPeakPower, avgVo2Max };
    }, [filteredMetrics]);

    const insights = useMemo(() => {
        if (period === 'all') {
            return fullInsights;
        }

        return computeClinicalInsightsForPeriod(filteredMetrics, baselineRhr);
    }, [period, fullInsights, filteredMetrics, baselineRhr]);

    const periodOptions: { value: PeriodMode; label: string }[] = [
        { value: 'all', label: 'Semua' },
        { value: 'daily', label: '7 Hari' },
        { value: 'monthly', label: 'Bulanan' },
    ];

    return (
        <div className="space-y-6">
            {/* Period Filter Toolbar */}
            <div className="flex flex-col gap-3 rounded-md border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex w-fit items-center gap-1 rounded-md bg-muted p-1">
                    {periodOptions.map((option) => (
                        <button
                            key={option.value}
                            type="button"
                            onClick={() => setPeriod(option.value)}
                            className={cn(
                                'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
                                period === option.value
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-2.5">
                    {period !== 'all' && (
                        <>
                            <span className="text-xs text-muted-foreground">
                                Tanggal acuan:
                            </span>
                            <Input
                                type="date"
                                value={referenceDate}
                                onChange={(e) =>
                                    setReferenceDate(e.target.value)
                                }
                                className="h-9 w-40 rounded-md text-xs tabular-nums"
                            />
                        </>
                    )}
                    <span className="text-xs text-muted-foreground tabular-nums">
                        {filteredMetrics.length} hari terisi
                    </span>
                </div>
            </div>

            {/* 4 KPI StatCards */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>Avg Recovery</span>
                        <HeartPulse className="size-4 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                        {summary.avgRecovery !== null
                            ? `${summary.avgRecovery.toFixed(1)}%`
                            : '—'}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Skor kesiapan rata-rata periode
                    </p>
                </div>

                <div className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>Avg BHR</span>
                        <Activity className="size-4 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                        {summary.avgRhr !== null
                            ? summary.avgRhr.toFixed(1)
                            : '—'}{' '}
                        <span className="text-sm font-normal text-muted-foreground">
                            bpm
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                        Baseline:{' '}
                        {baselineRhr !== null
                            ? `${baselineRhr.toFixed(1)} bpm`
                            : 'Belum ada'}
                    </p>
                </div>

                <div className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>Max Peak Power</span>
                        <Flame className="size-4 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                        {summary.maxPeakPower !== null
                            ? summary.maxPeakPower.toLocaleString('id-ID')
                            : '—'}{' '}
                        <span className="text-sm font-normal text-muted-foreground">
                            W
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Daya ledak puncak Sayers
                    </p>
                </div>

                <div className="rounded-md border border-border bg-card p-4">
                    <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                        <span>Avg VO₂ Max</span>
                        <Wind className="size-4 text-primary" />
                    </div>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                        {summary.avgVo2Max !== null
                            ? summary.avgVo2Max.toFixed(1)
                            : '—'}{' '}
                        <span className="text-sm font-normal text-muted-foreground">
                            ml/kg/m
                        </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Kapasitas aerobik Uth–Sørensen
                    </p>
                </div>
            </div>

            {/* Recharts Visualizations */}
            <AnalyticsCharts
                metrics={filteredMetrics}
                baselineRhr={baselineRhr}
            />

            {/* Automated Clinical Insights */}
            <div className="space-y-3">
                <div>
                    <h3 className="text-sm font-semibold text-foreground">
                        Automated Clinical Insights
                    </h3>
                    <p className="text-xs text-muted-foreground">
                        Evaluasi otomatis berdasarkan skor QRS, deviasi BHR
                        terhadap baseline, dan kapasitas VO₂ Max
                    </p>
                </div>

                {insights.length === 0 ? (
                    <div className="rounded-md border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
                        Belum ada data terisi untuk menghasilkan evaluasi
                        klinis.
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-3">
                        {insights.map((insight) => {
                            const accent = getInsightAccent(insight.level);

                            return (
                                <div
                                    key={insight.category}
                                    className={cn(
                                        'rounded-md border border-l-2 border-border bg-card p-4',
                                        accent.borderClass,
                                    )}
                                >
                                    <div className="flex items-center justify-between gap-2">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                            <span
                                                className={cn(
                                                    'size-1.5 rounded-full',
                                                    accent.dotClass,
                                                )}
                                            />
                                            {insight.category}
                                        </span>
                                        <span
                                            className={cn(
                                                'text-xs font-semibold tabular-nums',
                                                accent.valueClass,
                                            )}
                                        >
                                            {insight.value}
                                        </span>
                                    </div>
                                    <h4 className="mt-2 text-sm font-semibold text-foreground">
                                        {insight.title}
                                    </h4>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                                        {insight.summary}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
