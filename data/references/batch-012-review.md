# Review batch-012: SquadEasy, Figure Film, Coveo Music

Tanggal: 2026-11-10. Enam halaman direkam (10 menit, 0 token). Dua juri AI menilai ketiga situs sekaligus (93 ribu + 101 ribu token). Data lengkap: `batch-012.json`.

## Skor

| Situs | Kategori | AI | Anda (visual/kirim) | Gabungan |
| --- | --- | --- | --- | --- |
| SquadEasy | Aplikasi keterlibatan karyawan, dijual ke HR (B2B) | 6,3 | 8 / 8,5 | 7,4 |
| Figure Film | Rumah produksi film, London | 6,3 (kekhasan **9**) | 7 / 8,2 | 7,3 |
| Coveo Music | Situs musisi independen | 6,7 (cerita **8**) | 8 / 8,5 | 7,6 |

## Catatan Anda, diukur

**SquadEasy**
- Kategorinya memang tidak terbaca, dan itu kelemahan halamannya, bukan Anda. Judul utamanya permainan kata, dan kata "team-building app" baru muncul di 18% halaman.
- **Scrollcraft: sebagian benar.** Hero yang berubah menjadi mockup aplikasi di HP layak dipertahankan. Sisanya kebanyakan hiasan: 9 loop tanpa jeda, angka statistik tampil 0 sebelum animasinya jalan, dan layout bergeser di HP.
- **"Warna sederhana" kurang tepat:** terukur ada 9 warna.

**Figure Film**
- **"Konsep unik": terbukti, dan kekhasannya terkuat di batch ini.** Polanya berulang di beranda, Works dan About: garis berlabel rasio layar film (2.76:1 sampai 1:1), wordmark berbentuk potongan frame, palet krem/kobalt/hitam, dan footer hitam "LET'S COLLABORATE".
- **"Retro/vintage" kurang tepat.** Yang dipakai adalah bahasa pembingkaian film, bukan nostalgia.
- Ini contoh terbaik dari aturan brand element kita: **signature diambil dari dunia profesinya sendiri.**
- Kelemahannya teknis: layout sangat bergeser (CLS 1,09), 16 judul karya tidak pernah muncul, tidak ada judul utama, dan teks 9–12px.

**Coveo Music**
- **Sederhana, white space, foto miring, cocok untuk portfolio: benar.**
- **Ceritanya terkuat dari ketiganya:** kisah asal-usul orang pertama, diskografi bernomor 001–011, dan "Behind the song" di setiap rilis.
- **"Motion kecil" sebagian kurang tepat:** 37 elemen bergerak saat dibuka, digerakkan 4 library animasi. Rasanya tenang, tapi jumlahnya tidak kecil.
- Kelemahannya:
  - pop-up "Credits" menutupi konten;
  - placeholder `{TRACK.TITLE}` bocor;
  - teks sampai 8,4px;
  - 38 gambar tanpa alt;
  - tidak ada tombol ke layanan streaming.

## Pola lintas batch

Ini batch ketiga berturut-turut dengan pola yang sama: **ekspresi visual kuat, pengerjaan teknis lemah** (ukuran teks, layout bergeser, konten tersembunyi). Skor "layak kirim" Anda 1,8–2,2 di atas AI, karena AI menghitung kesalahan teknis itu sebagai risiko saat dikirim ke klien.

Ini bukan berarti penilaian Anda salah. Pelajaran untuk skill: **ambil ekspresinya, tapi jangan ikut mewarisi kesalahan teknisnya.** Inspector kita sudah menangkap jenis kesalahan ini.

## Kandidat perpustakaan

| Pola | Dari | Fungsi |
| --- | --- | --- |
| Signature dari dunia profesi (garis rasio layar sebagai grid halaman) | Figure Film | Langsung terbaca "ini rumah produksi film" |
| Wordmark berbentuk medium (potongan frame film) | Figure Film | Brand element tanpa ilustrasi |
| Hero yang berubah menjadi produk saat di-scroll | SquadEasy | Dari janji ke produk dalam satu gerak |
| Arsip bernomor + "Behind the song" | Coveo | Cerita lewat arsip |
| Foto sedikit miring di grid yang tenang | Coveo | Memecah monoton tanpa ramai |
