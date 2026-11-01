# Builds the full page with the chosen hero: python3 -I page.py <build dir> <out file> <a|b|c>
import sys, re
sys.path.insert(0, sys.argv[1])
from parts import *
out, choice = sys.argv[2], sys.argv[3]

# Reuse the chosen hero's own CSS and markup from heroes.py output.
hero_src = open(f"{sys.argv[1]}/../.design/variants/hero-{choice}.html").read()
hero_css = hero_src.split("</style>")[0].split(BASE_CSS)[-1]
hero_html = re.search(r'(<section class="hero">.*?</section>)', hero_src, re.S).group(1)

PANELS = [
    ("05.30", "0530", "Tia sudah di venue. MUA datang 05.45, rias dimulai 06.00."),
    ("08.00", "0800", "Katering datang. Dimas menghitung porsi terhadap kontrak: 400 tamu plus cadangan 10%."),
    ("09.00", "0900", "Akad. MC sudah gladi kemarin; satu kode di HT dan musik berhenti tepat waktu."),
    ("11.00", "1100", "Resepsi dibuka. Antrean salam kami atur per 20 menit, supaya keluarga besar tidak menunggu lama."),
    ("13.30", "1330", "Hujan turun. Rencana B dari technical meeting berjalan: tenda samping sudah berdiri sejak 12.00."),
    ("15.00", "1500", "Acara selesai. Barang titipan kami kemas, cek satu per satu, dan antar sampai ke mobil keluarga."),
]
panels = "".join(f'<article class="panel" data-time="{t}"><p class="time">{t}</p>{panel_art(k)}<p class="what">{txt}</p></article>' for t, k, txt in PANELS)

CHECK = f'<svg class="tick" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="11" fill="{TEAL}"/><path d="M7 12.5l3.2 3.2L17 9" stroke="{PAPER}" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>'
checks = [
    ("Kantor yang bisa didatangi", "Jl. Wijaya I no. 12, Kebayoran Baru. Datang saja Senin–Sabtu, 10.00–18.00."),
    ("NIB dan akta usaha", "Kami tunjukkan aslinya saat konsultasi. Silakan difoto."),
    ("Daftar vendor beserta nomor teleponnya", "Hubungi mereka sendiri dan tanyakan pengalaman bekerja dengan kami."),
    ("Contoh kontrak", "Untuk dibaca sebelum kalian memutuskan, termasuk aturan kalau batal."),
    ("Tiga pasangan terakhir kami", "Nomor mereka kami berikan dengan izin. Tanyakan apa saja."),
    ("Technical meeting minimal 2 jam", "Semua vendor hadir, dan rundown kalian tanda tangani sendiri."),
]
checklist = "".join(f"<li>{CHECK}<div><b>{a}</b><span>{b}</span></div></li>" for a, b in checks)

