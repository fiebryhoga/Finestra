<?php

namespace App\Http\Controllers;

use App\Enums\RecoveryStatus;
use App\Http\Requests\Tracking\StoreBulkDailyMetricRequest;
use App\Http\Requests\Tracking\StoreDailyMetricRequest;
use App\Http\Requests\Tracking\UpdateTrainingStartDateRequest;
use App\Models\Athlete;
use App\Models\DailyMetric;
use App\Services\Tracking\QuickRecoveryCalculator;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\CarbonInterface;
use Carbon\CarbonPeriod;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class TrackingController extends Controller
{
    public function __construct(
        private readonly QuickRecoveryCalculator $calculator,
    ) {}

    /**
     * Display the athlete tracking overview list.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $statusFilter = $request->string('status', 'all')->toString();

        if (! in_array($statusFilter, ['all', 'good', 'fair', 'poor', 'empty'], true)) {
            $statusFilter = 'all';
        }

        $athletes = Athlete::query()
            ->with(['latestFilledMetric'])
            ->withCount([
                'dailyMetrics as filled_metrics_count' => fn (Builder $query) => $query
                    ->where('recovery_status', '!=', RecoveryStatus::Empty->value),
            ])
            ->when($search !== '', fn (Builder $query) => $query->where('name', 'like', "%{$search}%"))
            ->when($statusFilter === 'good', fn (Builder $query) => $query->whereHas(
                'latestFilledMetric',
                fn (Builder $q) => $q->where('recovery_status', RecoveryStatus::Good->value),
            ))
            ->when($statusFilter === 'fair', fn (Builder $query) => $query->whereHas(
                'latestFilledMetric',
                fn (Builder $q) => $q->where('recovery_status', RecoveryStatus::Fair->value),
            ))
            ->when($statusFilter === 'poor', fn (Builder $query) => $query->whereHas(
                'latestFilledMetric',
                fn (Builder $q) => $q->where('recovery_status', RecoveryStatus::Poor->value),
            ))
            ->when($statusFilter === 'empty', fn (Builder $query) => $query->whereDoesntHave('latestFilledMetric'))
            ->orderBy('name')
            ->paginate(10)
            ->withQueryString()
            ->through(function (Athlete $athlete): array {
                $latest = $athlete->latestFilledMetric;

                return [
                    'id' => $athlete->id,
                    'name' => $athlete->name,
                    'gender_label' => $athlete->gender->label(),
                    'age' => $athlete->age(),
                    'weight_kg' => $athlete->weight_kg,
                    'training_start_date' => $athlete->training_start_date?->format('Y-m-d'),
                    'training_start_date_formatted' => $athlete->training_start_date?->format('d M Y'),
                    'filled_metrics_count' => (int) ($athlete->filled_metrics_count ?? 0),
                    'latest_metric' => $latest !== null ? [
                        'record_date' => $latest->record_date->format('Y-m-d'),
                        'record_date_formatted' => $latest->record_date->format('d M Y'),
                        'rhr' => $latest->rhr,
                        'spo2' => $latest->spo2,
                        'vo2_max' => $latest->vo2_max,
                        'peak_power' => $latest->peak_power,
                        'quick_recovery_score' => $latest->quick_recovery_score,
                        'recovery_status' => $latest->recovery_status->value,
                        'recovery_status_short' => $latest->recovery_status->shortLabel(),
                    ] : null,
                ];
            });

        $allAthletes = Athlete::query()->with('latestFilledMetric')->get();
        $tracked = $allAthletes->filter(fn (Athlete $a): bool => $a->latestFilledMetric !== null);
        $goodCount = $tracked->filter(
            fn (Athlete $a): bool => $a->latestFilledMetric?->recovery_status === RecoveryStatus::Good,
        )->count();
        $fairCount = $tracked->filter(
            fn (Athlete $a): bool => $a->latestFilledMetric?->recovery_status === RecoveryStatus::Fair,
        )->count();
        $poorCount = $tracked->filter(
            fn (Athlete $a): bool => $a->latestFilledMetric?->recovery_status === RecoveryStatus::Poor,
        )->count();
        $avgScore = $tracked->isNotEmpty()
            ? round(
                (float) ($tracked->avg(
                    fn (Athlete $a): int => $a->latestFilledMetric !== null
                        ? $a->latestFilledMetric->quick_recovery_score
                        : 0,
                ) ?? 0.0),
                1,
            )
            : null;

        return Inertia::render('tracking/index', [
            'athletes' => $athletes,
            'filters' => [
                'search' => $search,
                'status' => $statusFilter,
            ],
            'stats' => [
                'total_athletes' => $allAthletes->count(),
                'tracked_athletes' => $tracked->count(),
                'avg_recovery_score' => $avgScore,
                'good_count' => $goodCount,
                'fair_count' => $fairCount,
                'poor_count' => $poorCount,
            ],
        ]);
    }

    /**
     * Show an athlete's daily recovery calendar, history, and analytics.
     */
    public function show(Athlete $athlete): Response
    {
        $today = Carbon::today();

        if ($athlete->training_start_date !== null && $athlete->training_start_date->lte($today)) {
            $periodStart = $athlete->training_start_date->copy()->startOfDay();
            $maxLookback = $today->copy()->subDays(365);

            if ($periodStart->lt($maxLookback)) {
                $periodStart = $maxLookback;
            }

            $existingDates = $athlete->dailyMetrics()
                ->whereDate('record_date', '>=', $periodStart->toDateString())
                ->whereDate('record_date', '<=', $today->toDateString())
                ->pluck('record_date')
                ->map(fn (CarbonInterface $date): string => $date->format('Y-m-d'))
                ->all();

            $existingLookup = array_flip($existingDates);
            $defaultAge = $athlete->age() > 0 ? $athlete->age() : 20;

            foreach (CarbonPeriod::create($periodStart, $today) as $date) {
                if ($date === null) {
                    continue;
                }

                $dateStr = $date->format('Y-m-d');

                if (isset($existingLookup[$dateStr])) {
                    continue;
                }

                DailyMetric::query()->create([
                    'athlete_id' => $athlete->id,
                    'record_date' => $dateStr,
                    'week' => $this->calculator->calculateWeekLabel($athlete->training_start_date, $date),
                    'age' => $defaultAge,
                    'rhr' => 0,
                    'spo2' => 0,
                    'weight' => $athlete->weight_kg,
                    'vj' => 0,
                    'hr_max' => 0,
                    'hr_ratio' => 0,
                    'vo2_max' => 0,
                    'peak_power' => 0,
                    'quick_recovery_score' => 0,
                    'recovery_status' => RecoveryStatus::Empty,
                ]);
            }
        }

        $chronological = $athlete->dailyMetrics()->orderBy('record_date')->get();
        $baselineRhr = $this->calculator->resolveBaselineRhr($athlete, $chronological);
        $filledMetrics = $chronological->filter(
            fn (DailyMetric $metric): bool => $metric->recovery_status !== RecoveryStatus::Empty,
        )->values();

        $insights = $this->calculator->generateClinicalInsights($filledMetrics, $baselineRhr);

        $metrics = $chronological->reverse()->values()->map(fn (DailyMetric $metric): array => [
            'id' => $metric->id,
            'record_date' => $metric->record_date->format('Y-m-d'),
            'record_date_formatted' => $metric->record_date->format('d M Y'),
            'week' => $metric->week,
            'age' => $metric->age,
            'rhr' => $metric->rhr,
            'spo2' => $metric->spo2,
            'weight' => $metric->weight,
            'vj' => $metric->vj,
            'hr_max' => $metric->hr_max,
            'hr_ratio' => $metric->hr_ratio,
            'vo2_max' => $metric->vo2_max,
            'peak_power' => $metric->peak_power,
            'quick_recovery_score' => $metric->quick_recovery_score,
            'recovery_status' => $metric->recovery_status->value,
            'recovery_status_short' => $metric->recovery_status->shortLabel(),
        ])->all();

        $latestFilledDate = $filledMetrics->last()?->record_date->format('Y-m-d') ?? $today->format('Y-m-d');

        return Inertia::render('tracking/show', [
            'athlete' => [
                'id' => $athlete->id,
                'name' => $athlete->name,
                'gender_label' => $athlete->gender->label(),
                'age' => $athlete->age(),
                'weight_kg' => $athlete->weight_kg,
                'height_cm' => $athlete->height_cm,
                'bmi' => $athlete->bmi(),
                'training_start_date' => $athlete->training_start_date?->format('Y-m-d'),
                'training_start_date_formatted' => $athlete->training_start_date?->format('d M Y'),
            ],
            'metrics' => $metrics,
            'baselineRhr' => $baselineRhr,
            'insights' => $insights,
            'defaultReferenceDate' => $latestFilledDate,
            'today' => $today->format('Y-m-d'),
        ]);
    }

    /**
     * Show the bulk spreadsheet input page for an athlete.
     */
    public function bulk(Athlete $athlete): Response
    {
        $today = Carbon::today();
        $chronological = $athlete->dailyMetrics()->orderBy('record_date')->get();
        $baselineRhr = $this->calculator->resolveBaselineRhr($athlete, $chronological);

        $existingRows = $chronological->map(fn (DailyMetric $metric): array => [
            'record_date' => $metric->record_date->format('Y-m-d'),
            'rhr' => $metric->rhr > 0 ? (string) $metric->rhr : '',
            'spo2' => $metric->spo2 > 0 ? (string) $metric->spo2 : '',
            'vj' => $metric->vj > 0 ? (string) $metric->vj : '',
            'weight' => $metric->weight > 0 ? (string) $metric->weight : (string) $athlete->weight_kg,
            'age' => (string) ($metric->age > 0 ? $metric->age : $athlete->age()),
        ])->values()->all();

        return Inertia::render('tracking/bulk-input', [
            'athlete' => [
                'id' => $athlete->id,
                'name' => $athlete->name,
                'age' => $athlete->age(),
                'weight_kg' => $athlete->weight_kg,
                'training_start_date' => $athlete->training_start_date?->format('Y-m-d'),
            ],
            'existingRows' => $existingRows,
            'baselineRhr' => $baselineRhr,
            'today' => $today->format('Y-m-d'),
        ]);
    }

    /**
     * Store or update a single daily metric record for an athlete.
     */
    public function store(StoreDailyMetricRequest $request, Athlete $athlete): RedirectResponse
    {
        $validated = $request->validated();
        $recordDate = Carbon::parse((string) $validated['record_date']);
        $age = (int) $validated['age'];
        $rhr = (float) $validated['rhr'];
        $spo2 = (float) $validated['spo2'];
        $weight = (float) $validated['weight'];
        $vj = (float) $validated['vj'];

        $base = $this->calculator->calculateBaseMetrics($age, $rhr, $weight, $vj);
        $weekLabel = $this->calculator->calculateWeekLabel($athlete->training_start_date, $recordDate);

        $payload = [
            'week' => $weekLabel,
            'age' => $age,
            'rhr' => $rhr,
            'spo2' => $spo2,
            'weight' => $weight,
            'vj' => $vj,
            'hr_max' => $base['hr_max'],
            'hr_ratio' => $base['hr_ratio'],
            'vo2_max' => $base['vo2_max'],
            'peak_power' => $base['peak_power'],
            'quick_recovery_score' => 0,
            'recovery_status' => RecoveryStatus::Calculating,
        ];

        $existing = $athlete->dailyMetrics()
            ->whereDate('record_date', $recordDate->toDateString())
            ->first();

        if ($existing !== null) {
            $existing->update($payload);
        } else {
            DailyMetric::query()->create([
                'athlete_id' => $athlete->id,
                'record_date' => $recordDate->toDateString(),
                ...$payload,
            ]);
        }

        $this->calculator->recalculateForAthlete($athlete);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data Quick Recovery berhasil disimpan dan dihitung ulang.',
        ]);

        return back();
    }

    /**
     * Store or update multiple daily metric records in one batch.
     */
    public function storeBulk(StoreBulkDailyMetricRequest $request, Athlete $athlete): RedirectResponse
    {
        /** @var array<int, array{record_date: string, rhr: float|int|string, spo2: float|int|string, vj: float|int|string, weight: float|int|string, age: int|string}> $rows */
        $rows = $request->validated('rows');

        DB::transaction(function () use ($athlete, $rows): void {
            foreach ($rows as $row) {
                $recordDate = Carbon::parse((string) $row['record_date']);
                $age = (int) $row['age'];
                $rhr = (float) $row['rhr'];
                $spo2 = (float) $row['spo2'];
                $weight = (float) $row['weight'];
                $vj = (float) $row['vj'];

                $base = $this->calculator->calculateBaseMetrics($age, $rhr, $weight, $vj);
                $weekLabel = $this->calculator->calculateWeekLabel($athlete->training_start_date, $recordDate);

                $payload = [
                    'week' => $weekLabel,
                    'age' => $age,
                    'rhr' => $rhr,
                    'spo2' => $spo2,
                    'weight' => $weight,
                    'vj' => $vj,
                    'hr_max' => $base['hr_max'],
                    'hr_ratio' => $base['hr_ratio'],
                    'vo2_max' => $base['vo2_max'],
                    'peak_power' => $base['peak_power'],
                    'quick_recovery_score' => 0,
                    'recovery_status' => RecoveryStatus::Calculating,
                ];

                $existing = $athlete->dailyMetrics()
                    ->whereDate('record_date', $recordDate->toDateString())
                    ->first();

                if ($existing !== null) {
                    $existing->update($payload);
                } else {
                    DailyMetric::query()->create([
                        'athlete_id' => $athlete->id,
                        'record_date' => $recordDate->toDateString(),
                        ...$payload,
                    ]);
                }
            }

            $this->calculator->recalculateForAthlete($athlete);
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => count($rows).' baris data harian berhasil disimpan.',
        ]);

        return to_route('tracking.show', $athlete);
    }

    /**
     * Update the athlete's program start date and recalculate calendar & recovery scores.
     */
    public function setStartDate(UpdateTrainingStartDateRequest $request, Athlete $athlete): RedirectResponse
    {
        $startDate = $request->validated('training_start_date');

        $athlete->update([
            'training_start_date' => $startDate ?: null,
        ]);

        $athlete->refresh();
        $this->calculator->recalculateForAthlete($athlete);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $startDate
                ? 'Tanggal mulai program diperbarui dan seluruh riwayat telah direkalkulasi.'
                : 'Tanggal mulai program berhasil dihapus.',
        ]);

        return back();
    }

    /**
     * Delete a single daily metric record and recalculate history.
     */
    public function destroy(Athlete $athlete, DailyMetric $dailyMetric): RedirectResponse
    {
        abort_unless($dailyMetric->athlete_id === $athlete->id, 404);

        $dailyMetric->delete();
        $this->calculator->recalculateForAthlete($athlete);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data harian berhasil dihapus dan riwayat telah direkalkulasi.',
        ]);

        return back();
    }

    /**
     * Export an athlete's Quick Recovery report as A4 Portrait PDF.
     */
    public function exportPdf(Request $request, Athlete $athlete): HttpResponse
    {
        $includeInsights = $request->boolean('include_insights', true);

        $chronological = $athlete->dailyMetrics()->orderBy('record_date')->get();
        $baselineRhr = $this->calculator->resolveBaselineRhr($athlete, $chronological);
        $filledMetrics = $chronological->filter(
            fn (DailyMetric $metric): bool => $metric->recovery_status !== RecoveryStatus::Empty,
        )->values();

        $insights = $includeInsights
            ? $this->calculator->generateClinicalInsights($filledMetrics, $baselineRhr)
            : [];

        $summary = [
            'total_days' => $filledMetrics->count(),
            'avg_recovery' => $filledMetrics->isNotEmpty()
                ? round((float) ($filledMetrics->avg('quick_recovery_score') ?? 0.0), 1)
                : null,
            'avg_rhr' => $filledMetrics->isNotEmpty()
                ? round((float) ($filledMetrics->avg('rhr') ?? 0.0), 1)
                : null,
            'max_peak_power' => $filledMetrics->isNotEmpty()
                ? (int) round((float) ($filledMetrics->max('peak_power') ?? 0.0))
                : null,
            'avg_vo2_max' => $filledMetrics->isNotEmpty()
                ? round((float) ($filledMetrics->avg('vo2_max') ?? 0.0), 1)
                : null,
        ];

        $pdf = Pdf::loadView('exports.daily_metric_pdf', [
            'athlete' => $athlete,
            'metrics' => $chronological->reverse()->values(),
            'baselineRhr' => $baselineRhr,
            'summary' => $summary,
            'insights' => $insights,
            'generatedAt' => Carbon::now()->format('d M Y, H:i'),
        ])->setPaper('a4', 'portrait');

        $filename = 'phynestra-quick-recovery-'.Str::slug($athlete->name).'.pdf';

        return $pdf->download($filename);
    }
}
