import { Head, Link, router } from '@inertiajs/react';
import {
    Activity,
    AlertTriangle,
    ArrowRight,
    CheckCircle2,
    Flame,
    Search,
    Users,
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
import { getAcwrZoneMeta } from '@/lib/rpe-acwr';
import { cn } from '@/lib/utils';
import { index as athletesIndex } from '@/routes/athletes';
import {
    index as rpeIndex,
    show as rpeShow,
    teamInput as rpeTeamInput,
} from '@/routes/rpe';
import type {
    AthleteRpeListItem,
    PaginatedResponse,
    RpeOverviewStats,
    RpeZoneFilter,
} from '@/types';

type Props = {
    athletes: PaginatedResponse<AthleteRpeListItem>;
    filters: {
        search: string;
        zone: RpeZoneFilter;
    };
    stats: RpeOverviewStats;
    currentWeekLabel: string;
};

export default function RpeIndex({
    athletes,
    filters,
    stats,
    currentWeekLabel,
}: Props) {
    const getInitials = useInitials();

    const [search, setSearch] = useState(filters.search);
    const [zone, setZone] = useState<RpeZoneFilter>(filters.zone);
    const lastAppliedSearch = useRef(filters.search);

    const applyFilters = (nextSearch: string, nextZone: RpeZoneFilter) => {
        const trimmedSearch = nextSearch.trim();
        lastAppliedSearch.current = trimmedSearch;

        const query: Record<string, string> = {};

        if (trimmedSearch) {
            query.search = trimmedSearch;
        }

        if (nextZone !== 'all') {
            query.zone = nextZone;
        }

        router.get(
            rpeIndex.url({ query }),
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
            applyFilters(trimmedSearch, zone);
        }, 300);

        return () => window.clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search]);

    const handleZoneChange = (value: string) => {
        const nextZone = value as RpeZoneFilter;
        setZone(nextZone);
        applyFilters(search, nextZone);
    };

    const resetFilters = () => {
        setSearch('');
        setZone('all');
        applyFilters('', 'all');
    };

    const hasActiveFilter = search.trim() !== '' || zone !== 'all';

    return (
        <>
            <Head title="Beban Latihan (RPE & ACWR)" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Page Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Beban Latihan (sRPE &amp; ACWR Weekly)
                        </h1>
                        <p className="text-sm text-muted-foreground tabular-nums">
                            Evaluasi Session Load (Foster CR-10) dan ACWR
                            mingguan (Coupled 4W) · Minggu berjalan:{' '}
                            <span className="font-medium text-foreground">
                                {currentWeekLabel}
                            </span>
                        </p>
                    </div>

                    <Button asChild className="w-fit rounded-md">
                        <Link href={rpeTeamInput()}>
                            <Users className="size-4" />
                            Input Sesi Tim
                        </Link>
                    </Button>
                </div>

                {/* 4 KPI Stat Cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Sesi Minggu Ini</span>
                            <Activity className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.sessions_this_week}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            Total dari {stats.total_athletes} atlet terdaftar
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Rata-rata ACWR Skuad</span>
                            <Flame className="size-4 text-primary" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.avg_acwr !== null
                                ? stats.avg_acwr.toFixed(2)
                                : '—'}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Target zona optimal 0.80 – 1.30
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Zona Optimal</span>
                            <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.optimal_count}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            Atlet dalam Sweet Spot (0.80–1.30)
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-4">
                        <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
                            <span>Waspada / Risiko Tinggi</span>
                            <AlertTriangle className="size-4 text-rose-600 dark:text-rose-400" />
                        </div>
                        <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.high_risk_count + stats.caution_count}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground tabular-nums">
                            {stats.high_risk_count} risiko tinggi ·{' '}
                            {stats.caution_count} waspada
                        </p>
                    </div>
                </div>

                {/* Filter Bar + Table */}
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
                                value={zone}
                                onValueChange={handleZoneChange}
                            >
                                <SelectTrigger className="h-9 w-52 rounded-md">
                                    <SelectValue placeholder="Filter zona ACWR" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua zona ACWR
                                    </SelectItem>
                                    <SelectItem value="optimal">
                                        Optimal (0.80 – 1.30)
                                    </SelectItem>
                                    <SelectItem value="caution">
                                        Waspada (1.31 – 1.50)
                                    </SelectItem>
                                    <SelectItem value="high_risk">
                                        Risiko Tinggi (&gt; 1.50)
                                    </SelectItem>
                                    <SelectItem value="undertraining">
                                        Beban Kurang (&lt; 0.80)
                                    </SelectItem>
                                    <SelectItem value="no_data">
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
                            <Flame className="size-8 text-muted-foreground/60" />
                            <p className="text-sm font-medium text-foreground">
                                {hasActiveFilter
                                    ? 'Tidak ada atlet sesuai filter zona ACWR'
                                    : 'Belum ada atlet terdaftar'}
                            </p>
                            <p className="max-w-sm text-xs text-muted-foreground">
                                {hasActiveFilter
                                    ? 'Coba ubah kata kunci atau pilih zona ACWR lain.'
                                    : 'Tambahkan atlet di menu Manajemen Atlet untuk mulai mencatat sesi RPE.'}
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
                                            <TableHead>Minggu Aktif</TableHead>
                                            <TableHead className="text-right">
                                                Acute (1W)
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Chronic (4W)
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Δ Minggu
                                            </TableHead>
                                            <TableHead className="text-right">
                                                ACWR
                                            </TableHead>
                                            <TableHead>Zona</TableHead>
                                            <TableHead className="pr-4 text-right">
                                                Aksi
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {athletes.data.map((athlete) => {
                                            const lw = athlete.latest_week;
                                            const zoneMeta = getAcwrZoneMeta(
                                                lw?.zone ?? 'no_data',
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
                                                                    href={rpeShow(
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
                                                                        athlete.total_sessions
                                                                    }{' '}
                                                                    sesi total
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-xs text-muted-foreground tabular-nums">
                                                        {lw ? (
                                                            <div>
                                                                <p className="font-medium text-foreground">
                                                                    {
                                                                        lw.week_label
                                                                    }
                                                                </p>
                                                                <p className="text-[11px] text-muted-foreground">
                                                                    {
                                                                        lw.session_count
                                                                    }{' '}
                                                                    sesi · basis{' '}
                                                                    {
                                                                        lw.chronic_weeks_used
                                                                    }
                                                                    W
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            'Belum ada sesi'
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-foreground tabular-nums">
                                                        {lw ? (
                                                            <>
                                                                {lw.acute_load.toLocaleString(
                                                                    'id-ID',
                                                                )}{' '}
                                                                <span className="font-normal text-muted-foreground">
                                                                    AU
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-normal text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-medium text-foreground tabular-nums">
                                                        {lw ? (
                                                            <>
                                                                {Math.round(
                                                                    lw.chronic_load,
                                                                ).toLocaleString(
                                                                    'id-ID',
                                                                )}{' '}
                                                                <span className="font-normal text-muted-foreground">
                                                                    AU
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className="font-normal text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right text-sm tabular-nums">
                                                        {lw &&
                                                        lw.week_change_pct !==
                                                            null ? (
                                                            <span
                                                                className={cn(
                                                                    lw.week_change_pct >
                                                                        15
                                                                        ? 'font-medium text-rose-700 dark:text-rose-400'
                                                                        : 'text-muted-foreground',
                                                                )}
                                                            >
                                                                {lw.week_change_pct >
                                                                0
                                                                    ? '+'
                                                                    : ''}
                                                                {lw.week_change_pct.toFixed(
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
                                                    <TableCell className="text-right font-semibold text-foreground tabular-nums">
                                                        {lw &&
                                                        lw.acwr !== null ? (
                                                            lw.acwr.toFixed(2)
                                                        ) : (
                                                            <span className="font-normal text-muted-foreground">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
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
                                                                {zoneMeta.label}
                                                            </span>
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="pr-4 text-right">
                                                        <Button
                                                            asChild
                                                            variant="outline"
                                                            size="sm"
                                                            className="h-8 rounded-md px-2.5 text-xs"
                                                        >
                                                            <Link
                                                                href={rpeShow(
                                                                    athlete.id,
                                                                )}
                                                            >
                                                                Detail
                                                                <ArrowRight className="size-3.5" />
                                                            </Link>
                                                        </Button>
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

RpeIndex.layout = {
    breadcrumbs: [
        {
            title: 'Beban Latihan (RPE)',
            href: rpeIndex(),
        },
    ],
};
