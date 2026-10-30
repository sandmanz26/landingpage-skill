# Simulasi v2: Senyum Dental dengan riset, strategi dan roast

Run kedua untuk brief yang sama, memakai alur baru: brief → **research → strategy → roast** → direction → … Run ini berhenti di **gerbang strategi**: titik pertama skill mengembalikan hasil riset ke pemakai. Langkah setelahnya sama seperti simulasi pertama (`examples/senyum-dental`).

File: `design-log/research.md`, `design-log/strategy.md`, `design-log/roast.md`, `design-log/decisions.log`.

## Yang dilihat pemakai di gerbang strategi

**1. Riset (7 temuan yang mengubah desain).** Sumber hanya hasil pencarian; halaman sumber tidak bisa dibuka dari sesi ini, jadi setiap angka ditandai *(snippet)* dan wajib dicek sebelum tayang.
- Alasan terbesar orang tidak ke dokter gigi adalah **merasa tidak perlu** (57% dari yang tidak pernah berobat, SKI 2023), bukan rasa takut.
- Rasa takut nyata tapi minoritas: ±15% orang dewasa (meta-analisis 31 studi, 72.577 orang).
- Klaim "tanpa sakit" tidak dipercaya; yang meyakinkan adalah penjelasan jujur tentang apa yang terasa.
- Rp 350.000 berada di kelas menengah-atas klinik swasta Bandung (±Rp 200–555 ribu); puskesmas Rp 50–200 ribu.
- Ada rumah sakit gigi di jalan yang sama, kemungkinan lebih murah. Bersaingnya lewat jadwal pasti dan kejelasan, bukan harga.
- Pasien memuji booking yang mudah ("reservasi malam, besoknya langsung").
- Soal BPJS untuk scaling, sumber-sumber saling bertentangan, jadi halaman harus menjawabnya.

**2. Strategi.** Aksi: booking WhatsApp. Pengunjung: pekerja kantoran yang sadar perlu tapi terus menunda. Janji utama: *jadwal pasti di jam istirahat, semuanya dijelaskan dulu*. Storyline 7 langkah, dari "perlu nggak?" sampai lokasi.

**3. Yang diubah oleh roast (8 poin, semua ditanggapi).**

| Sebelum roast | Sesudah roast |
| --- | --- |
| Storyline langsung menjual kemudahan | Ditambah langkah "Perlu sekarang?" karena hambatan terbesar adalah merasa tidak perlu |
| Harga hanya disebut | Harga dijelaskan: apa yang didapat dibanding alternatif, plus jawaban soal BPJS |
| Janji utama "30 menit" | Janji utama "jadwal pasti, dijelaskan dulu"; 30 menit menjadi bukti |
| Jam hanya menunjukkan waktu | Jam menjadi naskah kunjungan: waktu, apa yang dijelaskan, apa yang terasa (arah desain berubah) |
| Tidak ada bukti, diterima begitu saja | Nama dokter, rating Google dan foto menjadi **syarat sebelum tayang** |
| Section khusus rasa takut | Dihapus; rasa takut dijawab di langkah jam, tepat saat muncul |

**4. Pertanyaan untuk klien.** Review Google, nama dan kredensial dokter, foto klinik, kebijakan BPJS, nomor dan waktu balas WhatsApp, 3 bulan pertanyaan WhatsApp.

## Batasan demonstrasi ini
- Riset hanya dari ringkasan pencarian karena membuka halaman diblokir. Di lokal dengan akses internet, skill membuka setiap sumber.
- Roast ditulis di langkah terpisah oleh agen yang sama, bukan subagent independen.
