# Dokumentasi & Aturan Project Finestra

Folder ini menjadi _single source of truth_ untuk seluruh aturan teknis, panduan desain, PRD, arsitektur, dan landasan ilmiah pengembangan **Finestra (Physiological and Neuromuscular Tracking)**.

## Struktur Folder

```text
docs/
├── README.md                              # Panduan struktur folder dokumentasi
├── rules/                                 # Aturan kerja & standar teknis (isi sesuai kebutuhan)
│   ├── design-system.md                   # Aturan UI/UX, warna, tipografi, komponen, layout
│   ├── coding-standards.md                # Aturan penulisan kode PHP/Laravel & React/TSX
│   ├── feature-workflow.md                # Prosedur pembuatan fitur baru & Definition of Done
│   └── database-and-api.md                # Aturan skema DB, migrasi, validasi, Inertia props
├── prd/                                   # Product Requirements Document
│   ├── 00-prd.md                          # PRD utama produk Finestra (template siap isi)
│   └── features/                          # Spesifikasi per fitur (mis. 01-atlet.md, 02-acwr.md)
├── architecture/                          # Desain sistem & keputusan arsitektur
│   ├── system-overview.md                 # Ringkasan stack teknis & struktur codebase
│   └── adr/                               # Architecture Decision Records
└── research/                              # Referensi ilmiah & landasan domain
    └── 01-usulan-penelitian-unesa-2026.md # Ringkasan terstruktur Usulan Penelitian UNESA 2026
```

## Cara Penggunaan

1. **Isi aturan Anda** di folder `docs/rules/` (design system, standar penulisan kode, alur fitur, database).
2. **Tulis PRD & spesifikasi fitur** di folder `docs/prd/` dan `docs/prd/features/`.
3. **Tambahkan referensi ilmiah/rumus** baru ke folder `docs/research/` bila diperlukan.
4. File [`AGENTS.md`](../AGENTS.md) di root repositori sudah diarahkan untuk selalu membaca folder `docs/` sebelum membangun fitur apa pun.
