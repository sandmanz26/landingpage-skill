# Hasil uji buta AI slop (2026-11-12)

Putusan pemilik: **"masih jelek semua menurut saya, belum ada yang memenuhi expected saya."** Tidak ada skor per huruf.

Kunci: A = klinik (design-director, quick) · B = laundry (tanpa skill, prompt biasa) · C = yoga (design-director, quick) · D = kursus (tanpa skill, Tailwind/shadcn) · E = kopi (tanpa skill, prompt "senior designer").

Arti hasil ini:
- Skill pada mode quick **tidak** menghasilkan halaman yang memenuhi harapan pemilik. Dua halaman skill (A, C) tidak dinilai lebih baik daripada tiga halaman tanpa skill.
- Biayanya lebih besar: sekitar 215-225 ribu token per halaman skill, 82 ribu untuk halaman E.
- Bacaan koordinator (bukan juri): A dan C mirip satu sama lain (font grotesk yang sama, tombol WhatsApp pil, daftar bergaris tipis, bidang warna datar, FAQ) dan lebih polos daripada E. Skill memaksa proses dan kejujuran, tetapi pengetahuan craft-nya kebanyakan larangan, dan tidak ada gambar maupun motion yang berarti.
- Batasan uji: mode quick dan autopilot, tanpa juri independen, tanpa foto, satu halaman per bisnis. Mode standard belum diuji buta.

## Alasan pemilik (2026-11-16, kata-kata asli)

1. "semua element terasa flat, permainan menggunakan konsep rectangle tidak terlihat menarik"
2. "content tidak terasa seperti sedang membuka website yang proper dan terlalu sedikit sehingga nampak seperti lo fidelity"
3. "tidak ada interaksi experience"
4. "layout terasa flat dan monoton, saya tidak mendapatkan esensi brand yang ada"
5. "kalau saya sebagai user saya tidak bisa melihat data data yang seperti saya butuhkan seperti fasilitas, jam operational dll tidak tersampaikan"

## Diukur dengan `floor.mjs` (aturan baru dari lima alasan di atas, `rules/floor.md`)

Tanpa brief, jadi ukuran fakta dan brand tidak mungkin lolos; angka di bawah dari 7 ukuran.

| Huruf | Halaman | Lolos | Kata | Bagian | Navigasi | Interaksi | Bagian dengan bentuk | Gambar |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A | klinik (skill) | 0 | 355 | 6 | tidak ada | 1 jenis | 1 dari 6 | 2 |
| C | yoga (skill) | 1 | 258 | 7 | tidak ada | 1 jenis | 2 dari 7 | 1 |
| E | kopi | 2 | 657 | 7 | 5 tautan | 1 jenis | 2 dari 7 | 2 |
| B | laundry | 2 | 238 | 6 | tidak ada | 2 jenis | 1 dari 6 | 0 |
| D | kursus | 3 | 412 | 6 | 4 tautan | 1 jenis | 3 dari 6 (hanya bayangan; sekarang tidak dihitung) | 0 |

Angka ini diambil saat kalibrasi pertama (ambang 350 kata, 6 bagian, bentuk 50%); ambang akhirnya 300 kata, 7 bagian, bentuk 60%, dan bayangan pada kotak tidak dihitung.
