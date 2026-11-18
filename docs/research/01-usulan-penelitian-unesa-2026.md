# Referensi Ilmiah 01 — Usulan Penelitian UNESA 2026

Dokumen ini merupakan ringkasan terstruktur dari referensi penelitian yang menjadi landasan ilmiah pengembangan **Phynestra (Physiological and Neuromuscular Tracking)**.

---

## 1. Identitas Penelitian

- **Judul**: _Pengembangan Model Monitoring Kelelahan Atlet Berbasis Respons Fisiologis dan Neuromuskular_
- **Skema**: Penelitian Penugasan Universitas — LPPM Universitas Negeri Surabaya (UNESA)
- **Tahun**: 2026 (Waktu pelaksanaan: Mei – November 2026)
- **Bidang Fokus**: Ilmu Keolahragaan dan Kesehatan (Rumpun Ilmu 760 / Ilmu Pendidikan dan Kesehatan)
- **Lokasi**: Laboratorium Fakultas Ilmu Keolahragaan dan Kesehatan (FIKK) UNESA
- **Tim Peneliti**:
    - **Ketua**: Prof. Dr. Imam Marsudi, M.Si. (NIDN 0023036502)
    - **Anggota 1**: Prof. Dr. Or. Gigih Siantoro, M.Pd. (NIDN 0015038102)
    - **Anggota 2**: Prof. Dr. Nining Widyah Kusnanik, M.Appl.Sc. (NIDN 0005126906)
    - **Anggota 3**: Prof. Dr. Oce Wiriawan, M.Kes. (NIDN 0029057303)
- **Target Luaran**: Artikel ilmiah pada jurnal internasional bereputasi _Journal of Human Sport and Exercise_ (`https://www.jhse.ua.es`)
- **Kontribusi SDGs**:
    - **SDG 3** (_Good Health and Well-Being_): Monitoring kelelahan untuk kesehatan, keselamatan, pencegahan cedera/overtraining, dan performa atlet.
    - **SDG 9** (_Industry, Innovation and Infrastructure_): Transformasi teknologi olahraga berbasis aplikasi digital dan data.

---

## 2. Kebaruan & Output Model Digital yang Diharapkan

Praktik monitoring sebelumnya cenderung parsial (mengukur satu domain secara terpisah). Phynestra mengintegrasikan lintas domain (**training load + respons fisiologis + respons neuromuskular + athlete readiness**) dalam satu sistem aplikasi digital yang mampu melakukan:

1. Pengumpulan & penyimpanan data terintegrasi
2. Analisis & visualisasi tren
3. **Dashboard Monitoring**
4. **Fatigue Index**
5. **Readiness Classification**
6. **Risk Detection System**

---

## 3. Variabel & Indikator Monitoring

### A. Variabel Bebas (6 Indikator Utama)

| No  | Domain                        | Indikator                                 | Instrumen / Perangkat                     | Protokol Pengukuran                                                            |
| --- | ----------------------------- | ----------------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------ |
| 1   | Training Load                 | **ACWR** (_Acute:Chronic Workload Ratio_) | sRPE + volume/durasi latihan              | sRPE dikumpulkan **30 menit setelah sesi latihan selesai**                     |
| 2   | Fisiologis (Otonom/Pemulihan) | **HRR** (_Heart Rate Recovery_)           | Polar H10 Heart Rate Monitor              | Diukur setelah latihan terstandar pada **menit ke-1 dan menit ke-2 recovery**  |
| 3   | Fisiologis (Baseline)         | **RHR** (_Resting Heart Rate_)            | Polar H10 / monitor HR                    | Diukur **setiap pagi sebelum aktivitas**                                       |
| 4   | Fisiologis (Oksigenasi)       | **SpO₂** (_Oxygen Saturation_)            | Pulse Oximeter                            | Diukur **setiap pagi sebelum aktivitas**                                       |
| 5   | Neuromuskular                 | **CMJ** (_Countermovement Jump_)          | Aplikasi My Jump 3                        | Dilakukan **3 kali percobaan sebelum sesi latihan**, diambil **nilai terbaik** |
| 6   | Psikofisiologis / Subjektif   | **Athlete Readiness**                     | Readiness Questionnaire berbasis aplikasi | Diisi melalui aplikasi monitoring                                              |

### B. Variabel Terikat

1. Status kelelahan atlet
2. Perubahan performa neuromuskular
3. Risiko kelelahan akut (**kriteria kelelahan akut: penurunan CMJ ≥ 10% dari nilai baseline**)
4. Tingkat kesiapan atlet

### C. Variabel Kontrol (Data Profil & Konteks)

1. Usia atlet
2. Frekuensi latihan
3. Durasi latihan
4. Status cedera
5. Pola latihan tim
6. Kualitas tidur dan pemulihan atlet

