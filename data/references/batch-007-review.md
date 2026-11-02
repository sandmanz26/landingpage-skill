# Review batch-007: Quite Nice

Tanggal: 2026-11-02. Tiga halaman direkam: beranda, halaman produk dan "Our Science" (0 token). Interaksinya (hover, drawer, kartu rasa) saya ukur langsung di browser. Juri: 2 juri AI gabungan (163 ribu token). Skor Anda: visual 9, layak kirim 9. Data lengkap: `batch-007.json`.

## Skor

| Situs | Kejelasan | Kekhasan | Craft | Bisnis | Konsumen | Cerita | AI berbobot | Anda (visual/kirim) | Gabungan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Quite Nice | 6 | **8** | 7 | **5** | 6 | 7 | 6,6 | 9 / 9 | 7,8 (selisih **2,4**) |

**Dari sisi visual, AI dan Anda hampir sepakat.** Kekhasan 8 vs 9, craft 7 vs 9. Selisih 2,4 hampir seluruhnya datang dari sisi jualan:
- Beranda tidak menampilkan harga, rating, maupun angka serat dan protein. Semuanya ada di halaman produk ($9, 4,85 dari 54 ulasan, 8 g serat, 10 g protein).
- Semua tombol bertuliskan "Get Started".
- Saat direkam, situs ini sedang menjalankan "Farewell Sale – 70% Off Everything". Kemungkinan bisnisnya sedang tutup. Penawaran sekuat itu hanya muncul di bar tipis 36 px, sementara hero masih menjual "rutinitas sarapan harian".

Juri visual memberi visual 8 dan layak kirim 7.

## Catatan Anda, diukur

| Klaim | Putusan | Angka |
| --- | --- | --- |
| 1. Hero memadukan foto dan elemen vektor brand, jadi tidak AI slop | **Benar, dengan satu koreksi** | Daun dan oat itu gambar raster yang dipotong (leaf-1-front.png, leaf-2.png), bukan vektor. Tapi itu tetap ilustrasi brand yang keluar dari bingkai foto, jadi poin Anda berlaku. Inspector kami menghitungnya sebagai foto (ilustrasi: 0); ini celah pengukuran |
| 2. Animasi scroll tidak monoton | Benar soal variasi, dengan dua biaya | Ada 2 panel sticky (foto hero membesar sampai selebar layar), warna latar per bab, dan ilustrasi yang bergerak. Biayanya: 6 marquee berjalan terus tanpa tombol jeda, dan 11–13 elemen tetap bergerak saat pengunjung meminta gerak dikurangi |
| 3. Terlihat sederhana, tapi warna dan gambar membuat pesan hidup | Benar untuk suasana | Satu bidang warna datar per bagian, 2 jenis huruf (Nib Pro 58% + Basis Grotesque 42%), 0 gradien, 0 bayangan, 0 pergeseran layout. Tapi "sederhana" sebagian dicapai dengan membuang fakta yang menjual |
| 4. Hover yang berganti warna membuat situs hidup | **Sebagian** | Diukur: baris "Quite Nice can" berubah miring dan panah terisi, lalu bila diklik membuka drawer. Baris "We're Picky" berganti latar lalu terbuka saat diklik. Ganti warnanya hanya umpan balik; maknanya ada pada apa yang terbuka. Di HP semua ini tidak ada |
| 5. Flip card punya tujuan, user melihat maknanya | **Tujuannya benar, mekanismenya keliru** | Kartunya tidak berputar (flip): saat di-hover, foto kemasan diganti foto mangkuk jadi dari rasa itu. Fungsinya menjawab "nanti yang saya makan seperti apa?". Kelemahannya: hanya lewat hover, sehingga pengunjung HP tidak pernah melihat mangkuknya |
| 6. Warna netral, minimalis, modern, friendly | Modern dan friendly benar; **"netral" kurang tepat** | Jumlah warnanya memang sedikit: 2 keluarga warna (hijau, kuning) di atas krem. Tapi warnanya pekat dan memenuhi lebar layar (hijau tua, mustard, lime). Lebih tepat disebut "tenang dari jumlah warna, berani dari kepekatan" |

**Catatan untuk dial warna:** ini referensi kedua dengan skor 9 yang hanya memakai 2 keluarga warna. Pembandingnya Maxima, yang memakai 8 warna. Default tim saat ini "berani" (4+ keluarga). Quite Nice menunjukkan bahwa "berani" bukan satu-satunya jalan. Default belum saya ubah; ini sinyal untuk dipantau di batch berikutnya.

## Interaksi: mana yang punya makna

| Interaksi | Menjawab pertanyaan pelanggan | Putusan |
| --- | --- | --- |
| Kartu rasa: kemasan berganti menjadi mangkuk jadi | "Nanti saya makan apa?" | Layak; perlu jalur tap untuk HP |
| Baris manfaat membuka drawer berisi mekanisme dan sitasi jurnal | "Klaim ini benar?" | Layak; contoh terbaik di situs ini |
| Baris "We're Picky" terbuka saat diklik | "Bebas dari apa saja?" | Klik-nya layak; ganti warnanya hanya umpan balik |
| Foto hero membesar saat scroll | Mengalihkan mata dari janji ke makanan | Layak |
| Marquee "Low-FODMAP, Gluten-Free…" tanpa henti | Tidak ada; mengulang daftar "We're Picky" | Dekorasi |
| Warna latar berganti per bagian | Penanda bab, lemah | Dekorasi ringan |

