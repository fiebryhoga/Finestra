import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, LayoutGrid, LogIn } from 'lucide-react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { dashboard, home, login } from '@/routes';

type Props = {
    status?: number;
};

export default function NotFound({ status = 404 }: Props) {
    const { auth, name } = usePage().props;
    const isAuthenticated = Boolean(auth.user);

    const handleGoBack = () => {
        if (window.history.length > 1) {
            window.history.back();

            return;
        }

        window.location.href = isAuthenticated ? dashboard.url() : login.url();
    };

    return (
        <>
            <Head title="404 - Halaman Tidak Ditemukan" />

            <div className="relative flex min-h-dvh flex-col bg-background text-foreground">
                <header className="border-b border-border/60 bg-background/80 backdrop-blur-sm">
                    <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
                        <div className="flex items-center gap-3.5">
                            <Link
                                href={home()}
                                className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
                            >
                                <AppLogoIcon className="size-8 shrink-0" />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-sm font-semibold tracking-tight text-foreground">
                                        {name}
                                    </span>
                                    <span className="text-[11px] text-muted-foreground">
                                        Sports Science
                                    </span>
                                </div>
                            </Link>

                            <div className="h-6 w-px bg-border" />

                            <div className="inline-flex items-center gap-2">
                                <img
                                    src="/assets/unesa.webp"
                                    alt="Logo Universitas Negeri Surabaya"
                                    className="size-7 shrink-0 object-contain"
                                />
                                <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                                    FIKK UNESA
                                </span>
                            </div>
                        </div>

                        <ThemeToggle />
                    </div>
                </header>

                <main className="flex flex-1 items-center justify-center px-6 py-16">
                    <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
                        <div className="mx-auto mb-6 flex w-full max-w-xs items-center justify-center rounded-xl border border-border/80 bg-muted/40 px-5 py-4">
                            <svg
                                viewBox="0 0 240 48"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-full text-primary"
                                aria-hidden="true"
                            >
                                <path
                                    d="M4 26H44L54 11L66 39L76 20L84 26H118"
                                    stroke="currentColor"
                                    strokeWidth="2.25"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <circle
                                    cx="124"
                                    cy="26"
                                    r="3"
                                    className="fill-primary"
                                />
                                <path
                                    d="M134 26H236"
                                    stroke="currentColor"
                                    strokeOpacity="0.28"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeDasharray="4 6"
                                />
                            </svg>
                        </div>

                        <p className="text-xs font-medium tracking-wide text-muted-foreground">
                            Sinyal Rute Tidak Ditemukan
                        </p>

                        <p className="mt-4 text-6xl font-semibold tracking-tight text-foreground tabular-nums sm:text-7xl">
                            {status}
                        </p>

                        <h1 className="mt-3 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            Halaman tidak ditemukan
                        </h1>

                        <p className="mx-auto mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                            Tautan yang Anda tuju tidak tersedia, sudah
                            dipindahkan, atau tidak dapat diakses secara
                            langsung.
                        </p>

                        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                            <Button asChild className="h-10 w-full sm:w-auto">
                                <Link
                                    href={
                                        isAuthenticated ? dashboard() : login()
                                    }
                                >
                                    {isAuthenticated ? (
                                        <>
                                            <LayoutGrid className="size-4" />
                                            Kembali ke Dashboard
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="size-4" />
                                            Kembali ke Halaman Masuk
                                        </>
                                    )}
                                </Link>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 w-full sm:w-auto"
                                onClick={handleGoBack}
                            >
                                <ArrowLeft className="size-4" />
                                Halaman Sebelumnya
                            </Button>
                        </div>
                    </div>
                </main>

                <footer className="py-6 text-center text-xs text-muted-foreground">
                    {name} · Physiological &amp; Neuromuscular Tracking
                </footer>
            </div>
        </>
    );
}
