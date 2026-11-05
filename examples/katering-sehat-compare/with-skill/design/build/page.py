"""Generates ../../index.html for Dapur Seimbang from the spec (.design/spec.md) and copy (.design/copy.md).
Run: python3 .design/build/page.py (from the project folder)."""
import random, urllib.parse, pathlib

OUT = pathlib.Path(__file__).resolve().parents[2] / "index.html"
WA_TEXT = ("Halo Dapur Seimbang, saya mau langganan makan siang.\n"
           "Nama: \nAlamat kantor: \nMulai tanggal: \nNasi merah atau shirataki: ")
WA = "https://wa.me/6281234567890?text=" + urllib.parse.quote(WA_TEXT)

import sys; sys.path.insert(0, str(pathlib.Path(__file__).parent))
from drawing import box, DAYS

def week_strip():
    cells = "".join(
        f'<g transform="translate({i*72} 0)"><rect width="60" height="60" rx="10" fill="var(--ink)"/><rect x="3" y="3" width="22" height="34" rx="5" fill="var(--karbo)"/>'
        f'<rect x="27" y="3" width="30" height="34" rx="5" fill="var(--lauk)"/><rect x="3" y="40" width="33" height="17" rx="5" fill="var(--sayur)"/><rect x="38" y="40" width="19" height="17" rx="5" fill="var(--buah)"/></g>'
        for i in range(5))
    return f'<svg viewBox="0 0 348 60" role="img" aria-label="Lima kotak makan siang, satu untuk tiap hari Senin sampai Jumat">{cells}</svg>'

def mark(part):
    return f'<span class="mark mark-{part}" aria-hidden="true"></span>'

week_rows = "".join(
    f'<li><button class="day" type="button" aria-pressed="{"true" if i == 0 else "false"}" data-day="{k}">'
    f'{box("box--thumb", "", 30 + i, days=(k,), hidden=True, active=k)}'
    f'<span class="day__text"><span class="day__name">{d}</span><span class="day__menu"><span>{a}</span><span>{sy}</span><span>{b}</span></span></span></button></li>'
    for i, (k, d, l, sy2, bu, a, sy, b) in enumerate(DAYS))

FAQ = [
    ("Jam berapa makan siangnya sampai?", "Jam antar tergantung rute ke gedung kantormu. Sebutkan alamatnya waktu chat, kami kasih tahu jamnya."),
    ("Kantor mana saja yang bisa diantar?", "Kantor di Jakarta Selatan. Kirim alamat lengkap gedungnya supaya kami cek rutenya."),
    ("Kalau aku cuti atau kerja dari rumah?", "Kabari lewat chat WhatsApp yang sama. Atur hari antarnya di sana."),
    ("Bayarnya bagaimana?", "Cara bayar dikirim lewat WhatsApp waktu pesananmu dikonfirmasi."),
]
faq = "".join(f'<details{" open" if i == 0 else ""}><summary>{q}</summary><p>{a}</p></details>' for i, (q, a) in enumerate(FAQ))

