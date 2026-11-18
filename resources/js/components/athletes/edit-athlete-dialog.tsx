import { Form } from '@inertiajs/react';
import { useState } from 'react';
import AthleteController from '@/actions/App/Http/Controllers/AthleteController';
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
import type { Athlete, AthleteGender } from '@/types';

type Props = {
    athlete: Athlete | null;
    onOpenChange: (open: boolean) => void;
};

function calculateBmi(weight: string, height: string): string | null {
    const w = Number.parseFloat(weight);
    const h = Number.parseFloat(height);

    if (!Number.isFinite(w) || !Number.isFinite(h) || w < 20 || h < 100) {
        return null;
    }

    const heightMeters = h / 100;

    return (w / (heightMeters * heightMeters)).toFixed(1);
}

function EditAthleteForm({
    athlete,
    onClose,
}: {
    athlete: Athlete;
    onClose: () => void;
}) {
    const [gender, setGender] = useState<AthleteGender>(athlete.gender);
    const [weightInput, setWeightInput] = useState(String(athlete.weight_kg));
    const [heightInput, setHeightInput] = useState(String(athlete.height_cm));

    const previewBmi = calculateBmi(weightInput, heightInput);

    return (
        <Form
            {...AthleteController.update.form(athlete.id)}
            options={{ preserveScroll: true }}
            onSuccess={onClose}
            className="space-y-4"
        >
            {({ processing, errors }) => (
                <>
                    <div className="grid gap-2">
                        <Label htmlFor="edit-athlete-name">Nama lengkap</Label>
                        <Input
                            id="edit-athlete-name"
                            name="name"
                            type="text"
                            required
                            autoFocus
                            defaultValue={athlete.name}
                            placeholder="Nama lengkap atlet"
                            className="h-10"
                        />
                        <InputError message={errors.name} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-athlete-gender">
                                Jenis kelamin
                            </Label>
                            <input type="hidden" name="gender" value={gender} />
                            <Select
                                value={gender}
                                onValueChange={(value) =>
                                    setGender(value as AthleteGender)
                                }
                            >
                                <SelectTrigger
                                    id="edit-athlete-gender"
                                    className="h-10 w-full"
                                >
                                    <SelectValue placeholder="Pilih jenis kelamin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">
                                        Laki-laki
                                    </SelectItem>
                                    <SelectItem value="female">
                                        Perempuan
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.gender} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-athlete-dob">
                                Tanggal lahir
                            </Label>
                            <Input
                                id="edit-athlete-dob"
                                name="date_of_birth"
                                type="date"
                                required
                                defaultValue={athlete.date_of_birth}
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.date_of_birth} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-athlete-weight">
                                Berat badan (kg)
                            </Label>
                            <Input
                                id="edit-athlete-weight"
                                name="weight_kg"
                                type="number"
                                inputMode="decimal"
                                step="0.1"
                                min="20"
                                max="250"
                                required
                                value={weightInput}
                                onChange={(event) =>
                                    setWeightInput(event.target.value)
                                }
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.weight_kg} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="edit-athlete-height">
                                Tinggi badan (cm)
                            </Label>
                            <Input
                                id="edit-athlete-height"
                                name="height_cm"
                                type="number"
                                inputMode="decimal"
                                step="0.1"
                                min="100"
                                max="250"
                                required
                                value={heightInput}
                                onChange={(event) =>
                                    setHeightInput(event.target.value)
                                }
                                className="h-10 tabular-nums"
                            />
                            <InputError message={errors.height_cm} />
                        </div>
                    </div>

                    {previewBmi && (
                        <div className="flex items-center justify-between rounded-md border border-border bg-muted/40 px-3.5 py-2.5 text-xs">
                            <span className="text-muted-foreground">
                                Estimasi IMT (BMI)
                            </span>
                            <span className="font-semibold text-foreground tabular-nums">
                                {previewBmi}{' '}
                                <span className="font-normal text-muted-foreground">
                                    kg/m²
                                </span>
                            </span>
                        </div>
                    )}

                    <DialogFooter className="pt-2">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="submit-edit-athlete"
                        >
                            {processing && <Spinner />}
                            Simpan Perubahan
                        </Button>
                    </DialogFooter>
                </>
            )}
        </Form>
    );
}

export function EditAthleteDialog({ athlete, onOpenChange }: Props) {
    return (
        <Dialog open={athlete !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ubah Data Atlet</DialogTitle>
                    <DialogDescription>
                        Perbarui identitas dan data antropometri atlet.
                    </DialogDescription>
                </DialogHeader>

                {athlete && (
                    <EditAthleteForm
                        key={athlete.id}
                        athlete={athlete}
                        onClose={() => onOpenChange(false)}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}
