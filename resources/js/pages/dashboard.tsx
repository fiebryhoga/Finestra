import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    HeartPulse,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getRecoveryStatusMeta } from '@/lib/quick-recovery';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { index as athletesIndex } from '@/routes/athletes';
import {
    index as trackingIndex,
    show as trackingShow,
} from '@/routes/tracking';
import type {
    Auth,
    DashboardAlert,
    DashboardRecentMetric,
    DashboardStats,
} from '@/types';

type PageProps = {
    auth: Auth;
    stats: DashboardStats;
    alerts: DashboardAlert[];
    recentMetrics: DashboardRecentMetric[];
};

export default function Dashboard() {
    const { auth, stats, alerts, recentMetrics } = usePage<PageProps>().props;

    const trackedBase = Math.max(stats.tracked_athletes, 1);
    const optimalPct = Math.round((stats.optimal_fit / trackedBase) * 100);
    const warningPct = Math.round((stats.fatigue_warning / trackedBase) * 100);
    const recoveryPct = Math.round((stats.in_recovery / trackedBase) * 100);
    const attentionCount = stats.fatigue_warning + stats.in_recovery;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Welcome Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Selamat datang, {auth.user.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Ringkasan kesiapan pemulihan fisiologis dan
                            neuromuskular skuad Finestra.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            asChild
                            variant="outline"
                            className="rounded-md"
                        >
                            <Link href={athletesIndex()}>
                                <Users className="size-4" />
                                Data Atlet
                            </Link>
                        </Button>
                        <Button asChild className="rounded-md">
                            <Link href={trackingIndex()}>
                                <HeartPulse className="size-4" />
                                Buka Tracking
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* 4 KPI Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Total Atlet</span>
                            <Activity className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.total_athletes}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {stats.tracked_athletes} atlet aktif terpantau
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Avg Readiness (7 Hari)</span>
                            <HeartPulse className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.avg_readiness_7d !== null
                                ? `${stats.avg_readiness_7d.toFixed(1)}%`
                                : '—'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Rata-rata QRS pencatatan 7 hari terakhir
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Optimal Fit (≥ 75%)</span>
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.optimal_fit}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {stats.tracked_athletes > 0
                                ? `${optimalPct}% dari atlet terpantau`
                                : 'Belum ada data terisi'}
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Perlu Perhatian</span>
                            <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {attentionCount}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {stats.fatigue_warning} waspada ·{' '}
                            {stats.in_recovery} pemulihan rendah
                        </p>
                    </div>
                </div>

                {/* Squad Readiness Distribution + Alerts */}
                <div className="grid gap-4 lg:grid-cols-12">
                    <div className="rounded-md border border-border bg-card p-5 lg:col-span-5">
                        <div className="space-y-1">
                            <h2 className="text-sm font-semibold text-foreground">
                                Distribusi Kesiapan Skuad
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                Proporsi atlet berdasarkan skor Quick Recovery
                                terakhir
                            </p>
                        </div>

                        <div className="mt-5 space-y-4">
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                                        <span className="size-1.5 rounded-full bg-emerald-500" />
                                        Optimal Fit (≥ 75%)
                                    </span>
                                    <span className="text-muted-foreground tabular-nums">
                                        {stats.optimal_fit} atlet (
                                        {stats.tracked_athletes > 0
                                            ? optimalPct
                                            : 0}
                                        %)
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-md bg-muted">
                                    <div
                                        className="h-full rounded-md bg-emerald-500 transition-all"
                                        style={{
                                            width: `${stats.tracked_athletes > 0 ? optimalPct : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                                        <span className="size-1.5 rounded-full bg-amber-500" />
                                        Fatigue Warning (50–74%)
                                    </span>
                                    <span className="text-muted-foreground tabular-nums">
                                        {stats.fatigue_warning} atlet (
                                        {stats.tracked_athletes > 0
                                            ? warningPct
                                            : 0}
                                        %)
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-md bg-muted">
                                    <div
                                        className="h-full rounded-md bg-amber-500 transition-all"
                                        style={{
                                            width: `${stats.tracked_athletes > 0 ? warningPct : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
                                        <span className="size-1.5 rounded-full bg-rose-500" />
                                        In Recovery (&lt; 50%)
                                    </span>
                                    <span className="text-muted-foreground tabular-nums">
                                        {stats.in_recovery} atlet (
                                        {stats.tracked_athletes > 0
                                            ? recoveryPct
                                            : 0}
                                        %)
                                    </span>
                                </div>
                                <div className="h-2 w-full overflow-hidden rounded-md bg-muted">
                                    <div
                                        className="h-full rounded-md bg-rose-500 transition-all"
                                        style={{
                                            width: `${stats.tracked_athletes > 0 ? recoveryPct : 0}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-md border border-border bg-card p-5 lg:col-span-7">
                        <div className="flex items-center justify-between gap-2">
                            <div className="space-y-1">
                                <h2 className="text-sm font-semibold text-foreground">
                                    Alert Kesiapan &amp; Kelelahan
                                </h2>
                                <p className="text-xs text-muted-foreground">
                                    Atlet dengan skor QRS &lt; 70% atau RHR &gt;
                                    85 bpm
                                </p>
                            </div>
                            <Link
                                href={trackingIndex()}
                                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                            >
                                Lihat semua
                                <ArrowRight className="size-3.5" />
                            </Link>
                        </div>

                        {alerts.length === 0 ? (
                            <div className="mt-5 flex flex-col items-center justify-center rounded-md border border-dashed border-border py-8 text-center">
                                <CheckCircle2 className="size-6 text-emerald-500" />
                                <p className="mt-2 text-sm font-medium text-foreground">
                                    Tidak ada alert kelelahan aktif
                                </p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                    Seluruh atlet terpantau berada dalam kondisi
                                    siap latihan.
                                </p>
                            </div>
                        ) : (
                            <div className="mt-4 divide-y divide-border rounded-md border border-border">
                                {alerts.map((alert) => {
                                    const isRose = alert.severity === 'rose';

                                    return (
                                        <Link
                                            key={alert.athlete_id}
                                            href={trackingShow(
                                                alert.athlete_id,
                                            )}
                                            className="flex items-center justify-between gap-3 px-3.5 py-2.5 transition-colors hover:bg-muted/40"
                                        >
                                            <div className="min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            'size-1.5 shrink-0 rounded-full',
                                                            isRose
                                                                ? 'bg-rose-500'
                                                                : 'bg-amber-500',
                                                        )}
                                                    />
                                                    <span className="truncate text-sm font-medium text-foreground">
                                                        {alert.athlete_name}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 truncate pl-3.5 text-xs text-muted-foreground">
                                                    {alert.reason} ·{' '}
                                                    {
                                                        alert.record_date_formatted
                                                    }
                                                </p>
                                            </div>

                                            <div className="shrink-0 text-right tabular-nums">
                                                <p
                                                    className={cn(
                                                        'text-sm font-semibold',
                                                        isRose
                                                            ? 'text-rose-700 dark:text-rose-400'
                                                            : 'text-amber-700 dark:text-amber-400',
                                                    )}
                                                >
                                                    QRS {alert.score}%
                                                </p>
                                                <p className="text-[11px] text-muted-foreground">
                                                    RHR {alert.rhr.toFixed(1)}{' '}
                                                    bpm
                                                </p>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Daily Metrics */}
                <div className="rounded-md border border-border bg-card">
                    <div className="flex items-center justify-between gap-2 border-b border-border px-5 py-4">
                        <div>
                            <h2 className="text-sm font-semibold text-foreground">
                                Pencatatan Harian Terbaru
                            </h2>
                            <p className="text-xs text-muted-foreground">
                                6 catatan Quick Recovery terakhir yang telah
                                terisi
                            </p>
                        </div>
                        <Link
                            href={trackingIndex()}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                            Semua atlet
                            <ArrowRight className="size-3.5" />
                        </Link>
                    </div>

                    {recentMetrics.length === 0 ? (
                        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                            Belum ada pencatatan harian. Mulai input melalui
                            halaman{' '}
                            <Link
                                href={trackingIndex()}
                                className="font-medium text-primary hover:underline"
                            >
                                Tracking Quick Recovery
                            </Link>
                            .
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="pl-5">
                                            Atlet
                                        </TableHead>
                                        <TableHead>Tanggal</TableHead>
                                        <TableHead>Program</TableHead>
                                        <TableHead className="text-right">
                                            RHR
                                        </TableHead>
                                        <TableHead className="text-right">
                                            SpO₂
                                        </TableHead>
                                        <TableHead className="text-right">
                                            QRS
                                        </TableHead>
                                        <TableHead className="pr-5">
                                            Status
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentMetrics.map((metric) => {
                                        const statusMeta =
                                            getRecoveryStatusMeta(
                                                metric.recovery_status,
                                            );

                                        return (
                                            <TableRow key={metric.id}>
                                                <TableCell className="pl-5 font-medium">
                                                    <Link
                                                        href={trackingShow(
                                                            metric.athlete_id,
                                                        )}
                                                        className="text-foreground hover:text-primary hover:underline"
                                                    >
                                                        {metric.athlete_name}
                                                    </Link>
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground tabular-nums">
                                                    {
                                                        metric.record_date_formatted
                                                    }
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground">
                                                    {metric.week}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {metric.rhr.toFixed(1)}{' '}
                                                    <span className="text-muted-foreground">
                                                        bpm
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {metric.spo2.toFixed(1)}
                                                    <span className="text-muted-foreground">
                                                        %
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-foreground tabular-nums">
                                                    {
                                                        metric.quick_recovery_score
                                                    }
                                                    %
                                                </TableCell>
                                                <TableCell className="pr-5">
                                                    <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                                                        <span
                                                            className={cn(
                                                                'size-1.5 shrink-0 rounded-full',
                                                                statusMeta.dotClass,
                                                            )}
                                                        />
                                                        <span
                                                            className={
                                                                statusMeta.textClass
                                                            }
                                                        >
                                                            {statusMeta.label}
                                                        </span>
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