CSS = r"""
:root{--ground:#F3F4EF;--surface:#FFFFFF;--ink:#17241C;--ink-soft:#3E4A42;--line:#D5D9CF;--karbo:#8E2F3C;--lauk:#F2B829;--sayur:#6FAE45;--buah:#E04F7A;--action:#0F5132;--on-action:#FFFFFF;
--font-display:"Bricolage Grotesque","Trebuchet MS",sans-serif;--font-text:"Figtree","Segoe UI",sans-serif;
--step-0:18px;--step-s:16px;--step-1:clamp(21px,1.7vw,25px);--step-2:clamp(34px,4.2vw,60px);--step-3:clamp(44px,6vw,84px);--step-4:clamp(52px,7.4vw,108px);
--space-1:8px;--space-2:16px;--space-3:24px;--space-4:40px;--space-5:64px;--space-6:136px;--radius-l:32px;--radius-s:999px;--wrap:1200px;--gutter:clamp(16px,5vw,64px);
--dur-fast:160ms;--dur-mid:320ms;--ease:cubic-bezier(.16,1,.3,1)}
*,*::before,*::after{box-sizing:border-box}
html{scroll-padding-top:80px}
body{margin:0;background:var(--ground);color:var(--ink);font:400 var(--step-0)/1.6 var(--font-text);-webkit-font-smoothing:antialiased;overflow-x:clip}
h1,h2,h3{font-family:var(--font-display);margin:0;letter-spacing:-.02em;font-weight:700}
h1{font-size:var(--step-4);line-height:.98}
h2{font-size:var(--step-2);line-height:1.04;max-width:18ch}
h3{font-size:var(--step-1);line-height:1.2;letter-spacing:-.01em}
p{margin:0}
a{color:inherit}
.wrap{width:min(100% - 2*var(--gutter),var(--wrap));margin-inline:auto}
section{padding-block:var(--space-6)}
.lead{font-size:20px;color:var(--ink-soft);max-width:34ch;margin-top:var(--space-3)}
:focus-visible{outline:3px solid var(--ink);outline-offset:3px}
.btn{display:inline-flex;align-items:center;gap:10px;min-height:56px;padding:0 28px;border-radius:var(--radius-s);background:var(--action);color:var(--on-action);
 font:700 var(--step-0)/1 var(--font-text);text-decoration:none;box-shadow:0 4px 0 var(--ink);transition:transform var(--dur-fast) var(--ease),box-shadow var(--dur-fast) var(--ease),background-color var(--dur-fast)}
.btn:hover{transform:translateY(2px);box-shadow:0 2px 0 var(--ink);background:#0B4128}
.btn:active{transform:translateY(4px);box-shadow:0 0 0 var(--ink)}
.btn svg{width:22px;height:22px;flex:none}
/* header */
.top{position:sticky;top:0;z-index:10;background:color-mix(in srgb,var(--ground) 94%,transparent);backdrop-filter:none;border-bottom:1px solid var(--line)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;min-height:64px;gap:var(--space-2)}
.brand{display:flex;align-items:center;gap:10px;font:700 22px/1 var(--font-display);letter-spacing:-.02em;text-decoration:none}
.brand svg{width:26px;height:26px}
.btn--small{min-height:44px;padding:0 18px;font-size:16px;box-shadow:0 3px 0 var(--ink)}
/* hero */
.hero{padding-block:var(--space-5) var(--space-6);position:relative;overflow:hidden}
.hero .wrap{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--space-4);align-items:center}
.hero__price{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 14px;margin-top:var(--space-4)}
.hero__price strong{font:700 clamp(30px,3vw,40px)/1 var(--font-display);letter-spacing:-.02em}
.hero__price span{color:var(--ink-soft)}
.hero__act{margin-top:var(--space-3)}
.hero__art{position:relative;justify-self:end;width:min(40vw,500px)}
.hero__art .box{width:100%;height:auto;display:block;transform:rotate(-4deg)}
/* parts colour marks: the motif at text size */
.mark{display:inline-block;width:18px;height:18px;border-radius:5px;flex:none;margin-top:6px}
.mark-karbo{background:var(--karbo)}.mark-lauk{background:var(--lauk)}.mark-sayur{background:var(--sayur)}.mark-buah{background:var(--buah)}
/* story */
.story .wrap{display:grid;grid-template-columns:1fr 1fr;gap:var(--space-5);align-items:start}
.story__art{position:sticky;top:104px}
.story__art .box{width:100%;max-width:520px;height:auto;display:block}
.parts{list-style:none;margin:var(--space-4) 0 0;padding:0}
.parts li{display:flex;gap:var(--space-2);padding-block:var(--space-4);border-top:1px solid var(--line)}
.parts li:last-child{border-bottom:1px solid var(--line)}
.parts p{color:var(--ink-soft);margin-top:6px}
.part{transition:opacity var(--dur-mid) var(--ease)}
.part .food{transition:transform var(--dur-mid) var(--ease);transform-box:fill-box;transform-origin:center}
@media (min-width:821px) and (prefers-reduced-motion:no-preference){
 .story.armed .part{opacity:.18}
 .story.armed .part .food{transform:scale(.85)}
 .story.armed[data-on="1"] .part-karbo,.story.armed[data-on="2"] .part-karbo,.story.armed[data-on="3"] .part-karbo,.story.armed[data-on="4"] .part-karbo,
 .story.armed[data-on="2"] .part-lauk,.story.armed[data-on="3"] .part-lauk,.story.armed[data-on="4"] .part-lauk,
 .story.armed[data-on="3"] .part-sayur,.story.armed[data-on="4"] .part-sayur,
 .story.armed[data-on="4"] .part-buah{opacity:1}
 .story.armed[data-on="1"] .part-karbo .food,.story.armed[data-on="2"] .part-karbo .food,.story.armed[data-on="3"] .part-karbo .food,.story.armed[data-on="4"] .part-karbo .food,
 .story.armed[data-on="2"] .part-lauk .food,.story.armed[data-on="3"] .part-lauk .food,.story.armed[data-on="4"] .part-lauk .food,
 .story.armed[data-on="3"] .part-sayur .food,.story.armed[data-on="4"] .part-sayur .food,
 .story.armed[data-on="4"] .part-buah .food{transform:none}
}
/* lauk variants */
.box--week .dish{display:none}
.box--week[data-day="sen"] .dish-sen,.box--week[data-day="sel"] .dish-sel,.box--week[data-day="rab"] .dish-rab,.box--week[data-day="kam"] .dish-kam,.box--week[data-day="jum"] .dish-jum{display:inline}
@media (prefers-reduced-motion:no-preference){.box--week.swap{animation:swap var(--dur-mid) var(--ease)}@keyframes swap{from{transform:scale(.96) rotate(-2deg)}to{transform:none}}}
/* week */
.week{background:var(--surface)}
.week .wrap{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--space-5);align-items:start}
.week__note{margin-top:var(--space-2);color:var(--ink-soft)}
.week__art{margin-top:var(--space-4);max-width:400px;position:sticky;top:104px}
.week__art .box{width:100%;height:auto;display:block}
.days{list-style:none;margin:0;padding:0;display:grid;gap:10px}
.day{width:100%;display:grid;grid-template-columns:72px 1fr;gap:var(--space-3);align-items:center;text-align:left;padding:12px 22px 12px 12px;min-height:64px;
 background:var(--ground);color:var(--ink);border:2px solid transparent;border-radius:var(--radius-l);font:inherit;cursor:pointer;transition:border-color var(--dur-fast),background-color var(--dur-fast)}
.day:hover{border-color:var(--ink)}
.day[aria-pressed="true"]{background:var(--lauk);border-color:var(--ink)}
.day .box--thumb{width:72px;height:72px;display:block}
.day__name{display:block;font:700 var(--step-1)/1.1 var(--font-display);margin-bottom:4px}
.day__menu{display:flex;flex-wrap:wrap;gap:4px 14px}
.day__menu span+span::before{content:"·";margin-right:14px;color:var(--ink-soft)}
.week__carb{margin-top:var(--space-3);color:var(--ink-soft)}
/* price */
.offer{display:grid;grid-template-columns:minmax(0,6fr) minmax(0,6fr);gap:var(--space-4);margin-top:var(--space-5);align-items:stretch}
.offer__panel{background:var(--karbo);color:#fff;border-radius:var(--radius-l);padding:var(--space-5) var(--space-4)}
.offer__panel .minis figcaption,.offer__panel .sum small{color:#F6E3E6}
.offer__panel .minis svg rect:first-child{fill:#3A0F17}
.offer__side{background:var(--surface);border-radius:var(--radius-l);padding:var(--space-5) var(--space-4);display:flex;flex-direction:column}
.offer__side .btn{align-self:flex-start}
.sum{font:700 var(--step-3)/1 var(--font-display);letter-spacing:-.03em}
.sum small{display:block;font:400 var(--step-0)/1.5 var(--font-text);letter-spacing:0;color:var(--ink-soft);margin-top:var(--space-2)}
.minis{margin:0}
.minis svg{width:min(100%,348px);height:auto;display:block}
.minis figcaption{margin-top:10px;font-size:16px;color:var(--ink-soft)}
.incl{list-style:none;margin:0;padding:0;display:grid;gap:14px}
.incl li{display:flex;gap:12px}
.offer__side .btn{margin-top:var(--space-4)}
.offer__note{margin-top:var(--space-3);color:var(--ink-soft)}
/* steps */
.how{background:var(--ground)}
.steps{list-style:none;margin:var(--space-5) 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:var(--space-4)}
.steps li{border-top:8px solid var(--ink);padding-top:var(--space-3)}
.steps li:nth-child(1){border-color:var(--karbo)}.steps li:nth-child(2){border-color:var(--lauk)}.steps li:nth-child(3){border-color:var(--sayur)}
.steps b{display:block;font:700 var(--step-2)/1 var(--font-display);margin-bottom:var(--space-2)}
.steps p{color:var(--ink-soft);margin-top:8px}
.msg{margin-top:var(--space-5);background:var(--sayur);border-radius:var(--radius-l);padding:var(--space-5) var(--space-4);display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--space-4);align-items:center}
.msg .bubble__cap{color:var(--ink)}
.bubble{background:var(--surface);border-radius:var(--radius-l) var(--radius-l) var(--radius-l) 8px;padding:var(--space-3) var(--space-4);border:2px solid var(--ink);white-space:pre-line;font-size:var(--step-0)}
.bubble__cap{font-size:16px;color:var(--ink-soft);margin-bottom:10px;font-weight:600}
.msg__note{font-weight:600;margin-bottom:var(--space-3);max-width:24ch;font-size:20px;line-height:1.35}
/* faq */
.faq .wrap{display:grid;grid-template-columns:minmax(0,5fr) minmax(0,7fr);gap:var(--space-5);align-items:start}
.faq details{border-top:1px solid var(--line)}
.faq details:last-child{border-bottom:1px solid var(--line)}
.faq summary{min-height:64px;display:flex;align-items:center;justify-content:space-between;gap:var(--space-2);padding-block:var(--space-2);cursor:pointer;font:600 20px/1.3 var(--font-text);list-style:none}
.faq summary::-webkit-details-marker{display:none}
.faq summary::after{content:"+";font:700 28px/1 var(--font-display);transition:transform var(--dur-fast) var(--ease)}
.faq details[open] summary::after{transform:rotate(45deg)}
.faq summary:hover{color:var(--action)}
.faq details p{padding-bottom:var(--space-3);color:var(--ink-soft);max-width:52ch}
/* close */
.close{background:var(--lauk)}
.close .wrap{display:grid;grid-template-columns:minmax(0,7fr) minmax(0,5fr);gap:var(--space-4);align-items:end}
.close p{margin-top:var(--space-3);max-width:40ch}
.close__num{margin-top:var(--space-2);font-weight:600}
footer{padding-block:var(--space-4)}
footer .wrap{display:flex;flex-wrap:wrap;justify-content:space-between;gap:var(--space-2);font-size:16px;color:var(--ink-soft)}
@media (max-width:820px){
 section{padding-block:72px}
 .hero{padding-block:var(--space-4) 72px}
 .hero .wrap,.story .wrap,.week .wrap,.offer,.msg,.faq .wrap,.close .wrap{grid-template-columns:1fr}
 .hero .wrap{gap:var(--space-3)}
 .hero__art{width:min(78vw,320px);justify-self:center;margin-top:var(--space-2)}
 .story .wrap{gap:var(--space-3)}
 .story__art{display:none}
 .week__art{display:none}
 .week .wrap{gap:var(--space-3)}
 .day{grid-template-columns:64px 1fr;gap:var(--space-2);padding:10px 16px 10px 10px}
 .day .box--thumb{width:64px;height:64px}
 .steps{grid-template-columns:1fr;gap:var(--space-3)}
 .offer,.msg,.faq .wrap,.close .wrap{gap:var(--space-3)}
 .bubble{padding:var(--space-3)}
 .offer__panel,.offer__side,.msg{padding:var(--space-4) var(--space-3)}
 main .btn{width:100%;justify-content:center;padding:0 16px;font-size:17px}
 .day__menu{flex-direction:column;gap:0}
 .day__menu span+span::before{content:none}
}
.top .sm{display:none}
@media (max-width:420px){.top .lg{display:none}.top .sm{display:inline}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
"""

