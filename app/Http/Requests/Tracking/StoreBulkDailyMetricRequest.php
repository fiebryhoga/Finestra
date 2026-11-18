<?php

namespace App\Http\Requests\Tracking;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBulkDailyMetricRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rows' => ['required', 'array', 'min:1', 'max:120'],
            'rows.*.record_date' => ['required', 'date', 'distinct'],
            'rows.*.rhr' => ['required', 'numeric', 'min:0', 'max:220'],
            'rows.*.spo2' => ['required', 'numeric', 'min:0', 'max:100'],
            'rows.*.vj' => ['required', 'numeric', 'min:0', 'max:150'],
            'rows.*.weight' => ['required', 'numeric', 'min:0', 'max:250'],
            'rows.*.age' => ['required', 'integer', 'min:5', 'max:100'],
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
            'rows.required' => 'Minimal satu baris data wajib diisi.',
            'rows.min' => 'Minimal satu baris data wajib diisi.',
            'rows.*.record_date.required' => 'Tanggal pada setiap baris wajib diisi.',
            'rows.*.record_date.distinct' => 'Terdapat tanggal pencatatan yang duplikat.',
            'rows.*.rhr.max' => 'RHR maksimal 220 bpm.',
            'rows.*.spo2.max' => 'SpO₂ maksimal 100%.',
            'rows.*.vj.max' => 'Vertical Jump maksimal 150 cm.',
            'rows.*.weight.max' => 'Berat badan maksimal 250 kg.',
        ];
    }
}
