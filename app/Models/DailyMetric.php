<?php

namespace App\Models;

use App\Enums\RecoveryStatus;
use Carbon\CarbonInterface;
use Database\Factories\DailyMetricFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $athlete_id
 * @property CarbonInterface $record_date
 * @property string $week
 * @property int $age
 * @property float $rhr
 * @property float $spo2
 * @property float $weight
 * @property float $vj
 * @property float $hr_max
 * @property float $hr_ratio
 * @property float $vo2_max
 * @property float $peak_power
 * @property int $quick_recovery_score
 * @property RecoveryStatus $recovery_status
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read Athlete $athlete
 */
#[Fillable([
    'athlete_id',
    'record_date',
    'week',
    'age',
    'rhr',
    'spo2',
    'weight',
    'vj',
    'hr_max',
    'hr_ratio',
    'vo2_max',
    'peak_power',
    'quick_recovery_score',
    'recovery_status',
])]
class DailyMetric extends Model
{
    /** @use HasFactory<DailyMetricFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'record_date' => 'date',
            'age' => 'integer',
            'rhr' => 'float',
            'spo2' => 'float',
            'weight' => 'float',
            'vj' => 'float',
            'hr_max' => 'float',
            'hr_ratio' => 'float',
            'vo2_max' => 'float',
            'peak_power' => 'float',
            'quick_recovery_score' => 'integer',
            'recovery_status' => RecoveryStatus::class,
        ];
    }

    /**
     * Athlete that owns this daily metric record.
     *
     * @return BelongsTo<Athlete, $this>
     */
    public function athlete(): BelongsTo
    {
        return $this->belongsTo(Athlete::class);
    }
}
