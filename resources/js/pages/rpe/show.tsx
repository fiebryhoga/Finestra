import { Form, Head, Link } from '@inertiajs/react';
import {
    Activity,
    ArrowLeft,
    BarChart3,
    Download,
    Flame,
    Gauge,
    HeartPulse,
    ListChecks,
    Pencil,
    Plus,
    Trash2,
    TrendingUp,
} from 'lucide-react';
import { useState } from 'react';
import RpeController from '@/actions/App/Http/Controllers/RpeController';
import { AcwrCharts } from '@/components/rpe/acwr-charts';
import { RpeSessionDialog } from '@/components/rpe/rpe-session-dialog';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { getAcwrZoneMeta } from '@/lib/rpe-acwr';
import { cn } from '@/lib/utils';
import { exportPdf as rpeExportPdf, index as rpeIndex } from '@/routes/rpe';
import { show as trackingShow } from '@/routes/tracking';
import type {
    DailyLoadPoint,
    LoadInsight,
    LoadInsightLevel,
    RpeAthleteDetail,
    RpeSessionRecord,
    SessionTypeOption,
    WeeklyAcwrSummary,
} from '@/types';

type Props = {
    athlete: RpeAthleteDetail;
    latestWeek: WeeklyAcwrSummary | null;
    weeklySummaries: WeeklyAcwrSummary[];
    dailyLoads: DailyLoadPoint[];
    insights: LoadInsight[];
    sessions: RpeSessionRecord[];
    sessionTypes: SessionTypeOption[];
    today: string;
};

type ActiveTab = 'acwr' | 'sessions';

