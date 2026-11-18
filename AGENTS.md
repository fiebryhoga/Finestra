# AGENTS.md — Panduan Agent untuk Finestra

Project ini adalah **Finestra (Physiological and Neuromuscular Tracking)** — aplikasi web berbasis **Laravel 13 + Inertia.js v3 + React 19 + TypeScript (`.tsx`) + Tailwind CSS v4**.

## Wajib Dibaca Sebelum Membangun atau Mengubah Fitur

Seluruh aturan project, spesifikasi produk, dan referensi ilmiah disimpan di folder `docs/`. Sebelum merancang atau mengimplementasikan fitur apa pun, baca dokumen yang relevan:

1. **Aturan Pengembangan (`docs/rules/`)**
    - `docs/rules/design-system.md` — Aturan desain UI/UX, warna, tipografi, komponen, dan layout.
    - `docs/rules/coding-standards.md` — Aturan penulisan kode backend (PHP/Laravel) dan frontend (React/TSX/Tailwind).
    - `docs/rules/feature-workflow.md` — Alur pembuatan fitur, struktur folder, standar testing, dan Definition of Done.
    - `docs/rules/database-and-api.md` — Konvensi skema database, migrasi, validasi, dan kontrak Inertia props.
2. **Product Requirements (`docs/prd/`)**
    - `docs/prd/00-prd.md` — PRD utama Finestra.
    - `docs/prd/features/` — Spesifikasi detail per fitur.
3. **Arsitektur (`docs/architecture/`)**
    - `docs/architecture/system-overview.md` — Gambaran stack teknis dan struktur repositori.
    - `docs/architecture/adr/` — Architecture Decision Records.
4. **Landasan Ilmiah (`docs/research/`)**
    - `docs/research/01-usulan-penelitian-unesa-2026.md` — Referensi model monitoring kelelahan atlet (ACWR, HRR, RHR, SpO₂, CMJ, Athlete Readiness).

## Verifikasi Standar Sebelum Menyelesaikan Pekerjaan

- Backend lint & static analysis & tests: `composer test` (menjalankan Pint, PHPStan/Larastan, dan Pest)
- Frontend lint/format & type check: `npm run check` dan `npm run types:check`
- Full CI check: `composer ci:check`
