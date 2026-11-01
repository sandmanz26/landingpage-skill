# Shared tokens, base CSS and flat SVG drawings for the Jalinan page and its hero variants.
TEAL, CORAL, BUTTER = "#0F4C4A", "#E8613C", "#F2C14E"
PAPER, INK, SAGE, LINE = "#F7F6F1", "#172321", "#EAF1EE", "#C9D3CF"
SKIN1, SKIN2, SKIN3 = "#B97A57", "#7A4B32", "#D9A07A"

FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=DM+Mono:wght@500&family=Figtree:wght@400;600&display=swap">'

BASE_CSS = f"""
  :root {{
    --teal: {TEAL}; --coral: {CORAL}; --butter: {BUTTER};
    --paper: {PAPER}; --ink: {INK}; --sage: {SAGE}; --line: {LINE}; --muted: #4c5a57;
    --display: "Bricolage Grotesque", "Arial Rounded MT Bold", Arial, sans-serif;
    --text: "Figtree", "Segoe UI", Arial, sans-serif;
    --mono: "DM Mono", ui-monospace, Menlo, Consolas, monospace;
    --gutter: max(20px, 5vw); --max: 1160px; --r: 14px;
    color-scheme: light;
  }}
  * {{ box-sizing: border-box; }}
  body {{ margin: 0; background: var(--paper); color: var(--ink); font: 400 17px/1.6 var(--text); }}
  a {{ color: inherit; }}
  :focus-visible {{ outline: 3px solid var(--coral); outline-offset: 3px; }}
  .wrap {{ max-width: var(--max); margin: 0 auto; padding-inline: var(--gutter); }}
  h1, h2, h3 {{ font-family: var(--display); font-weight: 800; line-height: 1; letter-spacing: -0.02em; margin: 0; text-wrap: balance; color: var(--teal); }}
  h1 {{ font-size: clamp(3rem, 7vw, 6.4rem); }}
  h2 {{ font-size: clamp(2.1rem, 4.4vw, 3.6rem); }}
  h3 {{ font-size: 1.4rem; font-weight: 600; letter-spacing: -0.01em; }}
  p {{ margin: 0; max-width: 60ch; }}
  .label {{ font: 500 0.8rem/1.3 var(--mono); letter-spacing: 0.06em; text-transform: uppercase; color: var(--muted); }}
  .btn {{ display: inline-flex; align-items: center; justify-content: center; gap: 0.55em; min-height: 52px; padding: 0.85em 1.4em; border-radius: var(--r); font: 600 1rem/1.2 var(--text); text-decoration: none; border: 2px solid transparent; }}
  .btn-main {{ background: var(--coral); color: var(--ink); }}
  .btn-main:hover {{ background: #ee7a59; }}
  .btn-ghost {{ border-color: var(--teal); color: var(--teal); }}
  .btn svg {{ width: 1.2em; height: 1.2em; flex: none; }}
  .top {{ background: var(--paper); position: sticky; top: env(safe-area-inset-top, 0px); z-index: 30; border-bottom: 1px solid var(--line); }}
  .top .wrap {{ display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 66px; }}
  .logo {{ font: 800 1.55rem/1 var(--display); color: var(--teal); text-decoration: none; letter-spacing: -0.02em; }}
  .nav {{ display: flex; gap: 24px; align-items: center; }}
  .nav a {{ text-decoration: none; color: var(--muted); font-size: 1rem; }}
  .nav a:hover {{ color: var(--teal); }}
  .nav .btn {{ min-height: 42px; padding: 0.55em 1.05em; font-size: 1rem; color: var(--ink); }}
  @media (max-width: 860px) {{ .nav a:not(.btn) {{ display: none; }} }}
  @media (max-width: 720px) {{ .nav .btn {{ display: none; }} .top .wrap {{ min-height: 58px; }} }}
  .price-line {{ font: 400 1rem/1.55 var(--text); color: var(--ink); max-width: 46ch; }}
  .price-line b {{ font-weight: 600; }}
  .check-line a {{ display: inline-block; padding-block: 10px; font-weight: 600; color: var(--teal); text-underline-offset: 3px; }}
  .text-link {{ align-self: center; font-weight: 600; color: var(--teal); text-underline-offset: 3px; padding: 12px 4px; }}
  h1 .line {{ display: block; }}
  @media (prefers-reduced-motion: no-preference) {{
    .sun {{ animation: rise 0.9s ease-out both; }}
    @keyframes rise {{ from {{ transform: translateY(12px); }} to {{ transform: none; }} }}
  }}
"""

