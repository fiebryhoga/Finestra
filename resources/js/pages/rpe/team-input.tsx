import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckSquare, Save, Users } from 'lucide-react';
import { useState } from 'react';
import RpeController from '@/actions/App/Http/Controllers/RpeController';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { calculateSessionLoadPreview, FOSTER_CR10_SCALE } from '@/lib/rpe-acwr';
import { cn } from '@/lib/utils';
import { index as athletesIndex } from '@/routes/athletes';
import { index as rpeIndex } from '@/routes/rpe';
import type {
    SessionTypeOption,
    SessionTypeValue,
    TeamInputAthlete,
} from '@/types';

type Props = {
    athletes: TeamInputAthlete[];
    sessionTypes: SessionTypeOption[];
    today: string;
};

type AthleteEntryState = {
    athlete_id: number;
    included: boolean;
    duration_minutes: string;
    rpe: number;
};

export default function RpeTeamInput({ athletes, sessionTypes, today }: Props) {
    const pageErrors = usePage().props.errors as Record<string, string>;

    const [sessionDate, setSessionDate] = useState(today);
    const [sessionType, setSessionType] =
        useState<SessionTypeValue>('training');
    const [defaultDuration, setDefaultDuration] = useState('90');
    const [notes, setNotes] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [entries, setEntries] = useState<AthleteEntryState[]>(() =>
        athletes.map((athlete) => ({
            athlete_id: athlete.id,
            included: true,
            duration_minutes: '90',
            rpe: 5,
        })),
    );

    const includedCount = entries.filter((e) => e.included).length;

    const applyDefaultDurationToAll = () => {
        setEntries((current) =>
            current.map((entry) => ({
                ...entry,
                duration_minutes: defaultDuration,
            })),
        );
    };

    const toggleAllIncluded = (nextIncluded: boolean) => {
        setEntries((current) =>
            current.map((entry) => ({
                ...entry,
                included: nextIncluded,
            })),
        );
    };

    const updateEntry = (
        athleteId: number,
        patch: Partial<AthleteEntryState>,
    ) => {
        setEntries((current) =>
            current.map((entry) =>
                entry.athlete_id === athleteId ? { ...entry, ...patch } : entry,
            ),
        );
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const selectedEntries = entries
            .filter((entry) => entry.included)
            .map((entry) => ({
                athlete_id: entry.athlete_id,
                duration_minutes: Number.parseInt(entry.duration_minutes, 10),
                rpe: entry.rpe,
            }));

        router.post(
            RpeController.storeTeam.url(),
            {
                session_date: sessionDate,
                session_type: sessionType,
                notes: notes.trim() || null,
                entries: selectedEntries,
            },
            {
                preserveScroll: true,
                onStart: () => setSubmitting(true),
                onFinish: () => setSubmitting(false),
            },
        );
    };

    return (
        <>
            <Head title="Input Sesi Tim (RPE)" />

            <div className="flex h-full flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="space-y-3">
                    <Link
                        href={rpeIndex()}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="size-3.5" />
                        Kembali ke Beban Latihan (RPE)
                    </Link>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                Input Sesi Tim (Massal RPE)
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Catat satu sesi latihan untuk banyak atlet
                                sekaligus — dikumpulkan 30 menit pasca-latihan
                                (Foster CR-10).
                            </p>
                        </div>

                        <Button
                            type="submit"
                            form="team-rpe-form"
                            disabled={submitting || includedCount === 0}
                            className="w-fit rounded-md"
                        >
                            {submitting ? (
                                <Spinner />
                            ) : (
                                <Save className="size-4" />
                            )}
                            Simpan {includedCount} Atlet
                        </Button>
                    </div>
                </div>

                {athletes.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-border bg-card px-6 py-14 text-center">
                        <Users className="size-8 text-muted-foreground/60" />
                        <p className="text-sm font-medium text-foreground">
                            Belum ada atlet terdaftar
                        </p>
                        <p className="max-w-sm text-xs text-muted-foreground">
                            Tambahkan atlet terlebih dahulu di menu Manajemen
                            Atlet sebelum mencatat sesi tim.
                        </p>
                        <Button asChild size="sm" className="mt-2 rounded-md">
                            <Link href={athletesIndex()}>Tambah Atlet</Link>
                        </Button>
                    </div>
                ) : (
                    <form
                        id="team-rpe-form"
                        onSubmit={handleSubmit}
                        className="space-y-6"
                    >
                        {/* Shared Session Metadata Card */}
                        <div className="rounded-md border border-border bg-card p-5">
                            <h2 className="mb-4 text-sm font-semibold text-foreground">
                                Informasi Sesi Bersama
                            </h2>
                            <div className="grid gap-4 md:grid-cols-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="team-session-date">
                                        Tanggal sesi
                                    </Label>
                                    <Input
                                        id="team-session-date"
                                        type="date"
                                        required
                                        value={sessionDate}
                                        onChange={(e) =>
                                            setSessionDate(e.target.value)
                                        }
                                        className="h-9 rounded-md tabular-nums"
                                    />
                                    {pageErrors.session_date && (
                                        <p className="text-xs text-destructive-foreground">
                                            {pageErrors.session_date}
                                        </p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="team-session-type">
                                        Jenis sesi
                                    </Label>
                                    <Select
                                        value={sessionType}
                                        onValueChange={(value) =>
                                            setSessionType(
                                                value as SessionTypeValue,
                                            )
                                        }
                                    >
                                        <SelectTrigger
                                            id="team-session-type"
                                            className="h-9 w-full rounded-md"
                                        >
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {sessionTypes.map((opt) => (
                                                <SelectItem
                                                    key={opt.value}
                                                    value={opt.value}
                                                >
                                                    {opt.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="team-default-duration">
                                        Durasi standar (menit)
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            id="team-default-duration"
                                            type="number"
                                            min={1}
                                            max={600}
                                            value={defaultDuration}
                                            onChange={(e) =>
                                                setDefaultDuration(
                                                    e.target.value,
                                                )
                                            }
                                            className="h-9 rounded-md tabular-nums"
                                        />
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={applyDefaultDurationToAll}
                                            className="h-9 shrink-0 rounded-md text-xs"
                                        >
                                            Terapkan
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="team-notes">
                                        Catatan sesi (opsional)
                                    </Label>
                                    <Input
                                        id="team-notes"
                                        type="text"
                                        maxLength={500}
                                        value={notes}
                                        onChange={(e) =>
                                            setNotes(e.target.value)
                                        }
                                        placeholder="Mis. Sesi sore / Uji coba"
                                        className="h-9 rounded-md"
                                    />
                                </div>
                            </div>
                        </div>

                        {pageErrors.entries && (
                            <div className="rounded-md border border-destructive/40 bg-destructive/5 px-4 py-3 text-xs text-destructive-foreground">
                                {pageErrors.entries}
                            </div>
                        )}

                        {/* Athlete RPE Matrix */}
                        <div className="rounded-md border border-border bg-card">
                            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <CheckSquare className="size-4 text-primary" />
                                    <span className="tabular-nums">
                                        <strong className="text-foreground">
                                            {includedCount}
                                        </strong>{' '}
                                        dari {athletes.length} atlet ikut sesi
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleAllIncluded(true)}
                                        className="h-8 rounded-md text-xs"
                                    >
                                        Pilih Semua
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleAllIncluded(false)}
                                        className="h-8 rounded-md text-xs text-muted-foreground"
                                    >
                                        Kosongkan
                                    </Button>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-12 pl-4 text-center">
                                                Ikut
                                            </TableHead>
                                            <TableHead className="min-w-44">
                                                Atlet
                                            </TableHead>
                                            <TableHead className="w-28 text-right">
                                                Durasi (mnt)
                                            </TableHead>
                                            <TableHead className="min-w-80">
                                                Skor sRPE (Foster CR-10)
                                            </TableHead>
                                            <TableHead className="w-28 pr-4 text-right">
                                                Load (AU)
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {athletes.map((athlete) => {
                                            const entry = entries.find(
                                                (e) =>
                                                    e.athlete_id === athlete.id,
                                            );

                                            if (!entry) {
                                                return null;
                                            }

                                            const previewLoad =
                                                calculateSessionLoadPreview(
                                                    entry.rpe,
                                                    Number.parseInt(
                                                        entry.duration_minutes,
                                                        10,
                                                    ),
                                                );

                                            return (
                                                <TableRow
                                                    key={athlete.id}
                                                    className={cn(
                                                        !entry.included &&
                                                            'opacity-50',
                                                    )}
                                                >
                                                    <TableCell className="pl-4 text-center">
                                                        <Checkbox
                                                            checked={
                                                                entry.included
                                                            }
                                                            onCheckedChange={(
                                                                checked,
                                                            ) =>
                                                                updateEntry(
                                                                    athlete.id,
                                                                    {
                                                                        included:
                                                                            checked ===
                                                                            true,
                                                                    },
                                                                )
                                                            }
                                                            aria-label={`Sertakan ${athlete.name}`}
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <p className="font-medium text-foreground">
                                                            {athlete.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground tabular-nums">
                                                            {
                                                                athlete.gender_label
                                                            }{' '}
                                                            · {athlete.age} thn
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Input
                                                            type="number"
                                                            min={1}
                                                            max={600}
                                                            disabled={
                                                                !entry.included
                                                            }
                                                            value={
                                                                entry.duration_minutes
                                                            }
                                                            onChange={(e) =>
                                                                updateEntry(
                                                                    athlete.id,
                                                                    {
                                                                        duration_minutes:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    },
                                                                )
                                                            }
                                                            className="h-8 w-24 rounded-md text-right text-xs tabular-nums"
                                                        />
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap items-center gap-1">
                                                            {FOSTER_CR10_SCALE.map(
                                                                (item) => {
                                                                    const selected =
                                                                        entry.rpe ===
                                                                        item.score;

                                                                    return (
                                                                        <button
                                                                            key={
                                                                                item.score
                                                                            }
                                                                            type="button"
                                                                            disabled={
                                                                                !entry.included
                                                                            }
                                                                            onClick={() =>
                                                                                updateEntry(
                                                                                    athlete.id,
                                                                                    {
                                                                                        rpe: item.score,
                                                                                    },
                                                                                )
                                                                            }
                                                                            title={`${item.score} — ${item.label}`}
                                                                            className={cn(
                                                                                'flex size-7 cursor-pointer items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors disabled:cursor-not-allowed',
                                                                                selected
                                                                                    ? 'border-primary bg-primary text-primary-foreground'
                                                                                    : 'border-input bg-background text-foreground hover:bg-accent',
                                                                            )}
                                                                        >
                                                                            {
                                                                                item.score
                                                                            }
                                                                        </button>
                                                                    );
                                                                },
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="pr-4 text-right font-semibold text-foreground tabular-nums">
                                                        {entry.included
                                                            ? `${previewLoad.toLocaleString('id-ID')} AU`
                                                            : '—'}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="flex items-center justify-end border-t border-border px-4 py-3">
                                <Button
                                    type="submit"
                                    disabled={submitting || includedCount === 0}
                                    className="rounded-md"
                                >
                                    {submitting ? (
                                        <Spinner />
                                    ) : (
                                        <Save className="size-4" />
                                    )}
                                    Simpan Sesi Tim ({includedCount} Atlet)
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}

RpeTeamInput.layout = {
    breadcrumbs: [
        {
            title: 'Beban Latihan (RPE)',
            href: rpeIndex(),
        },
        {
            title: 'Input Sesi Tim',
            href: rpeIndex(),
        },
    ],
};
