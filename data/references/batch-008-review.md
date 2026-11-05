# Review batch-008: Quilt

Tanggal: 2026-11-05. Tiga halaman direkam (beranda, "How it works", "Find an installer"; 3,5 menit, 0 token). Juri: 2 juri AI gabungan (72 ribu + 73 ribu token). Skor Anda: visual 7, layak kirim 7,5. Data lengkap: `batch-008.json`.

## Skor

| Situs | Kejelasan | Kekhasan | Craft | Bisnis | Konsumen | Cerita | AI berbobot | Anda (visual/kirim) | Gabungan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quilt | 7 | 8 | 7 | 7 | 6 | 6 | 6,7 | 7 / 7,5 | 7,1 (selisih 0,8) |

**Ini selisih AI dan Anda yang paling kecil sejauh ini.** Kekhasan dan craft hampir sama dengan penilaian Anda.

**Koreksi kategori:** Quilt bukan bidang kesehatan. Produknya pompa panas/AC tanpa saluran untuk rumah, dijual lewat installer. Di library saya catat sebagai **home** (sektor baru), dengan catatan bahwa Anda memasukkannya ke kesehatan.

## Catatan Anda, diukur

| Klaim | Putusan | Angka |
| --- | --- | --- |
| 1. Warna harmonis, tidak monoton | **Benar untuk beranda** | 4 warna dalam 2 keluarga (teal/biru muda, koral/salem) di atas krem dan putih, diulang di bingkai, blok dan ilustrasi. Halaman installer tidak berwarna sama sekali. Link teal gagal kontras (3,48:1) |
| 2. Slider foto + deskripsi di bawah menjelaskan produk | Sebagian | Thumbnail mengganti foto empat bagian produk, dengan satu keterangan di bawahnya. Keterangannya menyebut nama bagian, bukan apa manfaatnya bagi pemilik rumah. Anda benar bahwa ini bergantung pada pilihan foto |
| 3. Grafik vektor dibuat senada dengan website | **Benar; kedua juri menyebutnya poin terkuat** | Ruangan isometrik digambar dengan palet situsnya sendiri plus garis hitam, dan tiap ruangan diberi lencana suhu. Gambarnya menjelaskan cara kerja: suhu berbeda per ruangan. Inspector menghitung 0 ilustrasi di beranda (kemungkinan Lottie); ini celah pengukuran |
| 4. Section "why" ala Pinterest itu cerdas dan tidak umum | **Cerdas ya, tidak umum kurang tepat** | Dinding masonry untuk testimoni cukup umum. Yang membuatnya berhasil adalah keterangan per situasi (kantor, rumah perahu, rumah mobil) dalam bingkai warna brand. Kutipannya tanpa nama atau tempat |
| 5. Foto + panel kanan beranimasi itu menarik | Bagus dilihat, isinya sedikit | Panel oranye itu video tipografi kinetik yang hanya mengulang slogan "Better climate by design". Fungsinya suasana, bukan informasi, dan menambah berat halaman |

## Sinyal selera: cara mengukur warna mungkin keliru

Ini situs kedua yang Anda puji warnanya padahal hanya memakai **2 keluarga warna**: Quite Nice (9) dan Quilt (7). Dial warna kita sekarang mengukur jumlah keluarga warna, dengan "berani" = 4 ke atas.

Dari catatan Anda, yang Anda nilai sepertinya **keselarasan**: warna yang sama diulang di section, bingkai dan ilustrasi. Itu bukan soal banyaknya warna.

**Usul (belum saya ubah, menunggu Anda):** dial warna mengukur keselarasan, yaitu sedikit keluarga warna yang dipakai ulang di bidang, bingkai dan gambar, bukan jumlah warna.

## Yang saya ubah di skill

- **Aturan Prefer ilustrasi:** ditambah "digambar dengan palet dan garis halaman itu sendiri, dan menunjukkan sesuatu yang dikatakan section-nya", sesuai catatan 3 Anda. Ini penajaman aturan lama, bukan aturan baru.
- **Copy Quilt dicek dengan `copycheck` baru:** rata-rata kalimat 10,4 kata (enak dibaca), tapi gagal karena memuji diri ("industry-leading").

  Juri juga mencatat tiga klaim efisiensi yang saling bertentangan ("most efficient", "most efficient 2- and 3-zone", "20% more efficient"), serta istilah teknis tanpa penjelasan (SEER2, zones, ductless). Ini contoh yang pas untuk sub-skill copywriting: suaranya tenang dan rapi, tapi klaimnya ditulis, bukan dibuktikan.

## Kandidat perpustakaan

| Pola | Fungsi |
| --- | --- |
| Ilustrasi dengan palet halaman yang menjelaskan mekanisme (ruangan dengan suhu berbeda) | Memahami cara kerja tanpa paragraf teknis |
| Produk difoto seperti perabot di dalam ruangan, ditambah kutipan media (Wirecutter) di layar pertama | Menjawab "jelek tidak di dinding?" sekaligus memberi bukti awal |
| Rumah pelanggan dengan keterangan per situasi, dalam bingkai warna brand | "Cocok untuk rumah seperti punya saya?" |
| Satu aksi sticky di header ("Find an installer"); formnya hanya minta alamat | Aksi yang menghasilkan uang selalu terlihat dan ringan |

**Jangan ditiru:**
- tombol untuk audiens lain ("Become a partner") sama besar di samping aksi pemilik rumah;
- klaim superlatif yang saling bertentangan;
- slogan yang hanya ada di dalam video;
- tidak ada h1;
- 10 animasi scroll yang mengabaikan reduced motion (305 di "How it works").

## Belum diverifikasi

- Isi video dan perilaku slider (hanya dilihat dari frame diam).
- Apakah ilustrasi beranda berupa Lottie atau SVG.
- Kehalusan animasi di mesin dengan GPU (45,6 fps diukur dengan software rendering).
