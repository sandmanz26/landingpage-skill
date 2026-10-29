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
| **Site** | Lebih dari satu halaman, atau alur bertahap (onboarding, checkout) | Sistem bersama dulu (token, nav, footer, komponen), lalu halaman per halaman; lihat §13 |

Bendera tambahan: **app screen** (dashboard, admin, settings) memakai aturan layar kerja, bukan aturan halaman marketing. **Autopilot** melewati gerbang manusia dan mencatat setiap pilihan beserta alasannya, untuk lingkungan tanpa interaksi.

## 4. Alur mode Create

Contoh permintaan: *"Buatkan halaman untuk Senyum Dental, klinik gigi di Bandung."*

| Langkah | Yang dilakukan skill | Yang dilihat pemakai | Gerbang |
| --- | --- | --- | --- |
| 0. Muat | `SKILL.md`, `team/taste.md`, `brands/<klien>.md` bila ada | — | — |
| 1. Brief | Mengekstrak fakta dari permintaan dan file proyek. Maksimal 5 pertanyaan, hanya untuk yang menghalangi pekerjaan | **Brief card** ≤ 10 baris: produk, audiens, satu aksi utama, aset yang benar-benar ada, yang harus dihindari | **Gerbang 1**: konfirmasi atau koreksi |
| 2. Subjek dan argumen | Inventaris 8–12 hal yang hanya dimiliki klien ini. Halaman ditulis sebagai klaim dan bukti per section; section tanpa klaim dihapus | Ringkasan argumen dan urutan section | — |
| 3. Arah | Script `find_refs` mengambil 12 kandidat dari perpustakaan tim, menyaring keragaman, lalu skill menyusun 3 arah. Setiap arah berisi tabel keputusan, 3 thumbnail referensi beserta perannya, kalimat ide, dan hasil competitor test | **3 kartu arah** yang benar-benar berbeda | **Gerbang 2**: pilih satu, atau campur ("tipe dari A, warna dari B") |
| 3b. Kerangka | Kerangka abu-abu (wireframe) arah terpilih dirender di 1440 dan 390px: komposisi tiap section, ritme padat/lapang, komposisi mobile tersendiri, uji isi ekstrem (nama panjang, 3 vs 7 item, tanpa gambar) | Screenshot kerangka | Ikut Gerbang 2, atau disetujui diam-diam di gaya gerbang cepat |
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

- **Create:** menang ≥ 65% dalam voting blind berpasangan oleh minimal 3 desainer, pada 20 brief (60 suara per perbandingan), melawan taste-skill v2 dan tanpa skill. Dengan 60 suara, 65% berarti p ≈ 0,014; target 60% (p ≈ 0,08) belum bisa dibedakan dari kebetulan. 5 dari 20 brief disimpan sebagai **hold-out** yang tidak pernah dipakai saat merevisi skill, supaya skill tidak hanya pandai di soal latihan.
- **Kritikus:** pilihan subagent kritikus cocok dengan pilihan mayoritas desainer pada ≥ 70% pasangan. Di bawah itu, rubrik kritikus direvisi sebelum dipakai untuk memilih varian.
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

## 12. State proyek dan "turn back"

Semua keputusan disimpan di folder `.design/` proyek, bukan hanya di percakapan, karena percakapan bisa panjang, dipotong, atau dimulai ulang.

```
.design/
├── brief.md            brief card yang disetujui
├── argument.md         inventaris subjek + klaim per section
├── directions/         ketiga arah disimpan, termasuk yang tidak dipilih (A.md, B.md, C.md)
├── spec.md             spec aktif, dengan nomor versi
├── decisions.log       satu baris per keputusan: waktu, langkah, keputusan, alasan, siapa
└── snapshots/          screenshot setiap versi yang pernah diserahkan
```

**Peta ketergantungan.** Setiap langkah bergantung pada langkah sebelumnya:

brief → argumen → arah → kerangka → token → copy → section → gambar → motion

**Protokol turn back.** Ketika pemakai berubah pikiran ("balik ke arah B", "ternyata audiensnya anak muda"):