---

## 4. Desain Penelitian & Protokol Pengumpulan Data

- **Pendekatan**: Research & Development (R&D) Borg & Gall diadaptasi menjadi **7 tahap**:
    1. Analisis kebutuhan
    2. Perancangan model monitoring (prototype aplikasi digital)
    3. Validasi ahli (panel 7 ahli: 2 fisiologi olahraga, 1 biomekanika olahraga, 2 kepelatihan olahraga, 1 statistik olahraga, 1 praktisi sport science; skala Likert 1–5; kelayakan **CVI ≥ 0.80**)
    4. Uji coba terbatas (evaluasi usability, kemudahan implementasi, sensitivitas)
    5. Implementasi monitoring atlet (6 minggu)
    6. Analisis & integrasi data
    7. Evaluasi efektivitas model (validitas, reliabilitas, sensitivitas, spesifisitas vs metode konvensional)
- **Subjek Penelitian**: **30 atlet sepak bola** (estimasi G*Power: f = 0.40, α = 0.05, power = 0.80 → minimal 28, ditetapkan 30 untuk antisipasi dropout).
- **Kriteria Inklusi**:
    - Aktif berlatih minimal 3 kali/minggu
    - Usia 17–25 tahun
    - Laki-laki
    - Pengalaman kompetisi tingkat daerah atau nasional
    - Tidak cedera dalam 3 bulan terakhir
    - Tidak mengonsumsi suplemen ergogenik selama periode penelitian
    - Menandatangani _informed consent_ (persetujuan etik Komite Etik UNESA)
- **Titik Pengukuran Utama (Time Points)** selama 6 minggu:
    - **Baseline**: Minggu ke-0
    - **Pertengahan**: Minggu ke-3
    - **Akhir**: Minggu ke-6
- **Analisis Statistik** (IBM SPSS Statistics, signifikansi `p < 0.05`):
    - Statistik deskriptif
    - Uji normalitas: Shapiro–Wilk
    - Perubahan antar waktu: Repeated Measures ANOVA
    - Korelasi: Pearson / Spearman
    - Kontribusi indikator: Regresi berganda + uji multikolinearitas (VIF)
    - Evaluasi deteksi kelelahan: Sensitivitas, Spesifisitas, ROC Curve (acuan penurunan CMJ ≥ 10% dari baseline)
    - Validitas isi: Content Validity Index (CVI)
    - Reliabilitas pengukuran: Intraclass Correlation Coefficient (ICC)

---

## 5. Roadmap Pengembangan (2026–2031)

| Tahun    | Fokus Pengembangan                                                                                                                                         |
| -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **2026** | Model monitoring kelelahan atlet berbasis respons fisiologis & neuromuskular (integrasi ACWR, HRR, RHR, SpO₂, CMJ, Athlete Readiness dalam sistem digital) |
| **2027** | Validasi & generalisasi model pada berbagai cabang olahraga                                                                                                |
| **2028** | Pengembangan model prediksi kelelahan & risiko cedera                                                                                                      |
| **2029** | Penerapan _Machine Learning_ untuk meningkatkan akurasi klasifikasi & prediksi                                                                             |
| **2030** | Pengembangan _Decision Support System_ berbasis _Artificial Intelligence_ untuk rekomendasi latihan & pemulihan                                            |
| **2031** | Integrasi penuh menjadi _Precision Athlete Monitoring System_                                                                                              |

---

## 6. Referensi Pustaka Kunci (Pilihan dari Proposal)

- Akyildiz et al. (2022) — Post-match neuromuscular fatigue of young football players (_Scientific Reports_)
- Alba-Jiménez et al. (2022) — Trends assessing neuromuscular fatigue in team sports (_Sports_)
- Alecu & Onea (2025) — Readiness for competition across sports and genders (_Frontiers in Psychology_)
- Armstrong et al. (2022) — Overtraining syndrome as a complex systems phenomenon (_Frontiers in Network Physiology_)
- Bartels et al. (2018) — Heart rate recovery fast-to-slow phase transition (_Annals of Noninvasive Electrocardiology_)
- Impellizzeri et al. (2019) — Internal and external training load integration
- Marqués-Jiménez et al. (2022) — Match loads predicting neuromuscular fatigue (_IJERPH_)
- Pinelli et al. (2025) — ACWR and running parameters in elite football athletes (_Applied Sciences_)
- Rebelo et al. (2026) — Monitoring training effects in athletes: multidimensional framework (_Sports Medicine_)
- Sanders et al. (2024) — Jump load intensities on CMJ metrics (_Sensors_)
- Schneider et al. (2018) — Heart rate monitoring conceptual framework (_Frontiers in Physiology_)
- Schumann et al. (2023) — Comparing ACWR calculation methods (_Sports_)
