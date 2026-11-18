import { useEffect, useState } from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { getAcwrZoneMeta } from '@/lib/rpe-acwr';
import { cn } from '@/lib/utils';
import type { WeeklyAcwrSummary } from '@/types';

type Props = {
    latestWeek: WeeklyAcwrSummary | null;
};

const tooltipContentStyle = {
    backgroundColor: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: '0.375rem',
    color: 'var(--popover-foreground)',
    fontSize: '12px',
};

export function AcwrDonutCard({ latestWeek }: Props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const acwr = latestWeek?.acwr ?? null;
    const zoneMeta = getAcwrZoneMeta(latestWeek?.zone ?? 'no_data');

    // Scale ACWR against a 2.00 ceiling for clean visual ring representation
    const maxScale = 2.0;
    const filled = acwr !== null ? Math.min(maxScale, Math.max(0, acwr)) : 0;
    const remaining = Math.max(0, Math.round((maxScale - filled) * 100) / 100);

    const gaugeData =
        acwr !== null
            ? [
                  {
                      name: 'ACWR Aktif',
                      value: filled,
                      color: zoneMeta.colorHex,
                  },
                  {
                      name: 'Skala 2.00',
                      value: remaining,
                      color: 'var(--muted)',
                  },
              ]
            : [{ name: 'Belum Ada Data', value: 1, color: 'var(--muted)' }];

    return (
        <div className="flex h-full flex-col justify-between rounded-md border border-border bg-card p-4">
            <div>
                <h3 className="text-sm font-semibold text-foreground">
                    Rasio ACWR Mingguan
                </h3>
                <p className="text-xs text-muted-foreground">
                    {latestWeek
                        ? `${latestWeek.week_label} · Basis ${latestWeek.chronic_weeks_used} minggu`
                        : 'Coupled Rolling Average 4 Minggu'}
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
                                        acwr !== null
                                            ? Number(value ?? 0).toFixed(2)
                                            : '—',
                                        String(name ?? ''),
                                    ]}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                            <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums">
                                {acwr !== null ? acwr.toFixed(2) : '—'}
                            </span>
                            <span className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium">
                                <span
                                    className={cn(
                                        'size-1.5 rounded-full',
                                        zoneMeta.dotClass,
                                    )}
                                />
                                <span className={zoneMeta.textClass}>
                                    {zoneMeta.label}
                                </span>
                            </span>
                        </div>
                    </>
                )}
            </div>

            <div className="grid grid-cols-2 gap-3 border-t border-border pt-3 text-center">
                <div>
                    <p className="text-[11px] text-muted-foreground">
                        Acute (1W)
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
                        {latestWeek
                            ? latestWeek.acute_load.toLocaleString('id-ID')
                            : '—'}{' '}
                        <span className="text-[11px] font-normal text-muted-foreground">
                            AU
                        </span>
                    </p>
                </div>
                <div className="border-l border-border">
                    <p className="text-[11px] text-muted-foreground">
                        Chronic (4W Avg)
                    </p>
                    <p className="mt-0.5 text-sm font-semibold text-foreground tabular-nums">
                        {latestWeek
                            ? Math.round(
                                  latestWeek.chronic_load,
                              ).toLocaleString('id-ID')
                            : '—'}{' '}
                        <span className="text-[11px] font-normal text-muted-foreground">
                            AU
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
