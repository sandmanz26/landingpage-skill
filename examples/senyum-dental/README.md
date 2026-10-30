# Simulasi: Senyum Dental

Satu run lengkap skill `design-director` dari brief contoh **CONTOH-1** di `templates/referensi-dan-brief.xlsx`. Mode `create`, effort `standard`, gerbang `autopilot` (simulasi tanpa pemakai yang menjawab langsung; semua gerbang tetap ditulis dan dicatat). Buka `index.html` di browser untuk melihat hasilnya.

## Paket hasil (langkah deliver)

**Yang dibuat:** satu halaman statis, `index.html` + `assets/` (CSS, satu skrip kecil, font Fraunces dan Instrument Sans yang di-host sendiri, lisensi OFL).

**Arah:** `split-stage` (seed 109772034) dari 3 arah yang dibagikan. C ditolak karena butuh foto yang belum ada; B ditolak karena bidang warna yang lantang melawan audiens yang cemas. Lihat `design-log/direction-gate.md`.

**Ide:** *Di halaman ini, kunjungan 30 menit di jam istirahat menjadi separuh layar yang diam: jam yang bergerak dari 12.00 ke 12.30 saat pengunjung membaca setiap langkahnya.*

**Satu hal yang hidup:** pilih hari dan jam, pesan WhatsApp tersusun otomatis.

**Pemeriksaan:** inspector 0 FAIL, 0 WARN di 1440/768/390px, reduced motion dan tanpa JavaScript; lint 0 temuan. Skor kritik akhir 7,3 (kejelasan 8, kekhasan 7, craft 7, kecocokan 7).

**Konten contoh yang harus diganti sebelum tayang** (`[SAMPLE]` di `design-log/copy.md`):
- nomor WhatsApp +62 812-0000-0000 (brief tidak menyebut nomor);
- rincian menit per langkah (12.05, 12.12, 12.25) dan teks tiap langkah;
- daftar "sudah termasuk" di bagian harga;
- "paling sepi pukul 09.00–11.00 dan setelah 18.00".

**Tidak ada gambar yang menggantikan foto**; jam digambar dalam kode. Saat 6 foto klinik tersedia, arah perlu dibagi ulang dengan `--have photography`.

**Yang masih kurang** (dari kritik akhir): belum ada foto klinik yang nyata; ruang kosong ±240px di atas bidang harga; jam buka 24 jam butuh dua kali lihat.

## Jejak setiap langkah

| Langkah | Output | File |
| --- | --- | --- |
| brief | Kartu brief 9 baris | `design-log/brief.md` |
| argument | 10 hal khas klinik + 6 klaim; testimoni dan kartu fitur dihapus karena tidak ada buktinya | `design-log/argument.md` |
| direction | 3 arah, kalimat ide, competitor test, rekomendasi | `design-log/direction-gate.md`, `design-log/directions/` |
| skeleton | 2 masalah struktur ditemukan sebelum ada gaya | `design-log/skeleton.html`, `design-log/screenshots/skeleton-*.png` |
| spec | 12 keputusan, token, rencana section, motion spec | `design-log/spec.md` |
| copy | Seluruh teks, sapaan "Anda", `[SAMPLE]` ditandai | `design-log/copy.md` |
| build | Hero best-of-3: A 7,4 · B 6,6 · C 5,8 | `design-log/variants/` |
| gate | 1 FAIL (tap target) + 1 WARN (false positive) → 0 | — |
| look | Putaran 1: 3 masalah diperbaiki; putaran 2: 7,3 | `design-log/critique.md` |
| deliver | Paket di atas | `design-log/screenshots/` |
| learn | Dilewati: tidak ada feedback pemakai di simulasi | `design-log/decisions.log` |

## Yang ditemukan simulasi tentang skill-nya sendiri

1. **Server inspector** hanya melayani folder file HTML, sehingga CSS di folder atas tidak termuat. Diperbaiki: server melayani dari root proyek.
2. **False positive "shadow"**: shadow inset (dipakai sebagai garis) dihitung sebagai bayangan. Diperbaiki.
3. **Screenshot sticky salah:** potongan full-page tidak memperlihatkan elemen sticky di posisi aslinya, sehingga jam yang menutupi harga tidak terlihat. Diperbaiki: inspector menggulir dan memotret layar seperti yang dilihat pengunjung. Inilah yang kemudian membuka masalah terbesar halaman ini.
4. Panduan build ditambah aturan pembungkus untuk elemen sticky.

## Batasan simulasi ini

- Gerbang dijawab oleh Claude (`autopilot`), bukan oleh desainer.
- Kritik dilakukan oleh pembuatnya sendiri di langkah terpisah, bukan oleh subagent independen.
- Belum ada selera tim (`team/taste.md` kosong) dan belum ada perpustakaan referensi, jadi "kecocokan" hanya dinilai terhadap brief.
