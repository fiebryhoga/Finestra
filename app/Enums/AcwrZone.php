<?php

namespace App\Enums;

enum AcwrZone: string
{
    case Undertraining = 'undertraining';
    case Optimal = 'optimal';
    case Caution = 'caution';
    case HighRisk = 'high_risk';
    case NoData = 'no_data';

    /**
     * Classify an ACWR ratio using Gabbett (2016) thresholds.
     */
    public static function fromRatio(?float $acwr): self
    {
        if ($acwr === null) {
            return self::NoData;
        }

        if ($acwr < 0.80) {
            return self::Undertraining;
        }

        if ($acwr <= 1.30) {
            return self::Optimal;
        }

        if ($acwr <= 1.50) {
            return self::Caution;
        }

        return self::HighRisk;
    }

    /**
     * Human-readable Indonesian label for the ACWR zone.
     */
    public function label(): string
    {
        return match ($this) {
            self::Undertraining => 'Beban Kurang',
            self::Optimal => 'Optimal',
            self::Caution => 'Waspada',
            self::HighRisk => 'Risiko Tinggi',
            self::NoData => 'Belum Ada Data',
        };
    }
}
