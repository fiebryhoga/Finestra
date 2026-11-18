# Design System & Aturan UI/UX — Finestra

> **Status**: `Aktif (v1.0)`  
> **Identitas Visual**: Minimalis **shadcn/ui** • Tema **Biru Navy** • **Light & Dark Mode** • Estetika **Sports Science & Performance Lab**

---

## 1. Prinsip Desain & Identitas Visual

Finestra dirancang sebagai instrumen **sports science** modern — bukan aplikasi olahraga kasual yang ramai atau penuh dekorasi. Setiap elemen visual harus melayani kejernihan data fisiologis dan neuromuskular atlet.

1. **Minimalis & Presisi (shadcn/ui First)**
    - Gunakan permukaan bersih, border tipis (`1px solid var(--border)`), radius konsisten (`0.625rem`), dan whitespace yang lega.
    - Hindari gradasi mencolok, bayangan tebal (_heavy drop-shadow_), glassmorphism berlebihan, atau animasi dekoratif yang mengganggu pembacaan data.
2. **Data-First Sports Science Ergonomics**
    - Angka biometrik (`RHR`, `HRR`, `SpO₂`, `CMJ`, `ACWR`, `Fatigue Index`, `Readiness`) adalah fokus utama — tampilkan dengan kontras tinggi, satuan jelas (`bpm`, `%`, `cm`, `AU`), dan konteks baseline.
    - Warna semantik (hijau/kuning/merah) **hanya** digunakan untuk status fisiologis/risiko kelelahan, bukan sebagai hiasan tombol atau latar belakang umum.
