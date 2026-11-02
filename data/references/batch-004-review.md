# Review batch-004: Summer Smash Tennis (beranda + 5 subpage)

Tanggal: 2026-11-02. Direkam: beranda, classes, method, coaches, private-lessons dan about (16 menit, 0 token). Juri: **2 juri AI gabungan**, yaitu visual + gerak serta bisnis + pelanggan + cerita. Ini uji coba versi hemat: 181 ribu token, dibanding sekitar 325 ribu kalau memakai 5 juri. Skor Anda belum ada. Data lengkap: `batch-004.json`.

## Skor (AI saja)

| Kejelasan | Kekhasan | Craft | Bisnis | Konsumen | Cerita | AI berbobot |
| --- | --- | --- | --- | --- | --- | --- |
| 8 | 8 | 7 | 6 | 6 | 6 | **6,8** |

Pola yang sama muncul lagi: visualnya kuat, bisnisnya lebih lemah. Harga kelas grup tidak ada di halaman mana pun, dan pembayaran les privat terpecah ke dua sistem.

## Catatan Anda vs temuan juri

| Klaim Anda | Putusan | Intinya |
| --- | --- | --- |
| Bola tenis bergoyang; gambar memotong frame dan keluar dari frame | **Terbukti, istilah dikoreksi** | Yang keluar dari bingkai adalah **raket dan bola gambar yang ditumpuk di atas foto** (*frame-break*); fotonya sendiri tetap di dalam bingkai. Sudah saya ukur langsung: bola di hero **memantul** naik-turun, dan tiga ikon bundar **berputar terus** |
| Ikon agak klasik tapi nyaman dibaca | Terbukti, dengan koreksi | Ikon fungsionalnya sederhana dan konsisten (plus dalam lingkaran kuning, pin, panah). Kesan "klasik" datang dari **ilustrasi gaya stiker**: megafon "ATTENTION", tangan peace, lencana EST 2012 |
| Teks beranimasi di bentuk lingkaran/gelombang itu unik | Tekniknya terbukti; "unik" dibantah | Istilahnya **text-on-path**. Ini pola yang cukup umum. Nilainya ada di isinya: mengulang slogan metode ("the pathway is the progression"), bukan sekadar hiasan |
| Peta dengan objek custom itu lucu | Terbukti, dengan koreksi | Peta ilustrasi dengan **pin berbentuk bola tenis tersenyum**. Pinnya tanpa label dan tampaknya tidak bisa diklik |
| Bagian lingkaran memberi micro-animation | Terbukti, **istilah dikoreksi** | Lingkaran yang berputar itu **loop dekoratif**, bukan micro-interaction. Micro-interaction yang sebenarnya, sudah saya ukur: **tombol "tertekan" saat disentuh kursor**, karena bayangan offset-nya hilang |

**Yang terlewat dari catatan Anda:**
- Gerak mengabaikan reduced motion, dan ada 58 loop tanpa tombol jeda.
- Kontras gagal di label level kelas (2,07:1) dan teks "spots left" (3,42:1).
- 12 testimoni tersembunyi di slider.
- Keunggulan bisnisnya justru ada di subpage, bukan di beranda:
  - kartu kelas lengkap dengan "1 spot left", filter usia, level dan lokasi;
  - form "kabari saya kalau pendaftaran dibuka";
  - tabel harga les privat dengan kolom "best value";
  - tangga level dengan syarat masuk ("bisa rally 10 kali").

## Lima usulan standar Anda, diuji dengan data

