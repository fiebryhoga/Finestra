import { Form } from '@inertiajs/react';
import AthleteController from '@/actions/App/Http/Controllers/AthleteController';
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
import { Spinner } from '@/components/ui/spinner';
import type { Athlete } from '@/types';

type Props = {
    athlete: Athlete | null;
    onOpenChange: (open: boolean) => void;
};

export function DeleteAthleteDialog({ athlete, onOpenChange }: Props) {
    return (
        <Dialog open={athlete !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Data Atlet</DialogTitle>
                    <DialogDescription>
                        Data atlet{' '}
                        <span className="font-medium text-foreground">
                            {athlete?.name}
                        </span>{' '}
                        akan diarsipkan dan tidak lagi tampil pada daftar
                        monitoring aktif.
                    </DialogDescription>
                </DialogHeader>

                {athlete && (
                    <Form
                        key={athlete.id}
                        {...AthleteController.destroy.form(athlete.id)}
                        options={{ preserveScroll: true }}
                        onSuccess={() => onOpenChange(false)}
                    >
                        {({ processing }) => (
                            <DialogFooter className="pt-2">
                                <DialogClose asChild>
                                    <Button type="button" variant="outline">
                                        Batal
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    variant="destructive"
                                    disabled={processing}
                                    data-test="confirm-delete-athlete"
                                >
                                    {processing && <Spinner />}
                                    Hapus Atlet
                                </Button>
                            </DialogFooter>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
