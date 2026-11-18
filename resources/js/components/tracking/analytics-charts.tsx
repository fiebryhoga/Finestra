import { useEffect, useState } from 'react';
import {
    Area,
    AreaChart,
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { RecoveryDonutChart } from '@/components/tracking/recovery-donut-chart';
import type { DailyMetricRecord } from '@/types';

type Props = {
    metrics: DailyMetricRecord[];
    baselineRhr: number | null;
};

type ChartDatum = {
    label: string;
    date: string;
    week: string;
    qrs: number;
    rhr: number;
    spo2: number;
    vo2_max: number;
    peak_power: number;
};

function ChartSkeleton() {
    return (
        <div className="flex h-64 w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/20 text-xs text-muted-foreground">
            Memuat visualisasi grafik...
        </div>
    );
}

const tooltipContentStyle = {
    backgroundColor: 'var(--popover)',
    border: '1px solid var(--border)',
    borderRadius: '0.375rem',
    color: 'var(--popover-foreground)',
    fontSize: '12px',
};

export function AnalyticsCharts({ metrics, baselineRhr }: Props) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const chartData: ChartDatum[] = [...metrics]
        .sort((a, b) => a.record_date.localeCompare(b.record_date))
        .map((m) => ({
            label: m.record_date_formatted.replace(/\s+\d{4}$/, ''),
            date: m.record_date_formatted,
            week: m.week,
            qrs: m.quick_recovery_score,
            rhr: m.rhr,
            spo2: m.spo2,
            vo2_max: m.vo2_max,
            peak_power: Math.round(m.peak_power),
        }));

    if (chartData.length === 0) {
        return (
            <div className="rounded-md border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
                Belum ada data pencatatan terisi pada periode ini untuk
                ditampilkan sebagai grafik.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* 1. Recovery Donut Chart + Quick Recovery Score Trend */}
            <div className="grid gap-4 lg:grid-cols-12">
                <div className="lg:col-span-4">
                    <RecoveryDonutChart metrics={metrics} />
                </div>

                <div className="rounded-md border border-border bg-card p-4 lg:col-span-8">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Tren Quick Recovery Score (QRS)
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Skala 0–100% dengan ambang zona optimal (75%)
                                dan batas pemulihan rendah (35%)
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Optimal ≥ 75%
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <span className="size-1.5 rounded-full bg-rose-500" />
                                Kurang &lt; 35%
                            </span>
                        </div>
                    </div>

                    {!isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart
                                    data={chartData}
                                    margin={{
                                        top: 8,
                                        right: 16,
                                        left: 0,
                                        bottom: 0,
                                    }}
                                >
                                    <defs>
                                        <linearGradient
                                            id="phynestraQrsFill"
                                            x1="0"
                                            y1="0"
                                            x2="0"
                                            y2="1"
                                        >
                                            <stop
                                                offset="5%"
                                                stopColor="var(--chart-1)"
                                                stopOpacity={0.28}
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
                                        domain={[0, 100]}
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                        unit="%"
                                        width={42}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipContentStyle}
                                        formatter={(value) => [
                                            `${String(value ?? 0)}%`,
                                            'QRS',
                                        ]}
                                        labelFormatter={(_, payload) => {
                                            const item = payload?.[0]
                                                ?.payload as
                                                | ChartDatum
                                                | undefined;

                                            return item
                                                ? `${item.date} · ${item.week}`
                                                : '';
                                        }}
                                    />
                                    <ReferenceLine
                                        y={75}
                                        stroke="#10b981"
                                        strokeDasharray="4 4"
                                    />
                                    <ReferenceLine
                                        y={35}
                                        stroke="#f43f5e"
                                        strokeDasharray="4 4"
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="qrs"
                                        stroke="var(--chart-1)"
                                        strokeWidth={2}
                                        fill="url(#phynestraQrsFill)"
                                        activeDot={{ r: 4 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* 2. BHR vs Baseline & SpO2 Grid */}
            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-md border border-border bg-card p-4">
                    <div className="mb-4 flex items-start justify-between gap-2">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground">
                                Basal Heart Rate (BHR) vs Baseline
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                Kenaikan BHR di atas baseline menandakan
                                akumulasi kelelahan otonom
                            </p>
                        </div>
                        {baselineRhr !== null && (
                            <span className="shrink-0 text-xs font-medium text-muted-foreground tabular-nums">
                                Baseline: {baselineRhr.toFixed(1)} bpm
                            </span>
                        )}
                    </div>

                    {!isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="h-60 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 8,
                                        right: 16,
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
                                        domain={['dataMin - 4', 'dataMax + 4']}
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                        width={40}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipContentStyle}
                                        formatter={(value) => [
                                            `${String(value ?? 0)} bpm`,
                                            'BHR',
                                        ]}
                                    />
                                    {baselineRhr !== null && (
                                        <ReferenceLine
                                            y={baselineRhr}
                                            stroke="#f59e0b"
                                            strokeDasharray="4 4"
                                        />
                                    )}
                                    <Line
                                        type="monotone"
                                        dataKey="rhr"
                                        stroke="var(--chart-2)"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                <div className="rounded-md border border-border bg-card p-4">
                    <div className="mb-4">
                        <h3 className="text-sm font-semibold text-foreground">
                            Saturasi Oksigen (SpO₂)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Pemantauan oksigenasi darah harian (normal optimal
                            98–100%)
                        </p>
                    </div>

                    {!isMounted ? (
                        <ChartSkeleton />
                    ) : (
                        <div className="h-60 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{
                                        top: 8,
                                        right: 16,
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
                                        domain={[90, 100]}
                                        tick={{
                                            fill: 'var(--muted-foreground)',
                                            fontSize: 11,
                                        }}
                                        tickLine={false}
                                        axisLine={false}
                                        unit="%"
                                        width={42}
                                    />
                                    <Tooltip
                                        contentStyle={tooltipContentStyle}
                                        formatter={(value) => [
                                            `${String(value ?? 0)}%`,
                                            'SpO₂',
                                        ]}
                                    />
                                    <ReferenceLine
                                        y={95}
                                        stroke="#f43f5e"
                                        strokeDasharray="4 4"
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="spo2"
                                        stroke="var(--chart-3)"
                                        strokeWidth={2}
                                        dot={{ r: 3 }}
                                        activeDot={{ r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Peak Power & VO2 Max Composed Chart */}
            <div className="rounded-md border border-border bg-card p-4">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                    <div>
                        <h3 className="text-sm font-semibold text-foreground">
                            Peak Power (Neuromuskular) &amp; VO₂ Max (Aerobik)
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Kombinasi daya ledak Sayers (Watt) dan estimasi
                            kapasitas aerobik Uth–Sørensen (ml/kg/min)
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5">
                            <span
                                className="size-1.5 rounded-full"
                                style={{ backgroundColor: 'var(--chart-4)' }}
                            />
                            Peak Power (W)
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <span
                                className="size-1.5 rounded-full"
                                style={{ backgroundColor: 'var(--chart-1)' }}
                            />
                            VO₂ Max (ml/kg/min)
                        </span>
                    </div>
                </div>

                {!isMounted ? (
                    <ChartSkeleton />
                ) : (
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <ComposedChart
                                data={chartData}
                                margin={{
                                    top: 8,
                                    right: 16,
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
                                    yAxisId="power"
                                    orientation="left"
                                    tick={{
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 11,
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={48}
                                />
                                <YAxis
                                    yAxisId="vo2"
                                    orientation="right"
                                    domain={['dataMin - 4', 'dataMax + 4']}
                                    tick={{
                                        fill: 'var(--muted-foreground)',
                                        fontSize: 11,
                                    }}
                                    tickLine={false}
                                    axisLine={false}
                                    width={42}
                                />
                                <Tooltip
                                    contentStyle={tooltipContentStyle}
                                    formatter={(value, name) => {
                                        if (name === 'peak_power') {
                                            return [
                                                `${Number(value ?? 0).toLocaleString('id-ID')} W`,
                                                'Peak Power',
                                            ];
                                        }

                                        return [
                                            `${String(value ?? 0)} ml/kg/min`,
                                            'VO₂ Max',
                                        ];
                                    }}
                                />
                                <Bar
                                    yAxisId="power"
                                    dataKey="peak_power"
                                    fill="var(--chart-4)"
                                    fillOpacity={0.75}
                                    radius={[4, 4, 0, 0]}
                                    maxBarSize={28}
                                />
                                <Line
                                    yAxisId="vo2"
                                    type="monotone"
                                    dataKey="vo2_max"
                                    stroke="var(--chart-1)"
                                    strokeWidth={2}
                                    dot={{ r: 3 }}
                                />
                            </ComposedChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </div>
    );
}
