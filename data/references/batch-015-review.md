# Review batch-015: Outfit, Capitolium, L'Oiseau Dé, Indigo (fashion, perempuan, beauty)

Tanggal: 2026-11-16. Dibaca dengan pembaca cepat (22-46 detik per situs), dinilai satu juri (koordinator, Fable 5.2). Ini satu pandangan, bukan panel. Data: `batch-015.json`; catatan Anda tersimpan kata demi kata di `jury/batch-015/owner.json`.

Yang belum terverifikasi:
- Inspector tidak dijalankan: kontras, layout shift, dan target ketuk tidak diukur.
- Capitolium (20.000px) dan Indigo (43.000px) hanya terbaca 6.000-11.000px pertama. Tampilan ponsel keduanya hanya menunjukkan layar pembuka.
- Halaman detail produk Outfit tidak dibaca, jadi catatan Anda soal itu belum saya periksa.

## Skor juri

| Situs | Kategori | Skor | Terkuat | Terlemah |
| --- | --- | --- | --- | --- |
| Outfit (hellohello) | fashion, toko | 7,1 | kekhasan 9, craft 8 | pelanggan 6, cerita 6 |
| Capitolium | fashion, peluncuran jersey | 7,4 | cerita 9, kekhasan 9 | pelanggan 6, kejelasan 6 |
| L'Oiseau Dé | beauty, toko (template Framer) | 6,8 | kejelasan 8, craft 8 | bisnis 6, cerita 6 |
| Indigo | fashion, perhiasan | 7,2 | cerita 9, kekhasan 9 | bisnis 6, kejelasan 6 |

Anda belum memberi angka untuk batch ini. Dari lima batch terakhir, skor Anda biasanya 2-3 poin di atas skor juri.

## Catatan Anda, diukur

**Outfit**
- **"Tidak template, permainan tipografi": benar.** Satu huruf grotesk rapat, satu warna merah untuk semua teks, dipakai di dua ujung: keterangan 12px dan satu kalimat setinggi sekitar 100px.
- **"Penataan produk berbeda": benar, dan terukur.** 4 dari 5 bagian tersusun bebas: produk tampil dalam tiga ukuran (deret empat, sepasang kecil, satu tas selebar setengah layar) dengan sel kosong di antaranya.
- Kelemahan lain: layar hitam dengan penghitung sekitar 4 detik sebelum isi muncul, dan hampir tidak ada cerita tentang brand.

**Capitolium**
- **"Scrolling experience sangat bagus, membawa masuk ke cerita": benar.** Terukur 12 panel yang menempel setinggi layar. Teks bergerak lebih lambat dari halaman (0,1-0,65 kali), huruf judul masuk satu per satu, jendela lengkung melebar sampai memenuhi layar, dan satu bab bergerak ke samping.
- Identitasnya diambil dari satu tempat: lengkung, marmer, dan huruf pahatan gedung Capitole.
- Kelemahan: ada tiga gerbang sebelum isi (layar loading, panel cookie, tombol "Entrer"), dan situsnya berat (8 video).

**L'Oiseau Dé**
- **"Menang karena foto yang bagus": benar.** Tanpa fotonya, halaman ini hanya ubin warna dan label.
- **"Layout tidak monoton": benar.** Ada enam susunan berbeda: judul melintasi foto, pita berjalan, papan catur foto dan warna, foto kecil menurun diagonal, deret produk, daftar brand sebagai huruf besar.
- Catatan: ini template Framer. Isi bisnisnya contoh, dan tombol tetapnya menjual template.

**Indigo**
- **"Transisi mulus, foto bagus, terasa brand-nya saat scroll": benar.** Setiap bab dibuka sampul satu layar dengan judul berhuruf potongan kertas. Foto masuk dari samping, dan cincin melayang melintasi bab.
- Urutan tiap bab sama (sampul, judul, teks, foto, produk), jadi pengunjung cepat paham polanya.
- Kelemahan: ada gerbang suara sebelum isi, tidak ada harga atau cara beli (hanya "Request info"), dan halamannya sangat panjang.

## Yang masuk ke skill dari batch ini

1. **Aturan komposisi** (`rules/composition.md`): 12 susunan bernama dari referensi Anda, misalnya `scale-scatter` (Outfit), `window-open` dan `horizontal-track` (Capitolium), `checker-fields` dan `stepped-drift` (L'Oiseau Dé), `chapter-cover` dan `offset-pair` (Indigo). Tiap susunan disertai kegunaan dan cara membangunnya.
2. **Dial tata letak**: rapi, tersusun (default), bebas. Untuk fashion dan beauty rekomendasinya "bebas".
3. **Dial brand**: dasar atau kuat. Untuk fashion, beauty, dan produk perempuan, ini ditanyakan sebagai pertanyaan tersendiri di brief, dengan rekomendasi "kuat".
4. **Ukuran baru di batas bawah**: 40% bagian harus tersusun bebas (60% kalau dialnya "bebas"). Terukur: situs yang Anda sukai 57-80%, halaman uji buta 0-17%.
5. **Tes "jalan pengunjung"** di langkah copy: minimal lima hal yang ingin dilakukan atau diketahui pengunjung, di mana halaman menjawabnya, dan berapa layar ke bawah.
6. **Motion** batch ini ditautkan ke resep yang ada. Dua gerak belum punya resep: bab yang bergerak ke samping (Capitolium) dan judul huruf potongan (Indigo).
