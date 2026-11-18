<?php

namespace App\Services\Rpe;

use App\Enums\AcwrZone;
use App\Models\RpeSession;
use Carbon\CarbonImmutable;
use Carbon\CarbonInterface;
use Illuminate\Support\Collection;

/**
 * @phpstan-type WeeklyAcwrSummary array{
 *     iso_week: string,
 *     week_label: string,
 *     week_start: string,
 *     week_end: string,
 *     week_range: string,
 *     session_count: int,
 *     total_duration: int,
 *     avg_rpe: float|null,
 *     acute_load: int,
 *     chronic_load: float,
 *     chronic_weeks_used: int,
 *     acwr: float|null,
 *     zone: string,
 *     zone_label: string,
 *     week_change_pct: float|null,
 *     monotony: float,
 *     strain: int
 * }
 * @phpstan-type DailyLoadPoint array{
 *     date: string,
 *     date_label: string,
 *     day_short: string,
 *     session_count: int,
 *     daily_load: int
 * }
 * @phpstan-type LoadInsight array{
 *     category: string,
 *     level: 'optimal'|'warning'|'risk'|'info',
 *     title: string,
 *     summary: string,
 *     value: string
 * }
 */
class AcwrCalculator
{
    /**
     * Calculate Foster Session Training Load in Arbitrary Units (AU).
     */
    public function calculateSessionLoad(int $rpe, int $durationMinutes): int
    {
        if ($rpe <= 0 || $durationMinutes <= 0) {
            return 0;
        }

        return $rpe * $durationMinutes;
    }

    /**
     * Calculate the 1-based athlete program week label ("Minggu X") starting from the athlete's first RPE date.
     */
    public function weekLabelFromFirstDate(CarbonInterface $firstSessionDate, CarbonInterface $targetDate): string
    {
        $start = CarbonImmutable::parse($firstSessionDate->format('Y-m-d'));
        $target = CarbonImmutable::parse($targetDate->format('Y-m-d'));
        $diffDays = max(0, (int) $start->diffInDays($target, false));
        $weekNum = intdiv($diffDays, 7) + 1;

        return "Minggu {$weekNum}";
    }

    /**
     * Build continuous 7-day coupled 4-week rolling ACWR summaries starting from the athlete's first RPE date (oldest -> newest).
     *
     * @param  Collection<int, RpeSession>  $sessions
     * @return array<int, WeeklyAcwrSummary>
     */
    public function buildWeeklySummaries(Collection $sessions): array
    {
        if ($sessions->isEmpty()) {
            return [];
        }

        /** @var array<string, int> $dailyLoads */
        $dailyLoads = [];
        /** @var array<int, int> $weeklyLoads */
        $weeklyLoads = [];
        /** @var array<int, int> $weeklySessionCounts */
        $weeklySessionCounts = [];
        /** @var array<int, int> $weeklyDurations */
        $weeklyDurations = [];
        /** @var array<int, int> $weeklyRpeSums */
        $weeklyRpeSums = [];

        $firstDate = null;
        $lastDate = null;

        foreach ($sessions as $session) {
            $sessionDate = CarbonImmutable::parse($session->session_date->format('Y-m-d'));

            if ($firstDate === null || $sessionDate->lt($firstDate)) {
                $firstDate = $sessionDate;
            }

            if ($lastDate === null || $sessionDate->gt($lastDate)) {
                $lastDate = $sessionDate;
            }
        }

        foreach ($sessions as $session) {
            $sessionDate = CarbonImmutable::parse($session->session_date->format('Y-m-d'));
            $dateKey = $sessionDate->format('Y-m-d');
            $weekIdx = intdiv((int) $firstDate->diffInDays($sessionDate), 7);

            $load = $session->session_load;
            $dailyLoads[$dateKey] = ($dailyLoads[$dateKey] ?? 0) + $load;
            $weeklyLoads[$weekIdx] = ($weeklyLoads[$weekIdx] ?? 0) + $load;
            $weeklySessionCounts[$weekIdx] = ($weeklySessionCounts[$weekIdx] ?? 0) + 1;
            $weeklyDurations[$weekIdx] = ($weeklyDurations[$weekIdx] ?? 0) + $session->duration_minutes;
            $weeklyRpeSums[$weekIdx] = ($weeklyRpeSums[$weekIdx] ?? 0) + $session->rpe;
        }

        $totalWeeks = intdiv((int) $firstDate->diffInDays($lastDate), 7) + 1;

        $summaries = [];
        /** @var array<int, int> $orderedLoads */
        $orderedLoads = [];

        for ($idx = 0; $idx < $totalWeeks; $idx++) {
            $weekStart = $firstDate->addDays($idx * 7);
            $weekEnd = $weekStart->addDays(6);
            $acuteLoad = $weeklyLoads[$idx] ?? 0;
            $sessionCount = $weeklySessionCounts[$idx] ?? 0;
            $totalDuration = $weeklyDurations[$idx] ?? 0;
            $avgRpe = $sessionCount > 0
                ? round(($weeklyRpeSums[$idx] ?? 0) / $sessionCount, 1)
                : null;

            $orderedLoads[$idx] = $acuteLoad;

            // Coupled 4-week rolling window: [max(0, idx-3) .. idx]
            $windowStart = max(0, $idx - 3);
            $weeksUsed = $idx - $windowStart + 1;
            $windowSum = 0;

            for ($w = $windowStart; $w <= $idx; $w++) {
                $windowSum += $orderedLoads[$w];
            }

            $chronicLoad = round($windowSum / $weeksUsed, 1);
            $acwr = $chronicLoad > 0.0
                ? round($acuteLoad / $chronicLoad, 2)
                : null;
            $zone = AcwrZone::fromRatio($acwr);

            $weekChangePct = null;

            if ($idx > 0 && $orderedLoads[$idx - 1] > 0) {
                $prev = $orderedLoads[$idx - 1];
                $weekChangePct = round((($acuteLoad - $prev) / $prev) * 100, 1);
            }

            // Foster Monotony & Strain across 7 calendar days of this athlete week
            $sevenDayLoads = [];

            for ($d = 0; $d < 7; $d++) {
                $dayKey = $weekStart->addDays($d)->format('Y-m-d');
                $sevenDayLoads[] = $dailyLoads[$dayKey] ?? 0;
            }

            $meanDaily = array_sum($sevenDayLoads) / 7;
            $variance = 0.0;

            foreach ($sevenDayLoads as $dayLoad) {
                $variance += ($dayLoad - $meanDaily) ** 2;
            }

            $stdDev = sqrt($variance / 7);
            $monotony = $stdDev > 0.0 ? round($meanDaily / $stdDev, 2) : 0.0;
            $strain = (int) round($acuteLoad * $monotony);

            $weekNumber = $idx + 1;
            $weekCode = "M{$weekNumber}";
            $weekLabel = "Minggu {$weekNumber}";
            $weekRange = $weekStart->format('d M').' – '.$weekEnd->format('d M Y');

            $summaries[] = [
                'iso_week' => $weekCode,
                'week_label' => $weekLabel,
                'week_start' => $weekStart->format('Y-m-d'),
                'week_end' => $weekEnd->format('Y-m-d'),
                'week_range' => $weekRange,
                'session_count' => $sessionCount,
                'total_duration' => $totalDuration,
                'avg_rpe' => $avgRpe,
                'acute_load' => $acuteLoad,
                'chronic_load' => $chronicLoad,
                'chronic_weeks_used' => $weeksUsed,
                'acwr' => $acwr,
                'zone' => $zone->value,
                'zone_label' => $zone->label(),
                'week_change_pct' => $weekChangePct,
                'monotony' => $monotony,
                'strain' => $strain,
            ];
        }

        return $summaries;
    }

