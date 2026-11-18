import { Head, router } from '@inertiajs/react';
import {
    Activity,
    Calendar,
    MoreHorizontal,
    Pencil,
    Plus,
    Ruler,
    Scale,
    Search,
    Trash2,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CreateAthleteDialog } from '@/components/athletes/create-athlete-dialog';
import { DeleteAthleteDialog } from '@/components/athletes/delete-athlete-dialog';
import { EditAthleteDialog } from '@/components/athletes/edit-athlete-dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { index as athletesIndex } from '@/routes/athletes';
import type {
    Athlete,
    AthleteGender,
    AthleteSort,
    AthleteStats,
    PaginatedResponse,
} from '@/types';

type GenderFilter = 'all' | AthleteGender;

type Props = {
    athletes: PaginatedResponse<Athlete>;
    filters: {
        search: string;
        gender: GenderFilter;
        sort: AthleteSort;
    };
    stats: AthleteStats;
};

function getBmiMeta(bmi: number): {
    label: string;
    dotClass: string;
    textClass: string;
} {
    if (bmi < 18.5) {
        return {
            label: 'Kurus',
            dotClass: 'bg-sky-500',
            textClass: 'text-sky-700 dark:text-sky-400',
        };
    }

    if (bmi < 25) {
        return {
            label: 'Normal',
            dotClass: 'bg-emerald-500',
            textClass: 'text-emerald-700 dark:text-emerald-400',
        };
    }

    if (bmi < 30) {
        return {
            label: 'Berlebih',
            dotClass: 'bg-amber-500',
            textClass: 'text-amber-700 dark:text-amber-400',
        };
    }

    return {
        label: 'Obesitas',
        dotClass: 'bg-rose-500',
        textClass: 'text-rose-700 dark:text-rose-400',
    };
}