WA = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.9 11.9 0 0 0 4.6 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.3-.2-.5-.3z"/></svg>'
WA_URL = "https://wa.me/6281200000000?text=Halo%20Jalinan%2C%20kami%20mau%20cek%20tanggal"

HEADER = f"""<header class="top"><div class="wrap">
  <a class="logo" href="#">Jalinan</a>
  <nav class="nav" aria-label="Utama"><a href="#harga">Harga</a><a href="#cek">Cek kami</a><a href="#persiapan">Persiapan</a><a href="#hari-h">Hari H</a><a href="#tanya">Tanya jawab</a>
  <a class="btn btn-main" href="{WA_URL}" target="_blank" rel="noopener">Cek tanggal</a></nav>
</div></header>"""

HERO_TEXT = f"""<p class="label">Wedding organizer · Jakarta</p>
<h1><span class="line">Hari H berjalan.</span> <span class="line">Kalian&nbsp;tinggal hadir.</span></h1>
<p class="sub">Kami pegang rundown, vendor, dan jam di hari H. Kalau ada masalah di balik layar, itu urusan kami. Kalian tidak perlu tahu.</p>
<div class="actions"><a class="btn btn-main" href="{WA_URL}" target="_blank" rel="noopener">{WA}Cek tanggal kosong via WhatsApp</a><a class="text-link" href="#harga">Lihat harga</a></div>
<p class="price-line"><b>Koordinasi hari H mulai Rp 9,5 juta.</b> Vendor kalian bayar langsung; pelunasan fee kami setelah acara.</p>
<p class="check-line"><a href="#cek">Cek kami dulu: kantor, NIB, contoh kontrak →</a></p>"""


def person(x, y, body=INK, skin=SKIN1, hair=INK, s=1.0, extra=""):
    """A simple standing figure, feet at (x, y)."""
    return f"""<g transform="translate({x} {y}) scale({s})">
  <rect x="-13" y="-62" width="10" height="62" rx="4" fill="{INK}"/><rect x="3" y="-62" width="10" height="62" rx="4" fill="{INK}"/>
  <path d="M-22 -58 Q-24 -112 0 -116 Q24 -112 22 -58 Z" fill="{body}"/>
  <circle cx="0" cy="-132" r="17" fill="{skin}"/>
  <path d="M-17 -136 Q-15 -154 0 -153 Q17 -154 17 -136 Q8 -146 -17 -136 Z" fill="{hair}"/>
  {extra}
</g>"""


def coordinator(x, y, s=1.0):
    radio = f'<rect x="20" y="-104" width="11" height="24" rx="3" fill="{INK}"/><rect x="27" y="-118" width="3" height="16" fill="{INK}"/>'
    clip = f'<rect x="-40" y="-100" width="26" height="34" rx="3" fill="{PAPER}" stroke="{INK}" stroke-width="2"/><rect x="-32" y="-104" width="10" height="6" rx="2" fill="{CORAL}"/><path d="M-35 -88h16M-35 -81h16M-35 -74h10" stroke="{INK}" stroke-width="2"/>'
    tag = f'<rect x="-6" y="-96" width="12" height="15" rx="2" fill="{BUTTER}"/>'
    return person(x, y, body=TEAL, skin=SKIN2, s=s, extra=radio + clip + tag)


def chairs(x0, y, n, gap=40, colour=TEAL):
    out = []
    for i in range(n):
        x = x0 + i * gap
        out.append(f'<rect x="{x}" y="{y-36}" width="22" height="30" rx="5" fill="{colour}"/><rect x="{x-3}" y="{y-10}" width="28" height="8" rx="3" fill="{colour}"/><rect x="{x}" y="{y-2}" width="4" height="14" fill="{colour}"/><rect x="{x+18}" y="{y-2}" width="4" height="14" fill="{colour}"/>')
    return "".join(out)


def janur(cx, top, n=7, spread=120):
    out = []
    for i in range(n):
        x = cx - spread / 2 + i * spread / (n - 1)
        out.append(f'<path d="M{x:.0f} {top} q7 26 -3 52" stroke="{BUTTER}" stroke-width="5" fill="none" stroke-linecap="round"/>')
    return "".join(out)


