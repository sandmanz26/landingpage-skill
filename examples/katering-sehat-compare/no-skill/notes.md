# Dapur Seimbang: catatan landing page (versi tanpa skill)

File: `index.html`, satu file. CSS, JS, ilustrasi SVG dan favicon semuanya inline. Satu-satunya dependensi luar adalah Google Fonts (Fraunces + Plus Jakarta Sans). Kalau font gagal dimuat, halaman memakai font sistem dan tetap tampil normal.

## Struktur halaman
1. Header sticky: logo wordmark, navigasi (desktop), dan tombol "Pesan via WhatsApp".
2. Hero: headline "Makan siang sehat, diantar ke kantor. Kamu tinggal kerja.", CTA WhatsApp, tiga fakta (Rp45rb/porsi, Sen–Jum, minimal 5 hari), dan ilustrasi SVG kotak makan (nasi merah, ayam, sayur, buah) sebagai pengganti foto.
3. Strip manfaat: hemat waktu istirahat, komposisi seimbang, tidak perlu memikirkan menu.
4. Isi satu kotak: karbo (nasi merah/shirataki), lauk (ayam/ikan/tahu tempe), sayur, buah.
5. Contoh menu Senin–Jumat (di mobile bisa digeser ke samping).
6. Cara langganan dalam 4 langkah.
7. Harga dan form "Hitung & pesan": pilih 5/10/20 hari, jumlah porsi, dan karbo, isi nama dan kantor (opsional). Total dihitung langsung, lalu tombol membuka WhatsApp dengan pesan yang sudah tersusun.
8. FAQ (6 pertanyaan), CTA penutup, dan footer.
9. Tombol WhatsApp sticky di mobile. Muncul setelah hero lewat dan disembunyikan saat form harga terlihat.

## Keputusan yang saya ambil sendiri (pemilik tidak bisa ditanya)
- **Tanpa foto**: diganti ilustrasi SVG buatan sendiri, bukan stock photo, supaya pelanggan tidak mengira itu foto makanan asli. Sebaiknya diganti foto asli begitu tersedia; foto makanan sangat berpengaruh untuk katering.
- **Contoh menu mingguan saya karang** (ayam bakar kecap, dori panggang lemon, tahu tempe bacem, ayam suwir sambal matah, pepes ikan; sayur dan buah juga). Di halaman sudah diberi label jelas "ini contoh", tapi **pemilik harus menggantinya dengan menu asli**.
- **Karbo bisa dipilih pelanggan** (nasi merah atau shirataki). Dari pesan pemilik belum jelas apakah pelanggan bisa memilih atau dapur yang menentukan.
- **Paket 5/10/20 hari** di kalkulator hanyalah kelipatan Rp45.000 tanpa diskon. Saya tidak membuat diskon karena pemilik tidak menyebutkannya.
- **Tidak menyebut**: ongkir, jam antar, cara bayar, batas waktu pesan, kalori/gizi, ahli gizi, testimoni, jumlah pelanggan. Semua itu tidak diberikan pemilik, jadi tidak saya tulis supaya tidak ada klaim palsu. Di halaman, hal-hal ini diarahkan ke "admin akan konfirmasi lewat WhatsApp".
- **Satu-satunya klaim kesehatan** adalah shirataki "lebih rendah kalori". Ini fakta umum, bukan angka spesifik.
- **FAQ alergi** ditulis hati-hati ("kami cek apakah bisa disesuaikan"), tidak menjanjikan menu khusus.
- **FAQ pesanan tim kantor**: saya anggap boleh lebih dari 1 porsi per hari (stepper sampai 50).
- **Nada bahasa**: santai ("kamu", "nggak") sesuai target karyawan 25–40, tapi tetap rapi.
- **Nomor WA** 0812-3456-7890 ditulis sebagai `wa.me/6281234567890`, dengan pesan pembuka otomatis yang berbeda per tombol.

## Yang perlu dilengkapi pemilik
- Foto asli makanan (minimal 3–5 foto kotak makan dari atas).
- Menu asli minggu ini, ongkir, jam antar, cara bayar, dan batas waktu pemesanan (H-1?).
- Testimoni asli pelanggan, kalau ada.
- Domain/hosting dan gambar Open Graph (preview saat link dibagikan di WA).

## Yang sudah dicek
- Playwright (Chromium) di lebar 1280px dan 390px: tidak ada error di console dan tidak ada scroll horizontal.
- Form: memilih 10 hari, 2 porsi, dan shirataki menghasilkan Rp900.000, dan WhatsApp terbuka dengan pesan berisi paket, porsi, karbo, total, nama, dan kantor.

## Yang tidak dicek
- Browser selain Chromium (Safari iOS, Firefox) dan perangkat fisik.
- Membuka link WA di HP sungguhan. Yang dicek hanya URL-nya.
- Audit aksesibilitas dengan screen reader. Yang sudah dibuat baru dasar: label, fokus keyboard, dan reduced-motion.
