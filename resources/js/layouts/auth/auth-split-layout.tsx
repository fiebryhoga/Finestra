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
        dotClass: 'bg-emerald-400',
        statusTextClass: 'text-emerald-300',
    },
    {
        id: 'physiological',
        image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=1400&q=85',
        alt: 'Langkah lari biomekanik atlet saat pemantauan fisiologis',
        icon: HeartPulse,
        category: 'Respons Fisiologis · HRR, BHR & SpO₂',
        title: 'Pantau kapasitas pemulihan otonom dan fisiologis setiap pagi.',
        description:
            'Evaluasi Basal Heart Rate, Heart Rate Recovery menit ke-1 dan ke-2, serta saturasi oksigen untuk deteksi dini kelelahan.',
        metricLabel: 'BHR · SpO₂',
        metricValue: '54',
        metricUnit: 'bpm · 98%',
        status: 'Stabil',
        dotClass: 'bg-sky-400',
        statusTextClass: 'text-sky-300',
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
        dotClass: 'bg-emerald-400',
        statusTextClass: 'text-emerald-300',
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
        dotClass: 'bg-sky-400',
        statusTextClass: 'text-sky-300',
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

                <div className="relative z-10 flex items-center justify-between gap-4">
                    <Link
                        href={home()}
                        className="inline-flex items-center gap-3 text-white transition-opacity hover:opacity-90"
                    >
                        <AppLogoIcon inverted className="size-10 shrink-0" />
                        <div className="flex flex-col">
                            <span className="text-lg font-semibold tracking-tight">
                                {name}
                            </span>
                            <span className="text-xs text-slate-200/80">
                                Physiological &amp; Neuromuscular Tracking
                            </span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-2.5 text-right">
                        <div className="flex flex-col leading-tight">
                            <span className="text-xs font-semibold text-white">
                                UNESA
                            </span>
                            <span className="text-[11px] text-slate-300/80">
                                FIKK · Sport Science
                            </span>
                        </div>
                        <img
                            src="/assets/unesa.webp"
                            alt="Logo Universitas Negeri Surabaya"
                            className="size-10 shrink-0 object-contain"
                        />
                    </div>
                </div>

                <div className="relative z-10 mt-auto max-w-xl space-y-6 pt-12">
                    <div className="grid">
                        {showcaseSlides.map((slide, index) => {
                            const isActive = index === activeIndex;
                            const SlideIcon = slide.icon;

                            return (
                                <div
                                    key={slide.id}
                                    aria-hidden={!isActive}
                                    className={cn(
                                        'col-start-1 row-start-1 space-y-4 transition-opacity duration-500',
                                        isActive
                                            ? 'opacity-100'
                                            : 'pointer-events-none opacity-0',
                                    )}
                                >
                                    <div className="inline-flex items-center gap-2 text-xs font-medium text-sky-300">
                                        <SlideIcon className="size-3.5" />
                                        <span>{slide.category}</span>
                                    </div>

                                    <h2 className="text-3xl leading-tight font-semibold tracking-tight text-white">
                                        {slide.title}
                                    </h2>

                                    <p className="text-sm leading-relaxed text-slate-200/85">
                                        {slide.description}
                                    </p>

                                    <div className="inline-flex items-center gap-4 rounded-md border border-white/15 bg-[oklch(0.14_0.04_258)]/70 px-4 py-3 backdrop-blur-md">
                                        <div className="space-y-0.5">
                                            <p className="text-[11px] font-medium text-slate-300/80">
                                                {slide.metricLabel}
                                            </p>
                                            <div className="flex items-baseline gap-1.5 tabular-nums">
                                                <span className="text-xl font-semibold tracking-tight text-white">
                                                    {slide.metricValue}
                                                </span>
                                                <span className="text-xs text-slate-300">
                                                    {slide.metricUnit}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-8 w-px bg-white/15" />

                                        <span
                                            className={cn(
                                                'inline-flex items-center gap-1.5 text-xs font-medium',
                                                slide.statusTextClass,
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    'size-1.5 rounded-full',
                                                    slide.dotClass,
                                                )}
                                            />
                                            {slide.status}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="flex items-center justify-between border-t border-white/15 pt-5">
                        <div
                            className="flex items-center gap-2"
                            role="tablist"
                            aria-label="Slide fitur Phynestra"
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
                            Universitas Negeri Surabaya · Phynestra
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
                        <div className="flex items-center justify-between gap-4 lg:hidden">
                            <Link
                                href={home()}
                                className="inline-flex items-center gap-2.5"
                            >
                                <AppLogoIcon className="size-9 shrink-0" />
                                <div className="flex flex-col leading-tight">
                                    <span className="text-base font-semibold tracking-tight text-foreground">
                                        {name}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        Sports Science
                                    </span>
                                </div>
                            </Link>

                            <img
                                src="/assets/unesa.webp"
                                alt="Logo Universitas Negeri Surabaya"
                                className="size-9 shrink-0 object-contain"
                            />
                        </div>

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
