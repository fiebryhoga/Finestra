import { router } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import {
    Activity,
    CornerDownLeft,
    Flame,
    HeartPulse,
    KeyRound,
    LayoutGrid,
    Monitor,
    Moon,
    Palette,
    Search,
    Sun,
    UserCog,
    Users,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { edit as editAppearance } from '@/routes/appearance';
import { index as athletesIndex } from '@/routes/athletes';
import { edit as editProfile } from '@/routes/profile';
import { index as rpeIndex, teamInput as rpeTeamInput } from '@/routes/rpe';
import { edit as editSecurity } from '@/routes/security';
import { index as trackingIndex } from '@/routes/tracking';
import { index as usersIndex } from '@/routes/users';

type SearchItem = {
    id: string;
    group: 'Navigasi' | 'Aksi Cepat';
    title: string;
    description: string;
    keywords: string[];
    icon: LucideIcon;
    onSelect: () => void;
};

export function GlobalSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const { updateAppearance } = useAppearance();

    const items = useMemo<SearchItem[]>(
        () => [
            {
                id: 'nav-dashboard',
                group: 'Navigasi',
                title: 'Dashboard',
                description: 'Ringkasan monitoring kondisi dan kelelahan atlet',
                keywords: [
                    'home',
                    'beranda',
                    'utama',
                    'monitoring',
                    'ringkasan',
                ],
                icon: LayoutGrid,
                onSelect: () => router.visit(dashboard()),
            },
            {
                id: 'nav-tracking',
                group: 'Navigasi',
                title: 'Tracking Quick Recovery',
                description:
                    'Pantau pemulihan harian (QRS), BHR, SpO₂, VJ, VO₂ Max, dan Peak Power',
                keywords: [
                    'tracking',
                    'recovery',
                    'qrs',
                    'bhr',
                    'basal heart rate',
                    'rhr',
                    'spo2',
                    'vj',
                    'vo2',
                    'peak power',
                    'daily',
                    'harian',
                ],
                icon: HeartPulse,
                onSelect: () => router.visit(trackingIndex()),
            },
            {
                id: 'nav-rpe',
                group: 'Navigasi',
                title: 'Beban Latihan (RPE & ACWR)',
                description:
                    'Pantau sRPE (Foster CR-10), beban mingguan, dan ACWR Weekly',
                keywords: [
                    'rpe',
                    'srpe',
                    'acwr',
                    'beban',
                    'load',
                    'foster',
                    'monotony',
                    'strain',
                    'mingguan',
                ],
                icon: Flame,
                onSelect: () => router.visit(rpeIndex()),
            },
            {
                id: 'action-rpe-team',
                group: 'Aksi Cepat',
                title: 'Input Sesi Tim (RPE Massal)',
                description:
                    'Catat skor sRPE satu sesi latihan untuk banyak atlet sekaligus',
                keywords: ['rpe', 'tim', 'massal', 'bulk', 'sesi', 'latihan'],
                icon: Flame,
                onSelect: () => router.visit(rpeTeamInput()),
            },
            {
                id: 'nav-athletes',
                group: 'Navigasi',
                title: 'Manajemen Atlet',
                description:
                    'Kelola data atlet, tanggal lahir, berat badan, dan tinggi badan',
                keywords: [
                    'atlet',
                    'athlete',
                    'berat',
                    'tinggi',
                    'antropometri',
                    'bmi',
                    'imt',
                ],
                icon: Activity,
                onSelect: () => router.visit(athletesIndex()),
            },
            {
                id: 'nav-users',
                group: 'Navigasi',
                title: 'Manajemen Pengguna',
                description:
                    'Tambah, ubah, reset kata sandi, dan kelola status akun pengguna',
                keywords: [
                    'user',
                    'pengguna',
                    'admin',
                    'akun',
                    'crud',
                    'tambah',
                ],
                icon: Users,
                onSelect: () => router.visit(usersIndex()),
            },
            {
                id: 'nav-profile',
                group: 'Navigasi',
                title: 'Pengaturan Profil',
                description:
                    'Perbarui nama lengkap, username, atau kelola akun',
                keywords: ['profile', 'akun', 'nama', 'username', 'hapus'],
                icon: UserCog,
                onSelect: () => router.visit(editProfile()),
            },
            {
                id: 'nav-security',
                group: 'Navigasi',
                title: 'Ganti Kata Sandi',
                description: 'Perbarui kata sandi untuk keamanan akun Anda',
                keywords: ['password', 'sandi', 'keamanan', 'security', 'ubah'],
                icon: KeyRound,
                onSelect: () => router.visit(editSecurity()),
            },
            {
                id: 'nav-appearance',
                group: 'Navigasi',
                title: 'Pengaturan Tampilan',
                description: 'Atur preferensi tema Terang, Gelap, atau Sistem',
                keywords: ['tema', 'theme', 'appearance', 'mode', 'warna'],
                icon: Palette,
                onSelect: () => router.visit(editAppearance()),
            },
            {
                id: 'action-theme-light',
                group: 'Aksi Cepat',
                title: 'Aktifkan Mode Terang',
                description:
                    'Gunakan tema Biru Navy terang untuk kondisi lapangan',
                keywords: ['light', 'terang', 'siang', 'tema', 'theme'],
                icon: Sun,
                onSelect: () => updateAppearance('light'),
            },
            {
                id: 'action-theme-dark',
                group: 'Aksi Cepat',
                title: 'Aktifkan Mode Gelap',
                description:
                    'Gunakan tema Biru Navy gelap untuk ruang analisis',
                keywords: ['dark', 'gelap', 'malam', 'tema', 'theme'],
                icon: Moon,
                onSelect: () => updateAppearance('dark'),
            },
            {
                id: 'action-theme-system',
                group: 'Aksi Cepat',
                title: 'Ikuti Tema Sistem',
                description:
                    'Sinkronkan tampilan otomatis dengan perangkat Anda',
                keywords: ['system', 'sistem', 'otomatis', 'auto', 'tema'],
                icon: Monitor,
                onSelect: () => updateAppearance('system'),
            },
        ],
        [updateAppearance],
    );

    const filteredItems = useMemo(() => {
        const normalizedQuery = query.trim().toLowerCase();

        if (!normalizedQuery) {
            return items;
        }

        return items.filter((item) => {
            const haystack = [
                item.title,
                item.description,
                item.group,
                ...item.keywords,
            ]
                .join(' ')
                .toLowerCase();

            return haystack.includes(normalizedQuery);
        });
    }, [items, query]);

    const groupedItems = useMemo(() => {
        const groups: Record<string, SearchItem[]> = {};

        for (const item of filteredItems) {
            if (!groups[item.group]) {
                groups[item.group] = [];
            }

            groups[item.group].push(item);
        }

        return Object.entries(groups);
    }, [filteredItems]);

    const activeIndex =
        filteredItems.length === 0
            ? -1
            : Math.min(selectedIndex, filteredItems.length - 1);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                (event.metaKey || event.ctrlKey) &&
                event.key.toLowerCase() === 'k'
            ) {
                event.preventDefault();
                setOpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);

        if (!nextOpen) {
            setQuery('');
            setSelectedIndex(0);
        }
    };

    const runItem = (item: SearchItem) => {
        handleOpenChange(false);
        item.onSelect();
    };

    const handleInputKeyDown = (
        event: React.KeyboardEvent<HTMLInputElement>,
    ) => {
        if (filteredItems.length === 0) {
            return;
        }

        if (event.key === 'ArrowDown') {
            event.preventDefault();
            setSelectedIndex((current) => (current + 1) % filteredItems.length);
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            setSelectedIndex(
                (current) =>
                    (current - 1 + filteredItems.length) % filteredItems.length,
            );
        } else if (event.key === 'Enter' && activeIndex >= 0) {
            event.preventDefault();
            runItem(filteredItems[activeIndex]);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className="hidden h-9 w-56 cursor-pointer items-center justify-between rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none sm:flex lg:w-64"
                aria-label="Cari halaman atau fitur"
            >
                <span className="flex items-center gap-2 truncate">
                    <Search className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate">Cari cepat...</span>
                </span>
                <span className="ml-2 shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    ⌘K
                </span>
            </button>

            <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setOpen(true)}
                className="size-9 rounded-md sm:hidden"
                aria-label="Cari halaman atau fitur"
            >
                <Search className="size-4" />
            </Button>

            <Dialog open={open} onOpenChange={handleOpenChange}>
                <DialogContent
                    showCloseButton={false}
                    className="gap-0 overflow-hidden rounded-md p-0 sm:max-w-lg"
                >
                    <DialogTitle className="sr-only">
                        Pencarian cepat Phynestra
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Cari halaman, pengaturan, atau jalankan aksi cepat di
                        Phynestra.
                    </DialogDescription>

                    <div className="flex items-center gap-2.5 border-b border-border px-3.5">
                        <Search className="size-4 shrink-0 text-muted-foreground" />
                        <input
                            ref={inputRef}
                            type="text"
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setSelectedIndex(0);
                            }}
                            onKeyDown={handleInputKeyDown}
                            placeholder="Cari halaman, pengaturan, atau tema..."
                            autoFocus
                            className="h-12 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                        <span className="shrink-0 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            Esc
                        </span>
                    </div>

                    <div className="max-h-80 overflow-y-auto p-2">
                        {filteredItems.length === 0 ? (
                            <div className="py-10 text-center text-sm text-muted-foreground">
                                Tidak ada hasil untuk &ldquo;{query}&rdquo;.
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {groupedItems.map(([groupName, groupItems]) => (
                                    <div key={groupName} className="space-y-1">
                                        <p className="px-2.5 py-1 text-xs font-medium text-muted-foreground">
                                            {groupName}
                                        </p>
                                        {groupItems.map((item) => {
                                            const itemIndex =
                                                filteredItems.indexOf(item);
                                            const isSelected =
                                                itemIndex === activeIndex;
                                            const Icon = item.icon;

                                            return (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() =>
                                                        runItem(item)
                                                    }
                                                    onMouseEnter={() =>
                                                        setSelectedIndex(
                                                            itemIndex,
                                                        )
                                                    }
                                                    className={cn(
                                                        'flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-2 text-left transition-colors',
                                                        isSelected
                                                            ? 'bg-accent text-accent-foreground'
                                                            : 'text-foreground hover:bg-accent/60',
                                                    )}
                                                >
                                                    <div className="flex min-w-0 items-center gap-3">
                                                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                                                        <div className="min-w-0">
                                                            <p className="truncate text-sm font-medium">
                                                                {item.title}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground">
                                                                {
                                                                    item.description
                                                                }
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {isSelected && (
                                                        <CornerDownLeft className="size-3.5 shrink-0 text-muted-foreground" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between border-t border-border bg-muted/40 px-3.5 py-2 text-[11px] text-muted-foreground">
                        <span>Gunakan ↑ ↓ untuk memilih, Enter untuk buka</span>
                        <span>Phynestra</span>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
