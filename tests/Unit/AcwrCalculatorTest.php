<?php

namespace Tests\Unit;

use App\Enums\AcwrZone;
use App\Enums\SessionType;
use App\Models\RpeSession;
use App\Services\Rpe\AcwrCalculator;
use Carbon\CarbonImmutable;
use Illuminate\Support\Collection;
use Tests\TestCase;

class AcwrCalculatorTest extends TestCase
{
    private AcwrCalculator $calculator;

    protected function setUp(): void
    {
        parent::setUp();
        $this->calculator = new AcwrCalculator;
    }

    private function makeSession(string $date, int $rpe, int $duration): RpeSession
    {
        $session = new RpeSession;
        $session->session_date = CarbonImmutable::parse($date);
        $session->session_type = SessionType::Training;
        $session->rpe = $rpe;
        $session->duration_minutes = $duration;
        $session->session_load = $rpe * $duration;

        return $session;
    }

    public function test_session_load_calculation(): void
    {
        $this->assertSame(630, $this->calculator->calculateSessionLoad(7, 90));
        $this->assertSame(0, $this->calculator->calculateSessionLoad(0, 90));
        $this->assertSame(0, $this->calculator->calculateSessionLoad(5, 0));
    }

    public function test_acwr_zone_classification_boundaries(): void
    {
        $this->assertSame(AcwrZone::NoData, AcwrZone::fromRatio(null));
        $this->assertSame(AcwrZone::Undertraining, AcwrZone::fromRatio(0.79));
        $this->assertSame(AcwrZone::Optimal, AcwrZone::fromRatio(0.80));
        $this->assertSame(AcwrZone::Optimal, AcwrZone::fromRatio(1.30));
        $this->assertSame(AcwrZone::Caution, AcwrZone::fromRatio(1.31));
        $this->assertSame(AcwrZone::Caution, AcwrZone::fromRatio(1.50));
        $this->assertSame(AcwrZone::HighRisk, AcwrZone::fromRatio(1.51));
    }

    public function test_multi_session_same_day_and_coupled_four_week_rolling_average(): void
    {
        // ISO Weeks (Mon-Sun):
        // W42 (12-18 Oct 2026): 1500 AU (two sessions on same day: 600 + 900)
        // W43 (19-25 Oct 2026): 1800 AU
        // W44 (26 Oct - 1 Nov 2026): 1900 AU
        // W45 (2-8 Nov 2026): 2800 AU
        // W46 (9-15 Nov 2026): 5200 AU -> Chronic = (1800+1900+2800+5200)/4 = 2925 -> ACWR = 1.78 (high_risk)
        $sessions = new Collection([
            $this->makeSession('2026-10-12', 6, 100), // 600
            $this->makeSession('2026-10-12', 9, 100), // 900 -> W42 total 1500
            $this->makeSession('2026-10-20', 9, 200), // 1800 -> W43
            $this->makeSession('2026-10-28', 10, 190), // 1900 -> W44
            $this->makeSession('2026-11-03', 8, 350), // 2800 -> W45
            $this->makeSession('2026-11-10', 10, 520), // 5200 -> W46
        ]);

        $weeks = $this->calculator->buildWeeklySummaries($sessions);

        $this->assertCount(5, $weeks);

        // Week 1 (k = 1)
        $this->assertSame('Minggu 1', $weeks[0]['week_label']);
        $this->assertSame('2026-10-12', $weeks[0]['week_start']);
        $this->assertSame('2026-10-18', $weeks[0]['week_end']);
        $this->assertSame(2, $weeks[0]['session_count']);
        $this->assertSame(1500, $weeks[0]['acute_load']);
        $this->assertSame(1500.0, $weeks[0]['chronic_load']);
        $this->assertSame(1, $weeks[0]['chronic_weeks_used']);
        $this->assertSame(1.0, $weeks[0]['acwr']);
        $this->assertSame('optimal', $weeks[0]['zone']);
        $this->assertNull($weeks[0]['week_change_pct']);

        // Week 2 (k = 2)
        $this->assertSame('Minggu 2', $weeks[1]['week_label']);
        $this->assertSame(1800, $weeks[1]['acute_load']);
        $this->assertSame(1650.0, $weeks[1]['chronic_load']);
        $this->assertSame(2, $weeks[1]['chronic_weeks_used']);
        $this->assertSame(1.09, $weeks[1]['acwr']);
        $this->assertSame(20.0, $weeks[1]['week_change_pct']);

        // Week 3 (k = 3)
        $this->assertSame(1900, $weeks[2]['acute_load']);
        $this->assertSame(1733.3, $weeks[2]['chronic_load']);
        $this->assertSame(3, $weeks[2]['chronic_weeks_used']);
        $this->assertSame(1.1, $weeks[2]['acwr']);

        // Week 4 (k = 4)
        $this->assertSame(2800, $weeks[3]['acute_load']);
        $this->assertSame(2000.0, $weeks[3]['chronic_load']);
        $this->assertSame(4, $weeks[3]['chronic_weeks_used']);
        $this->assertSame(1.4, $weeks[3]['acwr']);
        $this->assertSame('caution', $weeks[3]['zone']);

        // Week 5 (rolling window drops W42, uses W43..W46)
        $this->assertSame(5200, $weeks[4]['acute_load']);
        $this->assertSame(2925.0, $weeks[4]['chronic_load']);
        $this->assertSame(4, $weeks[4]['chronic_weeks_used']);
        $this->assertSame(1.78, $weeks[4]['acwr']);
        $this->assertSame('high_risk', $weeks[4]['zone']);
    }

