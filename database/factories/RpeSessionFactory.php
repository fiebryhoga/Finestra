<?php

namespace Database\Factories;

use App\Enums\SessionType;
use App\Models\Athlete;
use App\Models\RpeSession;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<RpeSession>
 */
class RpeSessionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $duration = fake()->randomElement([45, 60, 75, 90, 105, 120]);
        $rpe = fake()->numberBetween(3, 8);

        return [
            'athlete_id' => Athlete::factory(),
            'session_date' => fake()->dateTimeBetween('-28 days', 'now')->format('Y-m-d'),
            'session_type' => fake()->randomElement(SessionType::cases()),
            'duration_minutes' => $duration,
            'rpe' => $rpe,
            'session_load' => $rpe * $duration,
            'notes' => null,
        ];
    }
}
