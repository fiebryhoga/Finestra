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
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import type { ManagedUser } from '@/types';

type Props = {
    user: ManagedUser | null;
    onOpenChange: (open: boolean) => void;
    passwordRules: string;
};

export function ResetPasswordDialog({
    user,
    onOpenChange,
    passwordRules,
}: Props) {
    return (
        <Dialog open={user !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Reset Kata Sandi</DialogTitle>
                    <DialogDescription>
                        Tetapkan kata sandi baru untuk{' '}
                        <span className="font-medium text-foreground">
                            {user?.name}
                        </span>{' '}
                        (@{user?.username}).
                    </DialogDescription>
                </DialogHeader>

                {user && (
                    <Form
                        key={user.id}
                        {...UserController.updatePassword.form(user.id)}
                        options={{ preserveScroll: true }}
                        resetOnSuccess
                        onSuccess={() => onOpenChange(false)}
                        className="space-y-4"
                    >
                        {({ processing, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="reset-user-password">
                                        Kata sandi baru
                                    </Label>
                                    <PasswordInput
                                        id="reset-user-password"
                                        name="password"
                                        required
                                        autoFocus
                                        autoComplete="new-password"
                                        placeholder="Masukkan kata sandi baru"
                                        passwordrules={passwordRules}
                                        className="h-10"
                                    />
                                    <InputError message={errors.password} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="reset-user-password-confirmation">
                                        Konfirmasi kata sandi baru
                                    </Label>
                                    <PasswordInput
                                        id="reset-user-password-confirmation"
                                        name="password_confirmation"
                                        required
                                        autoComplete="new-password"
                                        placeholder="Ulangi kata sandi baru"
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
                                        data-test="submit-reset-password"
                                    >
                                        {processing && <Spinner />}
                                        Perbarui Kata Sandi
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
