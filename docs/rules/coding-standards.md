# Standar Penulisan Kode (Coding Standards) — Finestra

> **Status**: `[Template Siap Diisi]` — Sesuaikan dan tambahkan konvensi penulisan kode backend dan frontend di sini.

## 1. Umum

- Bahasa kode (nama class, variabel, tabel, kolom, route): _(misal: Bahasa Inggris)_
- Bahasa UI / copywriting aplikasi: _(misal: Bahasa Indonesia / Inggris / Bilingual)_
- Bahasa komentar & dokumentasi: _(isi preferensi)_

## 2. Backend (PHP 8.3+ & Laravel 13)

- **Formatting**: Mengikuti aturan `pint.json` (`composer lint`).
- **Static Analysis**: Wajib lulus Larastan (`composer types:check`).
- **Struktur Layer**: _(isi preferensi arsitektur, misal: Controller tipis -> FormRequest -> Action / Service -> Model)_
- **Penamaan**:
    - Controller: _(misal: Resourceful / Invokable)_
    - Form Request: _(misal: `StoreMeasurementRequest`)_
    - Service / Domain Calculation (misal ACWR, Fatigue Index): _(tentukan namespace, misal `app/Services/` atau `app/Domain/`)_
    - Enum: _(gunakan Backed Enum PHP untuk status kelelahan, zona risiko, peran pengguna)_

## 3. Frontend (React 19, TypeScript `.tsx`, Inertia v3, Tailwind v4)

- **Strict TypeScript**: Hindari `any`; wajib lulus `npm run types:check`.
- **Lint & Format**: Wajib lulus `npm run check` (Vite+).
- **Routing**: Gunakan route/action generator dari **Laravel Wayfinder** (`resources/js/routes` & `resources/js/actions`), bukan hardcode URL string.
- **Struktur Komponen**:
    - `resources/js/pages/` — Halaman Inertia (kebab-case / sesuai konvensi fitur).
    - `resources/js/components/ui/` — Komponen primitif shadcn/ui.
    - `resources/js/components/` — Komponen aplikasi reusable.
    - `resources/js/hooks/` — Custom React hooks.
    - `resources/js/types/` — Definisi TypeScript global dan domain.

## 4. Larangan / Anti-Pattern

- **Dilarang menggunakan pill/badge dengan background warna tinted** (`rounded-full bg-*-500/10 border-*-500/20`, dll.) untuk label kategori, _eyebrow_, maupun status — gunakan teks bersih atau kombinasi `status dot` + teks semantik.
- **Dilarang menggunakan pill/badge dengan background warna tinted** (`rounded-full bg-*-500/10 border-*-500/20`, dll.) untuk label kategori, _eyebrow_, maupun status — gunakan teks bersih atau kombinasi `status dot` + teks semantik.
- **Dilarang menggunakan `font-mono` / font monospace** di komponen UI mana pun — selalu gunakan `font-sans` (`Instrument Sans`) dan tambahkan `tabular-nums` untuk angka/metrik.
- **Dilarang menggunakan warna hardcoded** (`bg-white`, `text-black`, hex langsung) di komponen UI — selalu gunakan semantic token tema dari `resources/css/app.css`.
- **Dilarang membiarkan halaman 404 default Laravel** tampil ke pengguna web — seluruh halaman error web wajib melalui halaman Inertia di `resources/js/pages/errors/` dengan tetap mempertahankan HTTP status code asli (`404`).
