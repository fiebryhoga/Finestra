<?php

namespace Database\Factories;

use App\Enums\Gender;
use App\Models\Athlete;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Athlete>
 */
class AthleteFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'gender' => fake()->randomElement(Gender::cases()),
            'date_of_birth' => fake()->dateTimeBetween('-25 years', '-17 years')->format('Y-m-d'),
            'weight_kg' => fake()->randomFloat(1, 55, 82),
            'height_cm' => fake()->randomFloat(1, 162, 188),
        ];
    }
}
