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

class DashboardTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_visit_the_dashboard(): void
    {
        $user = User::factory()->create();
        $this->actingAs($user);

        $response = $this->get(route('dashboard'));
        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('dashboard')
                ->where('auth.user.username', $user->username)
                ->where('stats.total_athletes', 0)
                ->where('stats.tracked_athletes', 0)
                ->where('stats.avg_readiness_7d', null)
                ->has('alerts', 0)
                ->has('recentMetrics', 0),
            );
    }

    public function test_dashboard_aggregates_readiness_alerts_and_excludes_empty_calendar_rows(): void
    {
        Carbon::setTestNow('2026-11-18 10:00:00');

        try {
            $user = User::factory()->create();

            // Athlete 1: Optimal Fit (QRS 88)
            $optimalAthlete = Athlete::factory()->create(['name' => 'Atlet Optimal']);
            DailyMetric::factory()->for($optimalAthlete)->create([
                'record_date' => '2026-11-18',
                'rhr' => 56,
                'spo2' => 99,
                'quick_recovery_score' => 88,
                'recovery_status' => RecoveryStatus::Good,
            ]);

            // Athlete 2: Low readiness alert (QRS 32, Poor)
            $poorAthlete = Athlete::factory()->create(['name' => 'Atlet Lelah']);
            DailyMetric::factory()->for($poorAthlete)->create([
                'record_date' => '2026-11-18',
                'rhr' => 70,
                'spo2' => 95,
                'quick_recovery_score' => 32,
                'recovery_status' => RecoveryStatus::Poor,
            ]);

            // Athlete 3: Elevated RHR alert (> 85 bpm, QRS 72)
            $highRhrAthlete = Athlete::factory()->create(['name' => 'Atlet RHR Tinggi']);
            DailyMetric::factory()->for($highRhrAthlete)->create([
                'record_date' => '2026-11-18',
                'rhr' => 88,
                'spo2' => 98,
                'quick_recovery_score' => 72,
                'recovery_status' => RecoveryStatus::Fair,
            ]);

            // Athlete 4: Only has an auto-generated KOSONG row -> must NOT pull down avg or trigger alerts
            $emptyAthlete = Athlete::factory()->create(['name' => 'Atlet Kosong']);
            DailyMetric::factory()->for($emptyAthlete)->emptyRow()->create([
                'record_date' => '2026-11-18',
            ]);

            $this->actingAs($user)
                ->get(route('dashboard'))
                ->assertOk()
                ->assertInertia(fn (Assert $page) => $page
                    ->component('dashboard')
                    ->where('stats.total_athletes', 4)
                    ->where('stats.tracked_athletes', 3)
                    ->where('stats.avg_readiness_7d', 64)
                    ->where('stats.optimal_fit', 1)
                    ->where('stats.fatigue_warning', 1)
                    ->where('stats.in_recovery', 1)
                    ->has('alerts', 2)
                    ->where('alerts.0.athlete_name', 'Atlet Lelah')
                    ->where('alerts.0.severity', 'rose')
                    ->where('alerts.1.athlete_name', 'Atlet RHR Tinggi')
                    ->where('alerts.1.severity', 'amber')
                    ->has('recentMetrics', 3),
                );
        } finally {
            Carbon::setTestNow();
        }
    }
}