| Usulan | Putusan | Data dan koreksi |
| --- | --- | --- |
| 1. Konsistensi font | **Setuju, dan bisa diangkakan** | Di **9 dari 9** situs di perpustakaan, polanya sama: **satu huruf teks membawa 80–95% tulisan, ditambah satu huruf display dipakai hemat (5–20%)**. Di situs tenis: Founders Grotesk 82% + Obviously Narrow 18%, konsisten di keenam halaman |
| 2. Micro-interaction dan animasi membuat situs hidup | **Setuju, dengan syarat** | Tiga situs favorit Anda dengan animasi berat (Maxima, Resolute, Tennis) **semuanya** mengabaikan reduced motion. Usulan: setiap tombol wajib memberi umpan balik (hover, tekan, fokus); boleh ada beberapa loop kecil dari benda subjek, tapi berhenti saat reduced motion dan punya tombol jeda kalau berisi teks |
| 3. Elemen unik (radius, awan, dll.) | **Setuju, dengan koreksi** | Elemen unik yang berhasil selalu **diambil dari dunia subjeknya**: bola dan raket tenis, lengkungan Swehl, huruf miring Maxima. Awan atau radius yang tidak punya arti untuk subjeknya menjadi hiasan, dan itu ciri "AI slop" yang ingin dihindari |
| 4. Elemen human interaction yang memberi jeda | **Perlu Anda perjelas** | Ada dua kemungkinan arti. (a) Sentuhan manusiawi atau buatan tangan, seperti stiker, tangan peace atau bola tersenyum, yang memecah ritme sehingga pengunjung "berhenti" dan memperhatikan. (b) Elemen yang **bisa dipakai** pengunjung, seperti filter kelas atau kalkulator. Taste-skill menyebutnya "live thing", dan dalam uji mereka semua halaman pemenang punya elemen ini. Situs tenis punya keduanya |
| 5. Pakai Unsplash atau placeholder kalau tidak ada foto | **Setuju bahwa foto adalah visual utama; ada tiga koreksi** | (i) Foto Unsplash boleh dipakai komersial, tapi **tidak boleh disajikan sebagai milik klien** ("tim kami", "kelas kami"). Situs tenis berhasil justru karena fotonya foto murid sungguhan. (ii) Foto stok generik (orang tersenyum ke kamera) adalah tampilan template; pilih foto yang spesifik ke subjek. (iii) Placeholder hanya untuk draf, ditandai jelas, dan disertai daftar foto; tidak boleh ada di hasil akhir |

Catatan teknis untuk nomor 5:
- Pencarian Unsplash butuh **API key** (gratis, didaftarkan di Unsplash).
- Dari sesi cloud ini, Openverse diblokir dan Wikimedia membatasi permintaan. Di komputer Anda kemungkinan semuanya bisa.
- Trik situs tenis yang patut ditiru: **benda gambar yang menumpuk di atas foto biasa** (frame-break) memberi suara brand tanpa perlu sesi foto baru.

## Usulan aturan selera (menunggu persetujuan Anda)

- **Always:** dua keluarga huruf, yaitu satu huruf teks (80–95% tulisan) dan satu huruf display yang dipakai hemat, dengan satu skala ukuran. (usulan 1; data 9/9 situs)
- **Always:** setiap kontrol memberi umpan balik saat disentuh kursor, ditekan dan difokus. (usulan 2; tombol "tertekan" di Tennis)
- **Prefer:** satu elemen khas dari dunia subjek yang dipakai berulang di seluruh halaman, misalnya benda yang keluar dari bingkai foto, penanda peta, atau pembatas section. (usulan 3)
- **Prefer:** foto sebagai visual utama: foto klien lebih dulu; kalau tidak ada, foto berlisensi dari dunia subjek (Unsplash dengan API key, koleksi terbuka) yang diberi kredit dan tidak pernah disajikan sebagai milik klien. Placeholder hanya di draf, dengan daftar foto. (usulan 5)
- Usulan 4 menunggu penjelasan Anda.

## Kandidat perpustakaan

| Pola | Fungsi |
| --- | --- |
| Palet diambil dari olahraganya: kuning bola, hijau lapangan, krem | Brand dikenali sebelum logo terbaca |
| Raket dan bola gambar yang keluar dari bingkai foto | Suara brand di atas foto biasa |
| Tombol pill dengan bayangan offset yang "tertekan" saat disentuh kursor | Tombol terasa bisa ditekan, konsisten di semua halaman |
| Pita text-on-path berisi slogan metode | Pembatas section yang sekaligus mengulang pesan |
| Pin peta berbentuk bola tenis di samping daftar lokasi | Menunjukkan cakupan dengan bahasa brand |
| Ilustrasi gaya stiker (megafon, tangan peace, lencana) | Jeda dan karakter di antara section |
| Kartu kelas: level, lokasi, jadwal, "N spots left", REGISTER; dilengkapi filter | Menjawab "ada kelas untuk kami, kapan, di dekat mana?" |
| Form "kabari saya kalau pendaftaran dibuka" | Halaman tidak berakhir buntu saat kelas penuh |
| Tabel harga privat: ukuran grup × jumlah les, kolom "best value" | Diskon volume terbaca sekilas |
| Tangga level dengan syarat masuk | Pengunjung bisa menempatkan diri tanpa harus bertanya |

## Pertanyaan untuk Anda

1. **Dua skor** (visual, layak kirim). Ingat permintaan saya sebelumnya: gunakan rentang yang lebar.
2. Usulan nomor 4, "human interaction", maksudnya (a) sentuhan manusiawi seperti stiker dan karakter, (b) elemen interaktif yang bisa dipakai pengunjung, atau keduanya?
3. Empat usulan aturan selera di atas: setuju, ubah, atau tolak?
4. Mau saya buatkan alat pencari foto (Unsplash dengan API key Anda, plus koleksi terbuka) yang mencatat lisensi dan kreditnya?
