# Aturan Database, Validasi & Kontrak Inertia — Finestra

> **Status**: `[Template Siap Diisi]` — Tentukan konvensi skema basis data dan pertukaran data Laravel ↔ React di sini.

## 1. Konvensi Skema Database

- **Penamaan Tabel**: `snake_case`, jamak (plural), Bahasa Inggris (misal `athletes`, `training_sessions`, `physiological_logs`, `cmj_tests`).
- **Primary Key**: _(isi pilihan: Auto-increment `id` / UUID / ULID)_
- **Timestamp & Soft Deletes**: _(tentukan tabel mana yang wajib memakai `softDeletes()` untuk menjaga integritas data riset)_
- **Presisi Numerik**: _(tentukan tipe `decimal(p, s)` untuk metrik seperti ACWR, CMJ cm, SpO₂ %, sRPE)_
- **Timezone & Tanggal Pengukuran**: _(tentukan aturan tanggal lokal vs UTC, misal `Asia/Jakarta` / `Asia/Makassar`)_

## 2. Validasi & Integritas Data Riset

- Seluruh input wajib divalidasi melalui Laravel `FormRequest`.
- Cantumkan rentang fisiologis wajar pada aturan validasi _(misal: SpO₂ 50–100%, RHR 30–220 bpm, sRPE 0–10 atau 1–10 sesuai skala yang ditetapkan)_.
- _(Tambahkan aturan audit log / tracking enumerator penginput data jika diperlukan untuk validitas riset)_

## 3. Kontrak Inertia Props & Serialization

- Gunakan Laravel API Resource / DTO / Data array terstruktur agar hanya field yang dibutuhkan yang dikirim ke frontend.
- Definisikan interface TypeScript yang cocok di `resources/js/types/` untuk setiap props halaman.
- Hindari mengirim data sensitif (misal informasi kesehatan pribadi tanpa otorisasi).

## 4. Ekspor Data Statistik

- _(Aturan format ekspor CSV/Excel untuk analisis lanjut di IBM SPSS Statistics: struktur kolom, missing value, encoding UTF-8)_
