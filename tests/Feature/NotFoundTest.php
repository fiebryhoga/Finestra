<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class NotFoundTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_visiting_unknown_route_receives_custom_inertia_404_page(): void
    {
        $response = $this->get('/halaman-yang-tidak-ada');

        $response
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page
                ->component('errors/not-found')
                ->where('status', 404)
                ->where('auth.user', null),
            );
    }

    public function test_authenticated_user_visiting_unknown_route_receives_custom_inertia_404_page(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get('/halaman-yang-tidak-ada');

        $response
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page
                ->component('errors/not-found')
                ->where('status', 404)
                ->where('auth.user.username', $user->username),
            );
    }

    public function test_disabled_register_route_renders_custom_inertia_404_page(): void
    {
        $response = $this->get('/register');

        $response
            ->assertNotFound()
            ->assertInertia(fn (Assert $page) => $page
                ->component('errors/not-found')
                ->where('status', 404),
            );
    }

    public function test_json_request_to_unknown_route_returns_json_404(): void
    {
        $response = $this->getJson('/halaman-yang-tidak-ada');

        $response
            ->assertNotFound()
            ->assertJson(['message' => 'Halaman tidak ditemukan.']);
    }
}
