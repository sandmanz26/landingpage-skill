# Generates templates/referensi-dan-brief.xlsx. Run: python3 templates/make_template.py
import os
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.worksheet.datavalidation import DataValidation
from openpyxl.comments import Comment
from openpyxl.utils import get_column_letter

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "referensi-dan-brief.xlsx")
F = "Arial"
base = Font(name=F, size=10)
bold = Font(name=F, size=10, bold=True)
title = Font(name=F, size=14, bold=True)
head_fill = PatternFill("solid", fgColor="1F2937")
head_font = Font(name=F, size=10, bold=True, color="FFFFFF")
req_fill = PatternFill("solid", fgColor="FFFF00")
req_font = Font(name=F, size=10, bold=True, color="000000")
dummy_fill = PatternFill("solid", fgColor="F3F4F6")
blue = Font(name=F, size=10, color="0000FF")
thin = Side(style="thin", color="D1D5DB")
border = Border(bottom=thin)
wrap = Alignment(wrap_text=True, vertical="top")

wb = Workbook()

# ---------------- Petunjuk
ws = wb.active
ws.title = "Petunjuk"
rows = [
    ("Pengumpulan referensi dan brief untuk skill design-director", title),
    ("", None),
    ("Cara pakai", bold),
    ("1. Kolom berwarna KUNING wajib diisi. Kolom berjudul gelap boleh dikosongkan.", base),
    ("2. Baris abu-abu berlabel CONTOH adalah data dummy untuk menunjukkan format. Hapus sebelum dipakai.", base),
    ("3. Kolom dengan pilihan (dropdown) mengambil daftar dari sheet 'Model Bisnis' dan 'Daftar'. Tambah pilihan di sana, jangan diketik bebas.", base),
    ("4. Angka berwarna BIRU adalah input (misalnya target jumlah referensi). Kolom hitam berisi rumus, jangan diubah.", base),
    ("", None),
    ("Isi tiap sheet", bold),
    ("Referensi Web: satu baris per situs. Cukup link + model bisnis. Skor dan catatan tim sangat berharga, cukup untuk 20-30% baris.", base),
    ("Dua skor, 1-10, dinilai terpisah: 'Skor visual' = seberapa bagus tampilannya menurut selera tim; 'Layak kirim ke klien' = apakah halaman ini akan Anda kirim ke klien sebagai contoh yang berhasil (jelas, menjual, menjawab pelanggan). Halaman bisa 9 visual tapi 5 layak kirim; selisih itu justru data yang berguna.", base),
    ("Brief Uji: soal ujian untuk membandingkan skill. Target 20 brief, 5 di antaranya hold-out.", base),
    ("Model Bisnis: daftar model bisnis + peta cakupan otomatis (berapa referensi yang sudah ada per model bisnis).", base),
    ("Desainer: siapa yang ikut voting dan gaya gerbang yang mereka suka.", base),
    ("Daftar: pilihan dropdown lain (platform, bagian, status, dll).", base),
    ("", None),
    ("Catatan yang berguna untuk kolom 'Ambil apa' dan 'Jangan ambil apa'", bold),
    ("Spesifik: bagian mana, kenapa bagus, cocok untuk apa.", base),
    ("Lemah: \"Keren banget, suka animasinya.\"", base),
    ("Kuat: \"Headline terbelah saat scroll dan membuka foto di baliknya, terasa seperti membuka pintu. Cocok untuk properti. Jangan ambil kursornya, mengganggu.\"", base),
    ("", None),
    ("Link", bold),
    ("Link halaman Awwwards lebih baik daripada link situsnya langsung: skor juri dan link situs asli bisa diambil otomatis.", base),
    ("Link apa pun lebih baik daripada screenshot: dari link, pipeline bisa mengambil font, ukuran, warna, spacing dan animasi.", base),
    ("", None),
    ("Bukan hanya estetika", bold),
    ("Kolom 'Storyline', 'Cara menjawab keberatan' dan 'Kenapa berhasil secara bisnis' mengajari skill sisi bisnis dan konsumen dari sebuah referensi. Isi bila terlihat; boleh kosong.", base),
    ("Di Brief Uji, kolom 'Bahan suara konsumen' adalah bahan riset terpenting: review, chat WhatsApp, pertanyaan yang sering masuk.", base),
]
for i, (text, font) in enumerate(rows, start=1):
    c = ws.cell(row=i, column=1, value=text)
    c.font = font or base
    c.alignment = Alignment(wrap_text=True, vertical="top")