    public function test_rest_week_in_middle_counts_as_zero_in_rolling_window(): void
    {
        // Week 1: 1000 AU, Week 2: rest (0 AU), Week 3: 1000 AU -> Chronic(W3) = (1000+0+1000)/3 = 666.7 -> ACWR = 1.50
        $sessions = new Collection([
            $this->makeSession('2026-10-12', 10, 100), // W42: 1000
            $this->makeSession('2026-10-26', 10, 100), // W44: 1000 (W43 skipped = 0)
        ]);

        $weeks = $this->calculator->buildWeeklySummaries($sessions);

        $this->assertCount(3, $weeks);
        $this->assertSame(0, $weeks[1]['acute_load']);
        $this->assertSame(500.0, $weeks[1]['chronic_load']);
        $this->assertSame(0.0, $weeks[1]['acwr']);
        $this->assertSame('undertraining', $weeks[1]['zone']);

        $this->assertSame(1000, $weeks[2]['acute_load']);
        $this->assertSame(666.7, $weeks[2]['chronic_load']);
        $this->assertSame(1.5, $weeks[2]['acwr']);
        $this->assertSame('caution', $weeks[2]['zone']);
    }

    public function test_monotony_and_strain_handle_identical_daily_loads_and_varied_loads(): void
    {
        // Identical load every single day of the week -> stdDev = 0 -> monotony = 0.0, strain = 0
        $uniformSessions = new Collection([
            $this->makeSession('2026-11-09', 5, 60),
            $this->makeSession('2026-11-10', 5, 60),
            $this->makeSession('2026-11-11', 5, 60),
            $this->makeSession('2026-11-12', 5, 60),
            $this->makeSession('2026-11-13', 5, 60),
            $this->makeSession('2026-11-14', 5, 60),
            $this->makeSession('2026-11-15', 5, 60),
        ]);

        $uniformWeeks = $this->calculator->buildWeeklySummaries($uniformSessions);
        $this->assertSame(0.0, $uniformWeeks[0]['monotony']);
        $this->assertSame(0, $uniformWeeks[0]['strain']);

        // Varied loads (3 active days + 4 rest days) -> monotony > 0, strain > 0
        $variedSessions = new Collection([
            $this->makeSession('2026-11-09', 6, 90), // 540
            $this->makeSession('2026-11-11', 8, 90), // 720
            $this->makeSession('2026-11-13', 4, 60), // 240
        ]);

        $variedWeeks = $this->calculator->buildWeeklySummaries($variedSessions);
        $this->assertGreaterThan(0.0, $variedWeeks[0]['monotony']);
        $this->assertGreaterThan(0, $variedWeeks[0]['strain']);
    }

    public function test_daily_loads_series_covers_exact_day_count_including_rest_days(): void
    {
        $sessions = new Collection([
            $this->makeSession('2026-11-16', 5, 60), // 300
            $this->makeSession('2026-11-16', 4, 30), // 120 -> 420
            $this->makeSession('2026-11-18', 7, 90), // 630
        ]);

        $points = $this->calculator->buildDailyLoads($sessions, CarbonImmutable::parse('2026-11-18'), 14);

        $this->assertCount(14, $points);
        $this->assertSame('2026-11-05', $points[0]['date']);
        $this->assertSame('2026-11-18', $points[13]['date']);
        $this->assertSame(420, $points[11]['daily_load']);
        $this->assertSame(2, $points[11]['session_count']);
        $this->assertSame(0, $points[12]['daily_load']);
        $this->assertSame(630, $points[13]['daily_load']);
    }

    public function test_weeks_anchor_from_athletes_first_rpe_date_midweek(): void
    {
        // Athlete starts on Wednesday 14 Oct 2026 -> Minggu 1 = 14-20 Oct, Minggu 2 = 21-27 Oct
        $sessions = new Collection([
            $this->makeSession('2026-10-14', 5, 60), // Day 1 -> Minggu 1 (300)
            $this->makeSession('2026-10-20', 5, 60), // Day 7 -> still Minggu 1 (+300 = 600)
            $this->makeSession('2026-10-21', 6, 100), // Day 8 -> Minggu 2 (600)
        ]);

        $weeks = $this->calculator->buildWeeklySummaries($sessions);

        $this->assertCount(2, $weeks);
        $this->assertSame('Minggu 1', $weeks[0]['week_label']);
        $this->assertSame('2026-10-14', $weeks[0]['week_start']);
        $this->assertSame('2026-10-20', $weeks[0]['week_end']);
        $this->assertSame(600, $weeks[0]['acute_load']);

        $this->assertSame('Minggu 2', $weeks[1]['week_label']);
        $this->assertSame('2026-10-21', $weeks[1]['week_start']);
        $this->assertSame('2026-10-27', $weeks[1]['week_end']);
        $this->assertSame(600, $weeks[1]['acute_load']);
    }
}
