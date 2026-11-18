# PRD Fitur 05 — Beban Latihan (sRPE) & ACWR Weekly

- **Route Utama**: `/rpe`, `/rpe/team-input`, `/rpe/{athlete}`, `/rpe/{athlete}/export-pdf`
- **Referensi Ilmiah**: Foster et al. (2001) Session-RPE, Gabbett (2016) ACWR, dan [01-usulan-penelitian-unesa-2026.md](../../research/01-usulan-penelitian-unesa-2026.md)
- **Status**: Implementasi Aktif

---

## 1. Tujuan Fitur

Memantau beban latihan internal (_Internal Training Load_) atlet melalui skor **Session RPE (sRPE)** berskala **Foster CR-10 (`1–10`)** yang dikalikan durasi sesi latihan (menit), lalu diagregasi per **ISO Week (Senin–Minggu)** untuk menghitung **ACWR Weekly (Coupled Rolling Average 4 Minggu)**, **Week-to-Week Load Change (%)**, **Training Monotony**, dan **Training Strain**.

## 2. Aturan Domain & Perhitungan

- **Session Load (AU)**: `session_load = rpe × duration_minutes`
- **Multi-Sesi per Hari**: Atlet dapat memiliki lebih dari satu sesi pada tanggal yang sama (mis. sesi pagi & sore atau latihan & pertandingan). `Daily Load` adalah total `session_load` seluruh sesi pada hari tersebut (`0 AU` untuk hari istirahat).
- **Weekly Load (ISO Week Senin–Minggu)**: Total `Daily Load` selama 7 hari ISO Week berjalan.
- **ACWR Weekly (Coupled 4-Week Rolling Average)**:
    - `Acute Load(W) = Weekly Load(W)`
    - `Chronic Load(W) = rata-rata Weekly Load(W .. W-(k-1))` dengan `k = min(4, jumlah minggu sejak minggu pertama atlet)` dan minggu istirahat di antara rentang dihitung `0 AU`.
    - `ACWR(W) = round(Acute Load / Chronic Load, 2)` (atau `null` bila `Chronic Load == 0`).
- **Klasifikasi Zona ACWR (Gabbett, 2016)**:
    - `< 0.80`: `undertraining` — Beban Kurang
    - `0.80 – 1.30`: `optimal` — Optimal (Sweet Spot)
    - `1.31 – 1.50`: `caution` — Waspada
    - `> 1.50`: `high_risk` — Risiko Tinggi (Danger Zone)
- **Metrik Pendukung Foster**:
    - `week_change_pct`: Persentase perubahan `Weekly Load` terhadap minggu sebelumnya.
    - `monotony`: `Mean(7 daily loads) / StdDev(7 daily loads)` (`0` bila stdDev = 0).
    - `strain`: `round(Weekly Load × Monotony)`.

## 3. Acceptance Criteria

1. Seluruh endpoint `/rpe/*` terlindungi middleware `auth`.
2. Pelatih dapat menambah, mengubah, dan menghapus sesi RPE per atlet termasuk multi-sesi di tanggal yang sama.
3. Pelatih dapat mencatat 1 sesi latihan untuk banyak atlet sekaligus melalui **Input Sesi Tim (`/rpe/team-input`)** secara atomik.
4. Halaman `/rpe/{athlete}` menampilkan kartu KPI minggu berjalan, _Donut Gauge ACWR_, grafik _Acute vs Chronic & ACWR_, grafik _Beban Harian 14 Hari_, tabel _ACWR Weekly_, _Load Insights_, dan riwayat sesi.
5. Export PDF A4 Portrait (`/rpe/{athlete}/export-pdf`) menampilkan laporan rapi dengan _running footer_ tanpa halaman kosong.
6. Alert atlet dengan `ACWR > 1.50` terintegrasi pada panel alert `/dashboard`.