def hero_drawing(label="Ilustrasi: venue pagi hari, kursi tamu tersusun di bawah gapura janur, koordinator Jalinan memegang HT dan clipboard"):
    return f"""<svg class="art" viewBox="0 0 480 540" role="img" aria-label="{label}">
  <defs><clipPath id="hc"><rect width="480" height="540" rx="22"/></clipPath></defs>
  <g clip-path="url(#hc)">
    <rect width="480" height="540" fill="{SAGE}"/>
    <circle class="sun" cx="392" cy="112" r="40" fill="{BUTTER}"/>
    <rect y="430" width="480" height="110" fill="{LINE}"/>
    <path d="M196 430 L284 430 L330 540 L150 540 Z" fill="{PAPER}"/>
    <path d="M100 440 V250 a140 140 0 0 1 280 0 V440" fill="none" stroke="{TEAL}" stroke-width="14" stroke-linecap="round"/>
    {janur(240, 112, 7, 150)}
    {chairs(36, 478, 3, 40)}{chairs(300, 478, 2, 40)}
    {chairs(20, 528, 3, 44)}
    {coordinator(392, 522, 1.3)}
  </g>
</svg>"""


def wide_drawing():
    return f"""<svg class="art" viewBox="0 0 1160 360" role="img" aria-label="Ilustrasi: venue pagi hari, deretan kursi tamu, gapura janur di tengah, kru Jalinan bersiap dengan HT dan clipboard" preserveAspectRatio="xMidYMax slice">
  <defs><clipPath id="wc"><rect width="1160" height="360" rx="22"/></clipPath></defs>
  <g clip-path="url(#wc)">
    <rect width="1160" height="360" fill="{SAGE}"/>
    <circle class="sun" cx="900" cy="96" r="46" fill="{BUTTER}"/>
    <rect y="270" width="1160" height="90" fill="{LINE}"/>
    <path d="M540 270 L620 270 L680 360 L480 360 Z" fill="{PAPER}"/>
    <path d="M460 280 V150 a120 120 0 0 1 240 0 V280" fill="none" stroke="{TEAL}" stroke-width="13" stroke-linecap="round"/>
    {janur(580, 40, 7, 130)}
    {chairs(120, 318, 7, 44)}{chairs(740, 318, 7, 44)}
    {chairs(100, 366, 8, 44)}{chairs(730, 366, 8, 44)}
    {coordinator(1030, 330, 0.9)}
    {person(400, 330, body=CORAL, skin=SKIN3, s=0.8, extra=f'<rect x="-30" y="-96" width="60" height="18" rx="4" fill="{PAPER}" stroke="{INK}" stroke-width="2"/>')}
  </g>
</svg>"""