CSS = BASE_CSS + hero_css + f"""
  section {{ padding-block: 96px; }}
  .head {{ display: grid; gap: 14px; margin-bottom: 44px; }}
  .lead {{ font-size: 1.125rem; color: var(--muted); }}

  /* Price */
  .slips {{ display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 18px; }}
  .slip {{ border: 2px solid var(--line); border-radius: var(--r); padding: 26px 24px; display: grid; gap: 12px; align-content: start; background: var(--paper); }}
  .slip .when {{ font: 500 0.8rem/1 var(--mono); letter-spacing: 0.06em; color: var(--muted); }}
  .slip .amount {{ font: 800 2.6rem/1 var(--display); letter-spacing: -0.03em; color: var(--teal); }}
  .slip .amount small {{ font: 400 1rem/1 var(--text); color: var(--muted); letter-spacing: 0; }}
  .slip ul {{ margin: 0; padding-left: 1.1em; display: grid; gap: 6px; }}
  .slip.featured {{ background: var(--teal); border-color: var(--teal); color: var(--paper); }}
  .slip.featured h3, .slip.featured .amount {{ color: var(--paper); }}
  .slip.featured .when, .slip.featured .amount small {{ color: #c4d8d3; }}
  .guests {{ margin-top: 26px; width: 100%; max-width: 620px; border-collapse: collapse; }}
  .guests caption {{ text-align: left; padding-bottom: 10px; color: var(--muted); }}
  .guests th, .guests td {{ text-align: left; padding: 10px 12px 10px 0; border-bottom: 1px solid var(--line); }}
  .guests th {{ font: 500 0.8rem/1.2 var(--mono); text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }}
  .guests td {{ font-variant-numeric: tabular-nums; }}
  .stages-title {{ margin-top: 40px; font-weight: 600; color: var(--teal); }}
  .stages {{ margin-top: 12px; display: grid; grid-template-columns: 3fr 4fr 3fr; gap: 4px; }}
  .stage {{ background: var(--sage); border-top: 6px solid var(--teal); border-radius: 0 0 var(--r) var(--r); padding: 14px 16px; display: grid; gap: 4px; }}
  .stage b {{ font: 800 2.2rem/1 var(--display); color: var(--teal); }}
  .stage span {{ color: var(--muted); }}
  .norm {{ margin-top: 26px; font: 600 1.25rem/1.4 var(--text); color: var(--teal); max-width: 46ch; }}
  .small-print {{ margin-top: 12px; display: grid; gap: 6px; color: var(--muted); }}
  .flow {{ margin-top: 44px; display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 36px; align-items: start; }}
  .flow-lines {{ display: grid; gap: 12px; }}
  .flow-line {{ display: grid; grid-template-columns: auto 1fr; gap: 16px; align-items: center; padding: 16px 18px; border-radius: var(--r); background: var(--sage); }}
  .flow-line .arrow {{ font: 500 1rem/1.3 var(--mono); white-space: nowrap; color: var(--teal); }}
  .why {{ background: var(--sage); border-radius: var(--r); padding: 20px 22px; display: grid; gap: 10px; }}
  .why b {{ color: var(--teal); }}
  .after {{ margin-top: 36px; }}

  /* Checks */
  .checks {{ background: var(--sage); }}
  .checklist {{ list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0 44px; }}
  .checklist li {{ display: grid; grid-template-columns: 28px 1fr; gap: 14px; padding: 18px 0; border-bottom: 1px solid var(--line); }}
  .tick {{ width: 26px; height: 26px; margin-top: 1px; }}
  .checklist b {{ display: block; font-weight: 600; }}
  .checklist span {{ color: var(--muted); }}

  /* Preparation */
  .prep {{ list-style: none; margin: 0; padding: 0; display: grid; }}
  .prep li {{ display: grid; grid-template-columns: 8.5em 1fr auto; gap: 18px; padding: 16px 0; border-bottom: 1px solid var(--line); align-items: baseline; }}
  .prep .h {{ font: 500 1rem/1.4 var(--mono); color: var(--teal); }}
  .prep .who {{ font: 500 0.8rem/1.4 var(--mono); color: var(--muted); text-align: right; }}
  .prep .pay {{ font: 500 0.8rem/1 var(--mono); border: 1.5px solid var(--teal); color: var(--teal); padding: 3px 7px; border-radius: 6px; margin-left: 8px; white-space: nowrap; }}
  .prep .theday {{ background: var(--teal); color: var(--paper); border-radius: var(--r); padding-inline: 16px; border-bottom: 0; }}
  .prep .theday .h, .prep .theday .who {{ color: var(--paper); }}
  .family {{ margin-top: 22px; color: var(--muted); }}

  /* The day: the pinned clock */
  .day {{ background: var(--teal); color: var(--paper); }}
  .day h2 {{ color: var(--paper); }}
  .day .label {{ color: #b8cdc8; }}
  .day .lead {{ color: #d6e4e0; }}
  .day-grid {{ display: grid; grid-template-columns: minmax(0, 0.8fr) minmax(0, 1.2fr); gap: 56px; }}
  .clock-col {{ display: none; }}
  .js .clock-col {{ display: block; }}
  .clock-pin {{ position: sticky; top: 140px; min-height: 62vh; display: grid; align-content: start; gap: 14px; }}
  .clock {{ font: 800 clamp(5rem, 12vw, 10.5rem)/0.85 var(--display); letter-spacing: -0.045em; color: var(--paper); font-variant-numeric: tabular-nums; }}
  .clock-note {{ font: 500 0.8rem/1.4 var(--mono); color: #b8cdc8; }}
  .panels {{ display: grid; gap: 0; }}
  .panel {{ min-height: 46vh; display: grid; gap: 16px; align-content: center; padding-block: 36px; border-top: 1px solid #2e6966; }}
  .panel .time {{ font: 500 1rem/1 var(--mono); color: var(--butter); }}
  .panel .art {{ width: 100%; max-width: 440px; height: auto; display: block; }}
  .panel .what {{ font-size: 1.25rem; color: var(--paper); max-width: 34ch; }}
  @media (prefers-reduced-motion: no-preference) {{
    .clock {{ transition: opacity 0.2s; }}
    .clock.flip {{ opacity: 0.2; }}
    .js .panel .art {{ transform: translateY(24px); opacity: 0; transition: transform 0.5s ease-out, opacity 0.5s ease-out; }}
    .js .panel.seen .art {{ transform: none; opacity: 1; }}
  }}
  .close-line {{ margin-top: 56px; font: 800 clamp(2.6rem, 6vw, 5rem)/1 var(--display); letter-spacing: -0.03em; color: var(--paper); }}
  .day-facts {{ margin-top: 26px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 40px; color: #d6e4e0; }}
  .day-facts b {{ color: var(--paper); font-weight: 600; }}

  /* FAQ */
  .faq {{ max-width: 820px; }}
  .faq details {{ border-bottom: 1px solid var(--line); }}
  .faq summary {{ cursor: pointer; padding: 20px 40px 20px 0; font: 600 1.125rem/1.4 var(--text); list-style: none; position: relative; }}
  .faq summary::-webkit-details-marker {{ display: none; }}
  .faq summary::after {{ content: "+"; position: absolute; right: 6px; top: 16px; font: 500 1.5rem/1 var(--mono); color: var(--teal); }}
  .faq details[open] summary::after {{ content: "–"; }}
  .faq details p {{ padding: 0 0 20px; color: var(--muted); }}

  /* Closing */
  .final {{ background: var(--sage); }}
  .steps {{ list-style: none; margin: 30px 0 34px; padding: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; counter-reset: s; }}
  .steps li {{ counter-increment: s; display: grid; gap: 8px; border-top: 3px solid var(--teal); padding-top: 14px; }}
  .steps li::before {{ content: counter(s); font: 800 2.2rem/1 var(--display); color: var(--teal); }}
  .wa-text {{ margin-top: 14px; font: 500 1rem/1.5 var(--mono); color: var(--muted); }}
  footer {{ background: var(--teal); color: #d6e4e0; padding-block: 34px; font-size: 1rem; }}
  footer .wrap {{ display: flex; flex-wrap: wrap; justify-content: space-between; gap: 12px 30px; }}
  footer b {{ color: var(--paper); }}

  .sticky-wa {{ display: none; }}
  @media (max-width: 720px) {{
    html {{ scroll-padding-bottom: 96px; scroll-padding-top: 140px; }}
    body {{ padding-bottom: 80px; }}
    .sticky-wa {{ display: flex; position: fixed; left: 0; right: 0; bottom: 0; z-index: 40; padding: 12px max(16px, env(safe-area-inset-left, 0px)) calc(12px + env(safe-area-inset-bottom, 0px)); background: var(--paper); border-top: 1px solid var(--line); transition: transform 0.25s ease-out; }}
    .sticky-wa .btn {{ width: 100%; }}
    .sticky-wa.away {{ transform: translateY(110%); }}
  }}
  @media (max-width: 860px) {{
    section {{ padding-block: 72px; }}
    .slips, .stages, .steps, .day-facts {{ grid-template-columns: 1fr; }}
    .flow, .checklist {{ grid-template-columns: 1fr; }}
    .day-grid {{ grid-template-columns: 1fr; gap: 0; }}
    .js .clock-col {{ position: sticky; top: 58px; z-index: 10; background: var(--teal); margin-inline: calc(-1 * var(--gutter)); padding: 10px var(--gutter); border-bottom: 1px solid #2e6966; }}
    .clock-pin {{ position: static; min-height: 0; display: flex; align-items: baseline; gap: 14px; }}
    .clock {{ font-size: 3rem; }}
    .panel {{ min-height: 0; }}
    .prep li {{ grid-template-columns: 6.5em 1fr; }}
    .prep .who {{ display: none; }}
  }}
"""

