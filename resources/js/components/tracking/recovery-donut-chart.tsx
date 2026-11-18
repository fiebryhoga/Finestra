import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getRecoveryStatusMeta } from '@/lib/quick-recovery';
import { cn } from '@/lib/utils';
import type { DailyMetricRecord, RecoveryStatusValue } from '@/types';

type Props = {
    metrics: DailyMetricRecord[];
};

const tooltipContentStyle = {
    backgroundColor: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: '0.375rem',
    color: 'var(--popover-foreground)',
    fontSize: '12px',
};

function getScoreColor(score: number): string {
    if (score >= 75) return '#10b981';
    if (score >= 35) return '#f59e0b';

    return '#f43f5e';
}

function getStatusFromAverage(score: number): RecoveryStatusValue {
    if (score >= 75) return 'RECOVERY BAIK';
    if (score >= 35) return 'RECOVERY CUKUP';

    return 'RECOVERY KURANG';
}

export function RecoveryDonutChart({ metrics }: Props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const count = metrics.length;
    const avgScore =
        count > 0
            ? Math.round(
                  (metrics.reduce((sum, m) => sum + m.quick_recovery_score, 0) /
                      count) *
                      10,
              ) / 10
            : 0;
    const clampedScore = Math.max(0, Math.min(100, avgScore));
    const remaining = Math.round((100 - clampedScore) * 10) / 10;

    const goodDays = metrics.filter(
        (m) => m.recovery_status === 'RECOVERY BAIK',
    ).length;
    const fairDays = metrics.filter(
        (m) => m.recovery_status === 'RECOVERY CUKUP',
    ).length;
    const poorDays = metrics.filter(
        (m) => m.recovery_status === 'RECOVERY KURANG',
    ).length;

    const status = getStatusFromAverage(clampedScore);
    const statusMeta = getRecoveryStatusMeta(status);
    const primaryColor = getScoreColor(clampedScore);

    const gaugeData = [
        {
            name: 'Avg Recovery Score',
            value: clampedScore,
            color: primaryColor,
        },
        { name: 'Sisa ke 100%', value: remaining, color: 'var(--muted)' },
    ];

    return (
        <div className="flex h-full flex-col justify-between rounded-md border border-border bg-card p-4">
            <div>
                <h3 className="text-sm font-semibold text-foreground">
                    Skor Quick Recovery
                </h3>
                <p className="text-xs text-muted-foreground">
                    Indeks rata-rata kesiapan pemulihan periode aktif
                </p>
            </div>

            <div className="relative my-2 flex h-48 w-full items-center justify-center">
                {!isMounted ? (
                    <div className="flex size-36 items-center justify-center rounded-full border-8 border-muted text-xs text-muted-foreground">
                        Memuat...
                    </div>
                ) : (
                    <>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={gaugeData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    startAngle={90}
                                    endAngle={-270}
                                    innerRadius="68%"
                                    outerRadius="92%"
                                    stroke="none"
                                    cornerRadius={4}
                                    isAnimationActive={false}
                                >
                                    {gaugeData.map((entry) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={tooltipContentStyle}
                                    formatter={(value, name) => [
                                        `${Number(value ?? 0).toFixed(1)}%`,
                                        String(name ?? ''),
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                                {avgScore.toFixed(1)}%
                            </span>
                            <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium">
                                <span
                                    className={cn(
                                        'size-1.5 rounded-full',
                                        statusMeta.dotClass,
                                    )}
                                />
                                <span className={statusMeta.textClass}>
                                    {statusMeta.label}
                                </span>
                            </span>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-border pt-3 text-center">
                <div>
                    <span className="inline-flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-emerald-500" />
                        Baik
                    </span>
                    <p className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
                        {goodDays}{' '}
                        <span className="text-[11px] font-normal text-muted-foreground">
                            hari
                        </span>
                    </p>
                </div>
                <div className="border-x border-border">
                    <span className="inline-flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-amber-500" />
                        Cukup
                    </span>
                    <p className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
                        {fairDays}{' '}
                        <span className="text-[11px] font-normal text-muted-foreground">
                            hari
                        </span>
                    </p>
                </div>
                <div>
                    <span className="inline-flex items-center justify-center gap-1 text-[11px] text-muted-foreground">
                        <span className="size-1.5 rounded-full bg-rose-500" />
                        Kurang
                    </span>
                    <p className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
                        {poorDays}{' '}
                        <span className="text-[11px] font-normal text-muted-foreground">
                            hari
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
