# Spesifikasi skill: design-director (nama kerja)

Status: rancangan v0, 29 Oktober 2026. Dokumen ini menjawab satu pertanyaan: **apa yang terjadi ketika orang memakai skill ini**, dan kenapa setiap langkahnya dirancang begitu.

## 1. Tujuan

Menghasilkan desain web, baik halaman baru maupun perbaikan UI yang sudah ada, yang:

- spesifik untuk klien, bukan rata-rata kategori;
- sesuai selera tim desain pemakainya, bukan selera universal pembuat skill;
- terbukti menang dalam uji blind oleh desainer manusia melawan dua pembanding: tanpa skill, dan taste-skill v2.

## 2. Prinsip rancangan dan alasan teknisnya

| # | Prinsip | Alasan dari cara kerja model |
| --- | --- | --- |
| 1 | Inti tipis, detail dimuat saat dibutuhkan | Context yang penuh mengencerkan instruksi. `SKILL.md` maksimal ±3k token; total context per langkah ditargetkan ≤ 20k token |
| 2 | Keputusan ditulis sebelum kode | Model menulis satu arah dari atas ke bawah dan tidak kembali. Spec yang tertulis mencegah keputusan diambil diam-diam di tengah kode |
| 3 | Manusia masuk di titik termurah | Selera paling berpengaruh di keputusan arah. Dua gerbang singkat (brief, arah) lebih efektif daripada revisi panjang di akhir |
| 4 | Selera tim adalah data, bukan aturan universal | Aturan universal menjadi "gaya skill" yang lama-lama dikenali sebagai tell. Taste profile tim dan brand profile klien dimuat setiap kali |
| 5 | Script untuk hal pasti, model untuk penilaian | Pencarian referensi, lint, inspeksi, dan cek kemiripan dikerjakan script: nol token, hasil konsisten |
| 6 | Penilai bukan pembuatnya | Model lunak menilai karyanya sendiri. Kritik dilakukan subagent dengan context bersih yang hanya melihat screenshot, tanpa tahu siapa pembuatnya |
| 7 | Hormati yang sudah ada | Mode perbaikan bekerja di level token dan komponen, bukan menimpa per halaman. Ini penyebab utama taste-skill sering gagal saat memperbaiki UI |
| 8 | Belajar lewat file | Model tidak mengingat antar-sesi. Setiap selesai pekerjaan, skill mengusulkan perubahan taste profile; manusia yang menyetujui |

## 3. Mode

Skill menentukan mode di langkah pertama dari kata-kata permintaan dan isi proyek. Kalau ragu, skill menyebut tebakannya dalam satu baris dan melanjutkan.

| Mode | Dipicu oleh | Hasil |
| --- | --- | --- |
| **Create** | Halaman atau situs baru | Halaman lengkap + spec + screenshot + laporan |
| **Review** | "review", "audit", "kenapa jelek" | Laporan temuan + 3 perubahan paling berdampak. Tidak mengubah kode |
| **Restyle** | "perbaiki tampilan", layout dipertahankan | Token dan komponen diperbarui, struktur tetap |
| **Redesign** | "rombak", "desain ulang" | Struktur baru; konten, stack, dan perilaku tetap |
| **Section** | Satu section atau komponen | Section yang menyatu dengan desain di sekitarnya |

Bendera tambahan: **app screen** (dashboard, admin, settings) memakai aturan layar kerja, bukan aturan halaman marketing. **Autopilot** melewati gerbang manusia dan mencatat setiap pilihan beserta alasannya, untuk lingkungan tanpa interaksi.

## 4. Alur mode Create

Contoh permintaan: *"Buatkan halaman untuk Senyum Dental, klinik gigi di Bandung."*