    /**
     * Build a continuous daily training load series ending at $endDate (oldest -> newest).
     *
     * @param  Collection<int, RpeSession>  $sessions
     * @return array<int, DailyLoadPoint>
     */
    public function buildDailyLoads(Collection $sessions, CarbonInterface $endDate, int $days = 14): array
    {
        $end = CarbonImmutable::parse($endDate->format('Y-m-d'));
        $start = $end->subDays(max(1, $days) - 1);

        /** @var array<string, int> $dailyTotals */
        $dailyTotals = [];
        /** @var array<string, int> $dailyCounts */
        $dailyCounts = [];

        foreach ($sessions as $session) {
            $key = $session->session_date->format('Y-m-d');
            $dailyTotals[$key] = ($dailyTotals[$key] ?? 0) + $session->session_load;
            $dailyCounts[$key] = ($dailyCounts[$key] ?? 0) + 1;
        }

        $dayNames = [
            1 => 'Sen',
            2 => 'Sel',
            3 => 'Rab',
            4 => 'Kam',
            5 => 'Jum',
            6 => 'Sab',
            7 => 'Min',
        ];

        $points = [];
        $cursor = $start;

        while ($cursor->lte($end)) {
            $key = $cursor->format('Y-m-d');
            $points[] = [
                'date' => $key,
                'date_label' => $cursor->format('d M'),
                'day_short' => $dayNames[$cursor->dayOfWeekIso] ?? $cursor->format('D'),
                'session_count' => $dailyCounts[$key] ?? 0,
                'daily_load' => $dailyTotals[$key] ?? 0,
            ];
            $cursor = $cursor->addDay();
        }

        return $points;
    }

