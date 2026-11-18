<?php

namespace App\Http\Controllers;

use App\Enums\AcwrZone;
use App\Enums\RecoveryStatus;
use App\Models\Athlete;
use App\Models\DailyMetric;
use App\Services\Rpe\AcwrCalculator;
use Illuminate\Support\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly AcwrCalculator $acwrCalculator,
    ) {}

    /**
     * Display the Finestra sports science monitoring dashboard.
     */
    public function __invoke(): Response
    {
        $athletes = Athlete::query()
            ->with([
                'latestFilledMetric',
                'rpeSessions' => fn ($query) => $query->orderBy('session_date'),
            ])
            ->get();
        $totalAthletes = $athletes->count();

        $sevenDaysAgo = Carbon::today()->subDays(6)->toDateString();

        $recentFilled7d = DailyMetric::query()
            ->where('recovery_status', '!=', RecoveryStatus::Empty->value)
            ->whereDate('record_date', '>=', $sevenDaysAgo)
            ->get();

        $avgReadiness7d = $recentFilled7d->isNotEmpty()
            ? round((float) ($recentFilled7d->avg('quick_recovery_score') ?? 0.0), 1)
            : null;

        $optimalFit = 0;
        $fatigueWarning = 0;
        $inRecovery = 0;
        $alerts = [];

        foreach ($athletes as $athlete) {
            $latest = $athlete->latestFilledMetric;

            if ($latest !== null) {
                $score = $latest->quick_recovery_score;

                if ($score >= 75) {
                    $optimalFit++;
                } elseif ($score >= 50) {
                    $fatigueWarning++;
                } else {
                    $inRecovery++;
                }

                if ($latest->recovery_status === RecoveryStatus::Poor || ($score > 0 && $score < 70)) {
                    $alerts[] = [
                        'athlete_id' => $athlete->id,
                        'athlete_name' => $athlete->name,
                        'source' => 'recovery',
                        'severity' => 'rose',
                        'reason' => 'Kesiapan Pemulihan Rendah',
                        'score' => $score,
                        'rhr' => $latest->rhr,
                        'acwr' => null,
                        'record_date_formatted' => $latest->record_date->format('d M Y'),
                    ];
                } elseif ($latest->rhr > 85) {
                    $alerts[] = [
                        'athlete_id' => $athlete->id,
                        'athlete_name' => $athlete->name,
                        'source' => 'recovery',
                        'severity' => 'amber',
                        'reason' => 'Basal Heart Rate (BHR) Tinggi (Indikasi Letih)',
                        'score' => $score,
                        'rhr' => $latest->rhr,
                        'acwr' => null,
                        'record_date_formatted' => $latest->record_date->format('d M Y'),
                    ];
                }
            }

            if ($athlete->rpeSessions->isNotEmpty()) {
                $weeklySummaries = $this->acwrCalculator->buildWeeklySummaries($athlete->rpeSessions);
                $latestWeek = $weeklySummaries !== [] ? $weeklySummaries[count($weeklySummaries) - 1] : null;

                if ($latestWeek !== null && $latestWeek['zone'] === AcwrZone::HighRisk->value) {
                    $alerts[] = [
                        'athlete_id' => $athlete->id,
                        'athlete_name' => $athlete->name,
                        'source' => 'acwr',
                        'severity' => 'rose',
                        'reason' => 'ACWR Zona Risiko Tinggi (> 1.50)',
                        'score' => $latest !== null ? $latest->quick_recovery_score : 0,
                        'rhr' => $latest !== null ? $latest->rhr : 0.0,
                        'acwr' => $latestWeek['acwr'],
                        'record_date_formatted' => $latestWeek['week_label'],
                    ];
                }
            }
        }

        usort($alerts, function (array $a, array $b): int {
            if ($a['severity'] !== $b['severity']) {
                return $a['severity'] === 'rose' ? -1 : 1;
            }

            return $a['score'] <=> $b['score'];
        });

        $recentMetrics = DailyMetric::query()
            ->with('athlete:id,name')
            ->where('recovery_status', '!=', RecoveryStatus::Empty->value)
            ->latest('record_date')
            ->latest('id')
            ->limit(6)
            ->get()
            ->map(fn (DailyMetric $metric): array => [
                'id' => $metric->id,
                'athlete_id' => $metric->athlete_id,
                'athlete_name' => $metric->athlete->name,
                'record_date_formatted' => $metric->record_date->format('d M Y'),
                'week' => $metric->week,
                'rhr' => $metric->rhr,
                'spo2' => $metric->spo2,
                'quick_recovery_score' => $metric->quick_recovery_score,
                'recovery_status' => $metric->recovery_status->value,
                'recovery_status_short' => $metric->recovery_status->shortLabel(),
            ])
            ->all();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_athletes' => $totalAthletes,
                'tracked_athletes' => $optimalFit + $fatigueWarning + $inRecovery,
                'avg_readiness_7d' => $avgReadiness7d,
                'optimal_fit' => $optimalFit,
                'fatigue_warning' => $fatigueWarning,
                'in_recovery' => $inRecovery,
            ],
            'alerts' => array_slice($alerts, 0, 5),
            'recentMetrics' => $recentMetrics,
        ]);
    }
}
