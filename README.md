# design-director

Skill untuk Claude yang membuat dan memperbaiki desain web supaya terasa didesain untuk kliennya, bukan hasil generate rata-rata. Rancangan lengkapnya ada di [`docs/SPEC.md`](docs/SPEC.md).

**Status: v0.2.** Alur inti, gerbang, dan alat pemeriksa sudah jalan. Setiap run kini wajib riset (bisnis, pesaing, konsumen), menyusun strategi dan storyline, dan me-roast rencananya sendiri; hasil riset dikembalikan ke pemakai. Perpustakaan referensi tim (v0.4) dan perpustakaan section kode (v0.5) belum ada; arah desain sementara diambil dari pustaka awal taste-skill (MIT, lihat [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md)).

## Isi

```
skill/design-director/      ← folder skill yang dipasang
├── SKILL.md                pintu masuk: mode, prinsip, gerbang, turn back
├── research/, strategy/, roast/   metode riset, strategi + storyline, roast (wajib)
├── modes/                  create, improve (review/restyle/redesign), site, section, app-screen
├── rules/                  aturan objektif, default AI, copyright, prioritas, copy Indonesia
├── motion/                 motion sebagai UX
├── rubric/                 rubrik kritikus + log kalibrasi
├── team/                   selera tim (diisi tim)
├── brands/, designers/     profil klien dan desainer (template)
├── library/                pustaka arah
├── scripts/                progress, draw, inspect, lint, selftest
└── evals/                  protokol uji, brief, trigger test, fixture
docs/SPEC.md                spesifikasi dan alasan desainnya
templates/referensi-dan-brief.xlsx   template Excel untuk mengumpulkan referensi, brief uji dan desainer
```

## Memasang di komputer lokal

Kebutuhan: Node 18+ (disarankan 22) dan Chromium untuk Playwright.

```bash
# 1. Salin skill ke proyek (atau ke ~/.claude/skills/ untuk semua proyek)
mkdir -p .claude/skills
cp -r path/ke/landingpage-skill/skill/design-director .claude/skills/

# 2. Pasang Playwright dan browser-nya
cd .claude/skills/design-director
npm install
npx playwright install chromium

# 3. Pastikan semuanya jalan
npm test
```

Setelah terpasang, cukup minta ke Claude Code, misalnya *"Buatkan halaman untuk Senyum Dental, klinik gigi di Bandung"* atau *"Review tampilan dashboard ini"*. Skill aktif sendiri.

## Alat yang bisa dipakai langsung

| Perintah | Fungsi |
| --- | --- |
| `node scripts/inspect.mjs <url atau file>` | Membuka halaman di browser pada 1440/768/390px, mengukur kontras, overflow, font, tap target, konten tersembunyi, pola default AI, lalu menyimpan screenshot dan inventaris desain |
| `node scripts/lint.mjs <folder>` | Mencari copy klise (Inggris dan Indonesia), placeholder, dan pola styling default di source |
| `node scripts/draw.mjs --sector health --options 3` | Membagikan 3 arah desain yang berbeda |
| `node scripts/progress.mjs status` | Melihat posisi langkah dan gerbang di proyek |

## Mengisi selera tim

1. Tulis aturan di `skill/design-director/team/taste.md` (format dan contoh ada di file itu).
2. Taruh screenshot desain yang disetujui di `team/approved/` dan yang ditolak di `team/rejected/`, lalu catat alasannya di bagian *Anchors*.
3. Untuk mengubah seberapa keras pemeriksaan default AI, salin `team/taste-rules.example.json` menjadi `team/taste-rules.json`.

## Langkah berikutnya

1. Set brief ujian (lihat `skill/design-director/evals/README.md`).
2. Baseline: tanpa skill vs taste-skill vs design-director, dinilai blind oleh desainer.
3. v0.2: gerbang arah dengan referensi + hero best-of-3, lalu v0.3: loop selera tim.