ws.column_dimensions["A"].width = 120

# ---------------- Daftar (lists)
ls = wb.create_sheet("Daftar")
lists = {
    "Platform": ["Web", "Mobile web", "Aplikasi mobile"],
    "Bagian": ["Satu halaman penuh", "Hero", "Section tertentu", "Navigasi", "Footer", "Transisi halaman", "Animasi scroll", "Form / alur", "Dashboard"],
    "Status": ["Baru", "Dicapture", "Ditag", "Dibuang"],
    "Ya/Tidak": ["Ya", "Tidak"],
    "Bahasa": ["Indonesia", "Inggris", "Campur"],
    "Gaya gerbang": ["Guided", "Quick"],
    "Sumber": ["Awwwards", "One Page Love", "Land-book", "Godly", "Dribbble", "Klien / proyek tim", "Lainnya"],
}
for col, (name, values) in enumerate(lists.items(), start=1):
    h = ls.cell(row=1, column=col, value=name)
    h.font, h.fill = head_font, head_fill
    for r, v in enumerate(values, start=2):
        ls.cell(row=r, column=col, value=v).font = base
    ls.column_dimensions[get_column_letter(col)].width = 22
ls.freeze_panes = "A2"
def list_ref(name):
    col = list(lists).index(name) + 1
    L = get_column_letter(col)
    return f"=Daftar!${L}$2:${L}$30"

# ---------------- Model Bisnis
mb = wb.create_sheet("Model Bisnis", 1)
models = ["Klinik / kesehatan", "F&B / restoran", "SaaS lokal", "Properti", "Jasa profesional", "E-commerce UMKM", "Pendidikan", "Hospitality", "Portfolio / agensi", "Lainnya"]
headers = ["Model bisnis", "Target referensi", "Terkumpul", "Kurang", "Sudah diberi skor", "Rata-rata visual", "Rata-rata layak kirim", "Dengan catatan"]
for c, h in enumerate(headers, start=1):
    cell = mb.cell(row=1, column=c, value=h)
    cell.font, cell.fill, cell.alignment = head_font, head_fill, wrap
mb.cell(row=1, column=1).fill = req_fill
mb.cell(row=1, column=1).font = req_font
mb.cell(row=1, column=2).fill = req_fill
mb.cell(row=1, column=2).font = req_font
REF = "'Referensi Web'"
for r, m in enumerate(models, start=2):
    mb.cell(row=r, column=1, value=m).font = base
    t = mb.cell(row=r, column=2, value=40)
    t.font = blue
    mb.cell(row=r, column=3, value=f'=COUNTIF({REF}!$D:$D,$A{r})')
    mb.cell(row=r, column=4, value=f'=MAX(0,B{r}-C{r})')
    mb.cell(row=r, column=5, value=f'=COUNTIFS({REF}!$D:$D,$A{r},{REF}!$G:$G,">0")')
    mb.cell(row=r, column=6, value=f'=IFERROR(AVERAGEIFS({REF}!$G:$G,{REF}!$D:$D,$A{r},{REF}!$G:$G,">0"),"-")')
    mb.cell(row=r, column=7, value=f'=IFERROR(AVERAGEIFS({REF}!$H:$H,{REF}!$D:$D,$A{r},{REF}!$H:$H,">0"),"-")')
    mb.cell(row=r, column=8, value=f'=COUNTIFS({REF}!$D:$D,$A{r},{REF}!$I:$I,"<>")')
    for c in range(3, 9):
        mb.cell(row=r, column=c).font = base
    mb.cell(row=r, column=6).number_format = "0.0"
    mb.cell(row=r, column=7).number_format = "0.0"
tr = len(models) + 2
mb.cell(row=tr, column=1, value="Total").font = bold
for c, L in zip(range(2, 9), "BCDEFGH"):
    if L == "F":
        f = f'=IFERROR(AVERAGEIF({REF}!$G:$G,">0"),"-")'
    elif L == "G":
        f = f'=IFERROR(AVERAGEIF({REF}!$H:$H,">0"),"-")'
    else:
        f = f"=SUM({L}2:{L}{tr-1})"
    cell = mb.cell(row=tr, column=c, value=f)
    cell.font = bold
