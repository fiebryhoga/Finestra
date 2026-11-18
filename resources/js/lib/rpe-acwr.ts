import type { AcwrZoneValue } from '@/types';

export type FosterScaleItem = {
    score: number;
    label: string;
    description: string;
};

export const FOSTER_CR10_SCALE: FosterScaleItem[] = [
    {
        score: 1,
        label: 'Sangat Ringan Sekali',
        description: 'Aktivitas pemulihan ringan',
    },
    {
        score: 2,
        label: 'Ringan',
        description: 'Intensitas rendah, napas stabil',
    },
    {
        score: 3,
        label: 'Sedang',
        description: 'Mulai terasa kerja otot ringan',
    },
    {
        score: 4,
        label: 'Agak Berat',
        description: 'Intensitas menengah terkendali',
    },
    { score: 5, label: 'Berat', description: 'Usaha cukup keras, napas cepat' },
    {
        score: 6,
        label: 'Berat+',
        description: 'Di atas intensitas sedang–berat',
    },
    {
        score: 7,
        label: 'Sangat Berat',
        description: 'Usaha keras, bicara terbatas',
    },
    {
        score: 8,
        label: 'Sangat Berat+',
        description: 'Mendekati batas ketahanan sesi',
    },
    {
        score: 9,
        label: 'Hampir Maksimal',
        description: 'Intensitas sangat tinggi',
    },
    {
        score: 10,
        label: 'Maksimal',
        description: 'Usaha puncak absolut (all-out)',
    },
];

export type AcwrZoneMeta = {
    label: string;
    dotClass: string;
    textClass: string;
    colorHex: string;
};

export function getAcwrZoneMeta(zone: AcwrZoneValue): AcwrZoneMeta {
    switch (zone) {
        case 'optimal':
            return {
                label: 'Optimal',
                dotClass: 'bg-emerald-500',
                textClass: 'text-emerald-700 dark:text-emerald-400',
                colorHex: '#10b981',
            };
        case 'caution':
            return {
                label: 'Waspada',
                dotClass: 'bg-amber-500',
                textClass: 'text-amber-700 dark:text-amber-400',
                colorHex: '#f59e0b',
            };
        case 'high_risk':
            return {
                label: 'Risiko Tinggi',
                dotClass: 'bg-rose-500',
                textClass: 'text-rose-700 dark:text-rose-400',
                colorHex: '#f43f5e',
            };
        case 'undertraining':
            return {
                label: 'Beban Kurang',
                dotClass: 'bg-sky-500',
                textClass: 'text-sky-700 dark:text-sky-400',
                colorHex: '#0ea5e9',
            };
        default:
            return {
                label: 'Belum Ada Data',
                dotClass: 'bg-muted-foreground/50',
                textClass: 'text-muted-foreground',
                colorHex: '#94a3b8',
            };
    }
}

export function getFosterScaleMeta(rpe: number): FosterScaleItem | null {
    return FOSTER_CR10_SCALE.find((item) => item.score === rpe) ?? null;
}

export function calculateSessionLoadPreview(
    rpe: number,
    durationMinutes: number,
): number {
    if (
        !Number.isFinite(rpe) ||
        !Number.isFinite(durationMinutes) ||
        rpe <= 0 ||
        durationMinutes <= 0
    ) {
        return 0;
    }

    return Math.round(rpe * durationMinutes);
}