BODY = f"""{HEADER}
<main>
{hero_html}

<section id="harga"><div class="wrap">
  <div class="head"><p class="label">Harga</p><h2>Harga, dan ke mana uang kalian pergi</h2>
  <p class="lead">Harga di bawah adalah fee kerja kami. Vendor kalian bayar sendiri, langsung ke mereka.</p></div>
  <div class="slips">
    <article class="slip"><span class="when">MULAI H-30</span><h3>Hari H</h3><p class="amount"><small>mulai</small> Rp 9,5 jt</p><ul><li>Rundown dan technical meeting</li><li>Gladi resik di venue</li><li>Koordinasi penuh di hari H</li></ul></article>
    <article class="slip featured"><span class="when">MULAI H-180</span><h3>Pendampingan</h3><p class="amount"><small>mulai</small> Rp 24 jt</p><ul><li>Semua di paket Hari H</li><li>Rencana anggaran</li><li>Pilih vendor; kami cek setiap kontrak sebelum ditandatangani</li></ul></article>
    <article class="slip"><span class="when">MULAI H-365</span><h3>Penuh</h3><p class="amount"><small>mulai</small> Rp 45 jt</p><ul><li>Semua di Pendampingan</li><li>Cari dan survei venue</li><li>Susun upacara dan adat</li></ul></article>
  </div>
  <table class="guests"><caption>Harga di atas untuk sampai 300 tamu. Kru dan fee mengikuti jumlah tamu:</caption>
    <thead><tr><th scope="col">Jumlah tamu</th><th scope="col">Kru di hari H</th><th scope="col">Tambahan fee</th></tr></thead>
    <tbody><tr><td>sampai 300</td><td>6 orang</td><td>–</td></tr><tr><td>301–600</td><td>8 orang</td><td>+ Rp 2 jt</td></tr><tr><td>601–1.000</td><td>10 orang</td><td>+ Rp 4 jt</td></tr></tbody></table>
  <p class="stages-title">Fee dibayar dalam 3 tahap, sama untuk semua paket</p>
  <div class="stages" aria-label="Tahap pembayaran fee">
    <div class="stage"><b>30%</b><span>saat tanda tangan kontrak</span></div>
    <div class="stage"><b>40%</b><span>di technical meeting, H-30</span></div>
    <div class="stage"><b>30%</b><span>pelunasan H+1, setelah acara selesai</span></div>
  </div>
  <p class="norm">Biasanya WO minta lunas sebelum hari H. Kami minta pelunasan sehari setelahnya.</p>
  <div class="small-print"><p>Tidak ada biaya lain di luar tabel ini. Makan, parkir, dan transport kru sudah termasuk.</p><p>Kalau batal, tahap yang sudah dibayar menutup pekerjaan yang sudah dikerjakan. Tahap berikutnya tidak ditagih.</p></div>
  <div class="flow">
    <div class="flow-lines">
      <div class="flow-line"><span class="arrow">Kalian → vendor</span><p>Langsung, dengan kontrak atas nama kalian.</p></div>
      <div class="flow-line"><span class="arrow">Kalian → Jalinan</span><p>Hanya fee kerja kami, dalam tiga tahap.</p></div>
      <p>Kalian tidak mengurus vendor sendirian. Kami cek setiap invoice vendor terhadap kontraknya, mengingatkan jatuh tempo, dan menemani pelunasan kalau kalian mau.</p>
    </div>
    <div class="why"><b>Kenapa begini</b><p>Tahun ini ada pasangan yang sudah lunas ke WO, lalu tahu dari pihak gedung di H-10 bahwa gedungnya baru dibayar DP. Kalau kalian membayar vendor sendiri, itu tidak bisa terjadi.</p></div>
  </div>
  <div class="after"><a class="btn btn-main" href="{WA_URL}" target="_blank" rel="noopener">{WA}Tanya tanggal dan paket via WhatsApp</a></div>
</div></section>

<section id="cek" class="checks"><div class="wrap">
  <div class="head"><p class="label">Sebelum membayar apa pun</p><h2>Takut ketemu WO bodong? Wajar. Cek kami dulu.</h2></div>
  <ul class="checklist">{checklist}</ul>
</div></section>

<section id="persiapan"><div class="wrap">
  <div class="head"><p class="label">Persiapan</p><h2>Dari H-365 sampai H+1</h2></div>
  <ol class="prep">
    <li><span class="h">H-365</span><span>Cari dan survei venue, susun anggaran awal</span><span class="who">Penuh</span></li>
    <li><span class="h">H-180</span><span>Pilih vendor; kami cek setiap kontrak sebelum kalian tanda tangan</span><span class="who">Pendampingan</span></li>
    <li><span class="h">H-90</span><span>Draf rundown sesuai upacara dan adat kalian</span><span class="who">Semua paket</span></li>
    <li><span class="h">H-30</span><span>Technical meeting dengan semua vendor <span class="pay">Tahap 2</span></span><span class="who">Semua paket</span></li>
    <li><span class="h">H-7</span><span>Gladi resik di venue</span><span class="who">Semua paket</span></li>
    <li class="theday"><span class="h">Hari H</span><span>Kalian tinggal hadir. Jam demi jamnya ada di bawah.</span><span class="who">Semua paket</span></li>
    <li><span class="h">H+1</span><span>Barang titipan dikembalikan, pelunasan <span class="pay">Tahap 3</span></span><span class="who">Semua paket</span></li>
  </ol>
  <p class="family">Jadwal ini kami kirim sebagai satu tautan. Bagikan ke orang tua dan keluarga, supaya semua melihat jadwal yang sama.</p>
</div></section>

<section id="hari-h" class="day"><div class="wrap">
  <div class="head"><p class="label">Hari H, di balik layar</p><h2>Satu hari, jam demi jam</h2>
  <p class="lead">Ini yang kami kerjakan sementara kalian bersiap. Contoh rundown untuk akad dan resepsi 400 tamu.</p></div>
  <div class="day-grid">
    <div class="clock-col" aria-hidden="true"><div class="clock-pin"><span class="clock" id="clock">05.30</span><span class="clock-note">waktu di venue</span></div></div>
    <div class="panels">{panels}</div>
  </div>
  <p class="close-line">Kalian? Tinggal hadir.</p>
  <div class="day-facts">
    <p><b>Satu hari, satu pernikahan.</b> Maksimal enam pernikahan per bulan, jadi koordinator kalian tidak datang dari acara lain.</p>
    <p><b>Kru menyesuaikan tamu:</b> 6 orang untuk sampai 300 tamu, 8 untuk 600, 10 untuk 1.000.</p>
    <p>Rundown kami susun sesuai upacara kalian: akad, pemberkatan, sangjit, tea pai, adat Jawa, Sunda, Batak, Minang, atau Betawi.</p>
  </div>
</div></section>

<section id="tanya"><div class="wrap">
  <div class="head"><p class="label">Tanya jawab</p><h2>Tanyakan ini ke WO mana pun</h2></div>
  <div class="faq">
    <details><summary>Hanya koordinasi, atau juga dekorasi?</summary><p>Kami mengatur dan mengoordinasi. Dekorasi, katering, rias, dan dokumentasi berasal dari vendor yang kalian pilih, dan kami bantu memilihnya.</p></details>
    <details><summary>Apakah sudah kenal venue kami?</summary><p>Kalau belum, survei venue termasuk di semua paket.</p></details>
    <details><summary>Bisa menjaga anggaran kami?</summary><p>Di Pendampingan dan Penuh kami susun rencana anggaran, lalu cek setiap invoice vendor terhadap rencana itu.</p></details>
    <details><summary>Berapa pernikahan yang kalian tangani sebulan?</summary><p>Maksimal enam, satu per hari.</p></details>
    <details open><summary>Kenapa pelunasan setelah acara?</summary><p>Karena pekerjaan kami baru selesai setelah acara kalian selesai.</p></details>
    <details><summary>Bisa di luar Jakarta?</summary><p>Jabodetabek tanpa biaya transport. Untuk luar kota, biayanya kami hitung terbuka sebelum kontrak.</p></details>
    <details open><summary>Bagaimana kalau kami batal?</summary><p>Tahap yang sudah dibayar menutup pekerjaan yang sudah dikerjakan. Aturan lengkapnya ada di contoh kontrak, yang bisa kalian baca sebelum memutuskan.</p></details>
  </div>
</div></section>

<section class="final"><div class="wrap">
  <h2>Kirim tanggal dan perkiraan jumlah tamu</h2>
  <ol class="steps"><li>Kami jawab ketersediaan tanggal dalam satu hari kerja.</li><li>Konsultasi 45 menit, online atau di kantor, gratis.</li><li>Contoh kontrak dan rincian biaya kami kirim sebelum kalian memutuskan.</li></ol>
  <a class="btn btn-main" href="{WA_URL}" target="_blank" rel="noopener">{WA}Cek tanggal via WhatsApp</a>
  <p class="wa-text">WhatsApp 0812-0000-0000</p>
</div></section>
</main>
<footer><div class="wrap"><span><b>Jalinan Wedding Organizer</b> · Jl. Wijaya I no. 12, Kebayoran Baru, Jakarta Selatan</span><span>Senin–Sabtu, 10.00–18.00</span></div></footer>
<div class="sticky-wa"><a class="btn btn-main" href="{WA_URL}" target="_blank" rel="noopener">{WA}Cek tanggal via WhatsApp</a></div>
<script>
  document.documentElement.classList.add('js');
  (function () {{
    if (!('IntersectionObserver' in window)) {{ document.documentElement.classList.remove('js'); return; }}
    var clock = document.getElementById('clock');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // The clock shows the hour of the last panel whose top has passed the middle of the screen,
    // worked out on every scroll so jumps (menu links, back button) never leave it stale.
    var panelsEls = [].slice.call(document.querySelectorAll('.panel'));
    var shown = clock.textContent, ticking = false;
    function setTime(t) {{
      if (t === shown) return;
      shown = t;
      if (reduce) {{ clock.textContent = t; return; }}
      clock.classList.add('flip');
      setTimeout(function () {{ clock.textContent = shown; clock.classList.remove('flip'); }}, 160);
    }}
    function update() {{
      ticking = false;
      var t = panelsEls[0].getAttribute('data-time');
      panelsEls.forEach(function (p) {{ if (p.getBoundingClientRect().top < innerHeight * 0.55) t = p.getAttribute('data-time'); }});
      setTime(t);
    }}
    addEventListener('scroll', function () {{ if (!ticking) {{ ticking = true; requestAnimationFrame(update); }} }}, {{ passive: true }});
    update();
    // Drawings rise in once as their hour arrives.
    var seen = new IntersectionObserver(function (entries) {{
      entries.forEach(function (e) {{ if (e.isIntersecting) {{ e.target.classList.add('seen'); seen.unobserve(e.target); }} }});
    }}, {{ threshold: 0.25 }});
    panelsEls.forEach(function (p) {{ seen.observe(p); }});
    // The phone's sticky button waits until the hero's own button has scrolled away.
    // ... and steps aside while the day section is on screen, so three sticky bars never stack.
    var bar = document.querySelector('.sticky-wa'), heroCta = document.querySelector('.hero .btn-main'), day = document.getElementById('hari-h');
    var heroIn = true, dayIn = false;
    function place() {{ if (bar) bar.classList.toggle('away', heroIn || dayIn); }}
    if (bar && heroCta) new IntersectionObserver(function (e) {{ heroIn = e[0].isIntersecting; place(); }}).observe(heroCta);
    if (bar && day) new IntersectionObserver(function (e) {{ dayIn = e[0].isIntersecting; place(); }}, {{ rootMargin: '0px 0px -40% 0px' }}).observe(day);
  }})();
</script>"""

open(out, "w").write(f"""<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Jalinan Wedding Organizer · Jakarta</title>
<meta name="description" content="Wedding organizer di Jakarta. Hari H berjalan, kalian tinggal hadir. Vendor dibayar langsung, fee bertahap, pelunasan setelah acara.">
{FONTS}
<style>{CSS}</style>
</head>
<body>
{BODY}
</body>
</html>
""")
print("built", out, "with hero", choice)