mb.cell(row=tr, column=6).number_format = "0.0"
mb.cell(row=tr, column=7).number_format = "0.0"
mb.cell(row=tr + 2, column=1, value="Target referensi (biru) adalah angka awal dari Claude, 40 per model bisnis; ubah sesuai kebutuhan tim. Kolom lain dihitung otomatis dari sheet 'Referensi Web'.").font = Font(name=F, size=9, italic=True)
mb.cell(row=tr + 3, column=1, value="Tambah model bisnis baru di bawah 'Lainnya' (salin rumus dari baris di atasnya); dropdown di sheet lain membaca A2:A30.").font = Font(name=F, size=9, italic=True)
widths = [26, 16, 12, 10, 18, 16, 20, 16]
for i, w in enumerate(widths, start=1):
    mb.column_dimensions[get_column_letter(i)].width = w
mb.freeze_panes = "A2"
MODEL_LIST = "='Model Bisnis'!$A$2:$A$30"

def dv_list(ws, formula, rng):
    dv = DataValidation(type="list", formula1=formula, allow_blank=True)
    dv.error, dv.errorTitle = "Pilih dari daftar.", "Nilai tidak dikenal"
    ws.add_data_validation(dv)
    dv.add(rng)

def header(ws, cols, required):
    for c, (h, w) in enumerate(cols, start=1):
        cell = ws.cell(row=1, column=c, value=h)
        cell.alignment = wrap
        if h in required:
            cell.fill, cell.font = req_fill, req_font
        else:
            cell.fill, cell.font = head_fill, head_font
        ws.column_dimensions[get_column_letter(c)].width = w
    ws.row_dimensions[1].height = 32
    ws.freeze_panes = "B2"
    ws.auto_filter.ref = f"A1:{get_column_letter(len(cols))}1"

def write_rows(ws, rows, start=2):
    for r, row in enumerate(rows, start=start):
        for c, v in enumerate(row, start=1):
            cell = ws.cell(row=r, column=c, value=v)
            cell.font = base
            cell.alignment = wrap
            cell.fill = dummy_fill

