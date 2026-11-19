<?php

namespace Database\Seeders;

use App\Enums\Gender;
use App\Enums\RecoveryStatus;
use App\Enums\SessionType;
use App\Models\Athlete;
use App\Models\DailyMetric;
use App\Models\RpeSession;
use App\Services\Rpe\AcwrCalculator;
use App\Services\Tracking\QuickRecoveryCalculator;
use Carbon\CarbonPeriod;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class AthleteMonitoringSeeder extends Seeder
{
    /**
     * Seed 3 athletes (2 female, 1 male) with Quick Recovery & RPE records from August 1 to today (1 rest day/week on Sunday).
     */
    public function run(): void
    {
        $recoveryCalculator = app(QuickRecoveryCalculator::class);
        $acwrCalculator = app(AcwrCalculator::class);

        $today = Carbon::today();
        $startYear = $today->month >= 8 ? $today->year : $today->year - 1;
        $startDate = Carbon::create($startYear, 8, 1)->startOfDay();

        $profiles = [
            [
                'name' => 'Nadia Putri Ramadhani',
                'gender' => Gender::Female,
                'date_of_birth' => '2005-04-12',
                'weight_kg' => 56.5,
                'height_cm' => 165.0,
                'bhr_base' => 58.0,
                'vj_base' => 27.0,
                'rpe_bias' => 0,
                'seed_offset' => 101,
            ],
            [
                'name' => 'Aulia Kartika Sari',
                'gender' => Gender::Female,
                'date_of_birth' => '2004-09-23',
                'weight_kg' => 59.0,
                'height_cm' => 168.0,
                'bhr_base' => 60.0,
                'vj_base' => 25.0,
                'rpe_bias' => 1,
                'seed_offset' => 202,
            ],
            [
                'name' => 'Raka Pratama Wijaya',
                'gender' => Gender::Male,
                'date_of_birth' => '2004-02-18',
                'weight_kg' => 69.5,
                'height_cm' => 176.0,
                'bhr_base' => 57.0,
                'vj_base' => 31.0,
                'rpe_bias' => 0,
                'seed_offset' => 303,
            ],
        ];

        $period = CarbonPeriod::create($startDate, $today);

        foreach ($profiles as $profile) {
            $athlete = Athlete::query()->updateOrCreate(
                ['name' => $profile['name']],
                [
                    'gender' => $profile['gender'],
                    'date_of_birth' => $profile['date_of_birth'],
                    'weight_kg' => $profile['weight_kg'],
                    'height_cm' => $profile['height_cm'],
                    'training_start_date' => $startDate->toDateString(),
                ],
            );

            // Reset existing seeded metrics/sessions for this seeded athlete so re-running stays idempotent
            $athlete->dailyMetrics()->delete();
            $athlete->rpeSessions()->delete();

            $age = max(16, $athlete->age());
            $dayIndex = 0;

            foreach ($period as $date) {
                if ($date === null) {
                    continue;
                }

                // 1 rest day per week (Sunday = libur)
                if ($date->isSunday()) {
                    continue;
                }

                $dayIndex++;
                $seed = ($profile['seed_offset'] * 997) + ($dayIndex * 131);
                $noise1 = (($seed % 100) / 100) - 0.5; // -0.50 .. +0.49
                $noise2 = ((($seed * 7) % 100) / 100) - 0.5;
                $wave = sin(($dayIndex + $profile['seed_offset']) / 5.5);

                // Clamp strictly within user-specified physiological ranges:
                // BHR: 55-65 bpm | SpO2: 97-99% | VJ: 20-34 cm
                $bhrRaw = $profile['bhr_base'] + ($wave * 3.0) + ($noise1 * 4.0);
                $bhr = round(max(55.0, min(65.0, $bhrRaw)), 1);

                $spo2Options = [97.0, 98.0, 98.0, 99.0, 99.0];
                $spo2 = $spo2Options[abs($seed) % count($spo2Options)];

                $vjRaw = $profile['vj_base'] + ($wave * 2.5) + ($noise2 * 3.5);
                $vj = round(max(20.0, min(34.0, $vjRaw)), 1);

                $weight = round($profile['weight_kg'] + ($noise1 * 0.8), 1);

                $base = $recoveryCalculator->calculateBaseMetrics($age, $bhr, $weight, $vj);
                $weekLabel = $recoveryCalculator->calculateWeekLabel($startDate, $date);

                DailyMetric::query()->create([
                    'athlete_id' => $athlete->id,
                    'record_date' => $date->toDateString(),
                    'week' => $weekLabel,
                    'age' => $age,
                    'rhr' => $bhr,
                    'spo2' => $spo2,
                    'weight' => $weight,
                    'vj' => $vj,
                    'hr_max' => $base['hr_max'],
                    'hr_ratio' => $base['hr_ratio'],
                    'vo2_max' => $base['vo2_max'],
                    'peak_power' => $base['peak_power'],
                    'quick_recovery_score' => 0,
                    'recovery_status' => RecoveryStatus::Calculating,
                ]);

                // Seed RPE session with realistic 1-10 Foster CR-10 variety across mesocycles & athletes
                $dayOfWeek = $date->dayOfWeekIso; // 1=Mon .. 6=Sat
                $weekNum = intdiv((int) $startDate->diffInDays($date), 7) + 1;
                $cyclePhase = ($weekNum + $profile['seed_offset']) % 5; // 0=deload, 1=build, 2=moderate, 3=peak, 4=match-heavy

                [$sessionType, $baseDuration, $rpeMin, $rpeMax, $notes] = match ($dayOfWeek) {
                    1 => [SessionType::Conditioning, 70, 3, 8, 'Sesi pengkondisian fisik awal pekan'],
                    2 => [SessionType::Tactical, 85, 4, 9, 'Latihan taktik dan pola permainan'],
                    3 => [SessionType::Training, 75, 2, 8, 'Latihan teknik & koordinasi'],
                    4 => [SessionType::Conditioning, 85, 5, 10, 'Interval intensitas menengah–tinggi'],
                    5 => [SessionType::Recovery, 45, 1, 4, 'Sesi pemulihan & aktivasi pra-pertandingan'],
                    default => [SessionType::Match, 90, 6, 10, 'Simulasi pertandingan / uji coba'],
                };

                // Shift intensity by mesocycle phase so ACWR fluctuates naturally across weeks
                $phaseShift = match ($cyclePhase) {
                    0 => -2, // deload / recovery week (hits RPE 1-3)
                    1 => 0,
                    2 => 1,
                    3 => 2,  // peak loading week (hits RPE 8-10)
                    default => 1,
                };

                // Extra athlete-specific late-block differentiation (so athletes span varied ACWR zones)
                $athleteWave = (int) round(sin(($weekNum + ($profile['seed_offset'] % 7)) * 0.9) * 2);
                $rpeSpan = max(1, $rpeMax - $rpeMin + 1);
                $rawSpread = (($seed * 17) + ($dayOfWeek * 29) + ($weekNum * 43)) % $rpeSpan;
                $rpe = max(1, min(10, $rpeMin + $rawSpread + $phaseShift + $athleteWave + $profile['rpe_bias']));

                // Align duration realistically with RPE intensity & session type
                $durationSpread = ((($seed * 13) % 5) - 2) * 10; // -20 .. +20 min
                $duration = max(30, min(120, $baseDuration + $durationSpread + ($phaseShift * 5)));

                RpeSession::query()->create([
                    'athlete_id' => $athlete->id,
                    'session_date' => $date->toDateString(),
                    'session_type' => $sessionType,
                    'duration_minutes' => $duration,
                    'rpe' => $rpe,
                    'session_load' => $acwrCalculator->calculateSessionLoad($rpe, $duration),
                    'notes' => $notes,
                ]);
            }

            $recoveryCalculator->recalculateForAthlete($athlete);
        }
    }
}