def panel_art(kind):
    frame = lambda inner, label: f'<svg class="art" viewBox="0 0 320 220" role="img" aria-label="{label}"><defs><clipPath id="p{kind}"><rect width="320" height="220" rx="18"/></clipPath></defs><g clip-path="url(#p{kind})"><rect width="320" height="220" fill="{SAGE}"/>{inner}</g></svg>'
    if kind == "0530":
        inner = f'<rect x="40" y="40" width="110" height="180" rx="6" fill="none" stroke="{TEAL}" stroke-width="10"/><rect x="50" y="50" width="90" height="170" fill="{PAPER}"/><circle cx="95" cy="24" r="12" fill="{BUTTER}"/><rect y="200" width="320" height="20" fill="{LINE}"/>{coordinator(215, 205, 0.95)}'
        return frame(inner, "Ilustrasi: kru Jalinan di pintu venue sebelum subuh, memegang HT")
    if kind == "0800":
        dome = lambda x: f'<path d="M{x} 150 a38 30 0 0 1 76 0 Z" fill="{PAPER}" stroke="{INK}" stroke-width="2.5"/><circle cx="{x+38}" cy="118" r="5" fill="{INK}"/>'
        inner = f'<rect x="20" y="150" width="200" height="14" rx="4" fill="{TEAL}"/><rect x="36" y="164" width="8" height="56" fill="{TEAL}"/><rect x="196" y="164" width="8" height="56" fill="{TEAL}"/>{dome(32)}{dome(126)}<g transform="rotate(6 262 120)"><rect x="226" y="62" width="74" height="100" rx="6" fill="{PAPER}" stroke="{INK}" stroke-width="2.5"/><rect x="250" y="54" width="26" height="14" rx="3" fill="{CORAL}"/><path d="M238 86l6 6 10-12M238 110l6 6 10-12M238 134l6 6 10-12" stroke="{TEAL}" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M262 90h26M262 114h26M262 138h18" stroke="{INK}" stroke-width="2.5"/></g>'
        return frame(inner, "Ilustrasi: clipboard daftar periksa di samping nampan katering yang tertutup")
    if kind == "0900":
        inner = f'<rect y="196" width="320" height="24" fill="{LINE}"/><rect x="100" y="120" width="120" height="16" rx="4" fill="{PAPER}"/><path d="M100 136 h120 l10 64 h-140 z" fill="{PAPER}" stroke="{LINE}" stroke-width="2"/><rect x="152" y="96" width="16" height="26" rx="4" fill="{TEAL}"/><circle cx="148" cy="88" r="9" fill="{CORAL}"/><circle cx="166" cy="80" r="9" fill="{BUTTER}"/><circle cx="174" cy="94" r="8" fill="{CORAL}"/>{chairs(44, 200, 1)}{chairs(254, 200, 1)}'
        return frame(inner, "Ilustrasi: meja upacara berkain putih dengan rangkaian bunga dan dua kursi")
    if kind == "1100":
        inner = f'<rect y="196" width="320" height="24" fill="{LINE}"/><rect x="150" y="150" width="160" height="22" rx="4" fill="{TEAL}"/><path d="M170 150 V90 a60 50 0 0 1 120 0 V150" fill="none" stroke="{TEAL}" stroke-width="8"/>{person(208, 150, body=PAPER, skin=SKIN1, s=0.62)}{person(250, 150, body=CORAL, skin=SKIN2, s=0.62)}{person(40, 214, body=TEAL, skin=SKIN3, s=0.55)}{person(78, 214, body=BUTTER, skin=SKIN2, s=0.55)}{person(116, 214, body=INK, skin=SKIN1, s=0.55)}'
        return frame(inner, "Ilustrasi: pengantin di pelaminan dan antrean tamu yang pendek")
    if kind == "1330":
        rain = "".join(f'<path d="M{x} {y} l-8 18" stroke="{TEAL}" stroke-width="3" stroke-linecap="round" opacity=".55"/>' for x, y in [(30,20),(70,46),(110,14),(150,40),(196,18),(236,44),(280,22),(52,90),(256,92)])
        inner = f'{rain}<rect y="196" width="320" height="24" fill="{LINE}"/><path d="M60 110 L160 60 L260 110 Z" fill="{PAPER}" stroke="{TEAL}" stroke-width="4"/><path d="M110 85 L160 60 L210 85" fill="none" stroke="{CORAL}" stroke-width="6"/><rect x="70" y="110" width="180" height="86" fill="{PAPER}"/><path d="M100 110v86M130 110v86M160 110v86M190 110v86M220 110v86" stroke="{LINE}" stroke-width="3"/>{chairs(118, 196, 3, 36)}'
        return frame(inner, "Ilustrasi: tenda samping sudah berdiri saat hujan turun, kursi tamu aman di dalamnya")
    if kind == "1500":
        box = lambda x, y, c: f'<rect x="{x}" y="{y}" width="46" height="36" rx="3" fill="{c}"/><rect x="{x+18}" y="{y}" width="10" height="36" fill="{CORAL}" opacity=".75"/>'
        inner = f'<rect y="196" width="320" height="24" fill="{LINE}"/><path d="M150 196 V120 Q150 100 170 100 H300 V196 Z" fill="{TEAL}"/><rect x="164" y="114" width="120" height="70" rx="6" fill="{INK}"/><circle cx="196" cy="198" r="18" fill="{INK}"/><circle cx="196" cy="198" r="7" fill="{LINE}"/>{box(176,148,BUTTER)}{box(226,148,PAPER)}{box(200,118,PAPER)}{person(92, 205, body=TEAL, skin=SKIN1, s=0.8, extra=box(-23,-118,BUTTER))}'
        return frame(inner, "Ilustrasi: kru memasukkan kotak barang titipan ke bagasi mobil keluarga")
    raise ValueError(kind)