function getInsightAccent(level: LoadInsightLevel): {
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

export default function RpeShow({
    athlete,
    latestWeek,
    weeklySummaries,
    dailyLoads,
    insights,
    sessions,
    sessionTypes,
    today,
}: Props) {
    const [activeTab, setActiveTab] = useState<ActiveTab>('acwr');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingSession, setEditingSession] =
        useState<RpeSessionRecord | null>(null);
    const [deletingSession, setDeletingSession] =
        useState<RpeSessionRecord | null>(null);

    const openCreate = () => {
        setEditingSession(null);
        setDialogOpen(true);
    };

    const openEdit = (session: RpeSessionRecord) => {
        setEditingSession(session);
        setDialogOpen(true);
    };

    const latestZoneMeta = getAcwrZoneMeta(latestWeek?.zone ?? 'no_data');

    return (
        <>
            <Head title={`RPE & ACWR — ${athlete.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Back Link & Header */}
                <div className="space-y-4">
                    <Link
                        href={rpeIndex()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Kembali ke Beban Latihan (RPE)
                    </Link>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                {athlete.name}
                            </h1>
                            <p className="text-sm text-muted-foreground tabular-nums">
                                {athlete.gender_label} · {athlete.age} thn ·{' '}
                                {athlete.weight_kg.toFixed(1)} kg ·{' '}
                                {athlete.height_cm.toFixed(1)} cm ·{' '}
                                {sessions.length} sesi tercatat (
                                {weeklySummaries.length} minggu berjalan)
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                onClick={openCreate}
                                className="rounded-md"
                            >
                                <Plus className="size-4" />
                                Catat Sesi RPE
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="rounded-md"
                            >
                                <Link href={trackingShow(athlete.id)}>
                                    <HeartPulse className="size-4" />
                                    Quick Recovery
                                </Link>
                            </Button>

                            <Button
                                asChild
                                variant="outline"
                                className="rounded-md"
                            >
                                <a href={rpeExportPdf.url(athlete.id)}>
                                    <Download className="size-4" />
                                    Export PDF
                                </a>
                            </Button>
                        </div>
                    </div>
                </div>

                {/* 4 KPI Cards for Latest ISO Week */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>ACWR Mingguan</span>
                            <Gauge className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {latestWeek && latestWeek.acwr !== null
                                ? latestWeek.acwr.toFixed(2)
                                : '—'}
                        </p>
                        <p className="mt-1 inline-flex items-center gap-1.5 text-xs font-medium">
                            <span
                                className={cn(
                                    'size-1.5 rounded-full',
                                    latestZoneMeta.dotClass,
                                )}
                            />
                            <span className={latestZoneMeta.textClass}>
                                {latestZoneMeta.label}
                            </span>
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Acute Load (Minggu Aktif)</span>
                            <Flame className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {latestWeek
                                ? latestWeek.acute_load.toLocaleString('id-ID')
                                : '—'}{' '}
                            <span className="text-sm font-normal text-muted-foreground">
                                AU
                            </span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {latestWeek
                                ? `${latestWeek.week_label} · ${latestWeek.session_count} sesi`
                                : 'Belum ada data'}
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Chronic Load (4W Avg)</span>
                            <TrendingUp className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {latestWeek
                                ? Math.round(
                                      latestWeek.chronic_load,
                                  ).toLocaleString('id-ID')
                                : '—'}{' '}
                            <span className="text-sm font-normal text-muted-foreground">
                                AU
                            </span>
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {latestWeek
                                ? `Rata-rata ${latestWeek.chronic_weeks_used} minggu bergulir`
                                : 'Coupled Rolling Average'}
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Monotony &amp; Strain</span>
                            <Activity className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {latestWeek ? latestWeek.monotony.toFixed(2) : '—'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            Strain:{' '}
                            {latestWeek
                                ? `${latestWeek.strain.toLocaleString('id-ID')} AU`
                                : '—'}
                        </p>
                    </div>
                </div>

                {/* Tab Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-1 rounded-md bg-muted p-1">
                        <button
                            type="button"
                            onClick={() => setActiveTab('acwr')}
                            className={cn(
                                'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                                activeTab === 'acwr'
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <BarChart3 className="size-3.5" />
                            Analitik &amp; ACWR Weekly
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('sessions')}
                            className={cn(
                                'inline-flex cursor-pointer items-center gap-1.5 rounded-md px-3.5 py-1.5 text-sm font-medium transition-colors',
                                activeTab === 'sessions'
                                    ? 'bg-background text-foreground shadow-xs'
                                    : 'text-muted-foreground hover:text-foreground',
                            )}
                        >
                            <ListChecks className="size-3.5" />
                            Riwayat Sesi RPE ({sessions.length})
                        </button>
                    </div>

                    {latestWeek && (
                        <span className="text-xs text-muted-foreground tabular-nums">
                            Rentang minggu terbaru: {latestWeek.week_range}
                        </span>
                    )}
                </div>

                {/* Tab Content */}
                {activeTab === 'acwr' ? (
                    <div className="space-y-6">
                        <AcwrCharts
                            latestWeek={latestWeek}
                            weeklySummaries={weeklySummaries}
                            dailyLoads={dailyLoads}
                        />

                        {/* Automated Workload Insights */}
                        {insights.length > 0 && (
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-sm font-semibold text-foreground">
                                        Automated Workload Insights
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Evaluasi otomatis status ACWR, progresi
                                        beban mingguan, dan indeks Monotony
                                    </p>
                                </div>
                                <div className="grid gap-4 md:grid-cols-3">
                                    {insights.map((insight) => {
                                        const accent = getInsightAccent(
                                            insight.level,
                                        );

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
                            </div>
                        )}

                        {/* Weekly ACWR Table */}
                        <div className="rounded-md border border-border bg-card">
                            <div className="border-b border-border px-4 py-3.5">
                                <h3 className="text-sm font-semibold text-foreground">
                                    Tabel Rekap ACWR Mingguan
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Coupled 4-Week Rolling Average · Dihitung
                                    per 7 hari sejak tanggal input RPE pertama
                                    atlet (minggu istirahat = 0 AU)
                                </p>
                            </div>

                            {weeklySummaries.length === 0 ? (
                                <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                                    Belum ada sesi RPE tercatat. Klik{' '}
                                    <button
                                        type="button"
                                        onClick={openCreate}
                                        className="cursor-pointer font-medium text-primary hover:underline"
                                    >
                                        Catat Sesi RPE
                                    </button>{' '}
                                    untuk memulai perhitungan ACWR mingguan.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="pl-4">
                                                    Minggu
                                                </TableHead>
                                                <TableHead>
                                                    Rentang Tanggal
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Sesi
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Acute Load
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Chronic (4W)
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Δ Minggu
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Monotony
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    Strain
                                                </TableHead>
                                                <TableHead className="text-right">
                                                    ACWR
                                                </TableHead>
                                                <TableHead className="pr-4">
                                                    Zona
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {weeklySummaries.map((week) => {
                                                const zoneMeta =
                                                    getAcwrZoneMeta(week.zone);

                                                return (
                                                    <TableRow
                                                        key={week.iso_week}
                                                    >
                                                        <TableCell className="pl-4 font-medium text-foreground tabular-nums">
                                                            {week.week_label}
                                                        </TableCell>
                                                        <TableCell className="text-xs text-muted-foreground tabular-nums">
                                                            {week.week_range}
                                                        </TableCell>
                                                        <TableCell className="text-right tabular-nums">
                                                            {week.session_count}
                                                        </TableCell>
                                                        <TableCell className="text-right font-medium text-foreground tabular-nums">
                                                            {week.acute_load.toLocaleString(
                                                                'id-ID',
                                                            )}{' '}
                                                            <span className="font-normal text-muted-foreground">
                                                                AU
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right tabular-nums">
                                                            {Math.round(
                                                                week.chronic_load,
                                                            ).toLocaleString(
                                                                'id-ID',
                                                            )}{' '}
                                                            <span className="text-muted-foreground">
                                                                AU
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right tabular-nums">
                                                            {week.week_change_pct !==
                                                            null ? (
                                                                <span
                                                                    className={cn(
                                                                        week.week_change_pct >
                                                                            15
                                                                            ? 'font-medium text-rose-700 dark:text-rose-400'
                                                                            : 'text-muted-foreground',
                                                                    )}
                                                                >
                                                                    {week.week_change_pct >
                                                                    0
                                                                        ? '+'
                                                                        : ''}
                                                                    {week.week_change_pct.toFixed(
                                                                        1,
                                                                    )}
                                                                    %
                                                                </span>
                                                            ) : (
                                                                <span className="text-muted-foreground">
                                                                    —
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right tabular-nums">
                                                            <span
                                                                className={cn(
                                                                    week.monotony >
                                                                        2.0
                                                                        ? 'font-medium text-amber-700 dark:text-amber-400'
                                                                        : '',
                                                                )}
                                                            >
                                                                {week.monotony.toFixed(
                                                                    2,
                                                                )}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right tabular-nums">
                                                            {week.strain.toLocaleString(
                                                                'id-ID',
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold text-foreground tabular-nums">
                                                            {week.acwr !== null
                                                                ? week.acwr.toFixed(
                                                                      2,
                                                                  )
                                                                : '—'}
                                                        </TableCell>
                                                        <TableCell className="pr-4">
                                                            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                                                                <span
                                                                    className={cn(
                                                                        'size-1.5 shrink-0 rounded-full',
                                                                        zoneMeta.dotClass,
                                                                    )}
                                                                />
                                                                <span
                                                                    className={
                                                                        zoneMeta.textClass
                                                                    }
                                                                >
                                                                    {
                                                                        zoneMeta.label
                                                                    }
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
                ) : (
                    /* Sessions History Tab */
                    <div className="rounded-md border border-border bg-card">
                        {sessions.length === 0 ? (
                            <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                                <ListChecks className="size-8 text-muted-foreground/60" />
                                <p className="text-sm font-medium text-foreground">
                                    Belum ada riwayat sesi RPE
                                </p>
                                <p className="max-w-md text-xs text-muted-foreground">
                                    Tambahkan sesi latihan harian (mendukung
                                    multi-sesi per hari) untuk menghitung beban
                                    latihan dan ACWR mingguan.
                                </p>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={openCreate}
                                    className="mt-2 rounded-md"
                                >
                                    <Plus className="size-4" />
                                    Catat Sesi Pertama
                                </Button>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-4">
                                                Tanggal
                                            </TableHead>
                                            <TableHead>Minggu</TableHead>
                                            <TableHead>Jenis Sesi</TableHead>
                                            <TableHead className="text-right">
                                                Durasi
                                            </TableHead>
                                            <TableHead className="text-right">
                                                sRPE
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Session Load
                                            </TableHead>
                                            <TableHead>Catatan</TableHead>
                                            <TableHead className="pr-4 text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sessions.map((session) => (
                                            <TableRow key={session.id}>
                                                <TableCell className="pl-4 font-medium text-foreground tabular-nums">
                                                    {
                                                        session.session_date_formatted
                                                    }
                                                </TableCell>
                                                <TableCell className="text-xs text-muted-foreground tabular-nums">
                                                    {session.iso_week}
                                                </TableCell>
                                                <TableCell className="text-sm text-foreground">
                                                    {session.session_type_label}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {session.duration_minutes}{' '}
                                                    <span className="text-muted-foreground">
                                                        mnt
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-medium text-foreground tabular-nums">
                                                    {session.rpe}
                                                    <span className="font-normal text-muted-foreground">
                                                        /10
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right font-semibold text-foreground tabular-nums">
                                                    {session.session_load.toLocaleString(
                                                        'id-ID',
                                                    )}{' '}
                                                    <span className="font-normal text-muted-foreground">
                                                        AU
                                                    </span>
                                                </TableCell>
                                                <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                                                    {session.notes ?? '—'}
                                                </TableCell>
                                                <TableCell className="pr-4 text-right">
                                                    <div className="inline-flex items-center justify-end gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEdit(
                                                                    session,
                                                                )
                                                            }
                                                            className="size-8 rounded-md text-muted-foreground hover:text-foreground"
                                                            aria-label={`Ubah sesi ${session.session_date_formatted}`}
                                                        >
                                                            <Pencil className="size-3.5" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeletingSession(
                                                                    session,
                                                                )
                                                            }
                                                            className="size-8 rounded-md text-muted-foreground hover:text-destructive-foreground"
                                                            aria-label={`Hapus sesi ${session.session_date_formatted}`}
                                                        >
                                                            <Trash2 className="size-3.5" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Create / Edit RPE Session Dialog */}
            <RpeSessionDialog
                open={dialogOpen}
                athlete={athlete}
                session={editingSession}
                sessionTypes={sessionTypes}
                today={today}
                onOpenChange={(open) => {
                    setDialogOpen(open);

                    if (!open) {
                        setEditingSession(null);
                    }
                }}
            />

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deletingSession !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingSession(null);
                    }
                }}
            >
                <DialogContent className="rounded-md sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Hapus Sesi RPE</DialogTitle>
                        <DialogDescription>
                            Yakin ingin menghapus sesi{' '}
                            <span className="font-medium text-foreground">
                                {deletingSession?.session_type_label}
                            </span>{' '}
                            tanggal{' '}
                            <span className="font-medium text-foreground">
                                {deletingSession?.session_date_formatted}
                            </span>{' '}
                            (
                            {deletingSession?.session_load.toLocaleString(
                                'id-ID',
                            )}{' '}
                            AU)? Rekap ACWR mingguan akan otomatis disesuaikan.
                        </DialogDescription>
                    </DialogHeader>

                    {deletingSession && (
                        <Form
                            {...RpeController.destroy.form([
                                athlete.id,
                                deletingSession.id,
                            ])}
                            options={{ preserveScroll: true }}
                            onSuccess={() => setDeletingSession(null)}
                        >
                            {({ processing }) => (
                                <DialogFooter className="gap-2 pt-2">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="rounded-md"
                                        >
                                            Batal
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        variant="destructive"
                                        disabled={processing}
                                        className="rounded-md"
                                    >
                                        {processing && <Spinner />}
                                        Hapus Sesi
                                    </Button>
                                </DialogFooter>
                            )}
                        </Form>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}

RpeShow.layout = {
    breadcrumbs: [
        {
            title: 'Beban Latihan (RPE)',
            href: rpeIndex(),
        },
        {
            title: 'Detail ACWR',
            href: rpeIndex(),
        },
    ],
};
