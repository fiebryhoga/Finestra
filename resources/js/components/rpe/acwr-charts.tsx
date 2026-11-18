import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ReferenceArea,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { AcwrDonutCard } from '@/components/rpe/acwr-donut-card';
import type { DailyLoadPoint, WeeklyAcwrSummary } from '@/types';

type Props = {
    latestWeek: WeeklyAcwrSummary | null;
    weeklySummaries: WeeklyAcwrSummary[];
    dailyLoads: DailyLoadPoint[];
};

type WeeklyChartDatum = {
    label: string;
    fullLabel: string;
    acute_load: number;
    chronic_load: number;
    acwr: number;
};

const tooltipContentStyle = {
    backgroundColor: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: '0.375rem',
    color: 'var(--popover-foreground)',
    fontSize: '12px',
};

function ChartSkeleton() {
    return (
        <div className="flex h-60 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
            Memuat visualisasi grafik...
        </div>
    );
}

export function AcwrCharts({ latestWeek, weeklySummaries, dailyLoads }: Props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Chronological order (oldest -> newest) for charts
    const weeklyChartData: WeeklyChartDatum[] = [...weeklySummaries]
        .reverse()
        .map((w) => ({
            label: w.week_label,
            fullLabel: `${w.week_label} (${w.week_range})`,
            acute_load: w.acute_load,
            chronic_load: Math.round(w.chronic_load),
            acwr: w.acwr ?? 0,
        }));

    const maxAcwr = Math.max(
        2.0,
        ...weeklyChartData.map((d) => Math.ceil((d.acwr + 0.2) * 2) / 2),
    );

    return (
        <div className="space-y-4">
            {/* Row 1: ACWR Donut (4 col) + Clean ACWR Trend AreaChart (8 col) */}
            <div className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <AcwrDonutCard latestWeek={latestWeek} />
                </div>

                <div className="rounded-md border border-border bg-card p-4 lg:col-span-8">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Tren ACWR Mingguan
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Area hijau menandakan zona optimal (0.80–1.30) ·
                                Garis merah batas risiko tinggi (1.50)
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Sweet Spot 0.80–1.30
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-rose-500" />
                                Risiko &gt; 1.50
                            </span>
                        </div>
                    </div>

                    {weeklyChartData.length === 0 ? (
                        <div className="flex h-60 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                            Belum ada sesi RPE untuk ditampilkan sebagai grafik
                            ACWR mingguan.
                        </div>
                    ) : !isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="h-60 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={weeklyChartData}
                                    margin={{
                                        top: 10,
                                        right: 16,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="finestraAcwrFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="var(--chart-1)"
                                                stopOpacity={0.22}
                                            />
                                            <stop
                                                offset="95%"
                                                stopColor="var(--chart-1)"
                                                stopOpacity={0.02}
                                            />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border)"
                                        vertical={false}
                                    />
                                    <ReferenceArea
                                        y1={0.8}
                                        y2={1.3}
                                        fill="#10b981"
                                        fillOpacity={0.09}
                                        strokeOpacity={0}
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: 'var(--border)' }}
                                    />
                                    <YAxis
                                        domain={[0, maxAcwr]}
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={38}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipContentStyle}
                                        labelFormatter={(_, payload) => {
                                            const item = payload?.[0]
                                                ?.payload as
                                                | WeeklyChartDatum
                                                | undefined;

                                            return item?.fullLabel ?? '';
                                        }}
                                        formatter={(value) => [
                                            Number(value ?? 0).toFixed(2),
                                            'ACWR',
                                        ]}
                                    />
                                    <ReferenceLine
                                        y={1.5}
                                        stroke="#f43f5e"
                                        strokeDasharray="4 4"
                                        strokeOpacity={0.75}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="acwr"
                                        stroke="var(--chart-1)"
                                        strokeWidth={2.25}
                                        fill="url(#finestraAcwrFill)"
                                        dot={{
                                            r: 3.5,
                                            fill: 'var(--card)',
                                            stroke: 'var(--chart-1)',
                                            strokeWidth: 2,
                                        }}
                                        activeDot={{ r: 5 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Row 2: Acute vs Chronic Load (AU) + Daily Load (14 Days) */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-border bg-card p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Perbandingan Acute vs Chronic Load
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Total beban mingguan (1W) dibanding rata-rata
                                bergulir 4 minggu (AU)
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <span
                                    className="size-1.5 rounded-full"
                                    style={{
                                        backgroundColor: 'var(--chart-1)',
                                    }}
                                />
                                Acute (1W)
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span
                                    className="size-1.5 rounded-full"
                                    style={{
                                        backgroundColor: 'var(--chart-2)',
                                    }}
                                />
                                Chronic (4W)
                            </span>
                        </div>
                    </div>

                    {weeklyChartData.length === 0 ? (
                        <div className="flex h-56 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                            Belum ada data beban mingguan.
                        </div>
                    ) : !isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={weeklyChartData}
                                    barGap={6}
                                    margin={{
                                        top: 8,
                                        right: 12,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="label"
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: 'var(--border)' }}
                                    />
                                    <YAxis
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={46}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipContentStyle}
                                        labelFormatter={(_, payload) => {
                                            const item = payload?.[0]
                                                ?.payload as
                                                | WeeklyChartDatum
                                                | undefined;

                                            return item?.fullLabel ?? '';
                                        }}
                                        formatter={(value, name) => [
                                            `${Number(value ?? 0).toLocaleString('id-ID')} AU`,
                                            name === 'acute_load'
                                                ? 'Acute Load (1W)'
                                                : 'Chronic Load (4W)',
                                        ]}
                                    />
                                    <Bar
                                        dataKey="acute_load"
                                        fill="var(--chart-1)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={28}
                                    />
                                    <Bar
                                        dataKey="chronic_load"
                                        fill="var(--chart-2)"
                                        fillOpacity={0.55}
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={28}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="rounded-md border border-border bg-card p-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-foreground">
                            Distribusi Beban Harian (14 Hari Terakhir)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Total Session Load (AU) per hari termasuk hari
                            istirahat (0 AU)
                        </p>
                    </div>

                    {!isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="h-56 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={dailyLoads}
                                    margin={{
                                        top: 8,
                                        right: 12,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="var(--border)"
                                        vertical={false}
                                    />
                                    <XAxis
                                        dataKey="date_label"
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={{ stroke: 'var(--border)' }}
                                    />
                                    <YAxis
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={46}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipContentStyle}
                                        labelFormatter={(_, payload) => {
                                            const item = payload?.[0]
                                                ?.payload as
                                                | DailyLoadPoint
                                                | undefined;

                                            return item
                                                ? `${item.day_short}, ${item.date_label} (${item.session_count} sesi)`
                                                : '';
                                        }}
                                        formatter={(value) => [
                                            `${Number(value ?? 0).toLocaleString('id-ID')} AU`,
                                            'Daily Load',
                                        ]}
                                    />
                                    <Bar
                                        dataKey="daily_load"
                                        fill="var(--chart-1)"
                                        fillOpacity={0.85}
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={24}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
