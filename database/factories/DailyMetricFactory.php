<?php

namespace Database\Factories;

use App\Enums\RecoveryStatus;
use App\Models\Athlete;
use App\Models\DailyMetric;
use App\Services\Tracking\QuickRecoveryCalculator;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DailyMetric>
 */
class DailyMetricFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $age = fake()->numberBetween(18, 25);
        $rhr = fake()->randomFloat(1, 48, 66);
        $spo2 = fake()->randomElement([96, 97, 98, 99]);
        $weight = fake()->randomFloat(1, 58, 80);
        $vj = fake()->randomFloat(1, 40, 62);

        $calculator = new QuickRecoveryCalculator;
        $base = $calculator->calculateBaseMetrics($age, $rhr, $weight, $vj);
        $recovery = $calculator->calculateRecoveryScore($rhr, $spo2, $rhr);

        return [
            'athlete_id' => Athlete::factory(),
            'record_date' => fake()->unique()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'week' => 'Week 1, Day 1',
            'age' => $age,
            'rhr' => $rhr,
            'spo2' => $spo2,
            'weight' => $weight,
            'vj' => $vj,
            'hr_max' => $base['hr_max'],
            'hr_ratio' => $base['hr_ratio'],
            'vo2_max' => $base['vo2_max'],
            'peak_power' => $base['peak_power'],
            'quick_recovery_score' => $recovery['score'],
            'recovery_status' => $recovery['status'],
        ];
    }

    /**
     * Represent an empty auto-generated calendar row.
     */
    public function emptyRow(): static
    {
        return $this->state(fn (array $attributes) => [
            'rhr' => 0,
            'spo2' => 0,
            'vj' => 0,
            'hr_max' => 0,
            'hr_ratio' => 0,
            'vo2_max' => 0,
            'peak_power' => 0,
            'quick_recovery_score' => 0,
            'recovery_status' => RecoveryStatus::Empty,
        ]);
    }
}
