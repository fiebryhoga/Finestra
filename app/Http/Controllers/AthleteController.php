<?php

namespace App\Http\Controllers;

use App\Enums\Gender;
use App\Http\Requests\Athletes\StoreAthleteRequest;
use App\Http\Requests\Athletes\UpdateAthleteRequest;
use App\Models\Athlete;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AthleteController extends Controller
{
    /**
     * Display a paginated listing of athletes.
     */
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim()->toString();
        $gender = $request->string('gender', 'all')->toString();
        $sort = $request->string('sort', 'latest')->toString();

        if (! in_array($gender, ['all', Gender::Male->value, Gender::Female->value], true)) {
            $gender = 'all';
        }

        if (! in_array($sort, ['latest', 'name_asc', 'name_desc', 'youngest', 'oldest'], true)) {
            $sort = 'latest';
        }

        $query = Athlete::query()
            ->when($search !== '', function (Builder $builder) use ($search): void {
                $builder->where('name', 'like', "%{$search}%");
            })
            ->when($gender !== 'all', function (Builder $builder) use ($gender): void {
                $builder->where('gender', $gender);
            });

        match ($sort) {
            'name_asc' => $query->orderBy('name'),
            'name_desc' => $query->orderByDesc('name'),
            'youngest' => $query->orderByDesc('date_of_birth'),
            'oldest' => $query->orderBy('date_of_birth'),
            default => $query->latest('id'),
        };

        $athletes = $query
            ->paginate(10)
            ->withQueryString()
            ->through(fn (Athlete $athlete): array => [
                'id' => $athlete->id,
                'name' => $athlete->name,
                'gender' => $athlete->gender->value,
                'gender_label' => $athlete->gender->label(),
                'date_of_birth' => $athlete->date_of_birth->format('Y-m-d'),
                'date_of_birth_formatted' => $athlete->date_of_birth->format('d M Y'),
                'age' => $athlete->age(),
                'weight_kg' => $athlete->weight_kg,
                'height_cm' => $athlete->height_cm,
                'bmi' => $athlete->bmi(),
                'created_at_formatted' => $athlete->created_at?->format('d M Y') ?? '-',
            ]);

        $allAthletes = Athlete::query()->get(['date_of_birth', 'weight_kg', 'height_cm']);
        $total = $allAthletes->count();

        $avgAge = $total > 0
            ? round($allAthletes->avg(fn (Athlete $athlete): int => $athlete->age()) ?? 0.0, 1)
            : null;

        $avgWeight = $total > 0
            ? round((float) ($allAthletes->avg('weight_kg') ?? 0.0), 1)
            : null;

        $avgHeight = $total > 0
            ? round((float) ($allAthletes->avg('height_cm') ?? 0.0), 1)
            : null;

        return Inertia::render('athletes/index', [
            'athletes' => $athletes,
            'filters' => [
                'search' => $search,
                'gender' => $gender,
                'sort' => $sort,
            ],
            'stats' => [
                'total' => $total,
                'avg_age' => $avgAge,
                'avg_weight_kg' => $avgWeight,
                'avg_height_cm' => $avgHeight,
            ],
        ]);
    }

    /**
     * Store a newly created athlete in storage.
     */
    public function store(StoreAthleteRequest $request): RedirectResponse
    {
        Athlete::query()->create($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data atlet berhasil ditambahkan.',
        ]);

        return back();
    }

    /**
     * Update the specified athlete in storage.
     */
    public function update(UpdateAthleteRequest $request, Athlete $athlete): RedirectResponse
    {
        $athlete->update($request->validated());

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => 'Data atlet berhasil diperbarui.',
        ]);

        return back();
    }

    /**
     * Soft-delete the specified athlete from storage.
     */
    public function destroy(Athlete $athlete): RedirectResponse
    {
        $name = $athlete->name;
        $athlete->delete();

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => "Data atlet {$name} berhasil dihapus.",
        ]);

        return back();
    }
}
