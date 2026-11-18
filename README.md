# Finestra

**Finestra — Physiological and Neuromuscular Tracking**

Platform monitoring kelelahan atlet multidimensional berbasis web yang mengintegrasikan beban latihan (_training load_), respons fisiologis, respons neuromuskular, dan kesiapan atlet (_athlete readiness_).

## Tech Stack

- **Backend**: Laravel 13 (PHP 8.3+), Inertia.js v3, Laravel Fortify, Laravel Wayfinder
- **Frontend**: React 19, TypeScript (`.tsx`), Tailwind CSS v4, Radix UI / shadcn/ui, Lucide Icons, Vite+ (`vp`)
- **Quality & Testing**: Pest v5, Laravel Pint, Larastan (PHPStan), TypeScript Compiler (`tsc`), Vite+ Check (`vp check`)
- **Database (Default Lokal)**: SQLite (`database/database.sqlite`), dapat diganti ke MySQL/PostgreSQL melalui `.env`

## Menjalankan Project Secara Lokal

```bash
# Jalankan server development (Laravel + Queue + Vite)
composer dev
```

Atau secara terpisah:

```bash
php artisan serve
npm run dev
```

## Perintah Penting

```bash
# Build asset produksi
npm run build

# Cek format & lint frontend (Vite+ / Oxlint & Oxfmt)
npm run check
npm run check:fix

# Cek tipe TypeScript
npm run types:check

# Format PHP (Laravel Pint)
composer lint

# Jalankan semua quality checks & test backend (Pint + PHPStan + Pest)
composer test

# Jalankan full CI check (Frontend + Backend)
composer ci:check
```

## Dokumentasi, Aturan & PRD

Seluruh aturan pengembangan, desain, PRD, arsitektur, dan referensi ilmiah berada di folder [`docs/`](./docs/README.md).
