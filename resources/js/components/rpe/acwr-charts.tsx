import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ComposedChart,
    LabelList,
    Line,
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

type CustomLabelProps = {
    x?: number | string;
    y?: number | string;
    width?: number | string;
    value?: number | string | boolean | null;
};

type VerticalTickProps = {
    x?: number | string;
    y?: number | string;
    payload?: {
        value?: string | number;
    };
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
        <div className="flex h-64 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
            Memuat visualisasi grafik...
        </div>
    );
}

function VerticalXAxisTick({ x = 0, y = 0, payload }: VerticalTickProps) {
    const cx = Number(x);
    const cy = Number(y);
    const label = String(payload?.value ?? '');

    return (
        <g transform={`translate(${cx},${cy})`}>
            <text
                x={0}
                y={0}
                dx={-4}
                dy={3}
                textAnchor="end"
                fill="var(--muted-foreground)"
                fontSize={9.5}
                transform="rotate(-90)"
            >
                {label}
            </text>
        </g>
    );
}

function VerticalBarValueLabel({ x, y, width, value }: CustomLabelProps) {
    const num = Number(value ?? 0);

    if (!Number.isFinite(num) || num <= 0) {
        return null;
    }

    // Offset 7px to the left of column center to prevent collision with ACWR line labels
    const cx = Number(x ?? 0) + Number(width ?? 0) / 2 - 7;
    const cy = Number(y ?? 0) - 5;

    return (
        <text
            x={cx}
            y={cy}
            fill="#d97706"
            fontSize={8.5}
            fontWeight={600}
            textAnchor="start"
            dominantBaseline="central"
            transform={`rotate(-90, ${cx}, ${cy})`}
        >
            {num.toLocaleString('id-ID')}
        </text>
    );
}

function VerticalDailyBarLabel({ x, y, width, value }: CustomLabelProps) {
    const num = Number(value ?? 0);

    if (!Number.isFinite(num) || num <= 0) {
        return null;
    }

    const cx = Number(x ?? 0) + Number(width ?? 0) / 2;
    const cy = Number(y ?? 0) - 5;

    return (
        <text
            x={cx}
            y={cy}
            fill="var(--muted-foreground)"
            fontSize={9}
            fontWeight={500}
            textAnchor="start"
            dominantBaseline="central"
            transform={`rotate(-90, ${cx}, ${cy})`}
        >
            {num.toLocaleString('id-ID')}
        </text>
    );
}

