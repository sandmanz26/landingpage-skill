# Laporan serah: landing page Dapur Seimbang (2026-11-05)

Mode create · effort standard · gates **autopilot**. Tidak ada manusia di gerbang. Setiap gerbang saya setujui dengan `--by claude`, dan setiap pilihan dicatat bersama alasannya di `.design/progress.json`.

## Yang dibuat dan cara membukanya
- **Halaman:** `examples/katering-sehat-compare/with-skill/index.html`. Satu file statis; buka langsung di browser. Font dimuat dari Google Fonts (Bricolage Grotesque + Figtree).
- **Generator:** `.design/build/page.py` dan `.design/build/drawing.py`. Jalankan `python3 .design/build/page.py` dari folder proyek. Ubah halaman lewat generator, bukan dengan menyunting index.html.
- **Screenshot final:** `.design/snapshots/2026-11-05-v3/`.
  - `desktop-fold.png`, `mobile-fold.png`, `tablet-fold.png`, `reduced-motion-fold.png`
  - `sheet-desktop.png`, `sheet-mobile.png` (seluruh halaman)
  - `desktop-week-jumat.png` (kotak setelah hari Jumat ditekan)

## Riset (`.design/research.md`)
**Batas akses web.** Pencarian web jalan, tetapi halaman sumber tidak bisa dibuka: antaranews.com, haibunda.com dan katadata.co.id diblokir jaringan sesi ini. Karena itu semua temuan web berlabel "ringkasan pencarian, halaman tidak dibuka". Saya membaca 1 sumber utama (pesan pemilik) dan 14 sumber sekunder lewat 5 pencarian. Suara pelanggan asli yang dikutip kata per kata: tidak ada.

Temuan yang mengubah desain:
1. **Posisi harga.** Rp 45.000 berada di antara langganan makan siang murah (sekitar Rp 20–25 ribu, data 2017) dan katering diet (sekitar Rp 57–115 ribu per porsi, data 2018–2024). Karena itu harga ditulis terbuka di layar pertama, bersama total seminggu Rp 225.000. Harga pesaing tidak dicantumkan karena belum terverifikasi.
2. **Kategori ini bicara diet** (kalori, turun berat badan), padahal pembeli Dapur Seimbang tidak sedang diet. Halaman memecah klise ini: tanpa kalori, tanpa janji langsing, dengan kalimat "Bukan salad diet. Ini makan siang lengkap."
3. **Bosan menu adalah keberatan yang umum.** Jawabannya: seminggu menu yang bisa dilihat hari per hari.
4. **Khawatir telat atau dingin** (sumber lemah, bukan dari Indonesia). Halaman tidak menjanjikan jam antar; pertanyaan itu jadi FAQ pertama dan pertanyaan nomor 1 untuk pemilik.
5. **Belum ada bukti apa pun** (foto, ulasan, jumlah pelanggan). Karena itu tidak ada testimoni atau statistik. Kepercayaan dibangun dari transparansi: harga, isi kotak, cara pesan dan nomor asli.

**Pesaing:** Yellow Fit Kitchen, Gorry Gourmet, Nutrify, Kulina, GoFood/warteg dekat kantor, dan bekal dari rumah. Klise kategori yang dipecah: bahasa diet, tampilan hijau-putih "clean eating", dan foto stok bento.

**Pertanyaan pelanggan** (asumsi, belum ada kutipan asli):
- "Berapaan sehari, minimal berapa?"
- "Menunya ganti-ganti nggak?"
- "Kenyang nggak?"
- "Kantor gue kejangkau, jam berapa nyampe?"
- "Gimana pesannya, kalau WFH?"

