<?php

namespace App\Http\Controllers;

use App\Enums\AcwrZone;
use App\Enums\SessionType;
use App\Http\Requests\Rpe\StoreRpeSessionRequest;
use App\Http\Requests\Rpe\StoreTeamRpeSessionRequest;
use App\Http\Requests\Rpe\UpdateRpeSessionRequest;
use App\Models\Athlete;
use App\Models\RpeSession;
use App\Services\Rpe\AcwrCalculator;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\CarbonInterface;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\Response as HttpResponse;

class RpeController extends Controller
{
    public function __construct(
        private readonly AcwrCalculator $calculator,
    ) {}

    /**
     * Display the squad RPE & ACWR Weekly overview list.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $zoneFilter = $request->string('zone', 'all')->toString();

        $allowedZones = ['all', 'optimal', 'caution', 'high_risk', 'undertraining', 'no_data'];

        if (! in_array($zoneFilter, $allowedZones, true)) {
            $zoneFilter = 'all';
        }

        $today = Carbon::today();
        $currentWeekMonday = $today->copy()->startOfWeek(CarbonInterface::MONDAY)->toDateString();
        $currentWeekSunday = $today->copy()->endOfWeek(CarbonInterface::SUNDAY)->toDateString();

        $allAthletes = Athlete::query()
            ->with(['rpeSessions' => fn ($query) => $query->orderBy('session_date')])
            ->orderBy('name')
            ->get();

        $sessionsThisWeekTotal = 0;
        $acwrValues = [];
        $optimalCount = 0;
        $cautionCount = 0;
        $highRiskCount = 0;
        $undertrainingCount = 0;

        $mapped = $allAthletes->map(function (Athlete $athlete) use (
            $currentWeekMonday,
            $currentWeekSunday,
            &$sessionsThisWeekTotal,
            &$acwrValues,
            &$optimalCount,
            &$cautionCount,
            &$highRiskCount,
            &$undertrainingCount,
        ): array {
            $summaries = $this->calculator->buildWeeklySummaries($athlete->rpeSessions);
            $latestWeek = $summaries !== [] ? $summaries[count($summaries) - 1] : null;

            $thisWeekSessions = $athlete->rpeSessions->filter(function (RpeSession $session) use ($currentWeekMonday, $currentWeekSunday): bool {
                $dateStr = $session->session_date->format('Y-m-d');

                return $dateStr >= $currentWeekMonday && $dateStr <= $currentWeekSunday;
            })->count();

            $sessionsThisWeekTotal += $thisWeekSessions;

            $zoneValue = $latestWeek !== null ? $latestWeek['zone'] : AcwrZone::NoData->value;
            $acwr = $latestWeek !== null ? $latestWeek['acwr'] : null;

            if ($acwr !== null) {
                $acwrValues[] = $acwr;
            }

            match ($zoneValue) {
                AcwrZone::Optimal->value => $optimalCount++,
                AcwrZone::Caution->value => $cautionCount++,
                AcwrZone::HighRisk->value => $highRiskCount++,
                AcwrZone::Undertraining->value => $undertrainingCount++,
                default => null,
            };

            return [
                'id' => $athlete->id,
                'name' => $athlete->name,
                'gender_label' => $athlete->gender->label(),
                'age' => $athlete->age(),
                'total_sessions' => $athlete->rpeSessions->count(),
                'sessions_this_week' => $thisWeekSessions,
                'latest_week' => $latestWeek !== null ? [
                    'week_label' => $latestWeek['week_label'],
                    'week_range' => $latestWeek['week_range'],
                    'session_count' => $latestWeek['session_count'],
                    'acute_load' => $latestWeek['acute_load'],
                    'chronic_load' => $latestWeek['chronic_load'],
                    'chronic_weeks_used' => $latestWeek['chronic_weeks_used'],
                    'acwr' => $latestWeek['acwr'],
                    'zone' => $latestWeek['zone'],
                    'zone_label' => $latestWeek['zone_label'],
                    'week_change_pct' => $latestWeek['week_change_pct'],
                ] : null,
            ];
        });

        $filtered = $mapped->filter(function (array $item) use ($search, $zoneFilter): bool {
            if ($search !== '' && ! Str::contains(Str::lower($item['name']), Str::lower($search))) {
                return false;
            }

            if ($zoneFilter === 'all') {
                return true;
            }

            $itemZone = $item['latest_week'] !== null
                ? $item['latest_week']['zone']
                : AcwrZone::NoData->value;

            return $itemZone === $zoneFilter;
        })->values();

        $perPage = 10;
        $currentPage = max(1, $request->integer('page', 1));
        $pageItems = $filtered->slice(($currentPage - 1) * $perPage, $perPage)->values();

        $paginator = new LengthAwarePaginator(
            $pageItems,
            $filtered->count(),
            $perPage,
            $currentPage,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ],
        );

        $avgAcwr = $acwrValues !== []
            ? round(array_sum($acwrValues) / count($acwrValues), 2)
            : null;

        return Inertia::render('rpe/index', [
            'athletes' => $paginator,
            'filters' => [
                'search' => $search,
                'zone' => $zoneFilter,
            ],
            'stats' => [
                'total_athletes' => $allAthletes->count(),
                'sessions_this_week' => $sessionsThisWeekTotal,
                'avg_acwr' => $avgAcwr,
                'optimal_count' => $optimalCount,
                'caution_count' => $cautionCount,
                'high_risk_count' => $highRiskCount,
                'undertraining_count' => $undertrainingCount,
            ],
            'currentWeekLabel' => sprintf(
                '%s – %s',
                $today->copy()->startOfWeek(CarbonInterface::MONDAY)->format('d M'),
                $today->copy()->endOfWeek(CarbonInterface::SUNDAY)->format('d M Y'),
            ),
        ]);
    }

    /**
     * Show the Team Session Bulk RPE input page.
     */
    public function teamInput(): Response
    {
        $today = Carbon::today();

        $athletes = Athlete::query()
            ->orderBy('name')
            ->get()
            ->map(fn (Athlete $athlete): array => [
                'id' => $athlete->id,
                'name' => $athlete->name,
                'gender_label' => $athlete->gender->label(),
                'age' => $athlete->age(),
            ])
            ->all();

        $sessionTypes = array_map(
            fn (SessionType $type): array => [
                'value' => $type->value,
                'label' => $type->label(),
            ],
            SessionType::cases(),
        );

        return Inertia::render('rpe/team-input', [
            'athletes' => $athletes,
            'sessionTypes' => $sessionTypes,
            'today' => $today->format('Y-m-d'),
        ]);
    }