function VerticalAcwrPointLabel({ x, y, value }: CustomLabelProps) {
    const num = Number(value ?? 0);

    if (!Number.isFinite(num) || num <= 0) {
        return null;
    }

    // Offset 7px to the right of point and slightly higher to prevent collision with Bar labels
    const cx = Number(x ?? 0) + 7;
    const cy = Number(y ?? 0) - 10;

    return (
        <text
            x={cx}
            y={cy}
            fill="#1d4ed8"
            fontSize={9}
            fontWeight={700}
            textAnchor="start"
            dominantBaseline="central"
            transform={`rotate(-90, ${cx}, ${cy})`}
        >
            {num.toFixed(2)}
        </text>
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
        ...weeklyChartData.map((d) => Math.ceil((d.acwr + 0.3) * 2) / 2),
    );
    const scrollable = weeklyChartData.length > 10;

    return (
        <div className="space-y-4">
            {/* Row 1: ACWR Donut (4 col) + Combined Acute vs Chronic & ACWR ComposedChart (8 col) */}
            <div className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <AcwrDonutCard latestWeek={latestWeek} />
                </div>

                <div className="rounded-md border border-border bg-card p-4 lg:col-span-8">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Tren Beban Mingguan (Acute vs Chronic) &amp;
                                ACWR
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Zona optimal 0.80–1.30 (hijau) · Batas bahaya
                                &gt; 1.50 (merah)
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#d97706]" />
                                Acute (AU)
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="inline-block h-0.5 w-3 rounded-full bg-[#0d9488]" />
                                Chronic 4W
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="inline-block h-0.5 w-3 rounded-full bg-[#1d4ed8]" />
                                ACWR
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
                                <span className="inline-block h-0.5 w-3 border-b-2 border-dashed border-rose-500" />
                                Batas 1.50
                            </span>
                        </div>
                    </div>

                    {weeklyChartData.length === 0 ? (
                        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                            Belum ada sesi RPE untuk ditampilkan sebagai grafik
                            beban mingguan.
                        </div>
                    ) : !isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="overflow-x-auto pb-1">
                            <div
                                className="h-80"
                                style={{
                                    width: '100%',
                                    minWidth: scrollable
                                        ? `${weeklyChartData.length * 52 + 100}px`
                                        : undefined,
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <ComposedChart
                                        data={weeklyChartData}
                                        margin={{
                                            top: 36,
                                            right: 28,
                                            left: 0,
                                            bottom: 8,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="var(--border)"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="label"
                                            interval={0}
                                            height={70}
                                            tick={<VerticalXAxisTick />}
                                            tickLine={false}
                                            axisLine={{
                                                stroke: 'var(--border)',
                                            }}
                                        />
                                        <YAxis
                                            yAxisId="left"
                                            orientation="left"
                                            tick={{
                                                fill: 'var(--muted-foreground)',
                                                fontSize: 11,
                                            }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={44}
                                            tickFormatter={(val: number) =>
                                                val >= 1000
                                                    ? `${(val / 1000).toFixed(1)}k`
                                                    : String(val)
                                            }
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            domain={[0, maxAcwr]}
                                            ticks={[0, 0.5, 1, 1.5, 2]}
                                            tick={{
                                                fill: 'var(--muted-foreground)',
                                                fontSize: 11,
                                            }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={32}
                                            tickFormatter={(v: number) =>
                                                v.toFixed(v % 1 === 0 ? 0 : 1)
                                            }
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
                                            formatter={(value, name) => {
                                                const num = Number(value ?? 0);
                                                if (name === 'ACWR') {
                                                    return [
                                                        num.toFixed(2),
                                                        'ACWR',
                                                    ];
                                                }
                                                return [
                                                    num.toLocaleString(
                                                        'id-ID',
                                                    ) + ' AU',
                                                    String(name),
                                                ];
                                            }}
                                        />
                                        {/* Shaded Sweet Spot Area (0.80 - 1.30) */}
                                        <ReferenceArea
                                            yAxisId="right"
                                            y1={0.8}
                                            y2={1.3}
                                            fill="#10b981"
                                            fillOpacity={0.08}
                                            strokeOpacity={0}
                                        />

                                        {/* Horizontal Reference Lines on right Y-axis (ACWR) */}
                                        <ReferenceLine
                                            yAxisId="right"
                                            y={1.5}
                                            stroke="#f43f5e"
                                            strokeDasharray="6 4"
                                            strokeOpacity={0.9}
                                        />
                                        <ReferenceLine
                                            yAxisId="right"
                                            y={1.3}
                                            stroke="#10b981"
                                            strokeDasharray="2 4"
                                            strokeOpacity={0.45}
                                        />
                                        <ReferenceLine
                                            yAxisId="right"
                                            y={0.8}
                                            stroke="#0284c7"
                                            strokeDasharray="2 4"
                                            strokeOpacity={0.45}
                                        />

                                        {/* Acute Load (AU) Bar */}
                                        <Bar
                                            yAxisId="left"
                                            dataKey="acute_load"
                                            name="Acute (AU)"
                                            fill="#d97706"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={32}
                                        >
                                            <LabelList
                                                dataKey="acute_load"
                                                content={VerticalBarValueLabel}
                                            />
                                        </Bar>

                                        {/* Chronic Load (4W) Line - Solid line (no dash) to avoid clashing with boundary lines */}
                                        <Line
                                            yAxisId="left"
                                            type="monotone"
                                            dataKey="chronic_load"
                                            name="Chronic 4W"
                                            stroke="#0d9488"
                                            strokeWidth={2.5}
                                            dot={{
                                                r: 3.5,
                                                fill: '#0d9488',
                                            }}
                                            activeDot={{ r: 5 }}
                                        />

                                        {/* ACWR Line */}
                                        <Line
                                            yAxisId="right"
                                            type="monotone"
                                            dataKey="acwr"
                                            name="ACWR"
                                            stroke="#1d4ed8"
                                            strokeWidth={2.5}
                                            dot={{
                                                r: 4,
                                                fill: '#ffffff',
                                                stroke: '#1d4ed8',
                                                strokeWidth: 2,
                                            }}
                                            activeDot={{ r: 6 }}
                                        >
                                            <LabelList
                                                dataKey="acwr"
                                                content={VerticalAcwrPointLabel}
                                            />
                                        </Line>
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Row 2: ACWR Area Sweet Spot + Daily Load (14 Days) */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-border bg-card p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Tren Area ACWR Mingguan (Sweet Spot)
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Area hijau menandakan zona aman (0.80–1.30)
                            </p>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Sweet Spot
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-rose-500" />
                                Batas 1.50
                            </span>
                        </div>
                    </div>

                    {weeklyChartData.length === 0 ? (
                        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                            Belum ada sesi RPE.
                        </div>
                    ) : !isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="overflow-x-auto pb-1">
                            <div
                                className="h-80"
                                style={{
                                    width: '100%',
                                    minWidth: scrollable
                                        ? `${weeklyChartData.length * 44 + 80}px`
                                        : undefined,
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={weeklyChartData}
                                        margin={{
                                            top: 28,
                                            right: 16,
                                            left: 0,
                                            bottom: 8,
                                        }}
                                    >
                                        <defs>
                                            <linearGradient
                                                id="phynestraAcwrFill2"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop
                                                    offset="5%"
                                                    stopColor="#1d4ed8"
                                                    stopOpacity={0.25}
                                                />
                                                <stop
                                                    offset="95%"
                                                    stopColor="#1d4ed8"
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
                                        <ReferenceLine
                                            y={1.5}
                                            stroke="#f43f5e"
                                            strokeDasharray="4 4"
                                            strokeOpacity={0.75}
                                        />
                                        <XAxis
                                            dataKey="label"
                                            interval={0}
                                            height={70}
                                            tick={<VerticalXAxisTick />}
                                            tickLine={false}
                                            axisLine={{
                                                stroke: 'var(--border)',
                                            }}
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
                                        <Area
                                            type="monotone"
                                            dataKey="acwr"
                                            stroke="#1d4ed8"
                                            strokeWidth={2.25}
                                            fill="url(#phynestraAcwrFill2)"
                                            dot={{
                                                r: 3.5,
                                                fill: 'var(--card)',
                                                stroke: '#1d4ed8',
                                                strokeWidth: 2,
                                            }}
                                            activeDot={{ r: 5 }}
                                        >
                                            <LabelList
                                                dataKey="acwr"
                                                content={VerticalAcwrPointLabel}
                                            />
                                        </Area>
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>

                {/* Daily Load Distribution (14 Days) */}
                <div className="rounded-md border border-border bg-card p-4">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Distribusi Beban Harian (14 Hari Terakhir)
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Total Session Load (AU) per hari termasuk hari
                                istirahat (0 AU)
                            </p>
                        </div>
                        <span className="text-xs font-medium text-muted-foreground">
                            14 Hari
                        </span>
                    </div>

                    {dailyLoads.length === 0 ? (
                        <div className="flex h-64 items-center justify-center rounded-md border border-dashed border-border text-xs text-muted-foreground">
                            Belum ada data sesi latihan harian.
                        </div>
                    ) : !isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="overflow-x-auto pb-1">
                            <div
                                className="h-80"
                                style={{
                                    width: '100%',
                                    minWidth:
                                        dailyLoads.length > 14
                                            ? `${dailyLoads.length * 40 + 80}px`
                                            : undefined,
                                }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={dailyLoads}
                                        margin={{
                                            top: 28,
                                            right: 16,
                                            left: 0,
                                            bottom: 8,
                                        }}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="var(--border)"
                                            vertical={false}
                                        />
                                        <XAxis
                                            dataKey="date_label"
                                            interval={0}
                                            height={70}
                                            tick={<VerticalXAxisTick />}
                                            tickLine={false}
                                            axisLine={{
                                                stroke: 'var(--border)',
                                            }}
                                        />
                                        <YAxis
                                            tick={{
                                                fill: 'var(--muted-foreground)',
                                                fontSize: 11,
                                            }}
                                            tickLine={false}
                                            axisLine={false}
                                            width={44}
                                            tickFormatter={(val: number) =>
                                                val >= 1000
                                                    ? `${(val / 1000).toFixed(1)}k`
                                                    : String(val)
                                            }
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
                                            name="Daily Load"
                                            fill="#2563eb"
                                            radius={[4, 4, 0, 0]}
                                            maxBarSize={32}
                                        >
                                            <LabelList
                                                dataKey="daily_load"
                                                content={VerticalDailyBarLabel}
                                            />
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