1. Skill mengidentifikasi keputusan mana yang berubah dan mencatatnya di `decisions.log`.
2. Hanya langkah **setelah** keputusan itu yang dibatalkan; yang sebelumnya tetap.
3. Skill menyebut dampaknya dalam satu baris sebelum mengerjakan: "Ganti ke arah B: token, kerangka, dan 4 section dibuat ulang; brief, argumen, dan copy tetap."
4. Arah lama tidak dihapus. Pemakai bisa kembali lagi tanpa kehilangan pekerjaan.
5. Perubahan kecil (satu warna, satu ukuran) tidak memicu protokol ini; cukup ubah token dan catat.

Dilarang menambal hasil lama dengan keputusan baru di atasnya. Itu yang menghasilkan desain campur aduk.

## 13. Alur kompleks: banyak halaman dan alur bertahap

**Mode Site:**

1. **Sitemap + peran tiap halaman**, termasuk alur (misalnya landing → pricing → daftar → onboarding).
2. **Sistem bersama dulu:** token, navigasi, footer, komponen dasar, dan satu halaman acuan. Gerbang arah dilakukan sekali untuk seluruh situs.
3. **Halaman per halaman**, masing-masing dengan argumennya sendiri, tapi hanya memakai sistem bersama.
4. **Cek konsistensi lintas halaman:** token yang sama, komponen yang sama, tidak ada nilai di luar sistem.
5. **Spec logika** untuk bagian yang punya perilaku: state, edge case, dan acceptance test dengan jawaban yang diharapkan (format dari panduan tim).

Untuk proyek besar, setiap halaman dikerjakan di sesi atau subagent terpisah yang memuat `.design/` saja, supaya context tidak menumpuk.

## 14. Pemakai dengan berbagai gaya

### Gaya gerbang

| Gaya | Cocok untuk | Bentuk gerbang |
| --- | --- | --- |
| **Guided** (bawaan) | Desainer yang ingin terlibat | 3 kartu arah, pilih atau campur |
| **Quick** | Pemakai yang tidak suka memilih | Satu rekomendasi + alasan satu kalimat + "lanjut?". Dua alternatif hanya ditampilkan bila diminta |
| **Autopilot** | Tanpa interaksi | Tidak ada gerbang; setiap pilihan dan alasannya dicatat di laporan |

Bila pemakai menjawab "terserah" atau memilih rekomendasi tiga kali berturut-turut, skill menawarkan pindah ke gaya Quick dan mencatat preferensinya di profil pemakai. Rekomendasi selalu ditandai sebagai rekomendasi, dan opsi lain tetap berbeda nyata, bukan tiga variasi yang hampir sama.

### Selera yang sulit diucapkan atau saling bertentangan

- **Kalibrasi dengan perbandingan.** Orang lebih mudah memilih daripada menjelaskan. Skill menampilkan 4–6 pasang thumbnail kecil yang berbeda di satu sumbu ("lebih ke kiri atau kanan?"). Jawabannya menempatkan brand di skala positioning tanpa pemakai harus menulis kata sifat.
- **Brief terbalik.** "Sebutkan 1–3 situs yang Anda tidak suka, dan kenapa." Larangan konkret lebih mudah didapat daripada keinginan.
- **Tabel ketegangan.** Bila keinginan bertentangan ("premium tapi ramah"), skill menuliskan di mana masing-masing berlaku: "premium di tipografi dan ruang, ramah di copy dan foto". Pemakai mengoreksi tabelnya, bukan desainnya.

### Feedback yang kabur setelah build

"Kurang wow" atau "kurang pas" tidak ditebak. Skill:

1. Menulis 2–3 hipotesis penyebab ("fokus hero lemah", "kontras ukuran kurang", "foto terlalu generik").
2. Membuat varian kecil **hanya untuk area itu** (crop hero A/B/C), bukan merombak seluruh halaman.
3. Pemakai memilih; pilihannya menjadi aturan di spec.

### Selera tim vs selera pribadi

Lapisan selera: `team/taste.md` (bersama) → `designers/<nama>.md` (pribadi, opsional). Bila bertentangan, berlaku urutan prioritas di §15. Setiap aturan selera mencatat asalnya (proyek, tanggal, siapa) dan ditinjau ulang setelah 3 bulan, supaya aturan usang tidak berlaku diam-diam.

## 15. Urutan prioritas aturan

Bila dua aturan bertentangan, yang lebih atas menang:

1. Aturan objektif: aksesibilitas, kontras, tidak ada overflow, fungsi tetap berjalan
2. Hak cipta dan aturan referensi
3. Brand profile klien
4. Brief proyek ini dan keputusan di `decisions.log`
5. Selera pribadi desainer
6. Selera tim
7. Bawaan skill

Konflik yang diselesaikan dengan aturan ini disebut di laporan.

## 16. Struktur layout

Kerangka (langkah 3b) memastikan struktur sebelum gaya:

- **Satu grid, margin luar sama di kiri dan kanan,** asimetri hanya di dalam grid.
- **Section bertetangga tidak memakai komposisi yang sama;** satu kata per section (split, daftar, full-bleed, statement…) tidak boleh berulang berturut-turut.
- **Ritme:** jarak antar-section jelas lebih besar dari jarak di dalam section; minimal satu section padat dan satu lapang.
- **Mobile adalah komposisi sendiri,** bukan desktop yang diperas: urutan, crop, dan baris headline direncanakan.
- **Uji isi ekstrem** sebelum gaya: nama atau judul panjang, jumlah item berbeda, gambar hilang, teks Bahasa Indonesia yang biasanya lebih panjang dari versi Inggris.

## 17. Simulasi internal (walkthrough di atas kertas)

Setiap skenario dijalankan sebagai walkthrough terhadap rancangan v0 (§1–§11) dan rancangan setelah perbaikan (§12–§16). Ini penilaian rancangan, bukan hasil menjalankan model; angka sebenarnya datang dari uji di §9.

| # | Skenario | v0 | Setelah perbaikan | Penanganan |
| --- | --- | --- | --- | --- |
| 1 | Brief lengkap, desainer aktif | Tertangani | Tertangani | Alur Create |
| 2 | Brief satu kalimat, tanpa aset | Sebagian | Tertangani | Brief card + konten contoh berlabel + strategi gambar |
| 3 | Pemakai tidak suka memilih | Gagal: gerbang jadi beban | Tertangani | Gaya Quick + rekomendasi + belajar preferensi |
| 4 | Balik ke arah B setelah build | Gagal: hasil ditambal | Tertangani | `.design/` + peta ketergantungan + protokol turn back |
| 5 | Audiens berubah di tengah jalan | Gagal | Tertangani | Pembatalan dari langkah brief, copy dan arah dibuat ulang |
| 6 | "Premium tapi ramah, seperti A tapi jangan terlalu…" | Sebagian | Tertangani | Kalibrasi perbandingan + tabel ketegangan |
| 7 | "Kurang wow" | Gagal: ditebak | Tertangani | Hipotesis + varian kecil per area |
| 8 | Situs 5 halaman + alur daftar | Gagal: hanya satu halaman | Tertangani | Mode Site + sistem bersama + spec logika |
| 9 | Brand guideline ketat | Sebagian | Tertangani | Brand profile + urutan prioritas |
| 10 | Perbaiki dashboard Tailwind + shadcn | Tertangani | Tertangani | Mode perbaikan, lapisan token, bendera app screen |
| 11 | Dua desainer, selera berbeda | Gagal | Sebagian | Lapisan selera; konflik antarpribadi tetap butuh keputusan tim |
| 12 | Sesi panjang, spec mulai dilupakan | Sebagian | Tertangani | `.design/` dibaca ulang sebelum tiap section; sesi baru cukup memuat folder itu |
| 13 | Kritikus menyukai gaya yang tidak disukai tim | Gagal: tidak terdeteksi | Tertangani | Kalibrasi kritikus vs voting desainer (≥ 70%) + contoh approved/rejected sebagai jangkar |
| 14 | Lingkungan tanpa Chromium atau subagent | Sebagian | Sebagian | Degradasi terdokumentasi; kualitas memang turun |
| 15 | Perpustakaan 1000 referensi belum siap | Gagal: arah tidak punya sumber | Tertangani | v0.1 memakai pustaka arah awal (taste-skill, MIT, dengan atribusi) + referensi tim yang sudah ada |

Ringkasan: v0 menangani 2 dari 15 skenario sepenuhnya, 5 sebagian, 8 gagal. Setelah perbaikan: 13 tertangani, 2 sebagian. Dua yang tersisa memang di luar kendali skill: perbedaan selera antarmanusia, dan lingkungan tanpa alat.