# ---------------- Referensi Web
rw = wb.create_sheet("Referensi Web", 1)
cols = [
    ("ID", 12), ("Link (Awwwards atau situs)", 36), ("Sumber", 14), ("Model bisnis", 22), ("Platform", 13),
    ("Bagian yang direferensikan", 20), ("Skor visual (1-10)", 11), ("Layak kirim ke klien (1-10)", 13), ("Ambil apa", 40), ("Jangan ambil apa", 32),
    ("Cocok untuk", 26), ("Storyline / alur halaman", 30), ("Cara menjawab keberatan", 30), ("Kenapa berhasil secara bisnis", 30), ("Brand besar / hanya pola?", 13), ("Catatan lain", 30), ("Dikumpulkan oleh", 16),
    ("Tanggal", 12), ("Status", 12),
]
header(rw, cols, {"Link (Awwwards atau situs)", "Model bisnis"})
dummy = [
    ["CONTOH-001", "https://example.com/contoh-klinik-gigi", "Awwwards", "Klinik / kesehatan", "Web", "Satu halaman penuh", 8, 9,
     "Foto asli ruang praktik dipakai besar di hero; jadwal dokter langsung terlihat di layar pertama.", "Ilustrasi gigi kartun di bagian layanan.",
     "Klinik, salon, praktik profesional", "Takut + tidak sempat -> dua penghalang dihapus satu per satu -> harga -> booking", "Section khusus 'kalau takut sakit' sebelum harga", "Tombol booking WA di setiap layar; harga di depan mengurangi chat yang hanya tanya harga", "Tidak", "DUMMY: contoh format, hapus baris ini.", "Rina", "2026-10-30", "Baru"],
    ["CONTOH-002", "https://example.com/contoh-restoran", "One Page Love", "F&B / restoran", "Web", "Section tertentu", 7, 8,
     "Menu ditulis sebagai tipografi besar dengan harga sejajar kanan, tanpa garis pemisah.", "Loading screen 4 detik sebelum konten muncul.",
     "Restoran, kafe, bakery", "Menu dulu, cerita belakangan", "Harga tertulis jelas, tidak perlu tanya", "Pengunjung datang untuk menu dan jam; keduanya ada di layar pertama", "Tidak", "DUMMY", "Budi", "2026-10-30", "Baru"],
    ["CONTOH-003", "https://example.com/contoh-properti", "Awwwards", "Properti", "Web", "Animasi scroll", 9, 6,
     "Headline terbelah saat scroll dan membuka foto unit di baliknya, terasa seperti membuka pintu.", "Kursor custom yang mengikuti mouse, mengganggu saat membaca.",
     "Properti premium, hotel", "Membuka pintu unit -> denah -> lingkungan -> jadwal kunjungan", "Simulasi cicilan untuk keberatan harga", "Ajakan jadwal kunjungan muncul setelah minat terbangun, bukan di awal", "Tidak", "DUMMY: visual 9 tapi layak kirim 6, karena harga dan lokasi baru muncul di akhir.", "Rina", "2026-10-30", "Baru"],
    ["CONTOH-004", "https://example.com/contoh-saas", "Awwwards", "SaaS lokal", "Web", "Transisi halaman", 8, 7,
     "Kartu fitur membesar menjadi hero halaman detail (shared element), arah perpindahan jelas.", "",
     "SaaS, aplikasi produktivitas", "Masalah -> cara kerja -> bukti -> harga", "", "", "Tidak", "DUMMY", "Dimas", "2026-10-30", "Baru"],
    ["CONTOH-005", "https://example.com/contoh-marketplace", "Lainnya", "E-commerce UMKM", "Mobile web", "Form / alur", 5, 7,
     "Checkout tiga langkah dengan ringkasan pesanan selalu terlihat di bawah layar.", "Warna oranye khas brand, jangan dipakai sebagai warna utama.",
     "Toko online, katalog produk", "", "Ringkasan ongkir sebelum bayar", "Mengurangi keranjang yang ditinggal", "Ya", "DUMMY: brand besar, hanya diambil polanya.", "Budi", "2026-10-30", "Baru"],
    ["CONTOH-006", "https://example.com/contoh-template-saas", "Dribbble", "SaaS lokal", "Web", "Satu halaman penuh", 2, 1,
     "", "Semua: hero tengah dengan dua tombol, gradien ungu, tiga kartu ikon.", "", "", "", "Tidak menjawab keberatan apa pun; tidak jelas apa yang dijual", "Tidak",
     "DUMMY: contoh jelek, sengaja dimasukkan sebagai contoh slop.", "Dimas", "2026-10-30", "Baru"],
    ["CONTOH-007", "https://example.com/contoh-konsultan", "Land-book", "Jasa profesional", "Web", "Hero", None, None,
     "", "", "", "", "", "", "Tidak", "DUMMY: hanya link + model bisnis juga boleh.", "Rina", "2026-10-30", "Baru"],
]
write_rows(rw, dummy)
n = 1000
dv_list(rw, list_ref("Sumber"), f"C2:C{n}")
dv_list(rw, MODEL_LIST, f"D2:D{n}")
dv_list(rw, list_ref("Platform"), f"E2:E{n}")
dv_list(rw, list_ref("Bagian"), f"F2:F{n}")
dv_list(rw, list_ref("Ya/Tidak"), f"O2:O{n}")
dv_list(rw, list_ref("Status"), f"S2:S{n}")
score = DataValidation(type="whole", operator="between", formula1="1", formula2="10", allow_blank=True)
score.error, score.errorTitle = "Skor 1 sampai 10.", "Skor tidak valid"
rw.add_data_validation(score)
score.add(f"G2:H{n}")
rw["B1"].comment = Comment("Link halaman Awwwards lebih baik: skor juri dan link situs asli diambil otomatis.", "Claude")
rw["L1"].comment = Comment("Urutan cerita halaman itu, misalnya: masalah -> cara kerja -> bukti -> harga -> ajakan.", "Claude")
rw["M1"].comment = Comment("Keberatan apa yang dijawab dan bagaimana caranya, misalnya: kalkulator cicilan untuk keberatan harga.", "Claude")
rw["N1"].comment = Comment("Kenapa halaman ini kemungkinan berhasil menjual, bukan hanya indah.", "Claude")
rw["G1"].comment = Comment("Skor visual menurut tim, bukan menurut Awwwards: seberapa bagus tampilannya. 1 = jelek, 10 = sangat ingin ditiru.", "Claude")
rw["H1"].comment = Comment("Apakah halaman ini akan Anda kirim ke klien sebagai contoh yang berhasil: jelas, menjual, menjawab pertanyaan pelanggan. Dinilai terpisah dari visual.", "Claude")
rw["O1"].comment = Comment("Ya untuk brand besar dan terkenal (misalnya marketplace nasional): hanya polanya yang dipakai, tampilannya tidak pernah ditunjukkan ke AI saat generate.", "Claude")
rw["S1"].comment = Comment("Diisi oleh pipeline: Baru, Dicapture, Ditag, Dibuang.", "Claude")

