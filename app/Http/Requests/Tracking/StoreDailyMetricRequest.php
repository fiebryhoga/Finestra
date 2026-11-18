<?php

namespace App\Http\Requests\Tracking;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreDailyMetricRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'record_date' => ['required', 'date'],
            'rhr' => ['required', 'numeric', 'min:0', 'max:220'],
            'spo2' => ['required', 'numeric', 'min:0', 'max:100'],
            'vj' => ['required', 'numeric', 'min:0', 'max:150'],
            'weight' => ['required', 'numeric', 'min:0', 'max:250'],
            'age' => ['required', 'integer', 'min:5', 'max:100'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'record_date.required' => 'Tanggal pencatatan wajib diisi.',
            'record_date.date' => 'Format tanggal pencatatan tidak valid.',
            'rhr.required' => 'RHR wajib diisi.',
            'rhr.numeric' => 'RHR harus berupa angka.',
            'rhr.max' => 'RHR maksimal 220 bpm.',
            'spo2.required' => 'SpO₂ wajib diisi.',
            'spo2.numeric' => 'SpO₂ harus berupa angka.',
            'spo2.max' => 'SpO₂ maksimal 100%.',
            'vj.required' => 'Vertical Jump wajib diisi.',
            'vj.numeric' => 'Vertical Jump harus berupa angka.',
            'vj.max' => 'Vertical Jump maksimal 150 cm.',
            'weight.required' => 'Berat badan wajib diisi.',
            'weight.numeric' => 'Berat badan harus berupa angka.',
            'weight.max' => 'Berat badan maksimal 250 kg.',
            'age.required' => 'Usia wajib diisi.',
            'age.integer' => 'Usia harus berupa bilangan bulat.',
            'age.min' => 'Usia minimal 5 tahun.',
            'age.max' => 'Usia maksimal 100 tahun.',
        ];
    }
}
