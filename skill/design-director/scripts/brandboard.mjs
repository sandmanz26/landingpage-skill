#!/usr/bin/env node
// Renders a brand kit into a board the user can see and keep (brand/method.md §8-§10, modes/brand.md):
// palette with roles and contrast pairs, type specimen, shape language, element samples, the
// placeholder wordmark, and the brand in use (web hero, price card, social post).
//
//   node brandboard.mjs <brand-kit.json | directions.json> [--out .design/brand] [--no-pdf]
//
// A directions file is { "directions": [kit, kit, kit] }: one board section per direction.
// Writes <out>/board.html and <out>/board.pdf (Playwright page.pdf).
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, launch, resolveTarget } from './lib/browser.mjs';
import { validateKit } from './lib/brandkit.mjs';

const args = parseArgs(process.argv.slice(2));
const input = args._[0];
if (!input) {
  console.error('Usage: brandboard.mjs <brand-kit.json | directions.json> [--out .design/brand] [--no-pdf]');
  process.exit(2);
}
const outDir = path.resolve(args.out || '.design/brand');

const raw = JSON.parse(fs.readFileSync(input, 'utf8'));
const kits = raw.directions || [raw];
if (kits.length < 1 || kits.length > 3) {
  console.error('A directions file holds 1-3 kits.');
  process.exit(2);
}
const errs = kits.flatMap((k, i) => validateKit(k, kits.length > 1 ? `direction ${i + 1}` : 'kit'));
if (errs.length) {
  console.error(`Invalid kit:\n  ${errs.join('\n  ')}`);
  process.exit(1);
}

