# Fitur 01 — Autentikasi Berbasis Username & Manajemen Akun

> **Status**: `Implementasi v1.0`  
> **Scope**: Autentikasi tanpa role (single-tier) berbasis `username` dan `password`, tanpa registrasi publik (akun ditambahkan melalui manajemen admin), tanpa email, tanpa verifikasi email, tanpa 2FA/passkey.

## 1. Tujuan

Menyediakan akses masuk yang ringkas, aman, dan sesuai estetika **Sports Science Biru Navy (Light & Dark Mode)** agar pengguna yang telah didaftarkan admin dapat login, mengakses Dashboard, serta mengelola profil, kata sandi, dan preferensi tema.

## 2. Alur & Endpoint Utama

| Fitur             | Method & Path                                      | Keterangan                                                                                                                    |
| ----------------- | -------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Entry Point       | `GET /`                                            | Redirect ke `/dashboard` jika sudah login, atau `/login` jika guest                                                           |
| Login             | `GET /login`, `POST /login`                        | Autentikasi menggunakan `username` (case-insensitive, disimpan lowercase) + `password` + opsi `remember`, rate limit 5x/menit |
| Registrasi Publik | _(Dinonaktifkan)_                                  | `/register` mengembalikan `404`; penambahan akun dilakukan melalui manajemen admin                                            |
| Logout            | `POST /logout`                                     | Menghapus sesi aktif dan kembali ke `/` → `/login`                                                                            |
| Dashboard         | `GET /dashboard`                                   | Area terproteksi middleware `auth`                                                                                            |
| Profil            | `GET/PATCH/DELETE /settings/profile`               | Ubah `name` & `username`, atau hapus akun dengan konfirmasi kata sandi                                                        |
| Ganti Kata Sandi  | `GET /settings/security`, `PUT /settings/password` | Ubah kata sandi menggunakan `current_password`, `password`, `password_confirmation` (throttle 6x/menit)                       |
| Tampilan          | `GET /settings/appearance`                         | Pengaturan tema `Terang`, `Gelap`, atau `Sistem`                                                                              |

## 3. Aturan Validasi

- `username`: wajib, string, 3–50 karakter, hanya `[a-z0-9._-]`, dinormalisasi menjadi huruf kecil (_lowercase_), unik di tabel `users`.
- `password`: wajib, string, memenuhi aturan default Laravel Password, dan cocok dengan `password_confirmation`.
- Akun default lokal (via `DatabaseSeeder`): `username: admin`, `password: password`.
