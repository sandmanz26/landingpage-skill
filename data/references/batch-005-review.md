# Review batch-005: A-Rete Academy (contoh negatif)

Tanggal: 2026-11-02. Satu halaman panjang, direkam dalam 6 menit (0 token). Juri: 2 juri AI gabungan (147 ribu token). Skor Anda: 4 visual, 4 layak kirim. Data lengkap: `batch-005.json`.

## Skor

| Kejelasan | Kekhasan | Craft | Bisnis | Konsumen | Cerita | AI berbobot | Anda | Gabungan |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 4 | 5 | 3 | 4 | 4 | 6 | 4,3 | 4 | **4,2** |

**Veto aksesibilitas:** isi halaman, kriteria pendaftaran dan label tombol "APPLY" hanya sekitar 2,1:1 (putih di atas hijau limau, hijau muda di atas putih).

Selisih AI dan Anda hanya **0,3**, kesepakatan paling dekat sejauh ini. Artinya skor tinggi Anda di situs lain mencerminkan selera visual yang jelas, bukan nilai yang terlalu murah hati.

## Catatan Anda, diukur

| Keluhan | Putusan | Angka |
| --- | --- | --- |
| 1. Logo terlalu besar, menutupi navigasi | **Terbukti, dengan koreksi** | Logo **fixed** berukuran 280×183 px, sekitar 20% tinggi layar, sehingga ikut terbawa di setiap layar. Yang ditutupinya adalah pita header dan isi halaman saat scroll, bukan link menunya |
| 2. Gambar menempel tapi menyisakan ruang; tidak ada spasi antar-section | **Terbukti, dengan koreksi** | Baris foto menempel 0 px ke pita gelap, sementara kiri-kanannya kosong sekitar 320 px. Section dipisahkan warna dan jarak yang tidak konsisten; tidak ada ritme jarak |
| 3. Tipografi makin mengecil saat scroll | **Terbukti, dengan koreksi** | Ukurannya tidak terus mengecil, tapi **melompat tanpa pola**: 65 → 53 → 35 → 150 → 115 → 35 → 30 → 50 → 30 → 50 → 35 → 50 → 150 px. Paragraf panjang ditulis HURUF BESAR SEMUA, 15 px, lebih dari 100 karakter per baris |
| 4. Inkonsistensi font | **Terbukti** | Satu keluarga (DIN) dalam 5 potongan, ditambah serif miring (Arapey) di footer. Total 16 ukuran huruf, 10 ukuran display, peran judul yang sama di 35, 50 dan 53 px, dan tidak ada h1 |
| 5. Warna, teks dan latar bercampur sehingga sulit dibaca | **Terbukti** | 32 teks gagal kontras di desktop, diukur dari piksel layar. Juri menjatuhkan veto |

## Yang masuk ke skill sekarang

Dua keluhan Anda belum terukur oleh inspector, dan sekarang sudah:
- **`fixed-cover`**: elemen fixed atau sticky yang bukan pita tipis (logo atau lencana besar) menutupi bagian dari setiap layar.
- **`display-sizes`**: lebih dari 5 ukuran display tanpa skala, dengan daftar ukurannya.

Kritikus juga mendapat cek craft baru: **ritme jarak antar-section yang konsisten**. Foto harus selebar penuh, atau berada di dalam margin dengan jarak di atas dan bawahnya; tidak boleh menempel ke pita sambil menyisakan ruang di samping.

## Usulan aturan "Never" (menunggu persetujuan Anda)

- **Never:** logo atau lencana fixed yang bukan pita tipis; logo besar boleh di layar pertama, tapi ikut tergulir.
- **Never:** ukuran display tanpa skala. Gunakan 3–4 langkah display, masing-masing dengan satu peran.
- **Never:** paragraf panjang dalam HURUF BESAR SEMUA, atau teks isi di bawah 16 px.
- **Never:** foto atau blok yang menempel ke pita sambil menyisakan ruang lebar di samping. Jarak antar-section harus punya ritme yang konsisten.

## Yang tetap layak diambil

| Pola | Fungsi |
| --- | --- |
| "8 spots available: 6 untuk 14–18, 2 untuk 18+ ATP" | Kelangkaan yang jujur dan spesifik |
| Tombol daftar tepat setelah kriteria penerimaan | Ajakan di titik keputusan |
| Video hero berisi pemain akademi sendiri | Bukti nyata, bukan foto stok |
