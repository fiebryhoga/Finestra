# Fitur 04 — Tracking Quick Recovery (`Daily Metrics`)

> **Status**: `Implementasi v1.0`  
> **Scope**: Pemantauan pemulihan harian (_daily readiness_) dan kebugaran dasar atlet berdasarkan 5 input biometrik (**RHR**, **SpO₂**, **VJ**, **Weight**, **Age**), kalender program (`Week X, Day Y`), Bulk Input (copy-paste Excel + live preview), Analitik Recharts, Export PDF DomPDF + Clinical Insights, serta integrasi ke Dashboard.

## 1. Formula Ilmiah

1. **HR Max (Tanaka, 2001)**: `208 - (0.7 × Age)` (bpm, `round(..., 2)`)
2. **HR Ratio**: `HR Max / RHR` (`0` jika `RHR <= 0`, `round(..., 2)`)
3. **VO₂ Max (Uth–Sørensen–Overgaard–Pedersen)**: `15.3 × (HR Max / RHR)` (`0` jika `RHR <= 0`, ml/kg/min, `round(..., 2)`)
4. **Peak Power (Sayers)**: `(60.7 × VJ) + (45.3 × Weight) - 2055` (`0` jika `VJ <= 0` atau `Weight <= 0`, Watt, `round(..., 3)`)
5. **Quick Recovery Score (QRS 0–100%)**:
    - Jika `RHR <= 0` atau `SpO₂ <= 0` → `0`, status `KOSONG`.
    - **SpO₂ (bobot 50%, skala 1–6)**: `>= 99` → 6, `>= 98` → 5, `>= 97` → 4, `>= 96` → 3, `>= 95` → 2, `< 95` → 1 (`spo2_ratio = spo2_score / 6`).
    - **Deviasi RHR terhadap Baseline (bobot 50%, skala 1–10)**: `rhr_diff = RHR - baseline_rhr` (`<= 0.9` → 10 hingga `>= 9.0` → 1; `rhr_ratio = rhr_score / 10`).
    - `QRS = round(clamp(((spo2_ratio + rhr_ratio) / 2) × 100, 0, 100))`.
6. **Status Pemulihan**:
    - `>= 75` → `RECOVERY BAIK` (`GOOD`)
    - `35–74` → `RECOVERY CUKUP` (`FAIR`)
    - `< 35` → `RECOVERY KURANG` (`POOR`)

## 2. Perbaikan Edge Case yang Diterapkan

- Pencocokan `baseline_rhr` pada `training_start_date` menggunakan `Carbon::isSameDay()`.
- Skoring SpO₂ memakai rentang `>=` agar nilai desimal tidak jatuh ke skor `0`.
- `peak_power` bernilai `0` saat `vj <= 0` atau `weight <= 0` (konsisten antara backend & live preview frontend).
- Agregasi Dashboard memfilter `recovery_status != 'KOSONG'`.
