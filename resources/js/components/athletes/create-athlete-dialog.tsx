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
import type { AthleteGender } from '@/types';

type Props = {
    open: boolean;
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

export function CreateAthleteDialog({ open, onOpenChange }: Props) {
    const [gender, setGender] = useState<AthleteGender>('male');
    const [weightInput, setWeightInput] = useState('');
    const [heightInput, setHeightInput] = useState('');

    const previewBmi = calculateBmi(weightInput, heightInput);

    const handleOpenChange = (nextOpen: boolean) => {
        onOpenChange(nextOpen);

        if (!nextOpen) {
            setGender('male');
            setWeightInput('');
            setHeightInput('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Atlet</DialogTitle>
                    <DialogDescription>
                        Masukkan data dasar antropometri atlet untuk memulai
                        pemantauan di Phynestra.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...AthleteController.store.form()}
                    options={{ preserveScroll: true }}
                    resetOnSuccess
                    onSuccess={() => handleOpenChange(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="create-athlete-name">
                                    Nama lengkap
                                </Label>
                                <Input
                                    id="create-athlete-name"
                                    name="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="off"
                                    placeholder="Contoh: Rizky Pratama"
                                    className="h-10"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="create-athlete-gender">
                                        Jenis kelamin
                                    </Label>
                                    <input
                                        type="hidden"
                                        name="gender"
                                        value={gender}
                                    />
                                    <Select
                                        value={gender}
                                        onValueChange={(value) =>
                                            setGender(value as AthleteGender)
                                        }
                                    >
                                        <SelectTrigger
                                            id="create-athlete-gender"
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
                                    <Label htmlFor="create-athlete-dob">
                                        Tanggal lahir
                                    </Label>
                                    <Input
                                        id="create-athlete-dob"
                                        name="date_of_birth"
                                        type="date"
                                        required
                                        className="h-10 tabular-nums"
                                    />
                                    <InputError
                                        message={errors.date_of_birth}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="create-athlete-weight">
                                        Berat badan (kg)
                                    </Label>
                                    <Input
                                        id="create-athlete-weight"
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
                                        placeholder="68.5"
                                        className="h-10 tabular-nums"
                                    />
                                    <InputError message={errors.weight_kg} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="create-athlete-height">
                                        Tinggi badan (cm)
                                    </Label>
                                    <Input
                                        id="create-athlete-height"
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
                                        placeholder="174.0"
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
                                    data-test="submit-create-athlete"
                                >
                                    {processing && <Spinner />}
                                    Simpan Atlet
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