# ---------------- Brief Uji
bu = wb.create_sheet("Brief Uji", 2)
bcols = [
    ("No", 6), ("Nama klien", 20), ("Model bisnis", 20), ("Audiens dan situasinya", 32), ("Satu aksi utama", 20),
    ("Konten nyata", 40), ("Testimoni asli", 32), ("Aset yang ada", 24), ("Batasan brand", 24), ("Bahasa", 12),
    ("Stack", 14), ("Bahan suara konsumen", 32), ("Prompt ke agen (persis)", 44), ("Hold-out?", 10),
]
header(bu, bcols, {"Nama klien", "Model bisnis", "Audiens dan situasinya", "Satu aksi utama", "Konten nyata", "Prompt ke agen (persis)"})
bdummy = [
    ["CONTOH-1", "Senyum Dental", "Klinik / kesehatan", "Pekerja kantoran di Bandung yang takut ke dokter gigi; membuka halaman dari ponsel saat jam istirahat",
     "Booking lewat WhatsApp", "Pemeriksaan + pembersihan Rp 350.000, 30 menit. Jl. Riau 12, Bandung. Senin-Sabtu 09.00-20.00. 3 dokter.",
     "Tidak ada", "Foto ruang praktik (6 foto), logo", "Hijau tua #0F5C4D wajib", "Indonesia", "HTML statis", "Ekspor chat WA 3 bulan + 40 review Google (contoh)",
     "Buatkan halaman untuk Senyum Dental, klinik gigi di Bandung. Datanya ada di brief ini.", "Tidak"],
    ["CONTOH-2", "Kopi Pagi", "F&B / restoran", "Pekerja muda Jakarta yang ingin langganan kopi ke kantor",
     "Mulai langganan", "Langganan bulanan Rp 189.000, single origin, dikirim tiap Senin. Bisa pause kapan saja.",
     "\"Kopinya selalu datang sebelum meeting pertama.\" Sari, product manager", "Tidak ada foto", "Bebas", "Campur", "Next.js", "Tidak ada",
     "Bikin landing page untuk Kopi Pagi, langganan kopi untuk kantor. Konten di brief.", "Ya"],
]
write_rows(bu, bdummy)
dv_list(bu, MODEL_LIST, "C2:C100")
dv_list(bu, list_ref("Bahasa"), "J2:J100")
dv_list(bu, list_ref("Ya/Tidak"), "N2:N100")
bu["L1"].comment = Comment("Review, chat WhatsApp, pertanyaan yang sering masuk ke CS/sales. Bahan riset terpenting untuk storyline.", "Claude")
bu["G1"].comment = Comment("Hanya testimoni asli, kata per kata, dengan nama dan peran. Kalau tidak ada, tulis 'Tidak ada': beberapa brief memang harus tanpa testimoni.", "Claude")
bu["N1"].comment = Comment("5 dari 20 brief diberi 'Ya'. Brief hold-out tidak pernah dipakai saat merevisi skill.", "Claude")

# ---------------- Desainer
ds = wb.create_sheet("Desainer", 3)
dcols = [("Nama", 18), ("Peran", 20), ("Ikut voting?", 12), ("Gaya gerbang", 14), ("Suka", 36), ("Tidak suka", 36)]
header(ds, dcols, {"Nama", "Ikut voting?"})
write_rows(ds, [["Rina (CONTOH)", "Lead designer", "Ya", "Guided", "Foto asli, tipografi besar, ruang lega", "Gradien, ikon generik"]])
dv_list(ds, list_ref("Ya/Tidak"), "C2:C50")
dv_list(ds, list_ref("Gaya gerbang"), "D2:D50")

for sh in wb.worksheets:
    sh.sheet_view.zoomScale = 110
wb.save(OUT)
print(OUT)
