<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ProfileUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_profile_page_is_displayed(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->get(route('profile.edit'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/profile'),
            );
    }

    public function test_profile_information_can_be_updated(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Dr. Peneliti',
                'username' => 'peneliti.unesa',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $user->refresh();

        $this->assertSame('Dr. Peneliti', $user->name);
        $this->assertSame('peneliti.unesa', $user->username);
    }

    public function test_username_is_stored_in_lowercase_so_the_user_can_still_log_in(): void
    {
        $user = User::factory()->create();

        $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Pelatih Utama',
                'username' => 'Pelatih.Utama',
            ])
            ->assertSessionHasNoErrors();

        $this->assertSame('pelatih.utama', $user->refresh()->username);

        $this->post(route('logout'));

        $this->post(route('login.store'), [
            'username' => 'Pelatih.Utama',
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
    }

    public function test_username_must_be_unique_regardless_of_case(): void
    {
        User::factory()->create(['username' => 'taken.user']);

        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->patch(route('profile.update'), [
                'name' => 'Test User',
                'username' => 'Taken.User',
            ]);

        $response
            ->assertSessionHasErrors('username')
            ->assertRedirect(route('profile.edit'));
    }

    public function test_user_can_keep_their_existing_username_when_updating_name(): void
    {
        $user = User::factory()->create(['username' => 'same.user']);

        $response = $this
            ->actingAs($user)
            ->patch(route('profile.update'), [
                'name' => 'Nama Baru',
                'username' => 'same.user',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('profile.edit'));

        $this->assertSame('Nama Baru', $user->refresh()->name);
    }

    public function test_user_can_delete_their_account(): void
    {
        User::factory()->create();
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('home'));

        $this->assertGuest();
        $this->assertNull($user->fresh());
    }

    public function test_last_remaining_active_user_cannot_delete_their_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), [
                'password' => 'password',
            ]);

        $response->assertRedirect(route('profile.edit'));

        $this->assertAuthenticatedAs($user);
        $this->assertNotNull($user->fresh());
    }

    public function test_correct_password_must_be_provided_to_delete_account(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('profile.edit'))
            ->delete(route('profile.destroy'), [
                'password' => 'wrong-password',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('profile.edit'));

        $this->assertNotNull($user->fresh());
    }
}
