# System Overview — Phynestra

Dokumen ini merangkum arsitektur dasar dan tooling hasil setup awal project **Phynestra (Physiological and Neuromuscular Tracking)**.

## 1. Tech Stack

| Layer                      | Teknologi                                       | Versi Utama                  |
| -------------------------- | ----------------------------------------------- | ---------------------------- |
| Runtime PHP                | PHP                                             | `^8.3` (lokal: 8.4)          |
| Backend Framework          | Laravel                                         | `^13.17`                     |
| Fullstack Bridge           | Inertia.js (Laravel + React)                    | `^3.0`                       |
| Authentication Scaffolding | Laravel Fortify + Passkeys                      | `^1.37`                      |
| Type-Safe Routing          | Laravel Wayfinder                               | `^0.1`                       |
| Frontend Framework         | React + React Compiler                          | `^19.2`                      |
| Language                   | TypeScript                                      | `^5.7`                       |
| Styling & UI               | Tailwind CSS v4 + Radix UI (shadcn/ui) + Lucide | `^4.0`                       |
| Bundler & Frontend Checker | Vite+ (`vp`)                                    | `1.4.0`                      |
| Backend Testing & QA       | Pest v5, Laravel Pint, Larastan (PHPStan)       | Pest `^5.3`, Larastan `^3.9` |
| Database (Default Lokal)   | SQLite (`database/database.sqlite`)             | Dapat diganti di `.env`      |

## 2. Struktur Direktori Utama

```text
phynestra/
├── app/                   # Kode backend Laravel (Controllers, Models, Actions, Services, dll.)
├── bootstrap/             # Bootstrap & registrasi aplikasi
├── config/                # Konfigurasi Laravel
├── database/              # Migrations, Factories, Seeders, SQLite DB
├── docs/                  # Single source of truth: rules, PRD, architecture, research
├── public/                # Public web root & compiled assets
├── resources/
│   ├── css/               # Entry point Tailwind CSS v4
│   ├── js/
│   │   ├── actions/       # Generated Wayfinder controller actions
│   │   ├── components/    # Komponen React & shadcn/ui primitives (ui/)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── layouts/       # Layout Inertia (App, Auth, Settings)
│   │   ├── lib/           # Frontend utilities
│   │   ├── pages/         # Halaman Inertia (.tsx)
│   │   ├── routes/        # Generated Wayfinder named routes
│   │   └── types/         # TypeScript type definitions
│   └── views/             # Root Blade template (app.blade.php)
├── routes/                # Definisi route Laravel (web.php, settings.php, console.php)
└── tests/                 # Pest test suite (Feature & Unit)
```

## 3. Catatan Setup Awal

- Project saat ini masih berupa **pondasi bersih (starter kit)** — fitur domain Phynestra belum dibangun.
- Fitur bawaan starter kit yang sudah siap dipakai: autentikasi (login, register, verifikasi email, reset password, 2FA, passkeys), pengaturan profil & tema (light/dark/system), serta layout sidebar dashboard dasar.
