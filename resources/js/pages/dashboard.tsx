import { Head, usePage } from '@inertiajs/react';
import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import { dashboard } from '@/routes';
import type { Auth } from '@/types';

type PageProps = {
    auth: Auth;
};

export default function Dashboard() {
    const { auth } = usePage<PageProps>().props;

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Selamat datang, {auth.user.name}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Dashboard Finestra — Physiological &amp; Neuromuscular
                        Tracking siap digunakan.
                    </p>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-card">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-foreground/10" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-card">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-foreground/10" />
                    </div>
                    <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-card">
                        <PlaceholderPattern className="absolute inset-0 size-full stroke-foreground/10" />
                    </div>
                </div>
                <div className="relative min-h-[40vh] flex-1 overflow-hidden rounded-md border border-border bg-card md:min-h-min">
                    <PlaceholderPattern className="absolute inset-0 size-full stroke-foreground/10" />
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
