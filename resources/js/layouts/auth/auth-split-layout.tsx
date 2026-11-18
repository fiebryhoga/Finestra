import { Link, usePage } from '@inertiajs/react';
import { Activity, Gauge, HeartPulse, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppLogoIcon from '@/components/app-logo-icon';
import { ThemeToggle } from '@/components/theme-toggle';
import { cn } from '@/lib/utils';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const SLIDE_INTERVAL_MS = 3000;

const showcaseSlides = [
    {
        id: 'acwr',
        image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1400&q=85',
        alt: 'Atlet berlari dalam sesi latihan intensitas tinggi',
        icon: Gauge,
        category: 'Training Load · ACWR',
        title: 'Keseimbangan beban latihan akut dan kronis secara presisi.',
        description:
            'Identifikasi ketidakseimbangan stres latihan dan adaptasi atlet melalui sRPE serta rasio beban kerja harian.',
        metricLabel: 'ACWR',
        metricValue: '1.14',
        metricUnit: 'ratio',
        status: 'Optimal',
        statusClass: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200',
    },
    {
        id: 'physiological',
        image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1400&q=85',
        alt: 'Langkah lari biomekanik atlet saat pemantauan fisiologis',
        icon: HeartPulse,
        category: 'Respons Fisiologis · HRR, RHR & SpO₂',
        title: 'Pantau kapasitas pemulihan otonom dan fisiologis setiap pagi.',
        description:
            'Evaluasi Resting Heart Rate, Heart Rate Recovery menit ke-1 dan ke-2, serta saturasi oksigen untuk deteksi dini kelelahan.',
        metricLabel: 'RHR · SpO₂',
        metricValue: '54',
        metricUnit: 'bpm · 98%',
        status: 'Stabil',
        statusClass: 'border-sky-400/30 bg-sky-400/15 text-sky-200',
    },
    {
        id: 'neuromuscular',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1400&q=85',
        alt: 'Atlet mempersiapkan latihan kekuatan dan daya ledak neuromuskular',
        icon: Activity,
        category: 'Performa Neuromuskular · CMJ',
        title: 'Deteksi kelelahan neuromuskular akut sebelum risiko cedera muncul.',
        description:
            'Rekam tiga percobaan Countermovement Jump pra-latihan dengan perbandingan otomatis terhadap ambang baseline atlet.',
        metricLabel: 'CMJ Terbaik',
        metricValue: '42.8',
        metricUnit: 'cm (-1.8%)',
        status: 'Terkendali',
        statusClass: 'border-emerald-400/30 bg-emerald-400/15 text-emerald-200',
    },
    {
        id: 'readiness',
        image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=85',
        alt: 'Atlet sepak bola bersiap di lapangan pertandingan',
        icon: ShieldCheck,
        category: 'Athlete Readiness & Risk Detection',
        title: 'Keputusan pelatihan berbasis data untuk performa kompetitif puncak.',
        description:
            'Satukan indeks kelelahan, klasifikasi kesiapan, dan peringatan risiko overtraining dalam satu platform sports science.',
        metricLabel: 'Readiness',
        metricValue: '86',
        metricUnit: '/ 100',
        status: 'Siap Latih',
        statusClass: 'border-sky-400/30 bg-sky-400/15 text-sky-200',
    },
];

export default function AuthSplitLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const { name } = usePage().props;
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const timer = window.setInterval(() => {
            setActiveIndex((current) => (current + 1) % showcaseSlides.length);
        }, SLIDE_INTERVAL_MS);

        return () => window.clearInterval(timer);
    }, [activeIndex]);

    const currentSlide = showcaseSlides[activeIndex];
    const CurrentIcon = currentSlide.icon;

    return (
        <div className="relative grid min-h-dvh bg-background lg:grid-cols-2">
            <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border/60 bg-[oklch(0.145_0.042_258)] p-10 text-slate-100 lg:flex">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                >
                    {showcaseSlides.map((slide, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <img
                                key={slide.id}
                                src={slide.image}
                                alt={slide.alt}
                                loading={index === 0 ? 'eager' : 'lazy'}
                                className={cn(
                                    'absolute inset-0 size-full object-cover object-center transition-all duration-1000 ease-in-out will-change-[opacity,transform]',
                                    isActive
                                        ? 'scale-100 opacity-100'
                                        : 'scale-105 opacity-0',
                                )}
                            />
                        );
                    })}

                    <div className="absolute inset-0 bg-[oklch(0.18_0.065_258)]/45 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-b from-[oklch(0.12_0.04_258)]/85 via-[oklch(0.14_0.042_258)]/40 to-[oklch(0.11_0.038_258)]/95" />
                </div>

                <div className="relative z-10 flex items-center justify-between">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-3 text-white transition-opacity hover:opacity-90"
                    >
                        <div className="flex size-9 items-center justify-center rounded-lg border border-white/20 bg-white/10 backdrop-blur-md">
                            <AppLogoIcon className="size-5 text-sky-300" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base font-semibold tracking-tight">
                                {name}
                            </span>
                            <span className="text-xs text-slate-200/80">
                                Physiological &amp; Neuromuscular Tracking
                            </span>
                        </div>
                    </Link>

                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100 backdrop-blur-md">
                        <span className="size-1.5 rounded-full bg-sky-300" />
                        Sports Science Lab
                    </span>
                </div>

                <div className="relative z-10 mt-auto max-w-xl space-y-6 pt-12">
                    <div
                        key={currentSlide.id}
                        className="animate-in space-y-4 duration-500 fade-in"
                    >
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-sky-200 backdrop-blur-md">
                            <CurrentIcon className="size-3.5 text-sky-300" />
                            <span>{currentSlide.category}</span>
                        </div>

                        <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white">
                            {currentSlide.title}
                        </h2>

                        <p className="text-sm leading-relaxed text-slate-200/85">
                            {currentSlide.description}
                        </p>

                        <div className="inline-flex items-center gap-4 rounded-xl border border-white/15 bg-[oklch(0.14_0.04_258)]/70 px-4 py-3 backdrop-blur-md">
                            <div className="space-y-0.5">
                                <p className="text-[11px] font-medium text-slate-300/80">
                                    {currentSlide.metricLabel}
                                </p>
                                <div className="flex items-baseline gap-1.5 tabular-nums">
                                    <span className="text-xl font-semibold tracking-tight text-white">
                                        {currentSlide.metricValue}
                                    </span>
                                    <span className="text-xs text-slate-300">
                                        {currentSlide.metricUnit}
                                    </span>
                                </div>
                            </div>

                            <div className="h-8 w-px bg-white/15" />

                            <span
                                className={cn(
                                    'rounded-full border px-2.5 py-0.5 text-xs font-medium',
                                    currentSlide.statusClass,
                                )}
                            >
                                {currentSlide.status}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/15 pt-5">
                        <div
                            className="flex items-center gap-2"
                            role="tablist"
                            aria-label="Slide fitur Finestra"
                        >
                            {showcaseSlides.map((slide, index) => {
                                const isActive = index === activeIndex;

                                return (
                                    <button
                                        key={slide.id}
                                        type="button"
                                        role="tab"
                                        aria-selected={isActive}
                                        aria-label={`Tampilkan ${slide.category}`}
                                        onClick={() => setActiveIndex(index)}
                                        className={cn(
                                            'h-1.5 cursor-pointer rounded-full transition-all duration-300',
                                            isActive
                                                ? 'w-8 bg-sky-300'
                                                : 'w-2 bg-white/30 hover:bg-white/55',
                                        )}
                                    />
                                );
                            })}
                        </div>

                        <span className="text-xs text-slate-300/80">
                            Finestra · Sport Science
                        </span>
                    </div>
                </div>
            </aside>

            <main className="relative flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
                <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                    <ThemeToggle />
                </div>

                <div className="mx-auto flex w-full max-w-[380px] flex-col gap-8">
                    <div className="flex flex-col gap-6">
                        <Link
                            href={home()}
                            className="inline-flex items-center gap-2.5 self-start lg:hidden"
                        >
                            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                <AppLogoIcon className="size-5" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-base font-semibold tracking-tight text-foreground">
                                    {name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    Physiological &amp; Neuromuscular Tracking
                                </span>
                            </div>
                        </Link>

                        <div className="space-y-1.5">
                            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                                {title}
                            </h1>
                            <p className="text-sm leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>

                    {children}
                </div>
            </main>
        </div>
    );
}
