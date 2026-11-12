# Review batch-014: Frans Hals Museum, Nomadic Tribe (makemepulse)

Tanggal: 2026-11-12. Dibaca dengan pembaca cepat (`read.mjs`, 21 detik per situs), dinilai satu juri (koordinator, Fable 5.2). Ini satu pandangan, bukan panel. Data: `batch-014.json`, `jury/batch-014/coordinator-fable.json`.

Yang belum terverifikasi:
- Inspector tidak dijalankan, jadi kontras, layout shift, dan ukuran target ketuk tidak diukur.
- Nomadic Tribe adalah cerita WebGL di balik tombol START. Yang terbaca hanya pembukaan, layar judul, dan kalimat pertama. Ceritanya sendiri tidak terlihat; skor cerita dan craft-nya berkeyakinan rendah.

## Skor

| Situs | Kategori | Skor juri | Terkuat | Terlemah | Skor Anda |
| --- | --- | --- | --- | --- | --- |
| Frans Hals Museum | culture (sektor baru) | 7,6 | bisnis 8, pelanggan 8, kejelasan 8 | cerita 7, kekhasan 7 | belum ada |
| Nomadic Tribe | agency (sektor baru) | 6,9 (keyakinan rendah) | kekhasan 9 | bisnis 6, kejelasan 6 | belum ada |

## Frans Hals Museum

- **Yang kuat:** urutannya menjawab pengunjung baru: apa dan di mana, apa yang dilihat, bisa bawa anak atau tidak, siapa Frans Hals, lalu museumnya. Tombol "Order tickets" selalu terlihat, dan ada pemberitahuan di paling atas bahwa tiket pameran harus dipesan dulu.
- **Identitasnya tenang:** warna dasar berganti per bab (aprikot, hijau tua kebiruan, sage) dan lukisannya yang menyumbang warna. Kartu gambar membulat, logo dipotong seperti sobekan tiket.
- **Motion-nya sengaja kecil:** tanpa library animasi. Blok memudar masuk, akordeon bergerak, transisi 0,15–0,75 detik, satu video hero dengan tombol jeda.
- **Yang lemah:** panel cookie menutupi hero saat dibuka, hampir seluruh layar di ponsel.

## Nomadic Tribe

- **Yang kuat:** layar judulnya triptych tiga dunia ilustrasi dalam bingkai Art Nouveau, di atas tekstur kertas, dengan empat warna kalem. Judulnya menjadi bagian dari bingkai. Tidak mungkin tertukar dengan situs lain.
- **Pembukaannya sebuah overture:** satu garis tipis dan satu titik tumbuh menjadi lingkaran yang memuat judul, bukan spinner.
- **Yang lemah:** semua isi ada di dalam canvas, jadi tidak terbaca pembaca layar dan tidak terukur. Layar kosong di 2,5 detik pertama. Tidak ada jalan kembali ke pembuatnya di layar yang terbaca.

## Motion yang disimpan dari batch ini

| Gerak yang terlihat | Disimpan sebagai resep |
| --- | --- |
| Blok memudar masuk berurutan (Frans Hals) | `staged-entrance`, `reveal-on-entry` |
| Akordeon dan panel yang tumbuh (Frans Hals) | `state-change` |
| Warna dasar berganti per bab (Frans Hals) | `chapter-ground` |
| Garis yang menggambar dirinya (Nomadic Tribe) | `draw-line` |

Cerita WebGL Nomadic Tribe sendiri tidak disimpan sebagai resep: tidak terbaca, dan di luar cakupan halaman web biasa.

## Yang saya butuhkan dari Anda

Skor Anda untuk kedua situs ini (visual dan layak kirim). Skor "9.5 dan 9.5, site ke-2 9.3, 9.3" di pesan Anda saya baca sebagai skor batch-013 (Mana dan The Other Side of Truth). Kalau maksudnya untuk dua situs ini, beri tahu saya, nanti saya pindahkan.
