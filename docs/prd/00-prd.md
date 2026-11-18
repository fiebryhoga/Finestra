# Product Requirements Document (PRD) — Phynestra

> **Status**: `[Draft / Siap Diisi]`  
> **Nama Produk**: Phynestra (_Physiological and Neuromuscular Tracking_)  
> **Referensi Ilmiah**: [`docs/research/01-usulan-penelitian-unesa-2026.md`](../research/01-usulan-penelitian-unesa-2026.md)

---

## 1. Ringkasan Produk & Tujuan

_(Isi tujuan utama produk, ruang lingkup MVP untuk penelitian 6 minggu, serta visi jangka panjang.)_

## 2. Pengguna & Peran (Roles & Personas)

- **Admin / Peneliti Utama**: _(isi hak akses & kebutuhan)_
- **Pelatih (Coach) / Sport Scientist**: _(isi hak akses & kebutuhan)_
- **Enumerator / Petugas Pengambilan Data**: _(isi hak akses & kebutuhan)_
- **Atlet**: _(isi hak akses & kebutuhan, misal pengisian readiness & sRPE)_

## 3. Ruang Lingkup Fitur (Scope)

### 3.1. Modul Inti (MVP)

_(Silakan sesuaikan daftar modul dan buat detailnya di `docs/prd/features/`):_

- [ ] Manajemen Atlet, Profil Kontrol & Informed Consent
- [ ] Input & Tracking Beban Latihan (sRPE, Durasi/Volume, ACWR)
- [ ] Input & Tracking Respons Fisiologis (RHR, SpO₂, HRR Menit ke-1 & ke-2)
- [ ] Input & Tracking Respons Neuromuskular (CMJ 3 percobaan -> nilai terbaik, pembanding baseline ≥10% drop)
- [ ] Kuesioner Athlete Readiness
- [ ] Dashboard Monitoring Multidimensional (Fatigue Index, Readiness Classification, Risk Detection System)
- [ ] Ekspor Data untuk Analisis Statistik (CSV / Excel siap olah SPSS)

### 3.2. Di Luar Ruang Lingkup Saat Ini (Out of Scope)

_(Isi fitur yang ditunda untuk fase berikutnya, misal integrasi BLE langsung Polar H10, ML/AI prediction roadmap 2029–2031, dll.)_

## 4. Aturan Perhitungan & Ambang Batas (Scoring & Thresholds)

_(Isi formula pasti yang disepakati tim peneliti untuk):_

- **ACWR**: _(Rolling Average vs EWMA, jendela 7:28 hari, zona optimal/risiko)_
- **HRR**: _(HRR60 & HRR120, batas pemulihan normal vs terganggu)_
- **CMJ Fatigue Threshold**: Penurunan ≥10% dari nilai baseline _(berdasarkan proposal penelitian)_
- **Athlete Readiness Questionnaire**: _(Daftar item pertanyaan, skala skor, kategori klasifikasi)_
- **Fatigue Index & Risk Detection**: _(Bobot masing-masing indikator dan kategori risiko)_

## 5. Kebutuhan Non-Fungsional

- **Keamanan & Privasi Data Kesehatan Atlet**: _(isi aturan akses & anonimisasi ekspor riset)_
- **Kegunaan Lapangan (Usability)**: _(isi target mobile/tablet responsiveness untuk input cepat di lapangan)_
- **Performa & Reliabilitas**: _(isi target)_
