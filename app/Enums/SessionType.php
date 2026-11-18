<?php

namespace App\Enums;

enum SessionType: string
{
    case Training = 'training';
    case Conditioning = 'conditioning';
    case Tactical = 'tactical';
    case Match = 'match';
    case Recovery = 'recovery';

    /**
     * Human-readable Indonesian label for the training session type.
     */
    public function label(): string
    {
        return match ($this) {
            self::Training => 'Latihan Rutin',
            self::Conditioning => 'Fisik & Kondisi',
            self::Tactical => 'Taktik & Teknik',
            self::Match => 'Pertandingan',
            self::Recovery => 'Pemulihan Aktif',
        };
    }
}
