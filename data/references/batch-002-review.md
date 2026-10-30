# Review batch-002: Maxima Therapy dan Future

Tanggal: 2026-10-30. Juri: 5 juri AI terpisah (art director, conversion strategist, customer researcher, story strategist, motion & accessibility; juri motion mengamati halaman langsung di browser) + Anda. Juri AI tidak melihat skor Anda. Data lengkap: `batch-002.json`.

## Skor

| Referensi | Kejelasan | Kekhasan | Craft | Bisnis | Konsumen | Story | AI berbobot | Anda | Gabungan | Selisih |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Maxima (beranda) | 5 | 9 | 7 | 3 | 3 | 4 | 5,0 | 9 | 7,0 | **4,0** |
| Maxima (3–18) | 4 | 8 | 6 | 3 | 3 | 5 | 4,7 | 9 | 6,8 | **4,3** |
| Future | 7 | 5 | 7 | 8 | 7 | 7 | 6,9 | 8 | 7,5 | 1,1 |

Selisih di atas 2 ditandai sistem: AI dan Anda menilai hal yang berbeda. Penjelasannya di bagian "Pola selera Anda".

Maxima beranda dan halaman 3–18 memakai template yang sama persis, halaman demi halaman. Pelajarannya dihitung sekali, bukan dua kali.

## Catatan Anda vs temuan juri

### Maxima

| Klaim Anda | Putusan | Intinya |
| --- | --- | --- |
| Permainan warna | Terbukti untuk rasa, dibantah untuk fungsi | 8–10 warna datar tanpa gradien, terasa "bukan klinik". Tapi oranye terkuat dipakai untuk tombol **Donate**, dan pasangan hijau/kuning/putih gagal kontras (1,82–2,78:1) |
| Tipografi bagus | Terbukti untuk kekhasan, dibantah untuk keterbacaan | Huruf display sampai 575px. Headline utama terpecah 5 baris di dua layar, dan stiker menutupi huruf judul di halaman 3–18 |
| Grafis sesuai goal tanpa vektor 3D modern | **Terbukti** | Ilustrasi datar, 0 shadow, 0 gradien. Membangun kehangatan untuk keluarga, tapi belum membangun kepercayaan |
| Scroll bagus, objek memberi kesan modern | **Dibantah** | Dibuat dengan rapi (GSAP, ScrollTrigger, SplitText, Lenis, Lottie; craft motion 8). Tapi gerakannya sebagian besar dekorasi, mengabaikan reduced motion, menyembunyikan lagi langkah "cara memulai" setelah dilewati, dan **pindah sendiri ke halaman lain setelah ±12,5 detik diam**. Objeknya terbaca seperti buku cerita anak, bukan "modern" |

**Soal "rounded = modern" (kedua kalinya):** kedua font Maxima rounded (ABC Diatype Rounded Plus dan Robuck Rounded). Di sini rounded memberi kesan **hangat dan ramah anak**. Rounded adalah alat untuk karakter tertentu, bukan tanda modern.

**Yang terlewat dari catatan Anda:**
- tidak ada ajakan di layar pertama; tombol "Get started" baru muncul di ±85% halaman;
- tidak ada bukti: wajah terapis, kredensial, atau testimoni;
- pertanyaan utama orang tua soal biaya, asuransi, daftar tunggu, dan wilayah layanan tidak dijawab. Kemungkinan layanannya gratis lewat sistem negara bagian California (inferensi dari istilah Regional Center/IFSP), dan itu alasan terkuat untuk mendaftar yang justru tidak pernah disebut;
- untuk audiens neurodivergen, beban sensorik dan gerak yang tidak bisa dimatikan adalah masalah serius, bukan detail kecil.

### Future

| Klaim Anda | Putusan | Intinya |
| --- | --- | --- |
| Permainan foto | **Terbukti** | Member nyata lintas usia, video coach, testimoni video. Catatan: atlet di hero mungkin terlalu bugar untuk orang yang pernah gagal latihan sendiri |
| Prototipe membuat user fokus | **Terbukti** | Satu ponsel di tengah latar hitam, satu headline, satu ajakan. Isi layarnya adalah adegan dari hidup pelanggan (minggu dinas, jadwal digeser, catatan cedera) |
| Card gambar dengan ikon | Istilah dikoreksi | Itu kartu foto dengan potongan UI aplikasi (pemilih hari, layar jam), bukan kartu ikon |
| Animasi di setiap section sangat bagus | **Dibantah** | Diukur langsung: animasinya terkendali (fade 600/300ms, header bersembunyi 200ms, kartu video membesar saat scroll). Tapi bagian hasil, testimoni, dan footer tidak beranimasi sama sekali, dan marquee kartunya adalah bagian terlemah (tidak bisa dihentikan) |

