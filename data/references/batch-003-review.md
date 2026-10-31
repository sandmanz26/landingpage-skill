# Review batch-003: Swehl dan Resolute

Tanggal: 2026-10-31. Juri: 5 juri AI terpisah. Kali ini mereka hanya membaca paket bukti hasil `capture.mjs`, tanpa membuka browser, kecuali satu cek transisi untuk Resolute. Skor Anda belum ada. Data lengkap: `batch-003.json`.

## Skor (AI saja, menunggu dua skor Anda)

| Referensi | Kejelasan | Kekhasan | Craft | Bisnis | Konsumen | Story | AI berbobot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Swehl | 6 | 7 | 6 | 4 | 6 | 6 | 5,8 |
| Resolute | 5 | 5 | 4,5 | 5 | 4 | 6 | 4,9 · **2 veto** |

## Swehl: catatan Anda vs temuan juri

Bisnisnya: toko online alat menyusui di AS (kit $22–$99,99), ditambah edukasi gratis (video, kelompok diskusi) dan newsletter.

| Klaim Anda | Putusan | Intinya |
| --- | --- | --- |
| Permainan warna sederhana | Terbukti, dengan koreksi | Sederhana dalam cara pakai: warna datar per section, satu warna tinta untuk semua teks, tanpa gradien dan bayangan. Jumlahnya tidak sedikit: 6 warna latar, satu per bab. Judul kuning di atas latar cokelat gagal kontras (2,0:1) |
| Ukuran teks sangat balance | Terbukti, dengan koreksi | Kekuatannya **kontras**, bukan keseimbangan: lompatan tegas dari judul 94–100px ke teks 16px. Ada 9 ukuran huruf, terkecil 10px |
| Konsep scrolling unik | **Terbukti, dengan koreksi** | Tidak ada library animasi, sehingga 3 juri awalnya membantah. Juri motion melihat efek "tirai". Saya ukur dan ternyata benar: ada 4 panel layar penuh yang menempel (sticky), sehingga tiap section membuka section berikutnya. Tekniknya CSS biasa; yang membuatnya khas adalah bentuk lengkung dan warna per section |
| CTA di awal, fixed di bawah, radius melingkar | **Dua elemen tercampur** | Tombol di awal ("SHOP KITS", "GET EDUCATED") berbentuk **pill**, ada di tengah hero, dan **tidak fixed**. Lengkungan besar yang muncul dari bawah adalah **pop-up newsletter** (bottom sheet beratap lengkung). Pop-up ini meminta email dan tanggal lahir anak sekitar 1 detik setelah halaman dibuka, lalu **menutupi judul dan tombol belanja**. Itu pengumpul email, bukan aksi yang menghasilkan uang |

Yang terlewat dari catatan Anda:
- Semua kit di halaman **SOLD OUT**, tanpa tanggal restock atau waitlist, jadi aksi utama buntu. Ini kondisi saat capture 31 Oktober dan bisa sementara.
- Testimoni memuji edukasi dan komunitas, bukan produk yang dijual di hero.
- Tidak ada garansi atau info retur.
- Di ponsel, 25 tombol lebih kecil dari 24px.

## Resolute: catatan Anda vs temuan juri

Bisnisnya: program kesehatan preventif yang dipersonalisasi (tes darah, dokter + AI, program 100 hari), kemungkinan dari India (inferensi dari nomor +91).

| Klaim Anda | Putusan | Intinya |
| --- | --- | --- |
| Tiap section dikemas dengan scrolling yang baik | Mesinnya terbukti; "baik" dibantah | Memakai GSAP, ScrollTrigger, SplitText, Lenis dan Lottie, dan tiap section di 60% halaman atas punya adegan sendiri. Tapi tidak ada versi reduced motion, layout bergeser besar (CLS 1,73; batas wajar 0,1), ada teks yang tidak pernah terlihat, header melorot dengan strip putih, dan muncul pita kosong selama animasi belum jalan |
| Transisi antar halaman smooth | **Istilah dikoreksi** | Ini satu halaman panjang (13.022px), jadi yang Anda maksud adalah transisi **antar section**. Link "Our Approach" hanya lompatan di halaman yang sama, dan sempat muncul frame putih penuh. Rasa "smooth" kemungkinan besar datang dari **Lenis** (scroll yang diperhalus). Kehalusan gerak sendiri belum bisa diukur dari gambar diam |
| Tiap section desainnya unik | Terbukti, dengan koreksi | Benar untuk 60% halaman atas. Mulai bagian testimoni ke bawah, blok-bloknya standar. Variasinya banyak tapi tanpa satu ide: pendaki dari foto stok, kepala 3D berkilau, gradien dan efek kaca adalah tampilan bawaan kategori "longevity" |