    /**
     * Store RPE sessions for multiple athletes in one atomic team session.
     */
    public function storeTeam(StoreTeamRpeSessionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $sessionDate = Carbon::parse((string) $validated['session_date'])->toDateString();
        $sessionType = SessionType::from((string) $validated['session_type']);
        $notes = isset($validated['notes']) && $validated['notes'] !== ''
            ? (string) $validated['notes']
            : null;

        /** @var array<int, array{athlete_id: int|string, duration_minutes: int|string, rpe: int|string}> $entries */
        $entries = $validated['entries'];

        DB::transaction(function () use ($entries, $sessionDate, $sessionType, $notes): void {
            foreach ($entries as $entry) {
                $rpe = (int) $entry['rpe'];
                $duration = (int) $entry['duration_minutes'];

                RpeSession::query()->create([
                    'athlete_id' => (int) $entry['athlete_id'],
                    'session_date' => $sessionDate,
                    'session_type' => $sessionType,
                    'duration_minutes' => $duration,
                    'rpe' => $rpe,
                    'session_load' => $this->calculator->calculateSessionLoad($rpe, $duration),
                    'notes' => $notes,
                ]);
            }
        });

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => count($entries).' catatan sesi RPE tim berhasil disimpan.',
        ]);

        return to_route('rpe.index');
    }

    /**
     * Show an athlete's RPE session history, weekly ACWR table, and workload charts.
     */
    public function show(Athlete $athlete): Response
    {
        $today = Carbon::today();
        $sessions = $athlete->rpeSessions()
            ->orderBy('session_date')
            ->orderBy('id')
            ->get();

        $weeklyChronological = $this->calculator->buildWeeklySummaries($sessions);
        $latestWeek = $weeklyChronological !== []
            ? $weeklyChronological[count($weeklyChronological) - 1]
            : null;

        $lastSession = $sessions->last();
        $latestSessionDate = $lastSession !== null ? $lastSession->session_date : $today;
        $dailyEndDate = $latestSessionDate->gt($today) ? $latestSessionDate : $today;
        $dailyLoads = $this->calculator->buildDailyLoads($sessions, $dailyEndDate, 14);
        $insights = $this->calculator->generateLoadInsights($weeklyChronological);

        $firstSession = $sessions->first();
        $firstSessionDate = $firstSession !== null ? $firstSession->session_date : $today;

        $sessionRecords = $sessions->reverse()->values()->map(fn (RpeSession $session): array => [
            'id' => $session->id,
            'session_date' => $session->session_date->format('Y-m-d'),
            'session_date_formatted' => $session->session_date->format('d M Y'),
            'iso_week' => $this->calculator->weekLabelFromFirstDate($firstSessionDate, $session->session_date),
            'session_type' => $session->session_type->value,
            'session_type_label' => $session->session_type->label(),
            'duration_minutes' => $session->duration_minutes,
            'rpe' => $session->rpe,
            'session_load' => $session->session_load,
            'notes' => $session->notes,
        ])->all();

        $sessionTypes = array_map(
            fn (SessionType $type): array => [
                'value' => $type->value,
                'label' => $type->label(),
            ],
            SessionType::cases(),
        );

        return Inertia::render('rpe/show', [
            'athlete' => [
                'id' => $athlete->id,
                'name' => $athlete->name,
                'gender_label' => $athlete->gender->label(),
                'age' => $athlete->age(),
                'weight_kg' => $athlete->weight_kg,
                'height_cm' => $athlete->height_cm,
            ],
            'latestWeek' => $latestWeek,
            'weeklySummaries' => array_reverse($weeklyChronological),
            'dailyLoads' => $dailyLoads,
            'insights' => $insights,
            'sessions' => $sessionRecords,
            'sessionTypes' => $sessionTypes,
            'today' => $today->format('Y-m-d'),
        ]);
    }

    /**
     * Store a single RPE session for an athlete.
     */
    public function store(StoreRpeSessionRequest $request, Athlete $athlete): RedirectResponse
    {
        $validated = $request->validated();
        $rpe = (int) $validated['rpe'];
        $duration = (int) $validated['duration_minutes'];

        RpeSession::query()->create([
            'athlete_id' => $athlete->id,
            'session_date' => Carbon::parse((string) $validated['session_date'])->toDateString(),
            'session_type' => SessionType::from((string) $validated['session_type']),
            'duration_minutes' => $duration,
            'rpe' => $rpe,
            'session_load' => $this->calculator->calculateSessionLoad($rpe, $duration),
            'notes' => isset($validated['notes']) && $validated['notes'] !== ''
                ? (string) $validated['notes']
                : null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sesi RPE berhasil dicatat dan ACWR mingguan diperbarui.',
        ]);

        return back();
    }

    /**
     * Update an existing RPE session for an athlete.
     */
    public function update(UpdateRpeSessionRequest $request, Athlete $athlete, RpeSession $rpeSession): RedirectResponse
    {
        abort_unless($rpeSession->athlete_id === $athlete->id, 404);

        $validated = $request->validated();
        $rpe = (int) $validated['rpe'];
        $duration = (int) $validated['duration_minutes'];

        $rpeSession->update([
            'session_date' => Carbon::parse((string) $validated['session_date'])->toDateString(),
            'session_type' => SessionType::from((string) $validated['session_type']),
            'duration_minutes' => $duration,
            'rpe' => $rpe,
            'session_load' => $this->calculator->calculateSessionLoad($rpe, $duration),
            'notes' => isset($validated['notes']) && $validated['notes'] !== ''
                ? (string) $validated['notes']
                : null,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sesi RPE berhasil diperbarui.',
        ]);

        return back();
    }

    /**
     * Delete an RPE session for an athlete.
     */
    public function destroy(Athlete $athlete, RpeSession $rpeSession): RedirectResponse
    {
        abort_unless($rpeSession->athlete_id === $athlete->id, 404);

        $rpeSession->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Sesi RPE berhasil dihapus.',
        ]);

        return back();
    }

    /**
     * Export an athlete's Weekly ACWR & RPE report as A4 Portrait PDF.
     */
    public function exportPdf(Athlete $athlete): HttpResponse
    {
        $sessions = $athlete->rpeSessions()
            ->orderBy('session_date')
            ->orderBy('id')
            ->get();

        $weeklyChronological = $this->calculator->buildWeeklySummaries($sessions);
        $latestWeek = $weeklyChronological !== []
            ? $weeklyChronological[count($weeklyChronological) - 1]
            : null;
        $insights = $this->calculator->generateLoadInsights($weeklyChronological);

        $pdf = Pdf::loadView('exports.rpe_weekly_pdf', [
            'athlete' => $athlete,
            'latestWeek' => $latestWeek,
            'weeklySummaries' => array_reverse($weeklyChronological),
            'recentSessions' => $sessions->reverse()->take(20)->values(),
            'totalSessions' => $sessions->count(),
            'insights' => $insights,
            'generatedAt' => Carbon::now()->format('d M Y, H:i'),
        ])->setPaper('a4', 'portrait');

        $filename = 'phynestra-rpe-acwr-'.Str::slug($athlete->name).'.pdf';

        return $pdf->download($filename);
    }
}
