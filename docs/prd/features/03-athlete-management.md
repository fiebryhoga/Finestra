# Fitur 03 — Manajemen Atlet

> **Status**: `Implementasi v1.0`  
> **Scope**: Pengelolaan profil dasar atlet Phynestra (`name`, `gender`, `date_of_birth`, `weight_kg`, `height_cm`) disertai kalkulasi otomatis usia dan IMT (BMI), soft delete untuk integritas data riset, serta pola Single-Page Table + Modal Dialog shadcn (`/athletes`).

## 1. Tujuan

Menyediakan master data atlet yang presisi dan siap menjadi relasi dasar bagi pencatatan indikator monitoring berikutnya (ACWR/sRPE, RHR, HRR, SpO₂, CMJ, dan Athlete Readiness).

## 2. Atribut Data Atlet

| Field           | Tipe DB                 | Validasi                                                  | Satuan / Catatan                 |
| --------------- | ----------------------- | --------------------------------------------------------- | -------------------------------- |
| `name`          | `string`                | Wajib, string, maks 255 karakter                          | Nama lengkap atlet               |
| `gender`        | `string(10)` (`Gender`) | Wajib, enum `male` (`Laki-laki`) / `female` (`Perempuan`) | Jenis kelamin atlet              |
| `date_of_birth` | `date`                  | Wajib, tanggal valid, `before:today`, `after:1920-01-01`  | Usia (tahun) dihitung otomatis   |
| `weight_kg`     | `decimal(5,2)`          | Wajib, numerik, `min:20`, `max:250`                       | Kilogram (`kg`)                  |
| `height_cm`     | `decimal(5,2)`          | Wajib, numerik, `min:100`, `max:250`                      | Sentimeter (`cm`)                |
| `deleted_at`    | `timestamp` (nullable)  | Soft delete                                               | Menjaga integritas histori riset |

## 3. Daftar Endpoint

| Aksi         | Method & Path                | Route Name         | Keterangan                                                                                                  |
| ------------ | ---------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| Daftar Atlet | `GET /athletes`              | `athletes.index`   | Tabel server-side dengan pencarian (`search`), pengurutan (`sort`), pagination, dan ringkasan rata-rata KPI |
| Tambah Atlet | `POST /athletes`             | `athletes.store`   | Menyimpan data atlet baru                                                                                   |
| Ubah Atlet   | `PATCH /athletes/{athlete}`  | `athletes.update`  | Memperbarui data atlet                                                                                      |
| Hapus Atlet  | `DELETE /athletes/{athlete}` | `athletes.destroy` | Menghapus atlet secara soft delete                                                                          |