    /**
     * Generate automated clinical & workload insights from chronological weekly ACWR summaries.
     *
     * @param  array<int, WeeklyAcwrSummary>  $weeklySummaries
     * @return array<int, LoadInsight>
     */
    public function generateLoadInsights(array $weeklySummaries): array
    {
        if ($weeklySummaries === []) {
            return [];
        }

        $latest = $weeklySummaries[count($weeklySummaries) - 1];
        $acwr = $latest['acwr'];
        $zone = AcwrZone::fromRatio($acwr);

        $acwrInsight = match ($zone) {
            AcwrZone::Optimal => [
                'category' => 'Status ACWR Mingguan',
                'level' => 'optimal',
                'title' => 'Zona Optimal (Sweet Spot)',
                'summary' => "ACWR {$acwr} berada dalam rentang aman 0.80–1.30. Adaptasi fisik berlangsung optimal dengan risiko cedera minimal.",
                'value' => number_format((float) $acwr, 2),
            ],
            AcwrZone::Caution => [
                'category' => 'Status ACWR Mingguan',
                'level' => 'warning',
                'title' => 'Zona Waspada (Caution)',
                'summary' => "ACWR {$acwr} (1.31–1.50) menunjukkan peningkatan beban mingguan moderat. Pantau pemulihan harian dan hindari lonjakan tambahan.",
                'value' => number_format((float) $acwr, 2),
            ],
            AcwrZone::HighRisk => [
                'category' => 'Status ACWR Mingguan',
                'level' => 'risk',
                'title' => 'Zona Risiko Tinggi (Danger Zone)',
                'summary' => "ACWR {$acwr} melampaui ambang 1.50. Risiko kelelahan akut & cedera tinggi — pertimbangkan pengurangan volume atau intensitas.",
                'value' => number_format((float) $acwr, 2),
            ],
            AcwrZone::Undertraining => [
                'category' => 'Status ACWR Mingguan',
                'level' => 'info',
                'title' => 'Beban Kurang (Undertraining)',
                'summary' => "ACWR {$acwr} berada di bawah 0.80. Jika bukan fase tapering/pemulihan, tingkatkan beban latihan secara bertahap.",
                'value' => number_format((float) $acwr, 2),
            ],
            AcwrZone::NoData => [
                'category' => 'Status ACWR Mingguan',
                'level' => 'info',
                'title' => 'Belum Ada Rasio ACWR',
                'summary' => 'Catat minimal satu sesi latihan RPE untuk mulai menghitung ACWR mingguan.',
                'value' => '—',
            ],
        };

        $changePct = $latest['week_change_pct'];

        if ($changePct === null) {
            $progressionInsight = [
                'category' => 'Progresi Beban Mingguan',
                'level' => 'info',
                'title' => 'Minggu Awal Pencatatan',
                'summary' => "Total beban minggu {$latest['week_label']} sebesar ".number_format($latest['acute_load']).' AU. Perbandingan mingguan tersedia mulai minggu ke-2.',
                'value' => number_format($latest['acute_load']).' AU',
            ];
        } elseif ($changePct > 15.0) {
            $progressionInsight = [
                'category' => 'Progresi Beban Mingguan',
                'level' => 'risk',
                'title' => 'Lonjakan Beban > 15%',
                'summary' => "Beban mingguan naik +{$changePct}% dibandingkan minggu sebelumnya. Kenaikan di atas 15%/minggu meningkatkan risiko cedera jaringan.",
                'value' => "+{$changePct}%",
            ];
        } elseif ($changePct < -20.0) {
            $progressionInsight = [
                'category' => 'Progresi Beban Mingguan',
                'level' => 'info',
                'title' => 'Penurunan Beban / Deload',
                'summary' => "Beban mingguan turun {$changePct}% dari minggu sebelumnya — sesuai pola deload/tapering atau fase pemulihan aktif.",
                'value' => "{$changePct}%",
            ];
        } else {
            $sign = $changePct > 0 ? '+' : '';
            $progressionInsight = [
                'category' => 'Progresi Beban Mingguan',
                'level' => 'optimal',
                'title' => 'Progresi Beban Terkendali',
                'summary' => "Perubahan beban mingguan ({$sign}{$changePct}%) berada dalam batas aman progresi fisiologis (≤ 15%).",
                'value' => "{$sign}{$changePct}%",
            ];
        }

        $monotony = $latest['monotony'];
        $strain = $latest['strain'];

        $monotonyInsight = match (true) {
            $monotony > 2.0 => [
                'category' => 'Monotony & Strain (Foster)',
                'level' => 'warning',
                'title' => 'Variasi Latihan Terlalu Monoton',
                'summary' => "Indeks Monotony {$monotony} (> 2.0) dengan Strain ".number_format($strain).' AU. Tambahkan variasi intensitas hari berat–ringan untuk mencegah overtraining.',
                'value' => number_format($monotony, 2),
            ],
            $monotony > 0.0 => [
                'category' => 'Monotony & Strain (Foster)',
                'level' => 'optimal',
                'title' => 'Variasi Beban Harian Sehat',
                'summary' => "Indeks Monotony {$monotony} (≤ 2.0) dengan Training Strain ".number_format($strain).' AU menunjukkan distribusi hari berat dan ringan yang seimbang.',
                'value' => number_format($monotony, 2),
            ],
            default => [
                'category' => 'Monotony & Strain (Foster)',
                'level' => 'info',
                'title' => 'Menunggu Variasi Harian',
                'summary' => 'Indeks Monotony & Strain akan terhitung otomatis ketika terdapat variasi beban latihan pada beberapa hari dalam minggu berjalan.',
                'value' => '0.00',
            ],
        };

        return [$acwrInsight, $progressionInsight, $monotonyInsight];
    }
}