## Yang saya tambahkan ke skill (sesuai permintaan Anda di catatan 5)

1. **`team/taste.md` → Always:** setiap interaksi punya makna dan tujuan, dan ditulis di spec sebelum dibangun. Interaksi harus melakukan salah satu dari tiga hal:
   - memperlihatkan sesuatu yang dibutuhkan pengunjung (hasil produk, bukti di balik klaim, lokasi di peta);
   - membantu memutuskan;
   - menjawab aksi pengunjung.

   Interaksi yang hanya bergerak adalah dekorasi dan dibuang. Interaksi juga harus bisa dipakai di HP dan keyboard (tap dan fokus melakukan hal yang sama dengan hover). Pola yang umum, seperti flip card atau accordion, tetap boleh: nilainya datang dari apa yang ia ungkap, bukan dari kebaruannya.

   Tambahan "harus jalan di HP" usul kedua juri secara terpisah. Saya setuju, karena kartu rasa Quite Nice gagal persis di situ.
2. **Spec wajib punya bagian "## Interactions".** Kolomnya: elemen, apa yang dilakukan pengunjung, apa yang ia lihat, pertanyaan pelanggan yang dijawab, serta jalur HP dan keyboard. `progress.mjs` menolak `done spec` tanpa bagian ini (isi "none" bila halaman tidak punya interaksi). Sudah diuji di selftest.
3. **`motion/functions.md`:** bagian baru "Interactions: meaning before movement", dengan Quite Nice sebagai contoh.
4. **Critic:** langkah ke-14 "Interactions": coba setiap interaksi di desktop dan HP. Craft dibatasi maksimal 6 bila ada interaksi yang tidak mengungkap apa pun, atau bila konten penting untuk memutuskan hanya muncul lewat hover.

## Perbaikan alat

- **`fixed-cover` salah tangkap.** Drawer yang tertutup duduk di wadah fixed selebar layar yang tidak menggambar apa pun dan meneruskan klik (pointer-events: none). Inspector menghitungnya sebagai elemen yang menutupi layar. Sekarang wadah seperti itu dilewati, dan hanya bagian yang benar-benar berada di layar yang dihitung. Fixture baru di `clean.html` dan cek di selftest; cek ini gagal tanpa perbaikan.
- **Kesalahan proses saya.** Saya menjalankan ulang inspector saja, padahal inspector menghapus semua PNG di foldernya, termasuk sheet dari evidence. Juri jadi menyusun contact sheet sendiri, dan juri visual memakai 12 panggilan alat (batasnya 10). Sheet sudah dibangun ulang. Pelajarannya: setelah inspector dijalankan ulang, jalankan juga evidence, atau langsung jalankan ulang `capture.mjs`.

## Kandidat perpustakaan

| Pola | Fungsi |
| --- | --- |
| Foto makanan dalam bingkai lengkung, dengan bahan yang digambar keluar dari bingkai | Hasil produk dan dunia brand sekaligus di layar pertama |
| Glyph kecil yang digambar di dalam kalimat judul (oat, daun, bunga) | Mudah diingat tanpa baris ikon |
| Baris manfaat yang membuka drawer berisi mekanisme dan sitasi | Janji di depan, bukti tersedia saat diminta; cocok untuk klaim kesehatan |
| Kartu produk yang berganti dari kemasan ke hasil jadi (dengan jalur tap) | Memperlihatkan yang didapat pelanggan, bukan bungkusnya |
| Satu bidang warna datar per bab cerita | Halaman panjang terbaca sebagai urutan |
| Penenang di samping checkout ("One-time purchase, nothing recurring") | Menghilangkan rasa takut berlangganan |

Di library, Quite Nice masuk grup gaya yang sama dengan Swehl dan ERLY (datar, gerak cerita, bentuk pil). Kemiripannya dengan Swehl paling dekat: bingkai lengkung dan bab warna.

**Jangan ditiru:**
- beranda tanpa harga dan bukti;
- konten penting yang hanya muncul lewat hover;
- marquee tanpa jeda;
- gerak yang mengabaikan reduced motion;
- halaman produk yang lepas dari sistem (17 ukuran huruf, 12 warna, 32 target sentuh terlalu kecil).

## Belum diverifikasi

- Apakah di HP, tap pada kartu rasa menampilkan mangkuk. Yang diukur hanya bahwa efeknya memakai hover; perilaku tap di perangkat sungguhan belum diuji.
- Kehalusan animasi di mesin dengan GPU. Angka 49 fps diukur dengan software rendering dan hanya berguna sebagai pembanding antar-halaman.
- Kenapa situs ini mengadakan farewell sale.
