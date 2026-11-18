<?php

namespace Tests\Feature;

use App\Enums\Gender;
use App\Models\Athlete;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AthleteManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_athlete_management_endpoints(): void
    {
        $athlete = Athlete::factory()->create();

        $this->get(route('athletes.index'))->assertRedirect(route('login'));
        $this->post(route('athletes.store'), [])->assertRedirect(route('login'));
        $this->patch(route('athletes.update', $athlete), [])->assertRedirect(route('login'));
        $this->delete(route('athletes.destroy', $athlete))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_athletes_index_with_stats(): void
    {
        $user = User::factory()->create();

        Athlete::factory()->create([
            'name' => 'Atlet Satu',
            'gender' => Gender::Male,
            'date_of_birth' => now()->subYears(20)->format('Y-m-d'),
            'weight_kg' => 65.0,
            'height_cm' => 170.0,
        ]);

        Athlete::factory()->create([
            'name' => 'Atlet Dua',
            'gender' => Gender::Female,
            'date_of_birth' => now()->subYears(24)->format('Y-m-d'),
            'weight_kg' => 75.0,
            'height_cm' => 180.0,
        ]);

        $this->actingAs($user)
            ->get(route('athletes.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('athletes/index')
                ->where('stats.total', 2)
                ->where('stats.avg_age', 22)
                ->where('stats.avg_weight_kg', 70)
                ->where('stats.avg_height_cm', 175)
                ->has('athletes.data', 2),
            );
    }

    public function test_athletes_can_be_searched_filtered_by_gender_and_sorted(): void
    {
        $user = User::factory()->create();

        Athlete::factory()->create([
            'name' => 'Zaki Ramadhan',
            'gender' => Gender::Male,
            'date_of_birth' => '2005-05-10',
        ]);
        Athlete::factory()->create([
            'name' => 'Ayu Lestari',
            'gender' => Gender::Female,
            'date_of_birth' => '2001-03-15',
        ]);

        $this->actingAs($user)
            ->get(route('athletes.index', ['search' => 'Ayu']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('athletes/index')
                ->where('filters.search', 'Ayu')
                ->has('athletes.data', 1)
                ->where('athletes.data.0.name', 'Ayu Lestari'),
            );

        $this->actingAs($user)
            ->get(route('athletes.index', ['gender' => 'female']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('athletes/index')
                ->where('filters.gender', 'female')
                ->has('athletes.data', 1)
                ->where('athletes.data.0.gender', 'female')
                ->where('athletes.data.0.gender_label', 'Perempuan'),
            );

        $this->actingAs($user)
            ->get(route('athletes.index', ['sort' => 'name_asc']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('athletes/index')
                ->where('filters.sort', 'name_asc')
                ->where('athletes.data.0.name', 'Ayu Lestari')
                ->where('athletes.data.1.name', 'Zaki Ramadhan'),
            );

        $this->actingAs($user)
            ->get(route('athletes.index', ['sort' => 'youngest']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('athletes/index')
                ->where('athletes.data.0.name', 'Zaki Ramadhan'),
            );
    }

    public function test_authenticated_user_can_create_an_athlete(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->from(route('athletes.index'))
            ->post(route('athletes.store'), [
                'name' => '  Rizky Pratama  ',
                'gender' => 'male',
                'date_of_birth' => '2004-06-15',
                'weight_kg' => '68.5',
                'height_cm' => '175.0',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('athletes.index'));

        $athlete = Athlete::query()->where('name', 'Rizky Pratama')->firstOrFail();

        $this->assertSame(Gender::Male, $athlete->gender);
        $this->assertSame('2004-06-15', $athlete->date_of_birth->format('Y-m-d'));
        $this->assertSame(68.5, $athlete->weight_kg);
        $this->assertSame(175.0, $athlete->height_cm);
        $this->assertSame(22.4, $athlete->bmi());
    }

    public function test_creating_athlete_validates_required_gender_and_physiological_bounds(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->from(route('athletes.index'))
            ->post(route('athletes.store'), [
                'name' => '',
                'gender' => 'unknown',
                'date_of_birth' => now()->addDay()->format('Y-m-d'),
                'weight_kg' => 10,
                'height_cm' => 300,
            ])
            ->assertRedirect(route('athletes.index'))
            ->assertSessionHasErrors([
                'name',
                'gender',
                'date_of_birth',
                'weight_kg',
                'height_cm',
            ]);
    }

    public function test_authenticated_user_can_update_an_athlete(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create([
            'name' => 'Nama Lama',
            'gender' => Gender::Male,
            'date_of_birth' => '2003-01-10',
            'weight_kg' => 64.0,
            'height_cm' => 171.0,
        ]);

        $this->actingAs($user)
            ->from(route('athletes.index'))
            ->patch(route('athletes.update', $athlete), [
                'name' => 'Nama Baru',
                'gender' => 'female',
                'date_of_birth' => '2002-08-20',
                'weight_kg' => 70.5,
                'height_cm' => 176.5,
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('athletes.index'));

        $athlete->refresh();

        $this->assertSame('Nama Baru', $athlete->name);
        $this->assertSame(Gender::Female, $athlete->gender);
        $this->assertSame('2002-08-20', $athlete->date_of_birth->format('Y-m-d'));
        $this->assertSame(70.5, $athlete->weight_kg);
        $this->assertSame(176.5, $athlete->height_cm);
    }

    public function test_authenticated_user_can_soft_delete_an_athlete(): void
    {
        $user = User::factory()->create();
        $athlete = Athlete::factory()->create(['name' => 'Atlet Arsip']);

        $this->actingAs($user)
            ->from(route('athletes.index'))
            ->delete(route('athletes.destroy', $athlete))
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('athletes.index'));

        $this->assertSoftDeleted('athletes', ['id' => $athlete->id]);

        $this->actingAs($user)
            ->get(route('athletes.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->where('stats.total', 0)
                ->has('athletes.data', 0),
            );
    }

    public function test_pagination_and_invalid_filters_behave_cleanly(): void
    {
        $user = User::factory()->create();
        Athlete::factory()->count(13)->create();

        $this->actingAs($user)
            ->get(route('athletes.index', ['gender' => 'invalid', 'sort' => 'tidak-valid', 'page' => 2]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('athletes/index')
                ->where('filters.gender', 'all')
                ->where('filters.sort', 'latest')
                ->where('athletes.current_page', 2)
                ->where('athletes.total', 13)
                ->has('athletes.data', 3),
            );
    }

    public function test_updating_nonexistent_athlete_returns_custom_404(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->patch('/athletes/99999', [
                'name' => 'Ghost',
                'gender' => 'male',
                'date_of_birth' => '2003-01-01',
                'weight_kg' => 65,
                'height_cm' => 170,
            ])
            ->assertNotFound();
    }
}
