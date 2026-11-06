# Pilihan yang diambil tanpa pemilik usaha (tasteskill 2.5.0)

Pemilik tidak bisa dihubungi. Di setiap titik di mana skill meminta keputusan "dengan pengguna", diambil
opsi bawaan atau yang direkomendasikan skill, atau opsi yang paling dekat dengan brief. Daftar ini mencatat
setiap pilihan itu.

## Jenis halaman dan deal

1. **Jenis usaha: `product`** (page type product, site-kind other). Brief: katering makan siang yang diantar ke
   kantor, tanpa tempat yang dikunjungi pembeli. SKILL.md bagian 1: "It is a product only when nothing happens
   at the door"; produk fisik yang dijual jarak jauh (seperti "coffee beans sold online") termasuk product.
   Alternatif `service` ditolak karena yang dibeli adalah kotak makan, bukan jasa per jam.
2. **Bahasa halaman: Indonesia** (`lang="id"`). Pemilik dan pembelinya berbahasa Indonesia. Pemeriksa salinan
   skill memakai daftar kata kerja bahasa Inggris, jadi "Berlangganan" dan "Lihat menu" mendapat WARN
   copy-buttons. Itu diterima.
3. **Hero: `product`**, dibagikan oleh `deal.mjs --type product --has object` (tanpa foto, jadi selalu `product`).
4. **Palet: `green-mat-chocolate`** (dari tiga yang dibagikan) karena hijau cocok dengan makanan sehat.
   **Pasangan huruf: `bricolage`** (Bricolage Grotesque / Figtree; menurut skill cocok untuk "kitchens that sell
   online"). **Radius: `soft`** (bawaan skill).
5. **Nav `nav-split`, footer `footer-dark`, rhythm `brand-band`, tombol `pill`, mark `ring`**: dibagikan oleh
   one-liner di sections.md. Nav-split tanpa panel foto, karena tidak ada foto (sections.md bagian 2).
6. **Close: `close-photo` dibagikan, lalu dibagikan ulang** menjadi baris kepala `close-word` tanpa nama, sesuai
   aturan "with no photograph to show" (sections.md bagian 2).
7. **Brand band** dipasang di bagian "Antar" (adegan di meja kerja, gambar terkuat di paruh kedua). Warna aksen di
   band digelapkan ke `#2f5228` agar teks putih lolos 7:1 (backgrounds.md).

## Gambar

8. **Tidak ada foto dari klien, jadi produk di-render** (photos.md "A product without photographs"): satu spec
   product-render buatan sendiri, `assets/objects/product-render/specs/kotak-makan.json`. Isinya kotak bersekat
   hijau tua dengan nasi, ayam, tempe, tahu, brokoli, wortel, pepaya, melon, serta sendok dan garpu kayu. Semua
   tampil sebagai still, tanpa WebGL di halaman. Desain kotak, warna kotak, dan isi menu harian pada render adalah
   rekaan untuk ilustrasi. Brief hanya menyebut jenis isinya.
9. **Pilihan warna (swatch) = pilihan nasi**: "Nasi merah" dan "Shirataki" adalah dua colourway dari spec.
   Radio di kartu pesanan mengganti gambar di sebelahnya (aturan Product no. 5). Kedua warna tampil di halaman.
10. **Tampilan per bagian**: hero `lebar`, bagian Kotak `three-quarter` (shirataki), Menu empat close-up, Antar
    adegan `meja`, Pesan `top`. Produk utuh tampil di tiga bagian, sesuai batas skill.
11. **Hotspot di hero dihapus.** Posisinya dalam persen panggung tidak tetap di atas bagian yang sama di semua
    lebar layar.
12. **Tidak ada FAQ dan tidak ada bagian spesifikasi terpisah.** Brief terlalu sedikit faktanya, dan FAQ akan
    mengulang fakta (aturan "no fact twice"). Tiga fakta jual (harga, minimal langganan, hari antar) ada sebagai
    `rows--spec` di bagian Kotak.

## Salinan dan kontak

13. **Aksi utama: "Berlangganan"**, sama di nav, hero, kartu pesanan, dan penutup. Label awal "Pesan langganan"
    membuat bar nav meluber di 390px.
14. **Nomor WhatsApp 0812-3456-7890 dicetak persis seperti di brief**, dengan tautan `wa.me/6281234567890`.
    Pemeriksa dijalankan dengan `--address-allow`. Pemeriksa `placeholder` tetap menandainya sebagai nomor contoh
    (digit berurutan). **Pemilik perlu memastikan nomor ini benar.**
15. **Kartu pesanan** (lama langganan 5/10/15/20 hari, porsi 1 sampai 5 per hari, total = Rp 45.000 × hari ×
    porsi) membuka WhatsApp dengan pesan yang sudah terisi. Tidak ada formulir POST karena tidak ada alamat
    server. Pilihan 10/15/20 hari dan beberapa porsi per hari adalah asumsi turunan dari "minimal 5 hari". Harga
    tidak diubah.
16. **Total Rp 225.000 untuk 5 hari** adalah hitungan 5 × Rp 45.000, bukan harga paket dari brief.
17. **Tidak ada alamat jalan, jam antar, email, media sosial, halaman Privasi/Ketentuan, atau testimoni.** Brief
    tidak menyediakannya. Skill melarang mengarangnya.
18. **Nama "Dapur Seimbang" berasal dari brief**, jadi tidak dicari dan tidak ada `names.json`.

## Lingkungan

19. Chromium dijalankan sebagai root, jadi skrip skill memakai `CHROME_PATH` ke pembungkus yang menambah
    `--no-sandbox` (di scratchpad, bukan di proyek). File kit tidak diubah.
20. Contoh spec kit (city-bike, desk-lamp, robot-arm) dihapus dari salinan `assets` proyek. Skill melarang
    mengirim spec kit sebagai produk klien.
