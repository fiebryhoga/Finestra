<?php

namespace App\Models;

use App\Enums\Gender;
use App\Enums\RecoveryStatus;
use Carbon\CarbonInterface;
use Database\Factories\AthleteFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property Gender $gender
 * @property CarbonInterface $date_of_birth
 * @property float $weight_kg
 * @property float $height_cm
 * @property CarbonInterface|null $training_start_date
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property CarbonInterface|null $deleted_at
 */
#[Fillable(['name', 'gender', 'date_of_birth', 'weight_kg', 'height_cm', 'training_start_date'])]
class Athlete extends Model
{
    /** @use HasFactory<AthleteFactory> */
    use HasFactory, SoftDeletes;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'gender' => Gender::class,
            'date_of_birth' => 'date',
            'weight_kg' => 'float',
            'height_cm' => 'float',
            'training_start_date' => 'date',
        ];
    }

    /**
     * Daily recovery & fitness metrics for this athlete.
     *
     * @return HasMany<DailyMetric, $this>
     */
    public function dailyMetrics(): HasMany
    {
        return $this->hasMany(DailyMetric::class);
    }

    /**
     * Most recent non-empty daily metric for this athlete.
     *
     * @return HasOne<DailyMetric, $this>
     */
    public function latestFilledMetric(): HasOne
    {
        return $this->hasOne(DailyMetric::class)
            ->where('recovery_status', '!=', RecoveryStatus::Empty->value)
            ->latestOfMany('record_date');
    }

    /**
     * Session RPE / internal training load logs for this athlete.
     *
     * @return HasMany<RpeSession, $this>
     */
    public function rpeSessions(): HasMany
    {
        return $this->hasMany(RpeSession::class);
    }

    /**
     * Calculate the athlete's current age in years.
     */
    public function age(): int
    {
        return (int) $this->date_of_birth->age;
    }

    /**
     * Calculate the athlete's Body Mass Index (BMI).
     */
    public function bmi(): float
    {
        $heightMeters = $this->height_cm / 100;

        if ($heightMeters <= 0) {
            return 0.0;
        }

        return round($this->weight_kg / ($heightMeters * $heightMeters), 1);
    }
}
