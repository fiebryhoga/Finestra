<?php

namespace App\Http\Requests\Rpe;

use App\Enums\SessionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateRpeSessionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'session_date' => ['required', 'date'],
            'session_type' => ['required', Rule::enum(SessionType::class)],
            'duration_minutes' => ['required', 'integer', 'min:1', 'max:600'],
            'rpe' => ['required', 'integer', 'min:1', 'max:10'],
            'notes' => ['nullable', 'string', 'max:500'],
        ];
    }

    /**
     * Custom Indonesian validation messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'session_date.required' => 'Tanggal sesi wajib diisi.',
            'session_date.date' => 'Format tanggal sesi tidak valid.',
            'session_type.required' => 'Jenis sesi wajib dipilih.',
            'duration_minutes.required' => 'Durasi sesi wajib diisi.',
            'duration_minutes.min' => 'Durasi minimal 1 menit.',
            'duration_minutes.max' => 'Durasi maksimal 600 menit.',
            'rpe.required' => 'Skor RPE wajib dipilih.',
            'rpe.min' => 'Skor RPE minimal 1 (Foster CR-10).',
            'rpe.max' => 'Skor RPE maksimal 10 (Foster CR-10).',
            'notes.max' => 'Catatan sesi maksimal 500 karakter.',
        ];
    }
}
