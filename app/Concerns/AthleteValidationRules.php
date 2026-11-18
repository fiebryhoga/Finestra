<?php

namespace App\Concerns;

use App\Enums\Gender;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait AthleteValidationRules
{
    /**
     * Get the validation rules used to validate athlete records.
     *
     * @return array<string, array<int, ValidationRule|array<mixed>|string>>
     */
    protected function athleteRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['required', Rule::enum(Gender::class)],
            'date_of_birth' => ['required', 'date', 'before:today', 'after:1920-01-01'],
            'weight_kg' => ['required', 'numeric', 'min:20', 'max:250'],
            'height_cm' => ['required', 'numeric', 'min:100', 'max:250'],
        ];
    }

    /**
     * Custom validation messages for athlete fields.
     *
     * @return array<string, string>
     */
    protected function athleteMessages(): array
    {
        return [
            'name.required' => 'Nama atlet wajib diisi.',
            'gender.required' => 'Jenis kelamin wajib dipilih.',
            'gender.enum' => 'Pilihan jenis kelamin tidak valid.',
            'date_of_birth.required' => 'Tanggal lahir wajib diisi.',
            'date_of_birth.date' => 'Format tanggal lahir tidak valid.',
            'date_of_birth.before' => 'Tanggal lahir harus sebelum hari ini.',
            'date_of_birth.after' => 'Tanggal lahir tidak valid.',
            'weight_kg.required' => 'Berat badan wajib diisi.',
            'weight_kg.numeric' => 'Berat badan harus berupa angka.',
            'weight_kg.min' => 'Berat badan minimal 20 kg.',
            'weight_kg.max' => 'Berat badan maksimal 250 kg.',
            'height_cm.required' => 'Tinggi badan wajib diisi.',
            'height_cm.numeric' => 'Tinggi badan harus berupa angka.',
            'height_cm.min' => 'Tinggi badan minimal 100 cm.',
            'height_cm.max' => 'Tinggi badan maksimal 250 cm.',
        ];
    }
}
