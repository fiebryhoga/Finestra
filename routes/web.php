<?php

use App\Http\Controllers\AthleteController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\TrackingController;
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
    Route::get('dashboard', DashboardController::class)->name('dashboard');

    Route::get('athletes', [AthleteController::class, 'index'])->name('athletes.index');
    Route::post('athletes', [AthleteController::class, 'store'])->name('athletes.store');
    Route::patch('athletes/{athlete}', [AthleteController::class, 'update'])->name('athletes.update');
    Route::delete('athletes/{athlete}', [AthleteController::class, 'destroy'])->name('athletes.destroy');

    Route::get('tracking', [TrackingController::class, 'index'])->name('tracking.index');
    Route::get('tracking/{athlete}', [TrackingController::class, 'show'])->name('tracking.show');
    Route::get('tracking/{athlete}/bulk', [TrackingController::class, 'bulk'])->name('tracking.bulk');
    Route::post('tracking/{athlete}/metrics', [TrackingController::class, 'store'])->name('tracking.metrics.store');
    Route::post('tracking/{athlete}/bulk', [TrackingController::class, 'storeBulk'])->name('tracking.bulk.store');
    Route::post('tracking/{athlete}/start-date', [TrackingController::class, 'setStartDate'])->name('tracking.start-date');
    Route::delete('tracking/{athlete}/metrics/{dailyMetric}', [TrackingController::class, 'destroy'])->name('tracking.metrics.destroy');
    Route::get('tracking/{athlete}/export-pdf', [TrackingController::class, 'exportPdf'])->name('tracking.export-pdf');

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
