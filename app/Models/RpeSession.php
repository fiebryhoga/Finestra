<?php

namespace App\Models;

use App\Enums\SessionType;
use Carbon\CarbonInterface;
use Database\Factories\RpeSessionFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id
 * @property int $athlete_id
 * @property CarbonInterface $session_date
 * @property SessionType $session_type
 * @property int $duration_minutes
 * @property int $rpe
 * @property int $session_load
 * @property string|null $notes
 * @property CarbonInterface|null $created_at
 * @property CarbonInterface|null $updated_at
 * @property-read Athlete $athlete
 */
#[Fillable([
    'athlete_id',
    'session_date',
    'session_type',
    'duration_minutes',
    'rpe',
    'session_load',
    'notes',
])]
class RpeSession extends Model
{
    /** @use HasFactory<RpeSessionFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'session_date' => 'date',
            'session_type' => SessionType::class,
            'duration_minutes' => 'integer',
            'rpe' => 'integer',
            'session_load' => 'integer',
        ];
    }

    /**
     * Athlete that completed this training session.
     *
     * @return BelongsTo<Athlete, $this>
     */
    public function athlete(): BelongsTo
    {
        return $this->belongsTo(Athlete::class);
    }
}
