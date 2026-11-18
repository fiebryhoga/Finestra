<?php

namespace App\Http\Controllers;

use App\Http\Requests\Users\StoreUserRequest;
use App\Http\Requests\Users\UpdateUserPasswordRequest;
use App\Http\Requests\Users\UpdateUserRequest;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    /**
     * Display a paginated listing of users.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $status = $request->string('status', 'all')->toString();

        if (! in_array($status, ['all', 'active', 'inactive'], true)) {
            $status = 'all';
        }

        $users = User::query()
            ->when($search !== '', function (Builder $query) use ($search): void {
                $query->where(function (Builder $subQuery) use ($search): void {
                    $subQuery
                        ->where('name', 'like', "%{$search}%")
                        ->orWhere('username', 'like', "%{$search}%");
                });
            })
            ->when($status === 'active', fn (Builder $query) => $query->where('is_active', true))
            ->when($status === 'inactive', fn (Builder $query) => $query->where('is_active', false))
            ->latest('id')
            ->paginate(10)
            ->withQueryString()
            ->through(fn (User $user): array => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'is_active' => $user->is_active,
                'created_at' => $user->created_at?->toISOString(),
                'created_at_formatted' => $user->created_at?->format('d M Y') ?? '-',
            ]);

        $totalUsers = User::query()->count();
        $activeUsers = User::query()->where('is_active', true)->count();

        return Inertia::render('users/index', [
            'users' => $users,
            'filters' => [
                'search' => $search,
                'status' => $status,
            ],
            'stats' => [
                'total' => $totalUsers,
                'active' => $activeUsers,
                'inactive' => $totalUsers - $activeUsers,
            ],
            'passwordRules' => Password::defaults()->toPasswordRulesString(),
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        User::query()->create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'password' => $validated['password'],
            'is_active' => true,
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Pengguna baru berhasil ditambahkan.',
        ]);

        return back();
    }

    /**
     * Update the specified user's profile details.
     */
    public function update(UpdateUserRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data pengguna berhasil diperbarui.',
        ]);

        return back();
    }

    /**
     * Reset the specified user's password.
     */
    public function updatePassword(UpdateUserPasswordRequest $request, User $user): RedirectResponse
    {
        $user->update([
            'password' => $request->validated('password'),
        ]);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Kata sandi untuk @{$user->username} berhasil diperbarui.",
        ]);

        return back();
    }

    /**
     * Toggle the specified user's active status.
     */
    public function toggleStatus(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Anda tidak dapat menonaktifkan akun yang sedang digunakan.',
            ]);

            return back();
        }

        $nextStatus = ! $user->is_active;
        $user->update(['is_active' => $nextStatus]);

        if (! $nextStatus) {
            $this->revokeUserSessions($user);
        }

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => $nextStatus
                ? "Akun @{$user->username} berhasil diaktifkan kembali."
                : "Akun @{$user->username} berhasil dinonaktifkan.",
        ]);

        return back();
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(Request $request, User $user): RedirectResponse
    {
        if ($user->is($request->user())) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Anda tidak dapat menghapus akun yang sedang digunakan.',
            ]);

            return back();
        }

        $username = $user->username;
        $this->revokeUserSessions($user);
        $user->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Akun @{$username} berhasil dihapus.",
        ]);

        return back();
    }

    /**
     * Invalidate active database sessions for the given user.
     */
    private function revokeUserSessions(User $user): void
    {
        if (config('session.driver') === 'database') {
            $table = is_string(config('session.table')) ? config('session.table') : 'sessions';

            DB::table($table)
                ->where('user_id', $user->id)
                ->delete();
        }
    }
}
