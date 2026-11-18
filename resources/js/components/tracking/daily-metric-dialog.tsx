import { Form } from '@inertiajs/react';
import { useState } from 'react';
import TrackingController from '@/actions/App/Http/Controllers/TrackingController';
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
import { Spinner } from '@/components/ui/spinner';
import {
    calculateBaseMetricsPreview,
    calculateRecoveryPreview,
    getRecoveryStatusMeta,
} from '@/lib/quick-recovery';
import { cn } from '@/lib/utils';
import type { DailyMetricRecord, TrackedAthleteDetail } from '@/types';

type Props = {
    open: boolean;
    athlete: TrackedAthleteDetail;
    metric: DailyMetricRecord | null;
    baselineRhr: number | null;
    today: string;
    onOpenChange: (open: boolean) => void;
};

function DailyMetricForm({
    athlete,
    metric,
    baselineRhr,
    today,
    onClose,
}: {
    athlete: TrackedAthleteDetail;
    metric: DailyMetricRecord | null;
    baselineRhr: number | null;
    today: string;
    onClose: () => void;
}) {
    const [recordDate, setRecordDate] = useState(
        metric ? metric.record_date : today,
    );
    const [rhrInput, setRhrInput] = useState(
        metric && metric.rhr > 0 ? String(metric.rhr) : '',
    );
    const [spo2Input, setSpo2Input] = useState(
        metric && metric.spo2 > 0 ? String(metric.spo2) : '',
    );
    const [vjInput, setVjInput] = useState(
        metric && metric.vj > 0 ? String(metric.vj) : '',
    );
    const [weightInput, setWeightInput] = useState(
        metric && metric.weight > 0
            ? String(metric.weight)
            : String(athlete.weight_kg),
    );
    const [ageInput, setAgeInput] = useState(
        metric && metric.age > 0
            ? String(metric.age)
            : String(athlete.age > 0 ? athlete.age : 20),
    );

    const parsedAge = Number.parseInt(ageInput, 10);
    const parsedRhr = Number.parseFloat(rhrInput);
    const parsedSpo2 = Number.parseFloat(spo2Input);
    const parsedWeight = Number.parseFloat(weightInput);
    const parsedVj = Number.parseFloat(vjInput);

    const basePreview = calculateBaseMetricsPreview(
        parsedAge,
        parsedRhr,
        parsedWeight,
        parsedVj,
    );
    const recoveryPreview = calculateRecoveryPreview(
        parsedRhr,
        parsedSpo2,
        baselineRhr,
    );
    const statusMeta = getRecoveryStatusMeta(recoveryPreview.status);

    return (
        <Form
            {...TrackingController.store.form(athlete.id)}
            options={{ preserveScroll: true }}
            onSuccess={onClose}
            className="space-y-4"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="metric-record-date">
                                Tanggal pencatatan
                            </Label>
                            <Input
                                id="metric-record-date"
                                name="record_date"
                                type="date"
                                required
                                value={recordDate}
                                onChange={(e) => setRecordDate(e.target.value)}
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.record_date} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="metric-age">Usia (tahun)</Label>
                            <Input
                                id="metric-age"
                                name="age"
                                type="number"
                                min={10}
                                max={80}
                                step={1}
                                required
                                value={ageInput}
                                onChange={(e) => setAgeInput(e.target.value)}
                                placeholder="24"
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.age} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="metric-rhr">
                                BHR{' '}
                                <span className="font-normal text-muted-foreground">
                                    (Basal Heart Rate · bpm)
                                </span>
                            </Label>
                            <Input
                                id="metric-rhr"
                                name="rhr"
                                type="number"
                                min={30}
                                max={150}
                                step="0.1"
                                required
                                autoFocus
                                value={rhrInput}
                                onChange={(e) => setRhrInput(e.target.value)}
                                placeholder="57"
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.rhr} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="metric-spo2">
                                SpO₂{' '}
                                <span className="font-normal text-muted-foreground">
                                    (%)
                                </span>
                            </Label>
                            <Input
                                id="metric-spo2"
                                name="spo2"
                                type="number"
                                min={70}
                                max={100}
                                step="0.1"
                                required
                                value={spo2Input}
                                onChange={(e) => setSpo2Input(e.target.value)}
                                placeholder="98"
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.spo2} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="metric-vj">
                                Vertical Jump{' '}
                                <span className="font-normal text-muted-foreground">
                                    (cm)
                                </span>
                            </Label>
                            <Input
                                id="metric-vj"
                                name="vj"
                                type="number"
                                min={0}
                                max={150}
                                step="0.1"
                                required
                                value={vjInput}
                                onChange={(e) => setVjInput(e.target.value)}
                                placeholder="55"
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.vj} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="metric-weight">
                                Berat badan{' '}
                                <span className="font-normal text-muted-foreground">
                                    (kg)
                                </span>
                            </Label>
                            <Input
                                id="metric-weight"
                                name="weight"
                                type="number"
                                min={20}
                                max={250}
                                step="0.1"
                                required
                                value={weightInput}
                                onChange={(e) => setWeightInput(e.target.value)}
                                placeholder="70"
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.weight} />
                        </div>
                    </div>

                    <div className="space-y-3 rounded-md border border-border bg-muted/40 p-3.5">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-muted-foreground">
                                Estimasi Kalkulasi Otomatis
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium">
                                <span
                                    className={cn(
                                        'size-1.5 rounded-full',
                                        statusMeta.dotClass,
                                    )}
                                />
                                <span className={statusMeta.textClass}>
                                    {recoveryPreview.status === 'KOSONG'
                                        ? 'Lengkapi BHR & SpO₂'
                                        : `${recoveryPreview.score}% · ${statusMeta.label}`}
                                </span>
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 border-t border-border/70 pt-2.5 text-xs">
                            <div>
                                <p className="text-muted-foreground">HR Max</p>
                                <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                                    {basePreview.hr_max > 0
                                        ? basePreview.hr_max.toFixed(1)
                                        : '—'}{' '}
                                    <span className="font-normal text-muted-foreground">
                                        bpm
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">VO₂ Max</p>
                                <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                                    {basePreview.vo2_max > 0
                                        ? basePreview.vo2_max.toFixed(2)
                                        : '—'}{' '}
                                    <span className="font-normal text-muted-foreground">
                                        ml/kg/m
                                    </span>
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Peak Power
                                </p>
                                <p className="mt-0.5 font-semibold text-foreground tabular-nums">
                                    {basePreview.peak_power > 0
                                        ? Math.round(
                                              basePreview.peak_power,
                                          ).toLocaleString('id-ID')
                                        : '—'}{' '}
                                    <span className="font-normal text-muted-foreground">
                                        W
                                    </span>
                                </p>
                            </div>
                        </div>

                        <p className="text-[11px] text-muted-foreground tabular-nums">
                            Baseline BHR aktif:{' '}
                            <span className="font-medium text-foreground">
                                {baselineRhr !== null
                                    ? `${baselineRhr.toFixed(1)} bpm`
                                    : 'Otomatis dari input pertama'}
                            </span>
                            . Skor seluruh riwayat akan direkalkulasi otomatis
                            setelah disimpan.
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
                            Simpan Data Harian
                        </Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}

export function DailyMetricDialog({
    open,
    athlete,
    metric,
    baselineRhr,
    today,
    onOpenChange,
}: Props) {
    const formKey = metric
        ? `edit-${metric.id}-${metric.record_date}`
        : `create-${today}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="rounded-md sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        {metric
                            ? `Perbarui Data — ${metric.record_date_formatted}`
                            : 'Input Quick Recovery Harian'}
                    </DialogTitle>
                    <DialogDescription>
                        Masukkan 5 indikator biometrik harian untuk{' '}
                        <span className="font-medium text-foreground">
                            {athlete.name}
                        </span>
                        .
                    </DialogDescription>
                </DialogHeader>

                {open && (
                    <DailyMetricForm
                        key={formKey}
                        athlete={athlete}
                        metric={metric}
                        baselineRhr={baselineRhr}
                        today={today}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