**Dua veto (tidak bisa dikalahkan suara):**
1. **Aksesibilitas.** Gerak tetap berjalan saat pengunjung meminta reduced motion. Ada 4 teks yang bergerak terus, termasuk "LIVE NOW" yang berkedip, tanpa tombol jeda. Ini melanggar aturan "Never" tim yang Anda setujui.
2. **Klaim tanpa sumber.** "Reduced Cardiovascular Risk", "Eliminate inflammation", "10,000+ Personalised Journeys", dan lencana "**HIPPA** NPP Compliant": salah eja, dan HIPAA tidak punya sertifikasi resmi.

Polanya boleh masuk perpustakaan; klaim dan gerak tanpa versi statisnya tidak.

## Pola selera Anda (9 referensi)

Untuk ketiga kalinya, klaim Anda tentang gerak perlu dikoreksi:
- Maxima: "scroll modern".
- Future: "animasi di setiap section".
- Resolute: "transisi antar halaman".

Ini bukan berarti Anda salah melihat. Anda menilai gerak dari **rasa**, dan juri AI tidak bisa mengukur rasa dari gambar diam. Sebaliknya, juri juga sempat salah: 3 dari 5 juri menyimpulkan "scroll Swehl biasa saja" hanya karena tidak ada library animasi, sampai pengukuran membuktikan sebaliknya. Kedua pihak butuh alat ukur kehalusan gerak; lihat langkah berikutnya di HANDOFF.

Konsisten dengan aturan tim: Swehl cocok dengan "warna datar yang berani". Resolute cocok dengan "cerita lewat scroll", tetapi melanggar syarat versi statisnya.

## Kandidat perpustakaan

| Dari | Pola | Fungsi |
| --- | --- | --- |
| Swehl | Bab berkode warna: satu latar datar per pilar, satu warna tinta | Pengunjung selalu tahu sedang di bagian mana |
| Swehl | Bentuk lengkung yang membingkai judul melengkung di atas foto dokumenter | Bentuk brand yang membingkai foto asli, bukan hiasan |
| Swehl | Efek tirai dengan sticky CSS, tanpa library | Kesan "membalik halaman" yang murah dan aman (CLS 0) |
| Swehl | Harga di judul produk dan di tombolnya | Pertanyaan biaya terjawab di titik keputusan |
| Swehl | Kolom tanggal lahir anak (opsional) di form email | Follow-up datang tepat saat dibutuhkan |
| Resolute | Kartu program dimiringkan seperti kipas, nama program sebagai wordmark | Enam program terasa satu set yang bisa dijelajahi |
| Resolute | Diagram dua kutub: dokter vs AI bertemu di hasil | Menjelaskan cara layanan bekerja tanpa daftar fitur |
| Resolute | Label CTA = nama langkah prosesnya ("Get Your Blueprint" = langkah 2) | Pengunjung tahu tombol membawanya ke mana |
| Resolute | Tim dokter bernama, lengkap dengan spesialisasi, sebelum ajakan terakhir | Bukti berupa orang, bukan klaim |

## Pertanyaan untuk Anda

1. **Dua skor per situs** (1–10): visual, dan layak kirim ke klien.
2. Swehl #4: yang Anda maksud **pop-up newsletter** beratap lengkung di bawah, atau **tombol pill** di hero?
3. Resolute "transisi antar halaman": apakah Anda mengklik ke halaman lain (link yang mana?), atau maksudnya antar section saat scroll?
4. "Smooth" bagi Anda artinya apa: tidak patah-patah, atau rasa scroll yang "berat dan meluncur" (efek Lenis)?