| Langkah | Yang dilakukan skill | Yang dilihat pemakai | Gerbang |
| --- | --- | --- | --- |
| 0. Muat | `SKILL.md`, `team/taste.md`, `brands/<klien>.md` bila ada | — | — |
| 1. Brief | Mengekstrak fakta dari permintaan dan file proyek. Maksimal 5 pertanyaan, hanya untuk yang menghalangi pekerjaan | **Brief card** ≤ 10 baris: produk, audiens, satu aksi utama, aset yang benar-benar ada, yang harus dihindari | **Gerbang 1**: konfirmasi atau koreksi |
| 2. Subjek dan argumen | Inventaris 8–12 hal yang hanya dimiliki klien ini. Halaman ditulis sebagai klaim dan bukti per section; section tanpa klaim dihapus | Ringkasan argumen dan urutan section | — |
| 3. Arah | Script `find_refs` mengambil 12 kandidat dari perpustakaan tim, menyaring keragaman, lalu skill menyusun 3 arah. Setiap arah berisi tabel keputusan, 3 thumbnail referensi beserta perannya, kalimat ide, dan hasil competitor test | **3 kartu arah** yang benar-benar berbeda | **Gerbang 2**: pilih satu, atau campur ("tipe dari A, warna dari B") |
| 4. Spec | Token sebagai CSS variables, rencana section, tabel peran referensi, dan kalimat ide disimpan ke `.design/spec.md` | Spec satu halaman | Opsional |
| 5. Copy | Seluruh copy ditulis sebelum markup, dengan konten nyata dari brief. Konten contoh ditandai untuk diganti | — | — |
| 6. Build | Token → hero → section → gambar. Hero dibuat **3 varian**, dinilai subagent kritikus secara blind, lalu yang terbaik dilanjutkan. Section diadaptasi dari perpustakaan section kode | — | — |
| 7. Gate otomatis | `lint` + `inspect` di 1440/768/390px: aturan objektif + aturan dari taste profile + cek kemiripan dengan referensi | — | Wajib 0 FAIL |
| 8. Lihat | Subagent kritikus (context bersih, hanya screenshot, rubrik tim) menilai. Perbaiki 3 masalah teratas, maksimal 3 putaran | — | — |
| 9. Serahkan | File, screenshot desktop dan mobile, spec, laporan cek, daftar konten contoh yang harus diganti | **Paket hasil** | **Gerbang 3**: setuju atau minta revisi |
| 10. Belajar | Meminta feedback satu kalimat, lalu mengusulkan perubahan `team/taste.md` dalam bentuk diff | Usulan aturan baru | Desainer menyetujui |

## 5. Alur mode perbaikan (Review, Restyle, Redesign)

| Langkah | Yang dilakukan skill |
| --- | --- |
| 0. Kenali proyek | Deteksi stack dan design system: config Tailwind, CSS variables, library komponen, file token |
| 1. Rekam kondisi awal | `inspect` di 3 lebar layar + **audit token**: jumlah warna unik, ukuran font, nilai spacing, radius, shadow yang benar-benar dipakai. Hasilnya laporan "utang desain" berisi angka |
| 2. Review | Subagent kritikus menilai screenshot. Temuan diurutkan berdasarkan dampak dan risiko. **Mode Review berhenti di sini** |
| 3. Gerbang | Desainer memilih perbaikan mana yang dikerjakan |
| 4. Perbaiki di lapisan terendah | Token dulu, lalu komponen, baru halaman. Override per halaman dilarang kalau perubahan token atau komponen bisa menyelesaikannya. Urutan: tipe → warna → frame dan spacing → state → komponen |
| 5. Rekam kondisi akhir | `inspect` ulang, perbandingan visual before/after, cek regresi (link, form, menu tetap berfungsi) |
| 6. Laporan | Angka before dan after berdampingan: jumlah warna, ukuran font, FAIL, kontras |

## 6. Isi context per langkah

Target: tidak ada langkah yang memuat lebih dari ±20k token instruksi dan referensi.

| Langkah | Yang dimuat | Perkiraan token |
| --- | --- | --- |
| 0–2 | `SKILL.md`, file mode, taste profile, brand profile | ±7k |
| 3 | + ringkasan 12 kandidat (JSON ringkas) + 9 thumbnail kecil | ±6k |
| 4–6 | Spec + 2–3 section kode yang relevan, menggantikan isi langkah 3 | ±8k |
| 7–8 | Laporan inspeksi + screenshot (di subagent kritikus, bukan di context pembuat) | ±6k |