3. **Dual-Mode Native (Light, Dark & System)**
    - Seluruh halaman, komponen, tabel, badge, dan grafik **wajib** mendukung **Light Mode** (kondisi terang/lapangan) dan **Dark Mode** (ruang analisis/telemetry) secara setara melalui CSS variables di `resources/css/app.css` dan `use-appearance.tsx`.
    - Dilarang menulis warna hardcoded seperti `bg-white`, `text-black`, `bg-gray-100`, atau kode hex langsung di komponen — selalu gunakan semantic token Tailwind/shadcn (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`, `bg-primary`, dll.).

---

## 2. Sistem Warna — Tema Biru Navy (OKLCH)

Seluruh token warna menggunakan ruang warna `oklch(...)` (selaras dengan Tailwind CSS v4 & shadcn/ui di `resources/css/app.css`) dengan rona dasar **Navy / Cool Slate-Navy (hue ~255–258)** sehingga nuansa laboratorium _sports science_ terasa kohesif di kedua mode.

### 2.1. Token Dasar Light & Dark Mode

| Token CSS                | Light Mode (Clinical Lab / Daylight) | Dark Mode (Telemetry Console) | Penggunaan                                     |
| ------------------------ | ------------------------------------ | ----------------------------- | ---------------------------------------------- |
| `--background`           | `oklch(0.99 0.003 255)`              | `oklch(0.145 0.028 258)`      | Latar belakang utama halaman                   |
| `--foreground`           | `oklch(0.17 0.035 258)`              | `oklch(0.96 0.008 255)`       | Teks utama                                     |
| `--card`                 | `oklch(1 0 0)`                       | `oklch(0.185 0.032 258)`      | Permukaan card, panel metrik, modal            |
| `--card-foreground`      | `oklch(0.17 0.035 258)`              | `oklch(0.96 0.008 255)`       | Teks di dalam card                             |
| `--popover`              | `oklch(1 0 0)`                       | `oklch(0.185 0.032 258)`      | Dropdown, tooltip, select menu                 |
| `--primary`              | `oklch(0.28 0.085 258)`              | `oklch(0.66 0.145 250)`       | Aksi utama (CTA), elemen aktif, identitas Navy |
| `--primary-foreground`   | `oklch(0.985 0.004 255)`             | `oklch(0.14 0.03 258)`        | Teks di atas `--primary`                       |
| `--secondary`            | `oklch(0.955 0.012 255)`             | `oklch(0.235 0.032 258)`      | Tombol sekunder, surface pendukung             |
| `--secondary-foreground` | `oklch(0.24 0.055 258)`              | `oklch(0.94 0.01 255)`        | Teks pada `--secondary`                        |
| `--muted`                | `oklch(0.96 0.01 255)`               | `oklch(0.22 0.028 258)`       | Latar tabel header, pill netral, skeleton      |
| `--muted-foreground`     | `oklch(0.48 0.028 258)`              | `oklch(0.7 0.024 255)`        | Label sekunder, satuan, timestamp              |
| `--accent`               | `oklch(0.935 0.022 255)`             | `oklch(0.26 0.042 258)`       | State hover item menu / row                    |
| `--accent-foreground`    | `oklch(0.22 0.065 258)`              | `oklch(0.96 0.008 255)`       | Teks pada `--accent`                           |
| `--destructive`          | `oklch(0.56 0.22 25)`                | `oklch(0.58 0.2 25)`          | Aksi hapus / error kritis                      |
| `--border` / `--input`   | `oklch(0.9 0.012 255)`               | `oklch(0.275 0.032 258)`      | Garis pemisah & border input                   |
| `--ring`                 | `oklch(0.45 0.12 258)`               | `oklch(0.66 0.145 250)`       | Focus ring aksesibilitas                       |
| `--sidebar`              | `oklch(0.975 0.008 255)`             | `oklch(0.125 0.026 258)`      | Latar sidebar navigasi                         |
| `--sidebar-primary`      | `oklch(0.28 0.085 258)`              | `oklch(0.66 0.145 250)`       | Aksen brand & item aktif sidebar               |

> **Catatan Inline Anti-Flash**: Saat token `--background` diterapkan ke `resources/css/app.css`, warna latar inline di `resources/views/app.blade.php` (`html` dan `html.dark`) wajib disinkronkan agar tidak terjadi kedipan (_flash_) saat load halaman.

### 2.2. Warna Semantik Status Sports Science

Digunakan secara konsisten untuk klasifikasi **ACWR**, **Fatigue Index**, **Readiness Classification**, **Penurunan CMJ**, dan **Risk Detection System**:

| Status / Zona                 | Arti Domain                                                                   | Gaya Badge Minimalis (Light / Dark)                                              |
| ----------------------------- | ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **Optimal / Ready**           | Kesiapan tinggi, beban latihan di _sweet spot_, pemulihan baik                | `bg-emerald-500/10 text-emerald-700 border-emerald-500/20 dark:text-emerald-400` |
| **Caution / Moderate**        | Kelelahan moderat, _undertraining_, atau perlu pemantauan ketat               | `bg-amber-500/10 text-amber-700 border-amber-500/20 dark:text-amber-400`         |
| **High Risk / Acute Fatigue** | Penurunan CMJ ≥ 10% dari baseline, ACWR zona risiko tinggi, SpO₂/HRR abnormal | `bg-rose-500/10 text-rose-700 border-rose-500/20 dark:text-rose-400`             |
| **Baseline / Info**           | Data acuan (Minggu-0), catatan protokol, status netral informatif             | `bg-sky-500/10 text-sky-700 border-sky-500/20 dark:text-sky-400`                 |

> **Aturan Aksesibilitas Status**: Status risiko **tidak boleh** hanya mengandalkan warna — selalu kombinasikan warna dengan label teks jelas (mis. `Optimal`, `Waspada`, `Risiko Tinggi`) dan/atau ikon ringkas.

### 2.3. Palet Grafik & Telemetry (`--chart-1` s.d. `--chart-5`)

| Token       | Domain Monitoring                            | Light Mode             | Dark Mode              |
| ----------- | -------------------------------------------- | ---------------------- | ---------------------- |
| `--chart-1` | Utama / ACWR / Composite Index (Navy-Cobalt) | `oklch(0.42 0.14 258)` | `oklch(0.68 0.15 250)` |
| `--chart-2` | Fisiologis — HRR / RHR / SpO₂ (Teal/Cyan)    | `oklch(0.56 0.13 200)` | `oklch(0.72 0.13 195)` |
| `--chart-3` | Neuromuskular — CMJ (Indigo-Blue)            | `oklch(0.5 0.16 275)`  | `oklch(0.7 0.15 275)`  |
| `--chart-4` | Beban Latihan — sRPE / Volume (Amber)        | `oklch(0.68 0.16 75)`  | `oklch(0.78 0.15 80)`  |
| `--chart-5` | Ambang Risiko / Fatigue Alert (Rose)         | `oklch(0.58 0.2 20)`   | `oklch(0.68 0.18 20)`  |

---

## 3. Tipografi & Penyajian Data Numerik

- **Font Utama (UI)**: `Instrument Sans` (bawaan stack), bersih dan presisi pada ukuran kecil hingga besar.
- **Angka & Telemetry (`tabular-nums`)**:
    - Seluruh angka metrik, tabel pengukuran, delta persentase (`-10.4%`), jam/durasi, dan skor kuesioner **wajib** memakai class `tabular-nums` (dan boleh memakai `font-mono` untuk kode ID atlet / nilai presisi tinggi) agar kolom angka rata lurus secara vertikal.
    - Tampilkan **satuan** dengan ukuran lebih kecil dan warna `text-muted-foreground` tepat di samping nilai (contoh: `54` `bpm`, `98` `%`, `42.5` `cm`, `1.18` `ratio`).
- **Hierarki Skala**:
    - **Page Title**: `text-2xl font-semibold tracking-tight`
    - **Section Title / Card Title**: `text-base font-semibold tracking-tight`
    - **KPI / Metric Value**: `text-2xl` hingga `text-3xl font-semibold tracking-tight tabular-nums`
    - **Label / Metadata**: `text-xs font-medium text-muted-foreground` (hindari uppercase berlebihan kecuali label kategori mikro yang sangat singkat)
    - **Body**: `text-sm leading-relaxed`

---

## 4. Layout, Navigasi & Ergonomi Lapangan

- **App Shell**:
    - Menggunakan pola **Sidebar + Header Breadcrumb** bawaan shadcn/ui (`AppLayout` / `AppSidebarLayout`).
    - Lebar konten utama nyaman untuk dashboard analitik (`max-w-7xl` untuk halaman form/detail dan penuh terkontrol untuk tabel/dashboard monitoring).
    - Mode tema (**Light / Dark / System**) mudah diakses oleh pengguna (tersedia di pengaturan tampilan dan dapat diakses cepat dari header/menu pengguna).
- **Spacing & Grid**:
    - Gunakan ritme jarak konsisten berbasis kelipatan `4px`: padding card `p-5` atau `p-6`, jarak antar card `gap-4` atau `gap-6`, jarak antar section `space-y-6`.
    - Dashboard ringkasan atlet memakai grid responsif (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` untuk kartu KPI metrik utama).
