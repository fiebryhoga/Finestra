import { Head, router, usePage } from '@inertiajs/react';
import {
    KeyRound,
    MoreHorizontal,
    Pencil,
    Plus,
    Search,
    Trash2,
    UserCheck,
    UserMinus,
    Users,
    UserX,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import UserController from '@/actions/App/Http/Controllers/UserController';
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
import { CreateUserDialog } from '@/components/users/create-user-dialog';
import { DeleteUserDialog } from '@/components/users/delete-user-dialog';
import { EditUserDialog } from '@/components/users/edit-user-dialog';
import { ResetPasswordDialog } from '@/components/users/reset-password-dialog';
import { useInitials } from '@/hooks/use-initials';
import { index as usersIndex } from '@/routes/users';
import type { Auth, ManagedUser, PaginatedResponse } from '@/types';

type PageProps = {
    auth: Auth;
};

type Props = {
    users: PaginatedResponse<ManagedUser>;
    filters: {
        search: string;
        status: 'all' | 'active' | 'inactive';
    };
    stats: {
        total: number;
        active: number;
        inactive: number;
    };
    passwordRules: string;
};

export default function UsersIndex({
    users,
    filters,
    stats,
    passwordRules,
}: Props) {
    const { auth } = usePage<PageProps>().props;
    const getInitials = useInitials();

    const [search, setSearch] = useState(filters.search);
    const [status, setStatus] = useState(filters.status);
    const [createOpen, setCreateOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<ManagedUser | null>(null);
    const [resettingUser, setResettingUser] = useState<ManagedUser | null>(
        null,
    );
    const [deletingUser, setDeletingUser] = useState<ManagedUser | null>(null);
    const lastAppliedSearch = useRef(filters.search);

    const applyFilters = (nextSearch: string, nextStatus: string) => {
        const trimmedSearch = nextSearch.trim();
        lastAppliedSearch.current = trimmedSearch;

        const query: Record<string, string> = {};

        if (trimmedSearch !== '') {
            query.search = trimmedSearch;
        }

        if (nextStatus !== 'all') {
            query.status = nextStatus;
        }

        router.get(
            usersIndex.url({ query }),
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
            applyFilters(search, status);
        }, 300);

        return () => window.clearTimeout(timer);
    }, [search, status]);

    const handleStatusChange = (nextStatus: 'all' | 'active' | 'inactive') => {
        setStatus(nextStatus);
        applyFilters(search, nextStatus);
    };

    const handleResetFilters = () => {
        setSearch('');
        setStatus('all');
        applyFilters('', 'all');
    };

    const handleToggleStatus = (user: ManagedUser) => {
        router.patch(
            UserController.toggleStatus.url(user.id),
            {},
            { preserveScroll: true },
        );
    };

    const hasActiveFilters = search.trim() !== '' || status !== 'all';

    return (
        <>
            <Head title="Manajemen Pengguna" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                            Manajemen Pengguna
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Kelola akun pelatih, peneliti, dan enumerator yang
                            memiliki akses ke platform Phynestra.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => setCreateOpen(true)}
                        className="h-10 self-start sm:self-auto"
                        data-test="open-create-user-dialog"
                    >
                        <Plus className="size-4" />
                        Tambah Pengguna
                    </Button>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-md border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                                Total Pengguna
                            </span>
                            <Users className="size-4 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.total}
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <span className="size-1.5 rounded-full bg-emerald-500" />
                                Pengguna Aktif
                            </span>
                            <UserCheck className="size-4 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.active}
                        </p>
                    </div>

                    <div className="rounded-md border border-border bg-card p-5">
                        <div className="flex items-center justify-between">
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                                Pengguna Nonaktif
                            </span>
                            <UserX className="size-4 text-muted-foreground" />
                        </div>
                        <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground tabular-nums">
                            {stats.inactive}
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
                                placeholder="Cari nama atau username..."
                                className="h-10 pr-9 pl-9"
                                aria-label="Cari pengguna"
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

                        <div className="flex items-center gap-2">
                            <Select
                                value={status}
                                onValueChange={(value) =>
                                    handleStatusChange(
                                        value as 'all' | 'active' | 'inactive',
                                    )
                                }
                            >
                                <SelectTrigger
                                    className="h-10 w-full sm:w-44"
                                    aria-label="Filter status akun"
                                >
                                    <SelectValue placeholder="Semua status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua status
                                    </SelectItem>
                                    <SelectItem value="active">
                                        Aktif
                                    </SelectItem>
                                    <SelectItem value="inactive">
                                        Nonaktif
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

                    {users.data.length === 0 ? (
                        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                            <Users className="size-8 text-muted-foreground/60" />
                            <p className="mt-3 text-sm font-medium text-foreground">
                                {hasActiveFilters
                                    ? 'Pengguna tidak ditemukan'
                                    : 'Belum ada pengguna'}
                            </p>
                            <p className="mt-1 max-w-sm text-xs text-muted-foreground">
                                {hasActiveFilters
                                    ? 'Coba ubah kata kunci pencarian atau filter status yang dipilih.'
                                    : 'Tambahkan akun pertama untuk mulai mengelola akses tim Phynestra.'}
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
                                    Tambah Pengguna
                                </Button>
                            )}
                        </div>
                    ) : (
                        <>
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead>Pengguna</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Terdaftar</TableHead>
                                        <TableHead className="w-20 text-right">
                                            Aksi
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.data.map((user) => {
                                        const isCurrentUser =
                                            user.id === auth.user.id;

                                        return (
                                            <TableRow key={user.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="size-8 rounded-full">
                                                            <AvatarFallback className="rounded-md bg-primary/10 text-xs font-medium text-primary">
                                                                {getInitials(
                                                                    user.name,
                                                                )}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div className="min-w-0 leading-tight">
                                                            <p className="truncate font-medium text-foreground">
                                                                {user.name}
                                                                {isCurrentUser && (
                                                                    <span className="ml-1.5 text-xs font-normal text-muted-foreground">
                                                                        (Anda)
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground">
                                                                @{user.username}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {user.is_active ? (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                                                            <span className="size-1.5 rounded-full bg-emerald-500" />
                                                            Aktif
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                                            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
                                                            Nonaktif
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-sm text-muted-foreground tabular-nums">
                                                    {user.created_at_formatted}
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
                                                                aria-label={`Aksi untuk ${user.name}`}
                                                            >
                                                                <MoreHorizontal className="size-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            align="end"
                                                            className="w-48"
                                                        >
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setEditingUser(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="mr-2 size-4" />
                                                                Ubah Data
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setResettingUser(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                <KeyRound className="mr-2 size-4" />
                                                                Reset Kata Sandi
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem
                                                                disabled={
                                                                    isCurrentUser
                                                                }
                                                                onClick={() =>
                                                                    handleToggleStatus(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                {user.is_active ? (
                                                                    <>
                                                                        <UserMinus className="mr-2 size-4" />
                                                                        Nonaktifkan
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <UserCheck className="mr-2 size-4" />
                                                                        Aktifkan
                                                                        Kembali
                                                                    </>
                                                                )}
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                disabled={
                                                                    isCurrentUser
                                                                }
                                                                onClick={() =>
                                                                    setDeletingUser(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 size-4" />
                                                                Hapus Pengguna
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
                                    Menampilkan {users.from ?? 0}–
                                    {users.to ?? 0} dari {users.total} pengguna
                                </span>

                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!users.prev_page_url}
                                        onClick={() => {
                                            if (users.prev_page_url) {
                                                router.visit(
                                                    users.prev_page_url,
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
                                        Halaman {users.current_page} /{' '}
                                        {users.last_page}
                                    </span>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        disabled={!users.next_page_url}
                                        onClick={() => {
                                            if (users.next_page_url) {
                                                router.visit(
                                                    users.next_page_url,
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

            <CreateUserDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                passwordRules={passwordRules}
            />

            <EditUserDialog
                user={editingUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingUser(null);
                    }
                }}
            />

            <ResetPasswordDialog
                user={resettingUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setResettingUser(null);
                    }
                }}
                passwordRules={passwordRules}
            />

            <DeleteUserDialog
                user={deletingUser}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingUser(null);
                    }
                }}
            />
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        {
            title: 'Manajemen Pengguna',
            href: usersIndex(),
        },
    ],
};
