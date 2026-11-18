import { Form } from '@inertiajs/react';
import UserController from '@/actions/App/Http/Controllers/UserController';
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
import type { ManagedUser } from '@/types';

type Props = {
    user: ManagedUser | null;
    onOpenChange: (open: boolean) => void;
};

export function DeleteUserDialog({ user, onOpenChange }: Props) {
    return (
        <Dialog open={user !== null} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Hapus Pengguna</DialogTitle>
                    <DialogDescription>
                        Akun{' '}
                        <span className="font-medium text-foreground">
                            {user?.name}
                        </span>{' '}
                        (@{user?.username}) akan dihapus secara permanen dan
                        tidak dapat dikembalikan. Jika hanya ingin mencabut
                        akses masuk sementara, gunakan opsi Nonaktifkan.
                    </DialogDescription>
                </DialogHeader>

                {user && (
                    <Form
                        key={user.id}
                        {...UserController.destroy.form(user.id)}
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
                                    data-test="confirm-delete-managed-user"
                                >
                                    {processing && <Spinner />}
                                    Hapus Permanen
                                </Button>
                            </DialogFooter>
                        )}
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}
