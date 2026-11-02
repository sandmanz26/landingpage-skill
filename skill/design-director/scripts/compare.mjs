#!/usr/bin/env node
// A comparison page for the user to choose between variants: each one framed at desktop or
// phone width, side by side or one at a time, a score and a pick, and a reply text to paste back.
//
//   node compare.mjs <variant.html> <variant.html> [...] [--out .design/variants/compare.html]
//        [--labels "Rundown,Bab berwarna,Kata saja"] [--blind]
//
// --blind shows "Varian 1…N" in a shuffled order and keeps the real names in compare.key.json.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const files = args._;
if (files.length < 2) {
  console.error('Usage: node compare.mjs <variant.html> <variant.html> [...] [--out file] [--labels a,b,c] [--blind]');
  process.exit(2);
}
for (const f of files) if (!fs.existsSync(f)) {
  console.error(`Not found: ${f}`);
  process.exit(2);
}
const out = path.resolve(args.out || '.design/variants/compare.html');
const names = String(args.labels || '').split(',').map((x) => x.trim()).filter(Boolean);
let items = files.map((f, i) => ({ file: f, name: names[i] || path.basename(path.dirname(path.resolve(f))) }));
if (args.blind) {
  items = items.map((x) => ({ x, r: Math.random() })).sort((a, b) => a.r - b.r).map((y) => y.x);
  fs.writeFileSync(out.replace(/\.html$/, '.key.json'), JSON.stringify(Object.fromEntries(items.map((x, i) => [`Varian ${i + 1}`, x.name])), null, 2));
}
items = items.map((x, i) => ({ ...x, label: args.blind ? `Varian ${i + 1}` : `Varian ${i + 1} · ${x.name}`, src: path.relative(path.dirname(out), path.resolve(x.file)).split(path.sep).join('/') }));
const esc = (t) => String(t).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pilih varian</title>
<style>
  :root { --bg: #f5f5f3; --panel: #fff; --fg: #1d1f24; --muted: #5d6170; --line: #dcdcd8; --accent: #2b59c3; --sel: #e7edfb; }
  @media (prefers-color-scheme: dark) { :root { --bg: #16171a; --panel: #1f2125; --fg: #ececea; --muted: #a3a6b0; --line: #34363c; --accent: #8fb0ff; --sel: #26324f; color-scheme: dark; } }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 15px/1.55 system-ui, sans-serif; }
  .page { max-width: 1440px; margin: 0 auto; padding: 24px max(16px, 3vw) 64px; display: grid; gap: 18px; }
  h1 { margin: 0; font-size: 1.6rem; }
  .bar { display: flex; flex-wrap: wrap; gap: 12px; }
  .seg { display: inline-flex; border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: var(--panel); }
  .seg button { font: 600 0.92rem/1 system-ui; padding: 10px 14px; border: 0; background: transparent; color: var(--fg); cursor: pointer; min-height: 40px; }
  .seg button + button { border-left: 1px solid var(--line); }
  .seg button[aria-pressed="true"] { background: var(--accent); color: #fff; }
  .stage { display: grid; gap: 14px; grid-template-columns: repeat(var(--n), minmax(0, 1fr)); }
  .stage.one { grid-template-columns: minmax(0, 1fr); }
  @media (max-width: 900px) { .stage { grid-template-columns: minmax(0, 1fr); } }
  .frame { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; min-width: 0; }
  .frame-head { display: flex; justify-content: space-between; gap: 8px; padding: 8px 12px; border-bottom: 1px solid var(--line); font-weight: 700; }
  .frame-head a { color: var(--accent); font-weight: 600; }
  .viewport { position: relative; overflow: hidden; margin: 0 auto; }
  .viewport iframe { border: 0; position: absolute; top: 0; left: 0; transform-origin: 0 0; background: #fff; }
  .judge { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 18px; display: grid; gap: 14px; }
  .scores { display: grid; gap: 10px; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); }
  .score { border: 1px solid var(--line); border-radius: 8px; padding: 12px; display: grid; gap: 8px; }
  label { display: flex; justify-content: space-between; gap: 8px; align-items: center; }
  select, textarea { font: inherit; border: 1px solid var(--line); border-radius: 6px; background: var(--bg); color: var(--fg); padding: 6px 8px; }
  textarea { width: 100%; min-height: 90px; box-sizing: border-box; font-family: ui-monospace, Menlo, monospace; }
  .btn { font: 700 0.95rem/1 system-ui; padding: 12px 18px; border-radius: 8px; border: 0; background: var(--accent); color: #fff; cursor: pointer; justify-self: start; }
  :focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
</style></head>
<body><div class="page">
  <h1>Pilih varian yang akan diselesaikan</h1>
  <p>Semua varian memakai riset, copy dan dial yang sama; yang berbeda arah atau komposisinya. Buka penuh untuk merasakan scroll.</p>
  <div class="bar">
    <div class="seg" role="group" aria-label="Tampilan"><button type="button" data-view="all" aria-pressed="true">Berdampingan</button>${items.map((x, i) => `<button type="button" data-view="${i}" aria-pressed="false">${i + 1}</button>`).join('')}</div>
    <div class="seg" role="group" aria-label="Perangkat"><button type="button" data-device="desktop" aria-pressed="true">Desktop</button><button type="button" data-device="phone" aria-pressed="false">Ponsel</button></div>
  </div>
  <div class="stage" id="stage" style="--n:${Math.min(items.length, 3)}">
    ${items.map((x, i) => `<div class="frame" data-frame="${i}"><div class="frame-head"><span>${esc(x.label)}</span><a href="${esc(x.src)}" target="_blank" rel="noopener">Buka penuh ↗</a></div><div class="viewport"><iframe src="${esc(x.src)}" title="${esc(x.label)}" loading="lazy"></iframe></div></div>`).join('\n    ')}
  </div>
  <section class="judge">
    <div class="scores">${items.map((x, i) => `<div class="score"><b>${esc(x.label)}</b><label for="v${i}">Visual (1–10) <select id="v${i}"></select></label><label for="s${i}">Layak kirim (1–10) <select id="s${i}"></select></label></div>`).join('')}</div>
    <label for="pick">Diselesaikan: <select id="pick">${items.map((x, i) => `<option value="${i}">${esc(x.label)}</option>`).join('')}</select></label>
    <label for="why" style="display:grid">Kenapa (opsional) <textarea id="why" rows="2" style="min-height:50px"></textarea></label>
    <textarea id="reply" readonly aria-label="Teks jawaban"></textarea>
    <button class="btn" id="copy" type="button">Salin jawaban</button><span id="msg" aria-live="polite"></span>
  </section>
</div>
<script>
  var LABELS = ${JSON.stringify(items.map((x) => x.label))};
  var view = 'all', device = 'desktop', D = { desktop: [1280, 800], phone: [390, 780] };
  function layout() {
    var stage = document.getElementById('stage');
    stage.classList.toggle('one', view !== 'all');
    document.querySelectorAll('.frame').forEach(function (f) {
      f.hidden = !(view === 'all' || view === f.getAttribute('data-frame'));
      if (f.hidden) return;
      var w = D[device][0], h = D[device][1], sc = Math.min(1, (f.clientWidth - 2) / w);
      var fr = f.querySelector('iframe'), vp = f.querySelector('.viewport');
      fr.style.width = w + 'px'; fr.style.height = h + 'px'; fr.style.transform = 'scale(' + sc + ')';
      vp.style.width = Math.round(w * sc) + 'px'; vp.style.height = Math.round(h * sc) + 'px';
    });
  }
  function wire(attr, set) {
    document.querySelectorAll('[' + attr + ']').forEach(function (b) {
      b.addEventListener('click', function () {
        set(b.getAttribute(attr));
        document.querySelectorAll('[' + attr + ']').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        layout();
      });
    });
  }
  wire('data-view', function (v) { view = v; });
  wire('data-device', function (v) { device = v; });
  addEventListener('resize', layout);
  layout();
  LABELS.forEach(function (_, i) { ['v', 's'].forEach(function (k) { var s = document.getElementById(k + i); s.add(new Option('–', '')); for (var n = 1; n <= 10; n++) s.add(new Option(n, n)); }); });
  function build() {
    var p = document.getElementById('pick').value;
    var scores = LABELS.map(function (l, i) { return l + ' ' + (document.getElementById('v' + i).value || '–') + '/' + (document.getElementById('s' + i).value || '–'); }).join(' · ');
    var why = document.getElementById('why').value.trim();
    document.getElementById('reply').value = 'Pilih ' + LABELS[p] + '. Skor (visual/layak kirim): ' + scores + '.' + (why ? ' Alasan: ' + why : '');
  }
  document.querySelectorAll('select, textarea#why').forEach(function (e) { e.addEventListener('input', build); e.addEventListener('change', build); });
  build();
  document.getElementById('copy').addEventListener('click', function () {
    var r = document.getElementById('reply'), m = document.getElementById('msg');
    (navigator.clipboard ? navigator.clipboard.writeText(r.value) : Promise.reject()).then(function () { m.textContent = 'Tersalin.'; }).catch(function () { r.select(); m.textContent = 'Teks sudah dipilih: salin manual.'; });
  });
</script>
</body></html>
`;
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
console.log(`compare: ${path.relative(process.cwd(), out)} (${items.length} variants${args.blind ? ', blind; key in compare.key.json' : ''})`);
