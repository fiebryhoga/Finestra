<?php

namespace App\Http\Requests\Rpe;

use App\Enums\SessionType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreTeamRpeSessionRequest extends FormRequest
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
            'notes' => ['nullable', 'string', 'max:500'],
            'entries' => ['required', 'array', 'min:1'],
            'entries.*.athlete_id' => [
                'required',
                'integer',
                Rule::exists('athletes', 'id')->whereNull('deleted_at'),
            ],
            'entries.*.duration_minutes' => ['required', 'integer', 'min:1', 'max:600'],
            'entries.*.rpe' => ['required', 'integer', 'min:1', 'max:10'],
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
            'session_date.required' => 'Tanggal sesi tim wajib diisi.',
            'session_type.required' => 'Jenis sesi wajib dipilih.',
            'entries.required' => 'Pilih dan isi minimal satu atlet untuk sesi tim.',
            'entries.min' => 'Pilih dan isi minimal satu atlet untuk sesi tim.',
            'entries.*.athlete_id.exists' => 'Data atlet tidak ditemukan.',
            'entries.*.duration_minutes.required' => 'Durasi latihan atlet wajib diisi.',
            'entries.*.duration_minutes.min' => 'Durasi minimal 1 menit.',
            'entries.*.duration_minutes.max' => 'Durasi maksimal 600 menit.',
            'entries.*.rpe.required' => 'Skor RPE atlet wajib diisi.',
            'entries.*.rpe.min' => 'Skor RPE minimal 1.',
            'entries.*.rpe.max' => 'Skor RPE maksimal 10.',
        ];
    }
}
