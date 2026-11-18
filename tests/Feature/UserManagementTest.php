<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_guests_cannot_access_user_management_endpoints(): void
    {
        $target = User::factory()->create();

        $this->get(route('users.index'))->assertRedirect(route('login'));
        $this->post(route('users.store'), [])->assertRedirect(route('login'));
        $this->patch(route('users.update', $target), [])->assertRedirect(route('login'));
        $this->put(route('users.password.update', $target), [])->assertRedirect(route('login'));
        $this->patch(route('users.toggle-status', $target))->assertRedirect(route('login'));
        $this->delete(route('users.destroy', $target))->assertRedirect(route('login'));
    }

    public function test_authenticated_users_can_view_users_index_with_stats(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);
        User::factory()->count(2)->create();
        User::factory()->inactive()->create();

        $this->actingAs($admin)
            ->get(route('users.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('users/index')
                ->where('stats.total', 4)
                ->where('stats.active', 3)
                ->where('stats.inactive', 1)
                ->has('users.data', 4)
                ->has('passwordRules'),
            );
    }

    public function test_users_can_be_searched_and_filtered_by_status(): void
    {
        $admin = User::factory()->create(['name' => 'Admin Utama', 'username' => 'admin']);
        User::factory()->create(['name' => 'Pelatih Fisik', 'username' => 'pelatih.fisik']);
        User::factory()->inactive()->create(['name' => 'Enumerator Lama', 'username' => 'enum.lama']);

        $this->actingAs($admin)
            ->get(route('users.index', ['search' => 'pelatih']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('users/index')
                ->where('filters.search', 'pelatih')
                ->has('users.data', 1)
                ->where('users.data.0.username', 'pelatih.fisik'),
            );

        $this->actingAs($admin)
            ->get(route('users.index', ['status' => 'inactive']))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('users/index')
                ->where('filters.status', 'inactive')
                ->has('users.data', 1)
                ->where('users.data.0.username', 'enum.lama'),
            );
    }

    public function test_admin_can_create_a_new_user_who_can_immediately_log_in(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);

        $response = $this->actingAs($admin)
            ->from(route('users.index'))
            ->post(route('users.store'), [
                'name' => 'Dr. Imam Marsudi',
                'username' => 'Imam.Marsudi',
                'password' => 'rahasia2026',
                'password_confirmation' => 'rahasia2026',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseHas('users', [
            'name' => 'Dr. Imam Marsudi',
            'username' => 'imam.marsudi',
            'is_active' => true,
        ]);

        $this->post(route('logout'));

        $this->post(route('login.store'), [
            'username' => 'imam.marsudi',
            'password' => 'rahasia2026',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticated();
    }

    public function test_creating_user_validates_unique_and_valid_username(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->post(route('users.store'), [
                'name' => 'Duplikat',
                'username' => 'ADMIN',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])
            ->assertSessionHasErrors('username');

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->post(route('users.store'), [
                'name' => 'Invalid Char',
                'username' => 'tidak valid!',
                'password' => 'password123',
                'password_confirmation' => 'password123',
            ])
            ->assertSessionHasErrors('username');
    }

    public function test_admin_can_update_user_details(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);
        $target = User::factory()->create(['name' => 'Nama Lama', 'username' => 'user.lama']);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->patch(route('users.update', $target), [
                'name' => 'Nama Baru',
                'username' => 'User.Baru',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('users.index'));

        $target->refresh();
        $this->assertSame('Nama Baru', $target->name);
        $this->assertSame('user.baru', $target->username);
    }

    public function test_updating_user_rejects_duplicate_username_of_another_user(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);
        $target = User::factory()->create(['username' => 'target.user']);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->patch(route('users.update', $target), [
                'name' => 'Target User',
                'username' => 'ADMIN',
            ])
            ->assertSessionHasErrors('username');
    }

    public function test_admin_can_reset_another_users_password(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);
        $target = User::factory()->create(['username' => 'pelatih']);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->put(route('users.password.update', $target), [
                'password' => 'sandi-baru-2026',
                'password_confirmation' => 'sandi-baru-2026',
            ])
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('users.index'));

        $this->assertTrue(Hash::check('sandi-baru-2026', $target->refresh()->password));

        $this->post(route('logout'));

        $this->post(route('login.store'), [
            'username' => 'pelatih',
            'password' => 'password',
        ]);
        $this->assertGuest();

        $this->post(route('login.store'), [
            'username' => 'pelatih',
            'password' => 'sandi-baru-2026',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticatedAs($target);
    }

    public function test_admin_can_deactivate_user_and_inactive_user_cannot_log_in(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);
        $target = User::factory()->create(['username' => 'enumerator']);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->patch(route('users.toggle-status', $target))
            ->assertRedirect(route('users.index'));

        $this->assertFalse($target->refresh()->is_active);

        $this->post(route('logout'));

        $this->from(route('login'))
            ->post(route('login.store'), [
                'username' => 'enumerator',
                'password' => 'password',
            ])
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('username');

        $this->assertGuest();
    }

    public function test_admin_cannot_deactivate_or_delete_their_own_account_from_user_management(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->patch(route('users.toggle-status', $admin))
            ->assertRedirect(route('users.index'));

        $this->assertTrue($admin->refresh()->is_active);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->delete(route('users.destroy', $admin))
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseHas('users', ['id' => $admin->id]);
    }

    public function test_admin_can_delete_another_user(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);
        $target = User::factory()->create(['username' => 'hapus.saya']);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->delete(route('users.destroy', $target))
            ->assertRedirect(route('users.index'));

        $this->assertDatabaseMissing('users', ['id' => $target->id]);
    }

    public function test_deactivated_user_with_existing_session_is_logged_out_on_next_request(): void
    {
        $user = User::factory()->inactive()->create(['username' => 'terkunci']);

        $response = $this->actingAs($user)->get(route('dashboard'));

        $response
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('username');

        $this->assertGuest();
    }

    public function test_admin_can_reactivate_inactive_user_and_allow_login_again(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);
        $target = User::factory()->inactive()->create(['username' => 'kembali.aktif']);

        $this->actingAs($admin)
            ->from(route('users.index'))
            ->patch(route('users.toggle-status', $target))
            ->assertRedirect(route('users.index'));

        $this->assertTrue($target->refresh()->is_active);

        $this->post(route('logout'));

        $this->post(route('login.store'), [
            'username' => 'kembali.aktif',
            'password' => 'password',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticatedAs($target);
    }

    public function test_pagination_and_invalid_status_filter_behave_cleanly(): void
    {
        $admin = User::factory()->create(['username' => 'admin']);
        User::factory()->count(12)->create();

        $this->actingAs($admin)
            ->get(route('users.index', ['status' => 'invalid-status', 'page' => 2]))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('users/index')
                ->where('filters.status', 'all')
                ->where('users.current_page', 2)
                ->where('users.total', 13)
                ->has('users.data', 3),
            );
    }
}
