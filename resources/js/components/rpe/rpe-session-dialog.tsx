import { Form } from '@inertiajs/react';
import { useState } from 'react';
import RpeController from '@/actions/App/Http/Controllers/RpeController';
import InputError from '@/components/input-error';
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
    calculateSessionLoadPreview,
    FOSTER_CR10_SCALE,
    getFosterScaleMeta,
} from '@/lib/rpe-acwr';
import { cn } from '@/lib/utils';
import type {
    RpeAthleteDetail,
    RpeSessionRecord,
    SessionTypeOption,
    SessionTypeValue,
} from '@/types';

type Props = {
    open: boolean;
    athlete: RpeAthleteDetail;
    session: RpeSessionRecord | null;
    sessionTypes: SessionTypeOption[];
    today: string;
    onOpenChange: (open: boolean) => void;
};

function RpeSessionForm({
    athlete,
    session,
    sessionTypes,
    today,
    onClose,
}: {
    athlete: RpeAthleteDetail;
    session: RpeSessionRecord | null;
    sessionTypes: SessionTypeOption[];
    today: string;
    onClose: () => void;
}) {
    const [sessionDate, setSessionDate] = useState(
        session ? session.session_date : today,
    );
    const [sessionType, setSessionType] = useState<SessionTypeValue>(
        session ? session.session_type : 'training',
    );
    const [durationInput, setDurationInput] = useState(
        session ? String(session.duration_minutes) : '90',
    );
    const [rpe, setRpe] = useState<number>(session ? session.rpe : 5);
    const [notes, setNotes] = useState(session?.notes ?? '');

    const parsedDuration = Number.parseInt(durationInput, 10);
    const previewLoad = calculateSessionLoadPreview(rpe, parsedDuration);
    const scaleMeta = getFosterScaleMeta(rpe);

    const formProps = session
        ? RpeController.update.form([athlete.id, session.id])
        : RpeController.store.form(athlete.id);

    return (
        <Form
            {...formProps}
            options={{ preserveScroll: true }}
            onSuccess={onClose}
            className="space-y-4"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="rpe-session-date">
                                Tanggal sesi
                            </Label>
                            <Input
                                id="rpe-session-date"
                                name="session_date"
                                type="date"
                                required
                                value={sessionDate}
                                onChange={(e) => setSessionDate(e.target.value)}
                                className="h-10 rounded-md tabular-nums"
                            />
                            <InputError message={errors.session_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="rpe-session-type">Jenis sesi</Label>
                            <input
                                type="hidden"
                                name="session_type"
                                value={sessionType}
                            />
                            <Select
                                value={sessionType}
                                onValueChange={(value) =>
                                    setSessionType(value as SessionTypeValue)
                                }
                            >
                                <SelectTrigger
                                    id="rpe-session-type"
                                    className="h-10 w-full rounded-md"
                                >
                                    <SelectValue placeholder="Pilih jenis sesi" />
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
                            <InputError message={errors.session_type} />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rpe-duration">
                            Durasi latihan{' '}
                            <span className="font-normal text-muted-foreground">
                                (menit)
                            </span>
                        </Label>
                        <Input
                            id="rpe-duration"
                            name="duration_minutes"
                            type="number"
                            min={1}
                            max={600}
                            step={1}
                            required
                            value={durationInput}
                            onChange={(e) => setDurationInput(e.target.value)}
                            placeholder="90"
                            className="h-10 rounded-md tabular-nums"
                        />
                        <InputError message={errors.duration_minutes} />
                    </div>

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <Label>Skor sRPE (Foster CR-10)</Label>
                            {scaleMeta && (
                                <span className="text-xs font-medium text-primary">
                                    {scaleMeta.score} — {scaleMeta.label}
                                </span>
                            )}
                        </div>
                        <input type="hidden" name="rpe" value={rpe} />
                        <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
                            {FOSTER_CR10_SCALE.map((item) => {
                                const selected = rpe === item.score;

                                return (
                                    <button
                                        key={item.score}
                                        type="button"
                                        onClick={() => setRpe(item.score)}
                                        className={cn(
                                            'flex h-9 cursor-pointer items-center justify-center rounded-md border text-sm font-medium tabular-nums transition-colors',
                                            selected
                                                ? 'border-primary bg-primary text-primary-foreground'
                                                : 'border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                                        )}
                                    >
                                        {item.score}
                                    </button>
                                );
                            })}
                        </div>
                        {scaleMeta && (
                            <p className="text-xs text-muted-foreground">
                                {scaleMeta.description} · Dikumpulkan 30 menit
                                pasca-sesi latihan.
                            </p>
                        )}
                        <InputError message={errors.rpe} />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="rpe-notes">
                            Catatan{' '}
                            <span className="font-normal text-muted-foreground">
                                (opsional)
                            </span>
                        </Label>
                        <Input
                            id="rpe-notes"
                            name="notes"
                            type="text"
                            maxLength={500}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Mis. Sesi pagi, small-sided game, atau babak ke-2"
                            className="h-10 rounded-md"
                        />
                        <InputError message={errors.notes} />
                    </div>

                    <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3.5 py-3">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Estimasi Session Load (sRPE × Durasi)
                            </p>
                            <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
                                {rpe} ×{' '}
                                {Number.isFinite(parsedDuration) &&
                                parsedDuration > 0
                                    ? parsedDuration
                                    : 0}{' '}
                                menit
                            </p>
                        </div>
                        <p className="text-lg font-semibold tracking-tight text-foreground tabular-nums">
                            {previewLoad.toLocaleString('id-ID')}{' '}
                            <span className="text-xs font-normal text-muted-foreground">
                                AU
                            </span>
                        </p>
                    </div>

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
                            disabled={processing}
                            className="rounded-md"
                        >
                            {processing && <Spinner />}
                            {session ? 'Simpan Perubahan' : 'Catat Sesi RPE'}
                        </Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}

export function RpeSessionDialog({
    open,
    athlete,
    session,
    sessionTypes,
    today,
    onOpenChange,
}: Props) {
    const formKey = session ? `edit-rpe-${session.id}` : `create-rpe-${today}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {session ? 'Ubah Sesi RPE' : 'Catat Sesi RPE Harian'}
                    </DialogTitle>
                    <DialogDescription>
                        Input beban latihan internal untuk{' '}
                        <span className="font-medium text-foreground">
                            {athlete.name}
                        </span>
                        . Mendukung lebih dari satu sesi pada tanggal yang sama.
                    </DialogDescription>
                </DialogHeader>

                {open && (
                    <RpeSessionForm
                        key={formKey}
                        athlete={athlete}
                        session={session}
                        sessionTypes={sessionTypes}
                        today={today}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
