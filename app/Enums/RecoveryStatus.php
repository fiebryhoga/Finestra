<?php

namespace App\Enums;

enum RecoveryStatus: string
{
    case Empty = 'KOSONG';
    case Calculating = 'MENGHITUNG...';
    case Good = 'RECOVERY BAIK';
    case Fair = 'RECOVERY CUKUP';
    case Poor = 'RECOVERY KURANG';

    /**
     * Determine status from a computed Quick Recovery Score (0–100).
     */
    public static function fromScore(int $score): self
    {
        return match (true) {
            $score >= 75 => self::Good,
            $score >= 35 => self::Fair,
            default => self::Poor,
        };
    }

    /**
     * Short display label for compact table/dashboard views.
     */
    public function shortLabel(): string
    {
        return match ($this) {
            self::Good => 'Baik',
            self::Fair => 'Cukup',
            self::Poor => 'Kurang',
            self::Calculating => 'Menghitung',
            self::Empty => 'Kosong',
        };
    }
}
