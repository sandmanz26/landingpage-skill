# Review batch-001: 3 referensi, catatan desainer vs 5 juri AI

Tanggal: 2026-10-30. Juri: art director, conversion strategist, customer researcher, story strategist, motion & accessibility engineer (masing-masing terpisah, tidak saling melihat). Data lengkap: `batch-001.json`, suara juri: `jury/batch-001/`, capture: `captures/`.

## Skor juri AI (1–10, belum ada suara manusia)

| Referensi | Kejelasan | Kekhasan | Craft | Bisnis | Konsumen | Story | Berbobot | Veto aksesibilitas |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Playfolly | 6 | 9 | 5 | 4 | 4 | 7 | **5,7** | Teks penjelas 1,70:1; halaman kosong tanpa JavaScript |
| Replay | 8 | 7 | 6 | 6 | 5 | 8 | **6,6** | Teks 2–8px, abu-abu 2,26:1, harga tersembunyi di ponsel |
| Scotch | 9 | 5 | 6,5 | 7 | 6 | 6 | **6,6** | Tanpa reduced motion; tombol utama 3,60:1 |

| Kolom | Dinilai oleh |
| --- | --- |
| Kejelasan, Kekhasan, Craft | Art director (Craft juga oleh juri motion & aksesibilitas) |
| Bisnis | Conversion strategist |
| Konsumen | Customer researcher |
| Story | Story strategist |

## Catatan Anda vs temuan juri

10 klaim diperiksa: **3 terbukti utuh, 5 terbukti dengan koreksi, 2 dibantah.**

| Ref | Klaim Anda | Putusan | Intinya |
| --- | --- | --- | --- |
| Playfolly | Judul bold besar + teks kecil ringan → kontras dan balance | Terbukti, dengan koreksi | 234px vs 14–18px (±13:1), satu font. Tapi teks kecilnya regular, bukan light; judul besarnya hanya nama brand tanpa tawaran; kalimat penjelasnya hampir tak terbaca (1,70:1) |
| Playfolly | Warna solid | Terbukti, dimaknai ulang | 0 gradien. Warnanya adalah pilihan warna produknya sendiri; itu sebabnya terasa kuat |
| Playfolly | Foto berperan penting | Terbukti | Anak sungguhan di halaman sungguhan menjawab "muat nggak di halaman saya". Layar pertama justru render 3D |
| Replay | Tidak mengandalkan gambar | Terbukti | Tidak ada foto sama sekali |
| Replay | Objek vektor sederhana yang dianimasikan | **Dibantah** | Bukan sederhana: tumpukan dokumen realistis bertekstur, 121 elemen bergerak |
| Replay | Mengikuti bisnis | Terbukti (sebagian besar) | Visualnya adalah data yang dijual (email, Jira, transkrip). Beberapa bagian hanya dekorasi |
| Replay | Ukuran font dominan kecil → rapi | **Dibantah** | Headline justru besar (72px serif). Yang kecil adalah teks 2–8px dan abu-abu yang gagal kontras |
| Replay | Tidak bertema modern (rounded) | Terbukti, cara pandang dikoreksi | Sudutnya memang tajam (2–3px). Tapi "rounded" bukan definisi "modern"; gayanya editorial |
| Scotch | Warna sederhana, mengandalkan gelap | Terbukti, ada harganya | Hitam + satu oranye. Cocok untuk minuman keras, tapi tombol utama hanya 3,60:1 |
| Scotch | Wireframe asli sangat membantu | Terbukti, istilah dikoreksi | Itu **UI produk sungguhan**, bukan wireframe, berisi merek whisky dan wine asli. Semua juri menyebut ini bagian terkuat |
| Scotch | Micro-interaction saat scroll | Terbukti, ternyata lebih besar | Diamati langsung: header bersembunyi (300ms), dan adegan utama adalah cerita scroll: kertas "cara lama" berterbangan, kalimat menyala kata per kata, lalu layar produk muncul |

**Koreksi untuk riset saya sendiri:** konteks bisnis Playfolly yang saya berikan ke juri ("dijual lewat konfigurator") salah. Itu dari cuplikan pencarian. Halaman aslinya hanya waitlist tanpa harga. Bisnis Replay juga baru diketahui dari halamannya: membayar perusahaan untuk melisensikan data operasionalnya ke lab AI.

## Yang terlewat dari catatan Anda

Semua catatan menilai tampilan. Temuan terbesar juri justru di bisnis dan konsumen:

- **Playfolly** tidak bisa dibeli: tanpa harga, tanpa usia anak, tombolnya hanya "Get updates". Paling khas secara visual (9), paling lemah secara bisnis (4).
- **Replay** meminta perusahaan menyerahkan datanya, tapi tidak menyebut satu pun nama pelanggan atau pembeli, dan angka "Millions paid" tidak bersumber.
- **Scotch** kehilangan tombol utamanya di sebagian besar scroll, dan "lowest fees guaranteed" tidak punya angka.
- **Ketiga tampilan yang Anda puji punya biaya aksesibilitas** yang membuatnya tidak boleh ditiru mentah-mentah (lihat kolom veto).

## Yang masuk kandidat perpustakaan

| Dari | Pola | Fungsi |
| --- | --- | --- |
| Playfolly | Palet = pilihan warna produk; swatch mengganti warna produk (300ms) dan latar halaman (700ms) | Pengunjung mulai "memiliki" konfigurasinya |
| Playfolly | Gambar ukuran (mm) dengan siluet anak, tepat sebelum ajakan | Menjawab "muat nggak?" |
| Playfolly | Usaha dalam satuan manusia: "dua orang dewasa, satu pagi" | Menjawab "repot nggak?" |
| Replay | Tangga keberatan: section disusun sesuai urutan ketakutan pembeli | Storyline untuk penawaran yang asing |
| Replay | Jangkar harga per ukuran perusahaan ("20–50 karyawan: $10K–$100K") | Tombol terasa mengonfirmasi angka, bukan mulai sales call |
| Replay | Satu kurva animasi untuk seluruh situs, reveal 270–470ms dengan stagger 55ms | Gerak yang konsisten |
| Scotch | UI produk diisi dunia pembeli (SKU asli) di hero | Bukti "dibuat untuk industri Anda" |
| Scotch | Cara lama vs cara baru dengan artefak yang dikenal pembeli, dianimasikan saat scroll | Story |
| Scotch | Testimoni video pemilik toko, difilmkan di tokonya, tepat setelah hero | Bukti dari sesama |

Semua pola ini masih **kandidat**. Pola-pola ini baru masuk ke skill lewat epoch berikutnya, setelah diuji.

## Pertanyaan untuk Anda (sebagai juri manusia)

1. Beri skor 1–10 untuk tiap referensi (satu angka keseluruhan sudah cukup), dan sebutkan bagian penilaian juri yang menurut Anda salah.
2. Playfolly: "balance" yang Anda maksud itu soal komposisi, atau perpaduan besar-kecilnya? Apakah halaman ini tetap Anda anggap bagus untuk klien yang harus menjual langsung?
3. Replay: "font kecil" yang Anda maksud label-label mono di sekitar visual, atau teks body? Yang Anda suka dari visualnya itu teksturnya atau gerakannya?
4. Scotch: catatan kedua terpotong. Yang Anda maksud adegan kertas berterbangan, atau header yang bersembunyi?