## Alasan di balik keputusan utama
- **Storyline: difference-first**, karena pembaca sedang membandingkan pilihan (riset #2, #7), dan tawaran disebut lebih awal karena harga adalah kekuatan (#1). Urutannya: apa dan berapa → isi kotak → tidak bosan → harga seminggu → cara pesan → jam, area, bayar → aksi.
- **Ide:** "Kotak Dapur Seimbang yang dibagi empat (karbo · lauk · sayur · buah) menjadi satu-satunya motif: bagiannya tetap, isinya ganti tiap hari. Motif ini jadi gambar hero, sistem warna, satuan harga (5 kotak = Rp 225.000 = minimal pesan) dan minggu Senin–Jumat."
- **Roast strategi mengubah empat hal:**
  - Tidak ada janji jam antar (roast #1).
  - Label "Contoh menu" ditaruh di halaman, bukan hanya di copy.md (#2).
  - Signature-nya minggu Senin–Jumat, bukan hanya kotaknya (#4).
  - Ada satu baris pembanding dengan "beli sendiri" tanpa angka (#8).
  - Ditolak: kalori/makro (#6, tidak ada data) dan penawaran trial (#7, itu keputusan bisnis pemilik).
- **Arah:** direction A "one-motif" (deal seed 971124372, sektor restaurant, nada warm). Tidak ada redraw dan tidak ada campuran.
  - B (foto dengan ukuran tak rata) ditolak karena butuh foto yang tidak ada.
  - C (halaman sebagai benda) ditolak karena lembar menu adalah benda kategori, bukan milik klien ini.
  - Referensi dari library, masing-masing dengan satu peran:
    - Swehl: bab berwarna, jadi satu warna per bagian kotak.
    - Quite Nice: pertukaran yang menunjukkan hasil, jadi menekan hari mengganti isi kotak.
    - Summer Smash: palet dari bahan subjek dan tombol yang "tertekan".
- **Reason roast** (subagent independen): 29 keep, 6 fix, 14 merge, 1 cut. Semuanya dikerjakan; tanggapan per ID ada di `.design/reason.md`.

## Penilaian juri (`.design/critique.md`)
- **Skor ronde 1, sebelum perbaikan:** business 7 · customer 7 · story 6 · clarity 8 · distinctiveness 6 · craft 6. Rata-rata tertimbang 6,7. Tanpa veto.
- **Tiga masalah teratas yang sudah diperbaiki:**
  1. Kotak di hero terpotong dan tidak menggugah selera. Sekarang kotak utuh, lauk jadi bagian terbesar dengan lauk yang jelas.
  2. Isi yang berganti tiap hari tidak terlihat, terutama di HP. Sekarang tiap hari punya gambar kotak sendiri; di desktop kotak besar berganti saat hari ditekan (sudah diverifikasi di browser).
  3. Setelah bagian harga, tampilan mengendur. Sekarang panel harga, langkah pesan dan pesan WhatsApp memakai warna bagian kotak, dan setiap tombol berada di bawah isinya.
- **Hanya satu ronde look.** Lingkungan ini hanya mengizinkan satu ronde dan tidak menyediakan juri verifikator, jadi perbaikan di atas **belum dinilai ulang oleh juri**. Pengecekannya hanya: inspector 0 FAIL 0 WARN, lint 0/0, copycheck tanpa FAIL, skrip Playwright, dan screenshot yang saya lihat sendiri.
- **Uji lima pertanyaan** (penjelasan ulang oleh juri bisnis dari layar pertama HP): apa, untuk siapa, di mana, harga, minimal pesan dan aksinya. Semua terjawab. Yang belum terjawab: jam antar dan ongkir.
- **Kekurangan yang tersisa:**
  - Jam antar dan ongkir/area belum ada (butuh data pemilik).
  - Belum ada "orang" di balik dapur (nama, lokasi dapur).
  - H1 jatuh menjadi 3 baris di 1440 dan 390 (inspector mengizinkan 3; target metode copy 2). Ini sengaja, supaya kata "ke kantor" tetap ada di judul.
  - Di desktop, pemisah "·" bisa jatuh di awal baris ketika menu satu hari terlipat ke baris kedua (kosmetik).

## Fit terhadap dial (`fit.mjs`)
- **Lolos (5):** type ×6,7 · imagery ilustrasi · motion story · 2 keluarga font · harga dekat tombol.
- **Colour: MISS.** fit.mjs menghitung 5 bayangan sebagai "tidak flat". Yang dihitung adalah tepi offset keras tanpa blur di bawah tombol WhatsApp, yaitu umpan balik saat tombol ditekan (aturan Always tim). Bayangan itu sengaja dipertahankan; alasannya ada di bagian Fit di critique.md.
- **Konflik aturan.** Team taste lebih suka foto sebagai visual utama; brief tidak punya foto dan pencarian foto berlisensi gagal (jaringan). Saya memakai ilustrasi datar dari subjek (aturan illustration.md), dengan catatan di footer "Gambar di halaman ini ilustrasi, bukan foto menu." Menurut precedence, brief (4) mengalahkan team taste (6).

## Hipotesis setelah tayang
| Hipotesis | Metrik |
| --- | --- |
| H1: total seminggu Rp 225.000 di samping harga per porsi menaikkan klik WhatsApp | rasio klik tombol WhatsApp per pengunjung |
| H2: pilihan hari (Senin–Jumat) menaikkan jumlah pembaca yang sampai ke bagian pesan | % sesi yang mencapai #pesan |
| H3: pesan WhatsApp yang sudah terisi mengurangi bolak-balik chat | jumlah pesan sampai pembayaran pertama (dihitung pemilik) |

## Konten [SAMPLE] yang harus diganti
- **Menu satu minggu:**
  - Senin: ayam panggang bumbu kuning / tumis buncis wortel / pepaya
  - Selasa: pepes ikan / sayur bening bayam / semangka
  - Rabu: tahu tempe bacem / capcay / melon
  - Kamis: ayam suwir kemangi / urap sayur / nanas
  - Jumat: ikan bakar kecap / tumis kangkung / buah naga
- Contoh lauk/sayur/buah di bagian "empat bagian" juga diambil dari menu contoh ini.
- Di halaman, menu ini diberi label "Contoh menu satu minggu. Menu aslinya bisa berbeda."
- **Gambar:** semua gambar adalah ilustrasi SVG yang digambar dengan kode dan menggantikan foto. Tidak ada foto temuan, jadi tidak ada kredit yang perlu dicantumkan.
- **Bukti:** tidak ada bukti yang dibuat-buat (tanpa testimoni, rating, jumlah pelanggan, kalori, atau jam antar).

## WARN yang dipertahankan
Tidak ada (inspector terakhir: 0 FAIL, 0 WARN di 1440/768/390).

## Supaya lebih bagus
1. **Jam antar dan batas pesan, plus area/ongkir.** Ini menjawab ketakutan nomor satu pembeli makan siang kantor ("telat"). Bisa ditaruh tepat di samping harga, dan FAQ pertama berubah dari "tanya dulu" menjadi jawaban.
2. **Foto asli, 8 foto.** Daftar pemotretan:
   1. Kotak terbuka dari atas di meja kantor, cahaya jendela, horizontal → hero.
   2. Close-up lauk hari ini (ayam panggang mengilap), vertikal → bagian "empat bagian".
   3. Lima kotak berjajar Senin–Jumat dengan isi berbeda, horizontal → bagian minggu.
   4. Nasi merah dan shirataki berdampingan, detail → baris karbo.
   5. Tangan menata sayur dan buah ke kotak di dapur, horizontal → langkah pesan.
   6. Kotak-kotak siap antar dengan label nama, pagi hari → harga.
   7. Pengantar menyerahkan kotak di lobi kantor (dari belakang, tanpa wajah) → FAQ antar.
   8. Pemilik di dapur (kalau bersedia) → penutup.

   Foto akan menaikkan selera makan, yang menurut kedua juri adalah kelemahan ilustrasi.
3. **Nama pemilik dan lokasi dapur** (satu baris, misalnya "Dimasak pagi ini oleh … di …"). Ini menjawab "siapa yang saya chat" sebelum pembeli mengirim alamat kantornya.
4. **Tiga pesan pelanggan asli** (dengan izin, nama boleh disamarkan) dan menu asli dua minggu terakhir. Dengan itu [SAMPLE] bisa diganti dan bagian bukti bisa ditambahkan tanpa mengarang.
5. **Keputusan bisnis:** coba 1 hari (trial) atau aturan libur/WFH yang jelas. Ini menurunkan risiko Rp 225.000 di muka (roast #7). Setelah diputuskan, cukup tambah satu baris di bagian harga.

## Biaya dan catatan proses
- **Subagent:** reason roaster dan 2 juri (visual-motion, business-customer-story) dijalankan oleh koordinator. Jumlah token mereka tidak terlihat dari sesi ini, jadi silakan ambil dari koordinator. Roast strategi tidak independen: saya kerjakan sendiri karena sesi ini tidak bisa membuat subagent. Tidak ada juri verifikator dan hanya ada satu ronde look.
- **Langkah learn:** dilewati, karena tidak ada umpan balik dari pengguna (autopilot).
- **Script skill:** tidak ada yang diubah, jadi `npm test` tidak perlu dijalankan.
