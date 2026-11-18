<?php

namespace Tests\Feature;

use App\Enums\SessionType;
use App\Models\Athlete;
use App\Models\RpeSession;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class RpeTrackingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_rpe_endpoints(): void
    {
        $athlete = Athlete::factory()->create();
        $session = RpeSession::factory()->for($athlete)->create();

        $this->get(route('rpe.index'))->assertRedirect(route('login'));
        $this->get(route('rpe.team-input'))->assertRedirect(route('login'));
        $this->post(route('rpe.team-input.store'), [])->assertRedirect(route('login'));
        $this->get(route('rpe.show', $athlete))->assertRedirect(route('login'));
        $this->post(route('rpe.sessions.store', $athlete), [])->assertRedirect(route('login'));
        $this->patch(route('rpe.sessions.update', [$athlete, $session]), [])->assertRedirect(route('login'));
        $this->delete(route('rpe.sessions.destroy', [$athlete, $session]))->assertRedirect(route('login'));
        $this->get(route('rpe.export-pdf', $athlete))->assertRedirect(route('login'));
    }

    public function test_rpe_index_displays_squad_acwr_overview_and_filters_by_zone_and_search(): void
    {
        $user = User::factory()->create();

        // Optimal athlete (1 week -> ACWR = 1.00)
        $optimalAthlete = Athlete::factory()->create(['name' => 'Andi Pratama']);
        RpeSession::factory()->for($optimalAthlete)->create([
            'session_date' => '2026-11-10',
            'rpe' => 6,
            'duration_minutes' => 90,
            'session_load' => 540,
        ]);

        // High-risk athlete (W44: 500, W45: 500, W46: 2500 -> Chronic 1166.7, ACWR 2.14)
        $highRiskAthlete = Athlete::factory()->create(['name' => 'Bima Sakti']);
        RpeSession::factory()->for($highRiskAthlete)->create([
            'session_date' => '2026-10-27',
            'rpe' => 5,
            'duration_minutes' => 100,
            'session_load' => 500,
        ]);
        RpeSession::factory()->for($highRiskAthlete)->create([
            'session_date' => '2026-11-03',
            'rpe' => 5,
            'duration_minutes' => 100,
            'session_load' => 500,
        ]);
        RpeSession::factory()->for($highRiskAthlete)->create([
            'session_date' => '2026-11-10',
            'rpe' => 10,
            'duration_minutes' => 250,
            'session_load' => 2500,
        ]);

        // No-data athlete
        Athlete::factory()->create(['name' => 'Candra Wijaya']);

        $this->actingAs($user)
            ->get(route('rpe.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('rpe/index')
                ->where('stats.total_athletes', 3)
                ->where('stats.optimal_count', 1)
                ->where('stats.high_risk_count', 1)
                ->has('athletes.data', 3),
            );

        $this->actingAs($user)
            ->get(route('rpe.index', ['zone' => 'high_risk']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('athletes.data', 1)
                ->where('athletes.data.0.name', 'Bima Sakti'),
            );

        $this->actingAs($user)
            ->get(route('rpe.index', ['zone' => 'no_data']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('athletes.data', 1)
                ->where('athletes.data.0.name', 'Candra Wijaya'),
            );

        $this->actingAs($user)
            ->get(route('rpe.index', ['search' => 'Andi']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('athletes.data', 1)
                ->where('athletes.data.0.name', 'Andi Pratama'),
            );
    }

    public function test_athlete_can_record_multiple_rpe_sessions_on_same_day_update_and_delete(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create();
        $otherAthlete = Athlete::factory()->create();

        // Morning session
        $this->actingAs($user)
            ->post(route('rpe.sessions.store', $athlete), [
                'session_date' => '2026-11-18',
                'session_type' => SessionType::Conditioning->value,
                'duration_minutes' => 60,
                'rpe' => 6,
                'notes' => 'Sesi pagi',
            ])
            ->assertRedirect();

        // Afternoon session (same date!)
        $this->actingAs($user)
            ->post(route('rpe.sessions.store', $athlete), [
                'session_date' => '2026-11-18',
                'session_type' => SessionType::Tactical->value,
                'duration_minutes' => 90,
                'rpe' => 7,
                'notes' => 'Sesi sore',
            ])
            ->assertRedirect();

        $this->assertSame(2, $athlete->rpeSessions()->count());

        // Show page aggregates both sessions into 1 ISO week (360 + 630 = 990 AU)
        $this->actingAs($user)
            ->get(route('rpe.show', $athlete))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('rpe/show')
                ->where('latestWeek.session_count', 2)
                ->where('latestWeek.acute_load', 990)
                ->where('latestWeek.acwr', 1)
                ->has('sessions', 2)
                ->has('dailyLoads', 14),
            );

        $session = $athlete->rpeSessions()->firstOrFail();

        // Update session recalculates session_load
        $this->actingAs($user)
            ->patch(route('rpe.sessions.update', [$athlete, $session]), [
                'session_date' => '2026-11-18',
                'session_type' => SessionType::Match->value,
                'duration_minutes' => 90,
                'rpe' => 9,
                'notes' => 'Pertandingan uji coba',
            ])
            ->assertRedirect();

        $session->refresh();
        $this->assertSame(810, $session->session_load);
        $this->assertSame(SessionType::Match, $session->session_type);

        // Cross-athlete update & delete must return 404
        $this->actingAs($user)
            ->patch(route('rpe.sessions.update', [$otherAthlete, $session]), [
                'session_date' => '2026-11-18',
                'session_type' => SessionType::Training->value,
                'duration_minutes' => 60,
                'rpe' => 5,
            ])
            ->assertNotFound();

        $this->actingAs($user)
            ->delete(route('rpe.sessions.destroy', [$otherAthlete, $session]))
            ->assertNotFound();

        // Legitimate delete works
        $this->actingAs($user)
            ->delete(route('rpe.sessions.destroy', [$athlete, $session]))
            ->assertRedirect();

        $this->assertDatabaseMissing('rpe_sessions', ['id' => $session->id]);
    }

    public function test_team_session_bulk_input_saves_multiple_athletes_atomically(): void
    {
        $user = User::factory()->create();
        $athleteA = Athlete::factory()->create(['name' => 'Atlet A']);
        $athleteB = Athlete::factory()->create(['name' => 'Atlet B']);

        $this->actingAs($user)
            ->get(route('rpe.team-input'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('rpe/team-input')
                ->has('athletes', 2),
            );

        $this->actingAs($user)
            ->post(route('rpe.team-input.store'), [
                'session_date' => '2026-11-18',
                'session_type' => SessionType::Training->value,
                'notes' => 'Latihan tim sore',
                'entries' => [
                    [
                        'athlete_id' => $athleteA->id,
                        'duration_minutes' => 90,
                        'rpe' => 6,
                    ],
                    [
                        'athlete_id' => $athleteB->id,
                        'duration_minutes' => 75,
                        'rpe' => 8,
                    ],
                ],
            ])
            ->assertRedirect(route('rpe.index'));

        $this->assertDatabaseHas('rpe_sessions', [
            'athlete_id' => $athleteA->id,
            'session_load' => 540,
            'notes' => 'Latihan tim sore',
        ]);

        $this->assertDatabaseHas('rpe_sessions', [
            'athlete_id' => $athleteB->id,
            'session_load' => 600,
            'notes' => 'Latihan tim sore',
        ]);
    }

    public function test_rpe_validation_rejects_out_of_range_values(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create();

        $this->actingAs($user)
            ->post(route('rpe.sessions.store', $athlete), [
                'session_date' => '2026-11-18',
                'session_type' => 'training',
                'duration_minutes' => 0,
                'rpe' => 11,
            ])
            ->assertSessionHasErrors(['duration_minutes', 'rpe']);
    }

    public function test_export_pdf_streams_valid_weekly_acwr_pdf(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create(['name' => 'Dimas Saputra']);

        RpeSession::factory()->for($athlete)->create([
            'session_date' => '2026-11-10',
            'rpe' => 7,
            'duration_minutes' => 90,
            'session_load' => 630,
        ]);

        $response = $this->actingAs($user)
            ->get(route('rpe.export-pdf', $athlete));

        $response->assertOk();
        $response->assertHeader('content-type', 'application/pdf');
    }
}