export default function AthletesIndex({ athletes, filters, stats }: Props) {
    const getInitials = useInitials();

    const [search, setSearch] = useState(filters.search);
    const [gender, setGender] = useState<GenderFilter>(filters.gender);
    const [sort, setSort] = useState<AthleteSort>(filters.sort);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
    const [deletingAthlete, setDeletingAthlete] = useState<Athlete | null>(
        null,
    );
    const lastAppliedSearch = useRef(filters.search);

    const applyFilters = (
        nextSearch: string,
        nextGender: GenderFilter,
        nextSort: AthleteSort,
    ) => {
        const trimmedSearch = nextSearch.trim();
        lastAppliedSearch.current = trimmedSearch;

        const query: Record<string, string> = {};

        if (trimmedSearch !== '') {
            query.search = trimmedSearch;
        }

        if (nextGender !== 'all') {
            query.gender = nextGender;
        }

        if (nextSort !== 'latest') {
            query.sort = nextSort;
        }

        router.get(
            athletesIndex.url({ query }),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            },
        );
    };

    useEffect(() => {
        if (search.trim() === lastAppliedSearch.current) {
            return;
        }

        const timer = window.setTimeout(() => {
            applyFilters(search, gender, sort);
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, gender, sort]);

    const handleGenderChange = (nextGender: GenderFilter) => {
        setGender(nextGender);
        applyFilters(search, nextGender, sort);
    };

    const handleSortChange = (nextSort: AthleteSort) => {
        setSort(nextSort);
        applyFilters(search, gender, nextSort);
    };

    const handleResetFilters = () => {
        setSearch('');
        setGender('all');
        setSort('latest');
        applyFilters('', 'all', 'latest');
    };

    const hasActiveFilters =
        search.trim() !== '' || gender !== 'all' || sort !== 'latest';

    return (
        <>
            <Head title="Manajemen Atlet" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Manajemen Atlet
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola profil dasar dan data antropometri atlet
                            untuk pemantauan fisiologis dan neuromuskular.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="h-10 self-start sm:self-auto"
                        data-test="open-create-athlete-dialog"
                    >
                        <Plus className="size-4" />
                        Tambah Atlet
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-md border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                                Total Atlet
                            </span>
                            <Activity className="size-4 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.total}{' '}
                            <span className="text-sm font-normal text-muted-foreground">
                                atlet
                            </span>
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                                Rata-rata Usia
                            </span>
                            <Calendar className="size-4 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.avg_age !== null ? (
                                <>
                                    {stats.avg_age.toFixed(1)}{' '}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        thn
                                    </span>
                                </>
                            ) : (
                                <span className="text-muted-foreground">—</span>
                            )}
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                                Rata-rata Berat Badan
                            </span>
                            <Scale className="size-4 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.avg_weight_kg !== null ? (
                                <>
                                    {stats.avg_weight_kg.toFixed(1)}{' '}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        kg
                                    </span>
                                </>
                            ) : (
                                <span className="text-muted-foreground">—</span>
                            )}
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                                Rata-rata Tinggi Badan
                            </span>
                            <Ruler className="size-4 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.avg_height_cm !== null ? (
                                <>
                                    {stats.avg_height_cm.toFixed(1)}{' '}
                                    <span className="text-sm font-normal text-muted-foreground">
                                        cm
                                    </span>
                                </>
                            ) : (
                                <span className="text-muted-foreground">—</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="rounded-md border border-border bg-card">
                    <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                type="text"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Cari nama atlet..."
                                className="h-10 pr-9 pl-9"
                                aria-label="Cari atlet"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch('')}
                                    className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-md p-1 text-muted-foreground hover:text-foreground"
                                    aria-label="Hapus pencarian"
                                >
                                    <X className="size-3.5" />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select
                                value={gender}
                                onValueChange={(value) =>
                                    handleGenderChange(value as GenderFilter)
                                }
                            >
                                <SelectTrigger
                                    className="h-10 w-full sm:w-44"
                                    aria-label="Filter jenis kelamin"
                                >
                                    <SelectValue placeholder="Semua gender" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua jenis kelamin
                                    </SelectItem>
                                    <SelectItem value="male">
                                        Laki-laki
                                    </SelectItem>
                                    <SelectItem value="female">
                                        Perempuan
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <Select
                                value={sort}
                                onValueChange={(value) =>
                                    handleSortChange(value as AthleteSort)
                                }
                            >
                                <SelectTrigger
                                    className="h-10 w-full sm:w-48"
                                    aria-label="Urutkan atlet"
                                >
                                    <SelectValue placeholder="Urutkan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="latest">
                                        Terbaru ditambahkan
                                    </SelectItem>
                                    <SelectItem value="name_asc">
                                        Nama (A–Z)
                                    </SelectItem>
                                    <SelectItem value="name_desc">
                                        Nama (Z–A)
                                    </SelectItem>
                                    <SelectItem value="youngest">
                                        Usia termuda
                                    </SelectItem>
                                    <SelectItem value="oldest">
                                        Usia tertua
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            {hasActiveFilters && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="h-10 px-3 text-muted-foreground"
                                    onClick={handleResetFilters}
                                >
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {athletes.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <Activity className="size-8 text-muted-foreground/60" />
                            <p className="mt-3 text-sm font-medium text-foreground">
                                {hasActiveFilters
                                    ? 'Atlet tidak ditemukan'
                                    : 'Belum ada data atlet'}
                            </p>
                            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                {hasActiveFilters
                                    ? 'Coba ubah kata kunci pencarian atau pengaturan urutan.'
                                    : 'Tambahkan data atlet pertama untuk mulai memantau kondisi fisiologis dan neuromuskular.'}
                            </p>
                            {hasActiveFilters ? (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="mt-4"
                                    onClick={handleResetFilters}
                                >
                                    Reset Filter
                                </Button>
                            ) : (
                                <Button
                                    type="button"
                                    className="mt-4"
                                    onClick={() => setCreateOpen(true)}
                                >
                                    <Plus className="size-4" />
                                    Tambah Atlet
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="min-w-48">
                                            Atlet
                                        </TableHead>
                                        <TableHead className="w-32">
                                            Jenis Kelamin
                                        </TableHead>
                                        <TableHead className="w-36">
                                            Tanggal Lahir
                                        </TableHead>
                                        <TableHead className="w-24 text-right">
                                            Usia
                                        </TableHead>
                                        <TableHead className="w-32 text-right">
                                            Berat Badan
                                        </TableHead>
                                        <TableHead className="w-32 text-right">
                                            Tinggi Badan
                                        </TableHead>
                                        <TableHead className="w-36 text-right">
                                            IMT (BMI)
                                        </TableHead>
                                        <TableHead className="w-16 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {athletes.data.map((athlete) => {
                                        const bmiMeta = getBmiMeta(athlete.bmi);

                                        return (
                                            <TableRow key={athlete.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-8 rounded-full">
                                                            <AvatarFallback className="rounded-md bg-primary/10 text-xs font-medium text-primary">
                                                                {getInitials(
                                                                    athlete.name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 leading-tight">
                                                            <p className="truncate font-medium text-foreground">
                                                                {athlete.name}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground tabular-nums">
                                                                Terdaftar{' '}
                                                                {
                                                                    athlete.created_at_formatted
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-sm text-foreground">
                                                    {athlete.gender_label ||
                                                        '—'}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground tabular-nums">
                                                    {
                                                        athlete.date_of_birth_formatted
                                                    }
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    <span className="font-medium text-foreground">
                                                        {athlete.age}
                                                    </span>{' '}
                                                    <span className="text-xs text-muted-foreground">
                                                        thn
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    <span className="font-medium text-foreground">
                                                        {athlete.weight_kg.toFixed(
                                                            1,
                                                        )}
                                                    </span>{' '}
                                                    <span className="text-xs text-muted-foreground">
                                                        kg
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    <span className="font-medium text-foreground">
                                                        {athlete.height_cm.toFixed(
                                                            1,
                                                        )}
                                                    </span>{' '}
                                                    <span className="text-xs text-muted-foreground">
                                                        cm
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    <div className="inline-flex items-center justify-end gap-2">
                                                        <span className="font-medium text-foreground">
                                                            {athlete.bmi.toFixed(
                                                                1,
                                                            )}
                                                        </span>
                                                        <span
                                                            className={`inline-flex items-center gap-1 text-xs font-medium ${bmiMeta.textClass}`}
                                                        >
                                                            <span
                                                                className={`size-1.5 rounded-full ${bmiMeta.dotClass}`}
                                                            />
                                                            {bmiMeta.label}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="size-8 rounded-md"
                                                                aria-label={`Aksi untuk ${athlete.name}`}
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-44"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setEditingAthlete(
                                                                        athlete,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="mr-2 size-4" />
                                                                Ubah Data
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    setDeletingAthlete(
                                                                        athlete,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 size-4" />
                                                                Hapus Atlet
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-4 py-3 text-xs text-muted-foreground sm:flex-row">
                                <span className="tabular-nums">
                                    Menampilkan {athletes.from ?? 0}–
                                    {athletes.to ?? 0} dari {athletes.total}{' '}
                                    atlet
                                </span>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!athletes.prev_page_url}
                                        onClick={() => {
                                            if (athletes.prev_page_url) {
                                                router.visit(
                                                    athletes.prev_page_url,
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    },
                                                );
                                            }
                                        }}
                                    >
                                        Sebelumnya
                                    </Button>
                                    <span className="px-2 tabular-nums">
                                        Halaman {athletes.current_page} /{' '}
                                        {athletes.last_page}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!athletes.next_page_url}
                                        onClick={() => {
                                            if (athletes.next_page_url) {
                                                router.visit(
                                                    athletes.next_page_url,
                                                    {
                                                        preserveState: true,
                                                        preserveScroll: true,
                                                    },
                                                );
                                            }
                                        }}
                                    >
                                        Berikutnya
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <CreateAthleteDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
            />

            <EditAthleteDialog
                athlete={editingAthlete}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingAthlete(null);
                    }
                }}
            />

            <DeleteAthleteDialog
                athlete={deletingAthlete}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingAthlete(null);
                    }
                }}
            />
        </>
    );
}

AthletesIndex.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Atlet',
            href: athletesIndex(),
        },
    ],
};
