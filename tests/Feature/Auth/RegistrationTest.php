<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_public_registration_screen_is_disabled(): void
    {
        $this->get('/register')->assertNotFound();
    }

    public function test_public_registration_submission_is_disabled(): void
    {
        $this->post('/register', [
            'name' => 'Pelatih Fisik',
            'username' => 'pelatih.fisik',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ])->assertNotFound();

        $this->assertGuest();
        $this->assertDatabaseMissing('users', [
            'username' => 'pelatih.fisik',
        ]);
    }
}
