<?php

use App\Http\Controllers\UserController;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

Route::get('/', function (): RedirectResponse {
    return Auth::check()
        ? to_route('dashboard')
        : to_route('login');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::get('users', [UserController::class, 'index'])->name('users.index');
    Route::post('users', [UserController::class, 'store'])->name('users.store');
    Route::patch('users/{user}', [UserController::class, 'update'])->name('users.update');
    Route::put('users/{user}/password', [UserController::class, 'updatePassword'])->name('users.password.update');
    Route::patch('users/{user}/toggle-status', [UserController::class, 'toggleStatus'])->name('users.toggle-status');
    Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
});

require __DIR__.'/settings.php';

Route::any('{fallbackPlaceholder}', function (Request $request): Response {
    if ($request->expectsJson() || ! $request->isMethod('GET')) {
        return response()->json(['message' => 'Halaman tidak ditemukan.'], Response::HTTP_NOT_FOUND);
    }

    return Inertia::render('errors/not-found', [
        'status' => Response::HTTP_NOT_FOUND,
    ])
        ->toResponse($request)
        ->setStatusCode(Response::HTTP_NOT_FOUND);
})
    ->where('fallbackPlaceholder', '.*')
    ->fallback()
    ->withoutMiddleware(ValidateCsrfToken::class);
