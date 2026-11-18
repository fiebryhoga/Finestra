# Fitur 02 — Manajemen Pengguna (CRUD User)

> **Status**: `Implementasi v1.0`  
> **Scope**: Pengelolaan akun pengguna Finestra tanpa role (single-tier) melalui pola Single-Page Table + Modal Dialog shadcn (`/users`).

## 1. Tujuan

Karena registrasi publik dinonaktifkan, modul Manajemen Pengguna menjadi pusat administrasi untuk menambah akun pelatih/enumerator/peneliti, memperbarui profil, mereset kata sandi, menonaktifkan akses tanpa menghapus rekam jejak data, dan menghapus akun.

## 2. Daftar Endpoint

| Aksi              | Method & Path                       | Route Name              | Keterangan                                                                                             |
| ----------------- | ----------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------ |
| Daftar Pengguna   | `GET /users`                        | `users.index`           | Tabel server-side dengan pencarian (`search`), filter status (`status`), pagination, dan ringkasan KPI |
| Tambah Pengguna   | `POST /users`                       | `users.store`           | Membuat akun baru (`name`, `username`, `password`, `password_confirmation`) dengan status aktif        |
| Ubah Pengguna     | `PATCH /users/{user}`               | `users.update`          | Memperbarui `name` dan `username`                                                                      |
| Reset Kata Sandi  | `PUT /users/{user}/password`        | `users.password.update` | Mengatur kata sandi baru untuk pengguna                                                                |
| Ubah Status Aktif | `PATCH /users/{user}/toggle-status` | `users.toggle-status`   | Mengaktifkan atau menonaktifkan akun (akun sendiri dilindungi)                                         |
| Hapus Pengguna    | `DELETE /users/{user}`              | `users.destroy`         | Menghapus akun secara permanen (akun sendiri dilindungi)                                               |

## 3. Aturan Bisnis & Keamanan

- Seluruh endpoint dilindungi middleware `auth`.
- `username` dinormalisasi ke huruf kecil (_lowercase_), 3–50 karakter `[a-z0-9._-]`, dan unik (_case-insensitive_).
- Pengguna dengan `is_active = false` ditolak saat mencoba login dengan pesan yang jelas.
- Pengguna yang sedang login tidak dapat menonaktifkan atau menghapus akunnya sendiri dari halaman Manajemen Pengguna.
