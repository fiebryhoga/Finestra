import { Form } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
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
import type { ManagedUser } from '@/types';

type Props = {
    user: ManagedUser | null;
    onOpenChange: (open: boolean) => void;
};

export function EditUserDialog({ user, onOpenChange }: Props) {
    return (
        <Dialog open={user !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ubah Data Pengguna</DialogTitle>
                    <DialogDescription>
                        Perbarui nama lengkap atau username untuk akun ini.
                    </DialogDescription>
                </DialogHeader>

                {user && (
                    <Form
                        key={user.id}
                        {...UserController.update.form(user.id)}
                        options={{ preserveScroll: true }}
                        onSuccess={() => onOpenChange(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="edit-user-name">
                                        Nama lengkap
                                    </Label>
                                    <Input
                                        id="edit-user-name"
                                        name="name"
                                        type="text"
                                        required
                                        autoFocus
                                        defaultValue={user.name}
                                        placeholder="Nama lengkap"
                                        className="h-10"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="edit-user-username">
                                        Username
                                    </Label>
                                    <Input
                                        id="edit-user-username"
                                        name="username"
                                        type="text"
                                        required
                                        defaultValue={user.username}
                                        placeholder="Username"
                                        className="h-10"
                                    />
                                    <InputError message={errors.username} />
                                </div>

                                <DialogFooter className="pt-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Batal
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        data-test="submit-edit-user"
                                    >
                                        {processing && <Spinner />}
                                        Simpan Perubahan
                                    </Button>
                                </DialogFooter>
                            </>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
