import { Form } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
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

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    passwordRules: string;
};

export function CreateUserDialog({ open, onOpenChange, passwordRules }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Tambah Pengguna</DialogTitle>
                    <DialogDescription>
                        Buat akun baru untuk pelatih, peneliti, atau enumerator
                        Phynestra.
                    </DialogDescription>
                </DialogHeader>

                <Form
                    {...UserController.store.form()}
                    options={{ preserveScroll: true }}
                    resetOnSuccess
                    onSuccess={() => onOpenChange(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-2">
                                <Label htmlFor="create-user-name">
                                    Nama lengkap
                                </Label>
                                <Input
                                    id="create-user-name"
                                    name="name"
                                    type="text"
                                    required
                                    autoFocus
                                    autoComplete="name"
                                    placeholder="Contoh: Dr. Imam Marsudi"
                                    className="h-10"
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-user-username">
                                    Username
                                </Label>
                                <Input
                                    id="create-user-username"
                                    name="username"
                                    type="text"
                                    required
                                    autoComplete="off"
                                    placeholder="Contoh: imam.marsudi"
                                    className="h-10"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Minimal 3 karakter. Hanya huruf, angka,
                                    titik, tanda hubung, atau garis bawah.
                                </p>
                                <InputError message={errors.username} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-user-password">
                                    Kata sandi
                                </Label>
                                <PasswordInput
                                    id="create-user-password"
                                    name="password"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Masukkan kata sandi"
                                    passwordrules={passwordRules}
                                    className="h-10"
                                />
                                <InputError message={errors.password} />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="create-user-password-confirmation">
                                    Konfirmasi kata sandi
                                </Label>
                                <PasswordInput
                                    id="create-user-password-confirmation"
                                    name="password_confirmation"
                                    required
                                    autoComplete="new-password"
                                    placeholder="Ulangi kata sandi"
                                    passwordrules={passwordRules}
                                    className="h-10"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
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
                                    data-test="submit-create-user"
                                >
                                    {processing && <Spinner />}
                                    Simpan Pengguna
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