// --- colour maths (WCAG relative luminance)
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lum = (h) => rgb(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const SYSTEM = /^(arial|helvetica|georgia|times new roman|verdana|tahoma|trebuchet ms|courier new|palatino|garamond|dejavu (sans|serif)|liberation (sans|serif)|noto (sans|serif)|system-ui|serif|sans-serif|monospace)$/i;

function tokens(kit) {
  const by = (role) => (kit.colors.find((c) => c.role === role) || {}).hex;
  const ink = by('ink');
  const ground = by('ground') || '#ffffff';
  const action = by('action');
  const signature = by('signature') || action;
  // Text on any field: the kit's ink or ground, else black or white, whichever reads best.
  const on = (bg) => [ink, ground, '#111111', '#ffffff'].sort((a, b) => ratio(b, bg) - ratio(a, bg))[0];
  return { ink, ground, action, signature, support: by('support') || signature, on };
}

function shapeCss(shape, r) {
  if (shape === 'arch') return `border-radius:999px 999px ${r.small ?? 6}px ${r.small ?? 6}px`;
  if (shape === 'circle' || shape === 'dot') return 'border-radius:50%';
  if (shape === 'pill') return 'border-radius:999px';
  if (shape === 'notch') return `border-radius:${r.large ?? 20}px 0 ${r.large ?? 20}px 0`;
  return `border-radius:${r.large ?? 16}px`;
}

function wordmark(kit, t, size = 28) {
  const w = kit.wordmark || {};
  const mark = w.shape ? `<span aria-hidden="true" style="display:inline-block;width:${size * 0.7}px;height:${size * 0.7}px;background:${t.signature};${shapeCss(w.shape, kit.radii || {})};margin-right:${size * 0.25}px;vertical-align:-0.05em"></span>` : '';
  return `<span class="wm" ${w.placeholder !== false ? 'data-placeholder-logo' : ''} style="font-family:'${esc(kit.fonts.display)}',Georgia,serif;font-size:${size}px;color:inherit">${mark}${esc(w.text || kit.name)}</span>`;
}

function board(kit, i, many) {
  const t = tokens(kit);
  const r = kit.radii || {};
  const big = r.large ?? 16;
  const small = r.small ?? 6;
  const ease = kit.motion?.easing || 'ease';
  const d = kit.motion?.durations || {};
  const display = `font-family:'${esc(kit.fonts.display)}',Georgia,serif`;
  const body = `font-family:'${esc(kit.fonts.body)}',Verdana,sans-serif`;
  const shape = shapeCss(kit.wordmark?.shape || 'rounded', r);
  const pairs = [];
  for (const fg of kit.colors) for (const bg of kit.colors) if (fg !== bg && ['ink', 'action', 'ground'].includes(fg.role)) pairs.push([fg, bg, ratio(fg.hex, bg.hex)]);
  pairs.sort((a, b) => b[2] - a[2]);
  const Title = many ? 'h2' : 'h1';
  const H = many ? 'h3' : 'h2';
  const action = `display:inline-block;padding:14px 22px;min-height:48px;box-sizing:border-box;background:${t.action};color:${t.on(t.action)};border-radius:${small}px;font-weight:700;text-decoration:none;transition:transform ${d.short ?? 160}ms ${ease}`;
  return `
<section class="kit" style="${body};background:${t.ground};color:${t.on(t.ground)}">
  <header class="kit-head">
    <p class="label">${many ? `Direction ${String.fromCharCode(65 + i)}` : 'Brand kit'}</p>
    <${Title} style="${display}">${esc(kit.direction || kit.name)}</${Title}>
    <p class="lead">${esc(kit.hero?.name)}: ${esc(kit.hero?.description || '')} <span class="src">Source: ${esc(kit.hero?.source || '')}</span></p>
  </header>

  <div class="grid">
    <div class="panel">
      <${H}>Palette and roles</${H}>
      <ul class="swatches">${kit.colors.map((c) => `<li style="background:${c.hex};color:${t.on(c.hex)};border-radius:${small}px"><b>${esc(c.role)}</b><span>${esc(c.name || '')} ${c.hex}</span></li>`).join('')}</ul>
      <p class="small">Contrast pairs (4.5:1 for body text, 3:1 for large):</p>
      <ul class="pairs">${pairs.slice(0, 6).map(([f, b, x]) => `<li><span style="background:${b.hex};color:${f.hex};border-radius:${small}px">Aa</span> ${esc(f.role)} on ${esc(b.role)} ${x.toFixed(1)}:1 ${x >= 4.5 ? 'body' : x >= 3 ? 'large only' : 'decoration only'}</li>`).join('')}</ul>
    </div>
    <div class="panel">
      <${H}>Type</${H}>
      <p style="${display};font-size:44px;line-height:1.05;margin:0 0 8px">${esc(kit.wordmark?.text || kit.name)}</p>
      <p class="small">Display: ${esc(kit.fonts.display)} · Body: ${esc(kit.fonts.body)}</p>
      <p style="max-width:36em">Body text reads at 16-18px with a line height of 1.5; the display face carries the headlines and the wordmark.</p>
    </div>
    <div class="panel">
      <${H}>Shape and motion</${H}>
      <div class="shapes"><span style="background:${t.signature};${shape}"></span><span style="background:${t.support};border-radius:${big}px"></span><span style="background:${t.action};border-radius:${small}px"></span></div>
      <p class="small">Radii: ${Object.entries(r).map(([k, v]) => `${esc(k)} ${v}px`).join(', ')} · Easing ${esc(ease)} · ${Object.entries(d).map(([k, v]) => `${esc(k)} ${v}ms`).join(', ')}</p>
    </div>
    <div class="panel">
      <${H}>Elements</${H}>
      <ul class="elements">
        <li><b>Hero: ${esc(kit.hero?.name)}</b> <span class="small">from ${esc(kit.hero?.source || '')}</span></li>
        ${kit.supporting.map((s) => `<li><b>${esc(s.name)}</b> <span class="small">from ${esc(s.source || '')}; ${esc(s.effect || '')}</span></li>`).join('')}
      </ul>
      <p class="small">Placeholder wordmark (replace with a designer's logo):</p>
      <p>${wordmark(kit, t, 26)}</p>
    </div>
  </div>

  <${H} class="apps-title">In use</${H}>
  <div class="apps">
    <div class="app hero" style="background:${t.signature};color:${t.on(t.signature)};border-radius:${big}px">
      <p>${wordmark(kit, { ...t, signature: t.on(t.signature) }, 20)}</p>
      <p style="${display};font-size:32px;line-height:1.1;margin:18px 0 12px">${esc(kit.hero?.name)}</p>
      <a href="#" style="${action}">${esc(kit.sampleAction || 'Pesan sekarang')}</a>
    </div>
    <div class="app price" style="background:${t.ground};color:${t.on(t.ground)};border:2px solid ${t.ink};${shape.includes('50%') ? `border-radius:${big}px` : shape}">
      <p class="small">Price card</p>
      <p style="${display};font-size:32px;margin:6px 0">${esc(kit.samplePrice || 'Rp 45.000')}</p>
      <p>${esc(kit.samplePriceNote || 'per hari, sudah termasuk antar')}</p>
      <a href="#" style="${action}">${esc(kit.sampleAction || 'Pesan sekarang')}</a>
    </div>
    <div class="app social" style="background:${t.support};color:${t.on(t.support)};border-radius:${small}px">
      <p class="small">Social post</p>
      <span class="blob" style="background:${t.signature};${shape}"></span>
      <p style="${display};font-size:26px;line-height:1.1;margin:10px 0">${esc(kit.samplePost || kit.hero?.name)}</p>
      <p>${wordmark(kit, { ...t, signature: t.action }, 18)}</p>
    </div>
  </div>
</section>`;
}

const fontLinks = [...new Set(kits.flatMap((k) => [k.fonts.display, k.fonts.body]))].filter((f) => !SYSTEM.test(f));
const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Brand board: ${esc(kits.length > 1 ? `${kits.length} directions` : kits[0].name)}</title>
${fontLinks.length ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${fontLinks.map((f) => `family=${encodeURIComponent(f)}:wght@400;700`).join('&')}&display=swap">` : ''}
<style>
*{box-sizing:border-box} body{margin:0;background:#f4f4f2;color:#111;font:16px/1.5 Verdana,sans-serif}
.top{padding:32px 24px 8px;max-width:1200px;margin:0 auto} .top h1{font:700 32px/1.1 Georgia,serif;margin:0}
.kit{padding:40px 24px;max-width:1200px;margin:0 auto 24px;break-inside:avoid-page;break-after:page}
.kit h1,.kit h2{font-size:44px;line-height:1.05;margin:4px 0 12px} .kit h3{font-size:20px;margin:0 0 12px}
.kit .grid h2,.kit .apps-title{font-size:20px;line-height:1.2}
.label,.small{font-size:13px;opacity:.85;margin:0} .lead{max-width:44em} .src{display:block;font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px;margin:24px 0}
.panel{padding:4px 0} .swatches,.pairs,.elements{list-style:none;padding:0;margin:0 0 12px}
.swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(110px,1fr));gap:8px}
.swatches li{padding:14px 10px;min-height:84px;display:flex;flex-direction:column;justify-content:flex-end;font-size:13px}
.pairs li{font-size:13px;margin:6px 0} .pairs span{display:inline-block;padding:2px 8px;font-weight:700;margin-right:6px}
.elements li{margin:0 0 8px} .shapes{display:flex;gap:12px;margin-bottom:12px} .shapes span{width:72px;height:72px;display:block}
.apps{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:20px}
.app{padding:24px;min-height:260px} .app p{margin:0 0 6px} .blob{display:block;width:96px;height:96px;margin:12px 0}
@media print{body{background:#fff}.kit{margin:0}}
</style></head><body>
${kits.length > 1 ? `<header class="top"><h1>${esc(kits[0].name)}: ${kits.length} brand directions</h1><p class="small">Choose one (or a mix); the chosen one becomes the brand kit.</p></header>` : ''}
<main>${kits.map((k, i) => board(k, i, kits.length > 1)).join('\n')}</main>
</body></html>`;

fs.mkdirSync(outDir, { recursive: true });
const htmlPath = path.join(outDir, 'board.html');
fs.writeFileSync(htmlPath, html);
console.log(`Board: ${path.relative(process.cwd(), htmlPath)} (${kits.length} ${kits.length > 1 ? 'directions' : 'kit'})`);

if (!args['no-pdf']) {
  const browser = await launch();
  const { url, close } = await resolveTarget(htmlPath);
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'load', timeout: 30000 });
  await page.evaluate(() => document.fonts.ready).catch(() => {});
  const pdfPath = path.join(outDir, 'board.pdf');
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '8mm', right: '8mm' } });
  await browser.close();
  await close();
  console.log(`PDF:   ${path.relative(process.cwd(), pdfPath)}`);
}