WA_ICON = ('<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>')

JS = r"""
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // story: the box fills part by part as each row passes the middle of the screen (desktop, motion allowed)
  var story = document.querySelector('.story');
  if (story && !reduce && 'IntersectionObserver' in window) {
    var rows = story.querySelectorAll('.parts li');
    story.setAttribute('data-on', '0'); story.classList.add('armed');
    var ticking = false;
    function update(){
      ticking = false; var n = 0, line = window.innerHeight * 0.6;
      rows.forEach(function(r, i){ if (r.getBoundingClientRect().top < line) n = i + 1; });
      if (n > +story.getAttribute('data-on')) story.setAttribute('data-on', String(n));
    }
    window.addEventListener('scroll', function(){ if (!ticking) { ticking = true; requestAnimationFrame(update); } }, {passive: true});
    update();
  }
  // week: pressing a day shows that day's box (lauk, sayur, buah) in the big drawing
  var art = document.querySelector('.week__art .box');
  var days = document.querySelectorAll('.day');
  days.forEach(function(b){
    b.addEventListener('click', function(){
      days.forEach(function(o){ o.setAttribute('aria-pressed', o === b ? 'true' : 'false'); });
      if (art) { art.setAttribute('data-day', b.getAttribute('data-day')); art.classList.remove('swap'); void art.getBoundingClientRect(); art.classList.add('swap');
        art.setAttribute('aria-label', 'Kotak hari ' + b.querySelector('.day__name').textContent + ': ' + Array.prototype.map.call(b.querySelectorAll('.day__menu span'), function(x){ return x.textContent; }).join(', ')); }
    });
  });
})();
"""

