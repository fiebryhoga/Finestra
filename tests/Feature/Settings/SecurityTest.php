<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class SecurityTest extends TestCase
{
    use RefreshDatabase;

    public function test_security_page_is_displayed_directly_for_authenticated_users(): void
    {
        $user = User::factory()->create();

        $this->actingAs($user)
            ->get(route('security.edit'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('settings/security')
                ->has('passwordRules'),
            );
    }

    public function test_guests_cannot_access_security_page(): void
    {
        $this->get(route('security.edit'))
            ->assertRedirect(route('login'));
    }

    public function test_password_can_be_updated_and_used_to_log_in_again(): void
    {
        $user = User::factory()->create(['username' => 'pelatih']);

        $response = $this
            ->actingAs($user)
            ->from(route('security.edit'))
            ->put(route('user-password.update'), [
                'current_password' => 'password',
                'password' => 'new-secure-password',
                'password_confirmation' => 'new-secure-password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('security.edit'));

        $this->assertTrue(Hash::check('new-secure-password', $user->refresh()->password));

        $this->post(route('logout'));

        // Old password must be rejected
        $this->post(route('login.store'), [
            'username' => 'pelatih',
            'password' => 'password',
        ]);
        $this->assertGuest();

        // New password must succeed
        $this->post(route('login.store'), [
            'username' => 'pelatih',
            'password' => 'new-secure-password',
        ])->assertRedirect(route('dashboard', absolute: false));

        $this->assertAuthenticatedAs($user);
    }

    public function test_correct_password_must_be_provided_to_update_password(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('security.edit'))
            ->put(route('user-password.update'), [
                'current_password' => 'wrong-password',
                'password' => 'new-secure-password',
                'password_confirmation' => 'new-secure-password',
            ]);

        $response
            ->assertSessionHasErrors('current_password')
            ->assertRedirect(route('security.edit'));
    }

    public function test_password_confirmation_must_match_when_updating_password(): void
    {
        $user = User::factory()->create();

        $response = $this
            ->actingAs($user)
            ->from(route('security.edit'))
            ->put(route('user-password.update'), [
                'current_password' => 'password',
                'password' => 'new-secure-password',
                'password_confirmation' => 'tidak-cocok',
            ]);

        $response
            ->assertSessionHasErrors('password')
            ->assertRedirect(route('security.edit'));
    }
}