Pembanding: taste-skill v2 memuat `SKILL.md` ±10k token, ditambah file referensi hingga belasan ribu token per file.

## 7. Struktur file

```
skill/design-director/
├── SKILL.md                 router + prinsip + alur ringkas
├── modes/                   create.md, improve.md, app-screen.md, section.md
├── rules/
│   ├── objective.md         aturan terukur universal (kontras, overflow, baris headline, skala spacing)
│   ├── defaults.md          pola default AI yang dideteksi
│   └── copyright.md         aturan referensi
├── rubric/critic.md         rubrik kritikus (bobot dari tim)
├── team/                    diisi tim: taste.md, approved/, rejected/
├── brands/                  satu file per klien
├── library/                 index.json + thumbs/ (exemplar dari perpustakaan tim)
├── sections/                section kode per peran (hero, pricing, …)
├── scripts/                 find_refs, inspect, lint, similarity, tokens_audit
└── evals/                   brief uji + hasil
```

Perpustakaan referensi penuh disimpan di luar skill; skill hanya membawa index dan exemplar.

## 8. Perbedaan dengan taste-skill v2

| Bidang | taste-skill v2 | design-director |
| --- | --- | --- |
| Fondasi ide dari subjek | Ada (inventaris, competitor test) | Dipakai, dengan atribusi (MIT) |
| Pemilihan arah | Diacak script, dipilih AI sendiri | Dipilih dari perpustakaan tim, diputuskan desainer |
| Selera | Aturan universal pemilik repo | Taste profile tim + brand profile klien |
| Data | 247 situs galeri global | Referensi tim sesuai model bisnis dan pasarnya |
| Penilai | Model yang membuat | Subagent bersih, blind, rubrik tim |
| Perbaikan UI | Jalur sampingan, sering bertabrakan dengan design system | Mode kelas satu: audit token, lapisan terendah, cek regresi |
| Ukuran context | Sangat besar | Ramping, dimuat per langkah |
| Belajar | Direvisi pemilik repo | Loop taste per tim, disetujui manusia |
| Bukti | Juri model, menang 4 dari 16 brief vs tanpa skill | Juri desainer, target menang ≥ 60% vs taste-skill |

## 9. Ukuran keberhasilan

- **Create:** menang ≥ 60% dalam voting blind berpasangan oleh minimal 3 desainer, pada minimal 12 brief, melawan taste-skill v2 dan tanpa skill.
- **Perbaikan:** ≥ 80% usulan perbaikan diterima desainer; nol regresi fungsional.
- **Keragaman:** hasil dari brief berbeda tidak saling mirip (diukur dengan kemiripan visual).
- **Copyright:** tidak ada hasil yang melewati ambang kemiripan dengan referensi mana pun.

## 10. Urutan pembangunan

Setiap versi baru dilanjutkan hanya bila lolos uji terhadap versi sebelumnya.

| Versi | Isi |
| --- | --- |
| v0.1 | `SKILL.md`, mode Create dan perbaikan, aturan objektif, inspector, subagent kritikus, file spec |
| v0.2 | Gerbang arah (3 kartu arah) + hero best-of-3 |
| v0.3 | Taste profile tim, brand profile, loop belajar |
| v0.4 | Perpustakaan referensi tim (1000) + `find_refs` |
| v0.5 | Perpustakaan section kode |

## 11. Keterbatasan yang sudah diketahui

- Subagent kritikus butuh lingkungan yang mendukung subagent (Claude Code). Di lingkungan lain, kritik dilakukan di langkah terpisah yang hanya memuat screenshot; lebih lemah, tetapi tetap lebih baik daripada menilai dari kode.
- Inspector butuh Node dan Chromium. Tanpa itu, gate otomatis tidak berjalan dan laporan wajib menyebutnya.
- Gerbang manusia menambah 2–3 menit per proyek. Mode autopilot tersedia, dengan kualitas yang diharapkan lebih rendah.
