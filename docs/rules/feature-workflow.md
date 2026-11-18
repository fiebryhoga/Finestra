# Alur Pembuatan Fitur (Feature Workflow) — Phynestra

> **Status**: `[Template Siap Diisi]` — Lengkapi prosedur kerja dari spesifikasi hingga rilis fitur.

## 1. Sebelum Mulai Coding

1. Pastikan spesifikasi fitur sudah tersedia di `docs/prd/features/<nama-fitur>.md`.
2. Pastikan formula/logika ilmiah sesuai dengan dokumen di `docs/research/`.
3. Pastikan desain UI mengacu pada `docs/rules/design-system.md`.

## 2. Urutan Implementasi Fitur (Vertikal)

1. **Database**: Migration, Model, Factory, Seeder (jika diperlukan).
2. **Domain / Service Logic**: Perhitungan metrik, klasifikasi, atau business rules + Unit Test (Pest).
3. **HTTP / Inertia Layer**: FormRequest, Policy/Authorization, Controller, Route.
4. **Frontend (React TSX)**: Types, Page Inertia, Komponen UI, Form handling (`useForm` / Inertia Form).
5. **Feature Tests**: Uji skenario sukses, validasi gagal, dan hak akses (Pest).

## 3. Strategi Git & Commit

- **Branching**: _(isi konvensi, misal `feat/<nama-fitur>`, `fix/<bug>`, `docs/<topik>`)_
- **Commit Message**: _(isi konvensi, misal Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`)_

## 4. Definition of Done (DoD)

Sebuah fitur dianggap selesai apabila:

- [ ] Seluruh acceptance criteria di PRD terpenuhi.
- [ ] `composer test` (Pint, Larastan, Pest) lulus tanpa error.
- [ ] `npm run check` dan `npm run types:check` lulus tanpa error.
- [ ] `npm run build` berhasil tanpa warning/error fatal.
- [ ] Tidak ada hardcoded secret atau debug statement yang tertinggal.
