<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\RateLimiter;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_screen_can_be_rendered(): void
    {
        $response = $this->get(route('login'));

        $response
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('auth/login'),
            );
    }

    public function test_users_can_authenticate_using_username(): void
    {
        $user = User::factory()->create(['username' => 'pelatih.utama']);

        $response = $this->post(route('login.store'), [
            'username' => 'pelatih.utama',
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_authenticate_with_uppercase_username(): void
    {
        $user = User::factory()->create(['username' => 'pelatih.utama']);

        $response = $this->post(route('login.store'), [
            'username' => 'Pelatih.Utama',
            'password' => 'password',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_authenticate_with_remember_me(): void
    {
        $user = User::factory()->create(['username' => 'admin']);

        $response = $this->post(route('login.store'), [
            'username' => 'admin',
            'password' => 'password',
            'remember' => 'on',
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('dashboard', absolute: false));
        $this->assertNotNull($user->fresh()->remember_token);
    }

    public function test_authenticated_users_visiting_login_are_redirected_to_dashboard(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route('login'));

        $response->assertRedirect(route('dashboard', absolute: false));
    }

    public function test_users_can_not_authenticate_with_invalid_password(): void
    {
        $user = User::factory()->create();

        $response = $this->from(route('login'))->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'wrong-password',
        ]);

        $this->assertGuest();
        $response
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('username');
    }

    public function test_users_can_not_authenticate_with_nonexistent_username(): void
    {
        $response = $this->from(route('login'))->post(route('login.store'), [
            'username' => 'tidak.ada',
            'password' => 'password',
        ]);

        $this->assertGuest();
        $response
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors('username');
    }

    public function test_login_requires_username_and_password(): void
    {
        $response = $this->from(route('login'))->post(route('login.store'), [
            'username' => '',
            'password' => '',
        ]);

        $this->assertGuest();
        $response
            ->assertRedirect(route('login'))
            ->assertSessionHasErrors(['username', 'password']);
    }

    public function test_users_can_logout(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('logout'));

        $response->assertRedirect(route('home'));
        $this->assertGuest();
    }

    public function test_users_are_rate_limited(): void
    {
        $user = User::factory()->create();

        RateLimiter::increment(md5('login'.implode('|', [$user->username, '127.0.0.1'])), amount: 5);

        $response = $this->post(route('login.store'), [
            'username' => $user->username,
            'password' => 'wrong-password',
        ]);

        $response->assertTooManyRequests();
    }
}
