import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    HeartPulse,
    Search,
    TableProperties,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useInitials } from '@/hooks/use-initials';
import { getRecoveryStatusMeta } from '@/lib/quick-recovery';
import { cn } from '@/lib/utils';
import { index as athletesIndex } from '@/routes/athletes';
import {
    bulk as trackingBulk,
    index as trackingIndex,
    show as trackingShow,
} from '@/routes/tracking';
import type {
    AthleteTrackingListItem,
    PaginatedResponse,
    TrackingOverviewStats,
    TrackingStatusFilter,
} from '@/types';

type Props = {
    athletes: PaginatedResponse<AthleteTrackingListItem>;
    filters: {
        search: string;
        status: TrackingStatusFilter;
    };
    stats: TrackingOverviewStats;
};

export default function TrackingIndex({ athletes, filters, stats }: Props) {
    const getInitials = useInitials();

    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState<TrackingStatusFilter>(filters.status);
    const lastAppliedSearch = useRef(filters.search);

    const applyFilters = (
        nextSearch: string,
        nextStatus: TrackingStatusFilter,
    ) => {
        const trimmedSearch = nextSearch.trim();
        lastAppliedSearch.current = trimmedSearch;

        const query: Record<string, string> = {};

        if (trimmedSearch) {
            query.search = trimmedSearch;
        }

        if (nextStatus !== 'all') {
            query.status = nextStatus;
        }

        router.get(
            trackingIndex.url({ query }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        const trimmedSearch = search.trim();

        if (trimmedSearch === lastAppliedSearch.current) {
            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters(trimmedSearch, status);
        }, 300);

        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleStatusChange = (value: string) => {
        const nextStatus = value as TrackingStatusFilter;
        setStatus(nextStatus);
        applyFilters(search, nextStatus);
    };

    const resetFilters = () => {
        setSearch('');
        setStatus('all');
        applyFilters('', 'all');
    };

    const hasActiveFilter = search.trim() !== '' || status !== 'all';

    return (
        <>
            <Head title="Tracking Quick Recovery" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Tracking Quick Recovery
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Pantau kesiapan pemulihan harian (QRS), Resting HR,
                            SpO₂, VO₂ Max, dan Peak Power seluruh atlet.
                        </p>
                    </div>

                    <Button
                        asChild
                        variant="outline"
                        className="w-fit rounded-md"
                    >
                        <Link href={athletesIndex()}>Kelola Data Atlet</Link>
                    </Button>
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
                            {stats.tracked_athletes} atlet sudah memiliki data
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Rata-rata Recovery</span>
                            <HeartPulse className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.avg_recovery_score !== null
                                ? `${stats.avg_recovery_score.toFixed(1)}%`
                                : '—'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Berdasarkan pencatatan terakhir tiap atlet
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Recovery Baik</span>
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.good_count}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Skor QRS ≥ 75% (zona optimal)
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Perlu Perhatian</span>
                            <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.poor_count + stats.fair_count}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {stats.poor_count} kurang · {stats.fair_count} cukup
                        </p>
                    </div>
                </div>

                {/* Filter Bar + Table Card */}
                <div className="rounded-md border border-border bg-card">
                    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative flex-1 sm:max-w-sm">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama atlet..."
                                className="h-9 rounded-md pl-9"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={status}
                                onValueChange={handleStatusChange}
                            >
                                <SelectTrigger className="h-9 w-48 rounded-md">
                                    <SelectValue placeholder="Filter status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua status
                                    </SelectItem>
                                    <SelectItem value="good">
                                        Recovery Baik (≥ 75%)
                                    </SelectItem>
                                    <SelectItem value="fair">
                                        Recovery Cukup (35–74%)
                                    </SelectItem>
                                    <SelectItem value="poor">
                                        Recovery Kurang (&lt; 35%)
                                    </SelectItem>
                                    <SelectItem value="empty">
                                        Belum Ada Data
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {hasActiveFilter && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={resetFilters}
                                    className="h-9 rounded-md text-muted-foreground"
                                >
                                    <X className="size-3.5" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {athletes.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 px-6 py-14 text-center">
                            <HeartPulse className="size-8 text-muted-foreground/60" />
                            <p className="text-sm font-medium text-foreground">
                                {hasActiveFilter
                                    ? 'Tidak ada atlet yang sesuai filter'
                                    : 'Belum ada atlet terdaftar'}
                            </p>
                            <p className="max-w-sm text-xs text-muted-foreground">
                                {hasActiveFilter
                                    ? 'Coba ubah kata kunci pencarian atau pilih status pemulihan lain.'
                                    : 'Tambahkan atlet terlebih dahulu di menu Manajemen Atlet untuk mulai mencatat Quick Recovery.'}
                            </p>
                            {!hasActiveFilter && (
                                <Button
                                    asChild
                                    size="sm"
                                    className="mt-2 rounded-md"
                                >
                                    <Link href={athletesIndex()}>
                                        Tambah Atlet
                                    </Link>
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="pl-4">
                                                Atlet
                                            </TableHead>
                                            <TableHead>Mulai Program</TableHead>
                                            <TableHead className="text-right">
                                                RHR Terakhir
                                            </TableHead>
                                            <TableHead className="text-right">
                                                SpO₂
                                            </TableHead>
                                            <TableHead className="text-right">
                                                VO₂ Max
                                            </TableHead>
                                            <TableHead className="text-right">
                                                QRS
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="pr-4 text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {athletes.data.map((athlete) => {
                                            const latest =
                                                athlete.latest_metric;
                                            const statusMeta = latest
                                                ? getRecoveryStatusMeta(
                                                      latest.recovery_status,
                                                  )
                                                : getRecoveryStatusMeta(
                                                      'KOSONG',
                                                  );

                                            return (
                                                <TableRow key={athlete.id}>
                                                    <TableCell className="pl-4">
                                                        <div className="flex items-center gap-3">
                                                            <Avatar className="size-8 shrink-0">
                                                                <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                                                                    {getInitials(
                                                                        athlete.name,
                                                                    )}
                                                                </AvatarFallback>
                                                            </Avatar>
                                                            <div className="min-w-0">
                                                                <Link
                                                                    href={trackingShow(
                                                                        athlete.id,
                                                                    )}
                                                                    className="truncate font-medium text-foreground hover:text-primary hover:underline"
                                                                >
                                                                    {
                                                                        athlete.name
                                                                    }
                                                                </Link>
                                                                <p className="text-xs text-muted-foreground tabular-nums">
                                                                    {
                                                                        athlete.gender_label
                                                                    }{' '}
                                                                    ·{' '}
                                                                    {
                                                                        athlete.age
                                                                    }{' '}
                                                                    thn ·{' '}
                                                                    {
                                                                        athlete.filled_metrics_count
                                                                    }{' '}
                                                                    hari terisi
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground tabular-nums">
                                                        {athlete.training_start_date_formatted ??
                                                            'Belum diatur'}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-foreground tabular-nums">
                                                        {latest ? (
                                                            <>
                                                                {latest.rhr.toFixed(
                                                                    1,
                                                                )}{' '}
                                                                <span className="font-normal text-muted-foreground">
                                                                    bpm
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-normal text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-foreground tabular-nums">
                                                        {latest ? (
                                                            <>
                                                                {latest.spo2.toFixed(
                                                                    1,
                                                                )}
                                                                <span className="font-normal text-muted-foreground">
                                                                    %
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-normal text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-foreground tabular-nums">
                                                        {latest ? (
                                                            <>
                                                                {latest.vo2_max.toFixed(
                                                                    1,
                                                                )}{' '}
                                                                <span className="font-normal text-muted-foreground">
                                                                    ml/kg/m
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-normal text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold text-foreground tabular-nums">
                                                        {latest ? (
                                                            <span>
                                                                {
                                                                    latest.quick_recovery_score
                                                                }
                                                                %
                                                            </span>
                                                        ) : (
                                                            <span className="font-normal text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
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
                                                                    {
                                                                        statusMeta.label
                                                                    }
                                                                </span>
                                                            </span>
                                                            {latest && (
                                                                <span className="text-[11px] text-muted-foreground tabular-nums">
                                                                    {
                                                                        latest.record_date_formatted
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-4 text-right">
                                                        <div className="inline-flex items-center justify-end gap-1.5">
                                                            <Button
                                                                asChild
                                                                variant="ghost"
                                                                size="sm"
                                                                className="h-8 rounded-md px-2.5 text-xs"
                                                            >
                                                                <Link
                                                                    href={trackingBulk(
                                                                        athlete.id,
                                                                    )}
                                                                >
                                                                    <TableProperties className="size-3.5" />
                                                                    Massal
                                                                </Link>
                                                            </Button>
                                                            <Button
                                                                asChild
                                                                variant="outline"
                                                                size="sm"
                                                                className="h-8 rounded-md px-2.5 text-xs"
                                                            >
                                                                <Link
                                                                    href={trackingShow(
                                                                        athlete.id,
                                                                    )}
                                                                >
                                                                    Detail
                                                                    <ArrowRight className="size-3.5" />
                                                                </Link>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            {athletes.last_page > 1 && (
                                <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row">
                                    <p className="tabular-nums">
                                        Menampilkan {athletes.from ?? 0}–
                                        {athletes.to ?? 0} dari {athletes.total}{' '}
                                        atlet
                                    </p>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={!athletes.prev_page_url}
                                            onClick={() => {
                                                if (athletes.prev_page_url) {
                                                    router.get(
                                                        athletes.prev_page_url,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                            className="h-8 rounded-md px-3 text-xs"
                                        >
                                            Sebelumnya
                                        </Button>
                                        <span className="px-2 tabular-nums">
                                            Hal {athletes.current_page} /{' '}
                                            {athletes.last_page}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={!athletes.next_page_url}
                                            onClick={() => {
                                                if (athletes.next_page_url) {
                                                    router.get(
                                                        athletes.next_page_url,
                                                        {},
                                                        {
                                                            preserveState: true,
                                                            preserveScroll: true,
                                                        },
                                                    );
                                                }
                                            }}
                                            className="h-8 rounded-md px-3 text-xs"
                                        >
                                            Berikutnya
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}

TrackingIndex.layout = {
    breadcrumbs: [
        {
            title: 'Tracking Quick Recovery',
            href: trackingIndex(),
        },
    ],
};