parts_rows = "".join(
    f'<li data-n="{n}">{mark(p)}<div><h3>{h}</h3><p>{t}</p></div></li>' for n, (p, h, t) in enumerate([
        ("karbo", "Karbo: nasi merah atau shirataki", "Sebutkan pilihanmu waktu pesan langganan."),
        ("lauk", "Lauk: ayam, ikan, atau tahu tempe", "Contohnya ayam panggang bumbu kuning atau pepes ikan."),
        ("sayur", "Sayur", "Contohnya tumis buncis wortel atau sayur bening bayam."),
        ("buah", "Buah", "Contohnya pepaya, semangka, atau buah naga."),
    ], start=1))

HTML = f"""<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Dapur Seimbang · Katering makan siang sehat ke kantor, Jakarta Selatan</title>
<meta name="description" content="Makan siang seimbang diantar ke kantor di Jakarta Selatan, Senin sampai Jumat. Nasi merah atau shirataki, lauk, sayur, buah. Rp 45.000 per porsi, langganan mulai 5 hari. Pesan lewat WhatsApp 0812-3456-7890.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,700&family=Figtree:wght@400;600;700&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
<header class="top">
  <div class="wrap">
    <a class="brand" href="#"><svg viewBox="0 0 40 40" aria-hidden="true" focusable="false"><rect width="40" height="40" rx="8" fill="var(--ink)"/><rect x="3" y="3" width="14" height="22" rx="4" fill="var(--karbo)"/><rect x="19" y="3" width="18" height="22" rx="4" fill="var(--lauk)"/><rect x="3" y="27" width="20" height="10" rx="4" fill="var(--sayur)"/><rect x="25" y="27" width="12" height="10" rx="4" fill="var(--buah)"/></svg>Dapur Seimbang</a>
    <a class="btn btn--small" href="{WA}" >{WA_ICON}<span class="lg">Chat WhatsApp</span><span class="sm">Chat</span></a>
  </div>
</header>
<main>
<section class="hero">
  <div class="wrap">
    <div>
      <h1>Makan siang seimbang ke kantormu.</h1>
      <p class="lead">Diantar ke kantormu di Jakarta Selatan, Senin sampai Jumat. Nasi merah atau shirataki, lauk, sayur, dan buah. Menunya ganti tiap hari.</p>
      <p class="hero__price"><strong>Rp 45.000</strong><span>per porsi · langganan mulai 5 hari</span></p>
      <p class="hero__act"><a class="btn" href="{WA}">{WA_ICON}Pesan lewat WhatsApp</a></p>
    </div>
    <div class="hero__art">{box("box--hero", "Ilustrasi kotak makan siang dalam empat bagian: nasi merah, ayam panggang, tumis buncis wortel, dan pepaya", 7)}</div>
  </div>
</section>

<section class="story" id="isi">
  <div class="wrap">
    <div class="story__art">{box("box--story", "Ilustrasi kotak dengan empat bagian: karbo, lauk, sayur, buah", 11)}</div>
    <div>
      <h2>Selalu empat bagian di setiap kotak.</h2>
      <p class="lead">Bukan salad diet. Ini makan siang lengkap.</p>
      <ol class="parts">{parts_rows}</ol>
    </div>
  </div>
</section>

<section class="week" id="menu">
  <div class="wrap">
    <div>
      <h2>Isinya ganti tiap hari. Bagiannya tetap.</h2>
      <p class="week__note">Contoh menu satu minggu. Menu aslinya bisa berbeda.</p>
      <div class="week__art">{box("box--week", "Kotak hari Senin: Ayam panggang bumbu kuning, Tumis buncis wortel, Pepaya", 23, days=tuple(d[0] for d in DAYS))}</div>
    </div>
    <div>
      <ul class="days" aria-label="Contoh menu Senin sampai Jumat">{week_rows}</ul>
    </div>
  </div>
</section>

<section class="price" id="harga">
  <div class="wrap">
    <h2>Rp 45.000 sekotak. Mulai dari satu minggu.</h2>
    <div class="offer">
      <div class="offer__panel">
        <figure class="minis">{week_strip()}<figcaption>Senin sampai Jumat: lima kotak</figcaption></figure>
        <p class="sum" style="margin-top:var(--space-4)">Rp 225.000<small>5 hari × Rp 45.000</small></p>
      </div>
      <div class="offer__side">
        <ul class="incl">
          <li>{mark("karbo")}<span>Satu kotak makan siang per hari kerja</span></li>
          <li>{mark("lauk")}<span>Karbo, lauk, sayur, dan buah</span></li>
          <li>{mark("sayur")}<span>Diantar ke kantormu, Senin sampai Jumat</span></li>
        </ul>
        <p class="offer__note">Tidak perlu antre atau pilih menu tiap siang. Tidak ada paket bulanan wajib.</p>
        <a class="btn" href="{WA}">{WA_ICON}Pesan 5 hari lewat WhatsApp</a>
      </div>
    </div>
  </div>
</section>

<section class="how" id="pesan">
  <div class="wrap">
    <h2>Mulai langganan lewat satu chat.</h2>
    <ol class="steps">
      <li><b>1</b><h3>Buka WhatsApp</h3><p>Tombol di bawah membuka chat ke 0812-3456-7890 dengan pesan yang sudah terisi.</p></li>
      <li><b>2</b><h3>Lengkapi empat hal</h3><p>Nama, alamat kantor, tanggal mulai, dan nasi merah atau shirataki.</p></li>
      <li><b>3</b><h3>Tunggu balasan</h3><p>Kami balas dengan jadwal antar dan cara bayar.</p></li>
    </ol>
    <div class="msg">
      <div><p class="bubble__cap">Pesan yang akan terkirim:</p><p class="bubble">{WA_TEXT}…</p></div>
      <div><p class="msg__note">Isi titik-titiknya di WhatsApp, lalu kirim.</p><p><a class="btn" href="{WA}">{WA_ICON}Kirim pesan ini lewat WhatsApp</a></p></div>
    </div>
  </div>
</section>

<section class="faq" id="tanya">
  <div class="wrap">
    <h2>Soal jam antar, area, dan bayar.</h2>
    <div>{faq}</div>
  </div>
</section>

<section class="close">
  <div class="wrap">
    <div>
      <h2>Lima hari makan siang, satu chat.</h2>
      <p>Chat langsung dengan Dapur Seimbang. Kirim nama dan alamat kantormu, kami balas jadwal antarnya.</p>
    </div>
    <div>
      <a class="btn" href="{WA}">{WA_ICON}Chat 0812-3456-7890</a>
    </div>
  </div>
</section>
</main>
<footer>
  <div class="wrap">
    <p>Dapur Seimbang · Katering makan siang untuk kantor di Jakarta Selatan · WhatsApp 0812-3456-7890</p>
    <p>Gambar di halaman ini ilustrasi, bukan foto menu.</p>
  </div>
</footer>
<script>{JS}</script>
</body>
</html>
"""
OUT.write_text(HTML)
print("wrote", OUT, len(HTML), "bytes")