- **Responsif untuk Pengambilan Data Lapangan**:
    - Form input harian (RHR & SpO₂ pagi, HRR menit ke-1 & ke-2, CMJ 3 percobaan, sRPE pasca latihan, kuesioner Athlete Readiness) **wajib nyaman digunakan di layar HP dan tablet** (target sentuh minimal `h-10` / `40px`, input angka memakai `inputMode="decimal"` atau `inputMode="numeric"`).

---

## 5. Standar Komponen & Visualisasi Data

- **UI Primitives**:
    - Wajib memprioritaskan komponen **shadcn/ui** di `resources/js/components/ui/` (`Button`, `Card`, `Badge`, `Input`, `Select`, `Table`, `Tabs`, `Dialog`, `Sheet`, `Tooltip`, `Separator`, `Skeleton`, `Sonner` toast).
    - Ikonografi menggunakan **Lucide React** (`strokeWidth={1.75}` atau default `2`, ukuran konsisten `size-4` di tombol/nav dan `size-5` di header card).
- **Pola Komponen Khas Sports Science**:
    - **Metric / KPI Card**: Judul indikator + ikon tipis di kanan atas, nilai utama (`tabular-nums`) + satuan, serta satu baris indikator tren/perbandingan terhadap baseline (mis. `-4.2% vs baseline`).
    - **Baseline Reference Line pada Grafik**: Grafik tren CMJ, ACWR, dan RHR/HRR sebaiknya menampilkan garis acuan (_reference line_) atau pita zona aman (_sweet spot band_ / ambang penurunan CMJ `-10%`) dengan opacity rendah agar pelatih dapat membaca anomali dalam sekejap.
    - **Form Input Multi-Trial (CMJ)**: Untuk input 3 kali percobaan CMJ, tampilkan 3 input berdampingan dengan kalkulasi **nilai terbaik (best value)** secara otomatis dan real-time sebelum disimpan.
    - **Tabel Data Monitoring**: Header ringkas, filter tanggal/atlet/zona risiko di bagian atas, kolom angka rata kanan (`text-right tabular-nums`), dan badge status di kolom paling kanan.
- **State Wajib di Setiap Halaman**:
    - **Empty State**: Minimalis (ikon muted + pesan singkat + tombol aksi utama jika relevan).
    - **Loading State**: Gunakan `Skeleton` yang menyerupai bentuk konten asli, hindari spinner layar penuh kecuali aksi transisi kritis.
    - **Error & Validation State**: Pesan error validasi fisiologis jelas di bawah field (`InputError`) disertai contoh rentang normal jika membantu enumerator/atlet.
    - **Feedback Aksi**: Gunakan toast (`sonner`) untuk konfirmasi simpan/ekspor/hapus yang tidak mengganggu alur input beruntun.
