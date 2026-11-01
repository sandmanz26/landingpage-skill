# Review batch-003: Swehl dan Resolute

Tanggal: 2026-10-31, skor Anda masuk 2026-11-01. Juri: 5 juri AI terpisah. Kali ini mereka hanya membaca paket bukti hasil `capture.mjs`, tanpa membuka browser, kecuali satu cek transisi untuk Resolute. Data lengkap: `batch-003.json`.

## Skor (AI saja, menunggu dua skor Anda)

| Referensi | Kejelasan | Kekhasan | Craft | Bisnis | Konsumen | Story | AI berbobot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Swehl | 6 | 7 | 6 | 4 | 6 | 6 | 5,8 |
| Resolute | 5 | 5 | 4,5 | 5 | 4 | 6 | 4,9 · **2 veto** |

## Skor Anda dan gabungannya (2026-11-01)

Anda memberi 9,5 visual dan 9,5 layak kirim untuk kedua situs. Skor visual Anda masuk ke kekhasan dan craft, skor layak kirim menjadi skor keseluruhan Anda.

| Referensi | AI berbobot (dengan visual Anda) | Anda: layak kirim | Gabungan | Selisih |
| --- | --- | --- | --- | --- |
| Swehl | 6,2 | 9,5 | 7,9 | **3,3** |
| Resolute | 5,6 | 9,5 | 7,5 | **3,9** |

Veto Resolute tetap berlaku; skor tidak bisa mengalahkannya.

**Catatan netral soal skor ini:**
- Dua skor dibuat untuk memisahkan "indah" dari "akan saya kirim ke klien". Dengan nilai yang sama (9,5 dan 9,5), pemisahan itu belum terjadi.
- "Layak kirim 9,5" bertentangan dengan bukti:
  - di Swehl, semua produk habis dan pop-up menutupi tombol belanja;
  - di Resolute, ada klaim kesehatan tanpa sumber, lencana HIPPA yang salah eja, dan pelanggaran aturan "Never" tim (gerak tanpa versi reduced motion) yang Anda setujui sendiri.

  Salah satu harus disesuaikan: skornya, atau aturannya.
- Dari 11 referensi, skor Anda selalu 8–9,5. Juri yang memberi nilai tinggi untuk semuanya hampir tidak memberi informasi tentang mana yang lebih baik. Usulan: urutkan situs dalam satu batch (1 = paling ingin ditiru), dan pakai patokan: 5 = situs agensi yang rapi, 7 = bagus, 9+ = 5% terbaik yang pernah Anda lihat.

## Kehalusan scroll (diukur 2026-11-01)

Anda menjelaskan "smooth" sebagai **tidak patah-patah**, jadi sekarang diukur: waktu antar-frame saat scroll seperti trackpad. Frame di atas 50 ms terlihat sebagai patah. Halaman kosong di mesin yang sama mencapai sekitar 59,6 fps dengan 0 frame panjang.

| Referensi | fps | Frame panjang (>50 ms) | Script memblokir |
| --- | --- | --- | --- |
| Playfolly | 57,7 | 0 | 0% |
| Scotch | 54,7 | 0 | 0% |
| Swehl | 47 | 4 | 0% |
| Future | 44,7 | 13 | 0% |
| Maxima 3–18 | 38,5 | 22 | 0% |
| Maxima | 34,3 | 37 | 21% |
| Replay | 17,5 | 55 | 9% |
| Resolute | **1,9** | **237** | **81%** |

**Batasannya:** container ini tidak punya GPU (SwiftShader, rendering software) dan CPU-nya lebih lambat dari laptop. Jadi tabel ini **mengurutkan seberapa berat halaman**, bukan apa yang Anda lihat di laptop Anda. Rasa smooth Anda di Maxima dan Resolute masuk akal di mesin yang kuat, dan saya tidak bisa membantahnya dari sini. Yang bisa dikatakan:
- Resolute adalah halaman terberat dengan selisih jauh, dan bebannya sebagian besar script, bukan GPU.
- Inferensi (belum diuji): di ponsel Android kelas menengah, Resolute paling mungkin patah-patah.

Untuk memastikannya, jalankan di laptop Anda:

```
node skill/design-director/scripts/smooth.mjs https://www.theresolute.ai/
node skill/design-director/scripts/smooth.mjs https://www.theresolute.ai/ --cpu 4    # simulasi CPU ponsel
```

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

## Jawaban Anda (2026-11-01)

1. Skor: semuanya 9,5 (visual dan layak kirim, kedua situs).
2. Swehl #4: yang dimaksud adalah **pop-up beratap lengkung**. Yang Anda sukai adalah bentuknya. Ini masuk perpustakaan sebagai "bottom sheet beratap lengkung untuk email", dengan syarat muncul setelah pengunjung scroll atau hendak keluar, bukan menutupi hero di detik pertama.
3. Resolute: yang dimaksud transisi **antar section saat scroll**. Istilahnya sudah dikoreksi di catatan.
4. Smooth berarti **tidak patah-patah**, dan sekarang diukur (lihat tabel di atas).
