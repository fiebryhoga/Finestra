<?php

namespace Tests\Feature;

use App\Enums\RecoveryStatus;
use App\Models\Athlete;
use App\Models\DailyMetric;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class TrackingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_tracking_endpoints(): void
    {
        $athlete = Athlete::factory()->create();
        $metric = DailyMetric::factory()->for($athlete)->create();

        $this->get(route('tracking.index'))->assertRedirect(route('login'));
        $this->get(route('tracking.show', $athlete))->assertRedirect(route('login'));
        $this->get(route('tracking.bulk', $athlete))->assertRedirect(route('login'));
        $this->post(route('tracking.metrics.store', $athlete), [])->assertRedirect(route('login'));
        $this->post(route('tracking.bulk.store', $athlete), [])->assertRedirect(route('login'));
        $this->post(route('tracking.start-date', $athlete), [])->assertRedirect(route('login'));
        $this->delete(route('tracking.metrics.destroy', [$athlete, $metric]))->assertRedirect(route('login'));
        $this->get(route('tracking.export-pdf', $athlete))->assertRedirect(route('login'));
    }

    public function test_tracking_index_displays_overview_stats_and_filters(): void
    {
        $user = User::factory()->create();

        $goodAthlete = Athlete::factory()->create(['name' => 'Budi Santoso']);
        DailyMetric::factory()->for($goodAthlete)->create([
            'record_date' => '2026-11-18',
            'quick_recovery_score' => 88,
            'recovery_status' => RecoveryStatus::Good,
        ]);

        $poorAthlete = Athlete::factory()->create(['name' => 'Citra Dewi']);
        DailyMetric::factory()->for($poorAthlete)->create([
            'record_date' => '2026-11-18',
            'quick_recovery_score' => 28,
            'recovery_status' => RecoveryStatus::Poor,
        ]);

        $emptyAthlete = Athlete::factory()->create(['name' => 'Dedi Pratama']);
        DailyMetric::factory()->for($emptyAthlete)->emptyRow()->create([
            'record_date' => '2026-11-18',
        ]);

        $this->actingAs($user)
            ->get(route('tracking.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('tracking/index')
                ->where('stats.total_athletes', 3)
                ->where('stats.tracked_athletes', 2)
                ->where('stats.avg_recovery_score', 58)
                ->where('stats.good_count', 1)
                ->where('stats.poor_count', 1)
                ->has('athletes.data', 3),
            );

        $this->actingAs($user)
            ->get(route('tracking.index', ['status' => 'poor']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('athletes.data', 1)
                ->where('athletes.data.0.name', 'Citra Dewi'),
            );

        $this->actingAs($user)
            ->get(route('tracking.index', ['status' => 'empty']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('athletes.data', 1)
                ->where('athletes.data.0.name', 'Dedi Pratama'),
            );

        $this->actingAs($user)
            ->get(route('tracking.index', ['search' => 'Budi']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('athletes.data', 1)
                ->where('athletes.data.0.name', 'Budi Santoso'),
            );
    }

    public function test_show_auto_generates_calendar_days_without_duplicating_existing_rows(): void
    {
        Carbon::setTestNow('2026-11-18 10:00:00');

        try {
            $user = User::factory()->create();
            $athlete = Athlete::factory()->create([
                'training_start_date' => '2026-11-15',
            ]);

            DailyMetric::factory()->for($athlete)->create([
                'record_date' => '2026-11-16',
                'rhr' => 56,
                'spo2' => 98,
                'recovery_status' => RecoveryStatus::Good,
                'quick_recovery_score' => 92,
            ]);

            $this->actingAs($user)
                ->get(route('tracking.show', $athlete))
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('tracking/show')
                    ->has('metrics', 4)
                    ->where('metrics.0.record_date', '2026-11-18')
                    ->where('metrics.0.week', 'Week 1, Day 4')
                    ->where('metrics.0.recovery_status', 'KOSONG')
                    ->where('metrics.2.record_date', '2026-11-16')
                    ->where('metrics.2.rhr', 56)
                    ->where('metrics.3.record_date', '2026-11-15')
                    ->where('metrics.3.week', 'Week 1, Day 1'),
                );

            // Second visit should not create duplicates
            $this->actingAs($user)->get(route('tracking.show', $athlete))->assertOk();
            $this->assertSame(4, $athlete->dailyMetrics()->count());
        } finally {
            Carbon::setTestNow();
        }
    }

    public function test_storing_daily_metric_calculates_exact_worked_example_and_recalculates_history(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create([
            'training_start_date' => '2026-11-10',
        ]);

        // Day 1: Baseline RHR = 54
        $this->actingAs($user)
            ->post(route('tracking.metrics.store', $athlete), [
                'record_date' => '2026-11-10',
                'rhr' => 54,
                'spo2' => 99,
                'vj' => 55,
                'weight' => 70,
                'age' => 24,
            ])
            ->assertRedirect();

        // Day 2: Worked Example (RHR=57, SpO2=98 -> QRS=77, RECOVERY BAIK)
        $this->actingAs($user)
            ->post(route('tracking.metrics.store', $athlete), [
                'record_date' => '2026-11-11',
                'rhr' => 57,
                'spo2' => 98,
                'vj' => 55,
                'weight' => 70,
                'age' => 24,
            ])
            ->assertRedirect();

        $day2 = DailyMetric::query()
            ->where('athlete_id', $athlete->id)
            ->whereDate('record_date', '2026-11-11')
            ->firstOrFail();

        $this->assertSame('Week 1, Day 2', $day2->week);
        $this->assertSame(191.2, $day2->hr_max);
        $this->assertSame(3.35, $day2->hr_ratio);
        $this->assertSame(51.32, $day2->vo2_max);
        $this->assertSame(4454.5, $day2->peak_power);
        $this->assertSame(77, $day2->quick_recovery_score);
        $this->assertSame(RecoveryStatus::Good, $day2->recovery_status);

        // Updating an existing date (upsert) must overwrite without unique constraint error
        $this->actingAs($user)
            ->post(route('tracking.metrics.store', $athlete), [
                'record_date' => '2026-11-11',
                'rhr' => 63,
                'spo2' => 94,
                'vj' => 50,
                'weight' => 70,
                'age' => 24,
            ])
            ->assertRedirect();

        $day2->refresh();
        $this->assertSame(2, $athlete->dailyMetrics()->count());
        $this->assertSame(63.0, $day2->rhr);
        $this->assertSame(RecoveryStatus::Poor, $day2->recovery_status);
    }

    public function test_setting_start_date_recalculates_week_labels_and_baseline_priority(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create([
            'training_start_date' => null,
        ]);

        // Store two days before training_start_date is configured
        $this->actingAs($user)->post(route('tracking.metrics.store', $athlete), [
            'record_date' => '2026-11-08',
            'rhr' => 60,
            'spo2' => 98,
            'vj' => 50,
            'weight' => 70,
            'age' => 22,
        ])->assertRedirect();

        $this->actingAs($user)->post(route('tracking.metrics.store', $athlete), [
            'record_date' => '2026-11-10',
            'rhr' => 50,
            'spo2' => 99,
            'vj' => 52,
            'weight' => 70,
            'age' => 22,
        ])->assertRedirect();

        // Set start date to 2026-11-10 so baseline RHR switches from 60 -> 50
        $this->actingAs($user)
            ->post(route('tracking.start-date', $athlete), [
                'training_start_date' => '2026-11-10',
            ])
            ->assertRedirect();

        $beforeProgram = DailyMetric::query()
            ->where('athlete_id', $athlete->id)
            ->whereDate('record_date', '2026-11-08')
            ->firstOrFail();

        $startDay = DailyMetric::query()
            ->where('athlete_id', $athlete->id)
            ->whereDate('record_date', '2026-11-10')
            ->firstOrFail();

        $this->assertSame('Sebelum Program', $beforeProgram->week);
        $this->assertSame('Week 1, Day 1', $startDay->week);
        $this->assertSame(100, $startDay->quick_recovery_score);

        // Before-program RHR 60 vs new baseline 50 (diff = +10 -> RHR score 1/10, SpO2 98 -> 5/6)
        // ((5/6 + 1/10) / 2) * 100 = 46.67 -> 47 (RECOVERY CUKUP)
        $this->assertSame(47, $beforeProgram->quick_recovery_score);
        $this->assertSame(RecoveryStatus::Fair, $beforeProgram->recovery_status);
    }

    public function test_bulk_store_saves_multiple_rows_and_recalculates(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create([
            'training_start_date' => '2026-11-10',
        ]);

        $this->actingAs($user)
            ->get(route('tracking.bulk', $athlete))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->component('tracking/bulk-input'));

        $this->actingAs($user)
            ->post(route('tracking.bulk.store', $athlete), [
                'rows' => [
                    [
                        'record_date' => '2026-11-10',
                        'rhr' => 54,
                        'spo2' => 99,
                        'vj' => 55,
                        'weight' => 70,
                        'age' => 24,
                    ],
                    [
                        'record_date' => '2026-11-11',
                        'rhr' => 57,
                        'spo2' => 98,
                        'vj' => 55,
                        'weight' => 70,
                        'age' => 24,
                    ],
                ],
            ])
            ->assertRedirect(route('tracking.show', $athlete));

        $this->assertSame(2, $athlete->dailyMetrics()->count());

        $day2 = DailyMetric::query()
            ->where('athlete_id', $athlete->id)
            ->whereDate('record_date', '2026-11-11')
            ->firstOrFail();

        $this->assertSame(77, $day2->quick_recovery_score);
        $this->assertSame(RecoveryStatus::Good, $day2->recovery_status);

        // Bulk upsert over an existing date must overwrite cleanly
        $this->actingAs($user)
            ->post(route('tracking.bulk.store', $athlete), [
                'rows' => [
                    [
                        'record_date' => '2026-11-11',
                        'rhr' => 63,
                        'spo2' => 94,
                        'vj' => 50,
                        'weight' => 70,
                        'age' => 24,
                    ],
                ],
            ])
            ->assertRedirect(route('tracking.show', $athlete));

        $day2->refresh();
        $this->assertSame(2, $athlete->dailyMetrics()->count());
        $this->assertSame(63.0, $day2->rhr);
        $this->assertSame(RecoveryStatus::Poor, $day2->recovery_status);
    }

    public function test_destroy_deletes_metric_and_blocks_cross_athlete_deletion(): void
    {
        $user = User::factory()->create();
        $athleteA = Athlete::factory()->create();
        $athleteB = Athlete::factory()->create();

        $metricA = DailyMetric::factory()->for($athleteA)->create([
            'record_date' => '2026-11-10',
            'rhr' => 52,
            'spo2' => 99,
        ]);

        $metricB = DailyMetric::factory()->for($athleteB)->create([
            'record_date' => '2026-11-10',
            'rhr' => 55,
            'spo2' => 98,
        ]);

        // Cross-athlete delete must return 404
        $this->actingAs($user)
            ->delete(route('tracking.metrics.destroy', [$athleteA, $metricB]))
            ->assertNotFound();

        $this->assertDatabaseHas('daily_metrics', ['id' => $metricB->id]);

        // Legitimate delete works
        $this->actingAs($user)
            ->delete(route('tracking.metrics.destroy', [$athleteA, $metricA]))
            ->assertRedirect();

        $this->assertDatabaseMissing('daily_metrics', ['id' => $metricA->id]);
    }

    public function test_export_pdf_streams_valid_pdf_with_and_without_insights(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create([
            'name' => 'Raka Wijaya',
            'training_start_date' => '2026-11-10',
        ]);

        DailyMetric::factory()->for($athlete)->create([
            'record_date' => '2026-11-10',
            'week' => 'Week 1, Day 1',
            'rhr' => 54,
            'spo2' => 99,
            'vj' => 55,
            'weight' => 70,
            'age' => 24,
            'quick_recovery_score' => 100,
            'recovery_status' => RecoveryStatus::Good,
        ]);

        $withInsights = $this->actingAs($user)
            ->get(route('tracking.export-pdf', ['athlete' => $athlete, 'include_insights' => 1]));

        $withInsights->assertOk();
        $withInsights->assertHeader('content-type', 'application/pdf');

        $withoutInsights = $this->actingAs($user)
            ->get(route('tracking.export-pdf', ['athlete' => $athlete, 'include_insights' => 0]));

        $withoutInsights->assertOk();
        $withoutInsights->assertHeader('content-type', 'application/pdf');
    }
}