**Yang terlewat:** kekuatan utama Future justru di bisnisnya. Harga plus jaminan refund tertulis tepat di bawah tombol pertama ("$50 bulan pertama, lalu $199/bulan, refund penuh dalam 30 hari"), ada bukti sosial sebelum ajakan, dan kuis 1 menit. Kelemahannya: ada tiga label berbeda untuk satu tindakan yang sama, dan angka "98%" tidak bersumber.

## Pola selera Anda (dari 6 referensi)

Skor Anda mengikuti **kekhasan dan art direction**, bukan bisnis atau konsumen:

| Referensi | AI berbobot | Anda |
| --- | --- | --- |
| Maxima | 4,7–5,0 (terendah) | **9** (tertinggi) |
| Future | 6,9 (tertinggi) | 8 |
| Batch-001 (3 situs) | 5,7–6,6 | 8, 8, 8 |

Ini **sinyal selera yang nyata dan berharga**: Anda menyukai warna berani, tipografi ekspresif, ilustrasi datar yang khas subjeknya, dan cerita lewat scroll. Tapi skor Anda sekarang menjawab "seberapa bagus art direction-nya", bukan "apakah halaman ini akan berhasil untuk klien". Kalau dua pertanyaan itu dicampur dalam satu angka, skill bisa belajar meniru halaman yang indah tapi tidak menjual.

**Usulan:** mulai batch berikutnya, beri **dua skor**: *visual* (1–10) dan *akan saya kirim ke klien* (1–10). Jury akan memakai skor visual untuk kriteria estetika, dan skor kedua untuk keputusan keseluruhan.

## Usulan aturan selera tim (menunggu persetujuan Anda)

Turunan dari 6 referensi. Belum masuk ke `team/taste.md` sebelum Anda setujui.

- **Prefer:** warna datar yang berani dengan peran jelas, satu warna untuk aksi utama (sumber: Maxima, Scotch, Playfolly)
- **Prefer:** ilustrasi atau grafis datar yang diturunkan dari subjeknya sendiri, bukan vektor 3D generik (sumber: Maxima, Replay)
- **Prefer:** UI produk sungguhan berisi data dunia pelanggan, bukan mockup kosong (sumber: Scotch, Future)
- **Prefer:** cerita lewat scroll dengan objek dari dunia subjek ("cara lama vs baru", kartu yang berputar), selalu dengan versi statis untuk reduced motion (sumber: Scotch, Maxima)
- **Always:** harga atau jawaban biaya dekat ajakan utama bila bisnisnya mengizinkan (sumber: Future; kekurangan di Playfolly dan Maxima)
- **Never:** konten yang hanya muncul lewat animasi, gerak tanpa reduced motion, dan halaman yang berpindah sendiri (sumber: Replay, Maxima)

## Kandidat perpustakaan

| Dari | Pola | Fungsi |
| --- | --- | --- |
| Maxima | Tagline menjadi sistem visual ("different angle" → tipografi, kartu, dan huruf yang dimiringkan) | Kekhasan yang lahir dari pesan |
| Maxima | Halaman program sebagai bab perjalanan hidup, tiap bab punya warna sendiri + ajakan "Next stop" | Navigasi antar-layanan |
| Maxima | Sebut kekhawatiran pengunjung dalam satu kalimat tepat sebelum 3 langkah proses | Menenangkan sebelum meminta |
| Future | Harga + refund tepat di bawah tombol pertama | Menghapus keberatan harga sejak awal |
| Future | Layar aplikasi ditulis sebagai adegan dari hidup pelanggan | Bukti "personal" |
| Future | Satu layar produk sendirian di latar hitam di bawah satu headline | Fokus |
| Future | Palet monokrom sehingga foto yang membawa warna; serif display tipis untuk kesan premium | Kesan premium tanpa ornamen |

## Pertanyaan untuk Anda

1. Maxima: setelah tahu tidak ada ajakan di layar pertama, langkah pendaftarannya menghilang, dan halamannya pindah sendiri, apakah tetap 9? Kalau ya, berarti skor Anda mengukur art direction saja, dan usulan dua skor di atas menjadi penting.
2. Apakah 6 usulan aturan selera di atas Anda setujui, ubah, atau tolak?
3. Future: "card gambar dengan ikon" yang Anda maksud itu potongan UI aplikasi di atas foto?
