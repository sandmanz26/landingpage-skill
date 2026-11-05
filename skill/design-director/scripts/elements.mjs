#!/usr/bin/env node
// Photographs a page with every element numbered, for the reason roast (rubric/reason.md): each
// element on the page must name its job, or it goes. Models place UI they cannot explain; this
// makes every piece visible and addressable by number.
//
//   node elements.mjs <url | file | folder> [--out .design/reason]
//
// Writes, in --out:
//   elements.json   sections and numbered elements (E01 …): kind, what it says, size, flags
//   elements.md     the table the roaster fills (job, lost without it, verdict)
//   desktop-S01.png …  each section at 1440px with numbered boxes
//   mobile-01.png …    the page at 390px with the same numbers
// Flags are hints, not verdicts: decorative, moves-endlessly, repeated, number-claim,
// generic-copy, emoji, same-as-siblings, eyebrow, no-label, hidden-on-phone.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, resolveTarget, parseArgs, gotoStable, dismissOverlays } from './lib/browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));
const target = args._[0];
if (!target) {
  console.error('Usage: node elements.mjs <url | file | folder> [--out .design/reason]');
  process.exit(2);
}
const out = path.resolve(args.out || '.design/reason');
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (/^(desktop-S\d+|mobile-\d+)\.png$/.test(f)) fs.unlinkSync(path.join(out, f));

const readJson = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : {});
const words = [...(readJson(path.join(here, '..', 'rules/lint-words.json')).copy || []), ...(readJson(path.join(here, '..', 'team/lint-words.json')).copy || [])].map((w) => w.pattern);

const { url, close } = await resolveTarget(target);
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const load = await gotoStable(page, url, { timeout: 45000 });
if (load.failed) {
  console.error('The page did not load (error page after retries).');
  await browser.close();
  await close();
  process.exit(1);
}
await dismissOverlays(page);

// Scroll through once so lazy pictures and scroll reveals have fired.
const scrollThrough = async () => {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const vh = await page.evaluate(() => innerHeight);
  for (let y = 0; y < h; y += vh / 2) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), y);
    await page.waitForTimeout(120);
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(400);
};
await scrollThrough();

const data = await page.evaluate((patterns) => {
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05;
  };
  const text = (el) => (el.innerText || el.getAttribute('aria-label') || el.getAttribute('alt') || el.getAttribute('title') || '').replace(/\s+/g, ' ').trim();
  const clip = (s, n = 90) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);
  const abs = (el) => {
    const r = el.getBoundingClientRect();
    return { x: Math.round(r.left + scrollX), y: Math.round(r.top + scrollY), w: Math.round(r.width), h: Math.round(r.height) };
  };
  const transparent = (c) => c === 'rgba(0, 0, 0, 0)' || c === 'transparent';
  const boxed = (el) => {
    const cs = getComputedStyle(el);
    const parentBg = el.parentElement ? getComputedStyle(el.parentElement).backgroundColor : '';
    return (!transparent(cs.backgroundColor) && cs.backgroundColor !== parentBg) || parseFloat(cs.borderTopWidth) > 0 || cs.boxShadow !== 'none';
  };
  const endless = new Set();
  for (const a of document.getAnimations()) {
    const t = a.effect && a.effect.target;
    const timing = a.effect ? a.effect.getComputedTiming() : {};
    if (t && timing.iterations === Infinity && a.playState === 'running') endless.add(t);
  }
  const movesEndlessly = (el) => [...endless].some((t) => el === t || el.contains(t));

  // Sections: the direct children of main (or body), unwrapping single wrappers.
  let blocks = [...(document.querySelector('main') ? [document.querySelector('header'), ...document.querySelector('main').children, document.querySelector('footer')] : document.body.children)];
  blocks = blocks.filter((b) => b && visible(b) && !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(b.tagName) && b.getBoundingClientRect().height >= 40);
  for (let i = 0; i < 3 && blocks.length === 1 && blocks[0].children.length > 1; i++) blocks = [...blocks[0].children].filter((b) => visible(b) && b.getBoundingClientRect().height >= 40);
  blocks = blocks.filter((b, i, all) => !all.some((o, j) => j !== i && o.contains(b)));

  const units = [];
  const taken = new Set();
  const seen = new Map();
  const add = (el, kind, sec, extra = {}) => {
    if (units.length >= 150) return;
    // The same thing again in the same section (a marquee's copies, a repeated badge): count it once.
    const key = `${sec}|${kind}|${extra.label || text(el)}`;
    if (!['action', 'navigation', 'heading'].includes(kind) && text(el) && seen.has(key)) {
      taken.add(el);
      seen.get(key).repeats = (seen.get(key).repeats || 1) + 1;
      return;
    }
    taken.add(el);
    el.setAttribute('data-dd-el', String(units.length + 1));
    const u = { el, kind, section: sec, label: clip(text(el)), tag: el.tagName.toLowerCase(), rect: abs(el), ...extra };
    units.push(u);
    seen.set(key, u);
  };
  const inTaken = (el) => {
    for (let n = el.parentElement; n; n = n.parentElement) if (taken.has(n)) return true;
    return false;
  };
  const sections = [];
  blocks.forEach((b, si) => {
    const sid = `S${String(si + 1).padStart(2, '0')}`;
    const r = abs(b);
    const h = b.querySelector('h1, h2, h3');
    sections.push({ id: sid, top: r.y, height: r.h, heading: h ? clip(text(h), 70) : clip(text(b), 50), tag: b.tagName.toLowerCase() });
    const walk = [b, ...b.querySelectorAll('*')].filter((el) => !el.closest('svg') || el.tagName === 'svg');
    for (const el of walk) {
      if (taken.has(el) || inTaken(el) || !visible(el)) continue;
      const tag = el.tagName;
      const rr = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      // A strip that moves by itself (marquee, ticker): one element, however many copies it holds.
      if (endless.has(el) && text(el) && rr.width >= 300) { add(el, 'marquee', sid, { label: clip(text(el)), inside: `${el.querySelectorAll('*').length} parts` }); continue; }
      if (tag === 'NAV') { add(el, 'navigation', sid, { inside: [...el.querySelectorAll('a, button')].filter(visible).map(text).filter(Boolean).slice(0, 8).join(' · ') }); continue; }
      if (tag === 'FORM') { add(el, 'form', sid, { inside: [...el.querySelectorAll('input, select, textarea')].map((i) => i.getAttribute('placeholder') || i.name || i.type).join(', ') }); continue; }
      if (tag === 'DETAILS') { const sm = el.querySelector('summary'); add(el, 'disclosure', sid, { label: clip(sm ? text(sm) : text(el)), inside: el.open ? 'open' : 'closed' }); continue; }
      if (/^H[1-6]$/.test(tag)) { add(el, 'heading', sid); continue; }
      if (tag === 'A' || tag === 'BUTTON' || el.getAttribute('role') === 'button') { add(el, 'action', sid, { href: el.getAttribute('href') || '' }); continue; }
      if (tag === 'VIDEO') { add(el, 'video', sid); continue; }
      if (['IMG', 'PICTURE', 'CANVAS'].includes(tag) || tag === 'svg') {
        if (rr.width < 16 || rr.height < 16) continue;
        if (tag === 'IMG' && el.parentElement && el.parentElement.tagName === 'PICTURE' && taken.has(el.parentElement)) continue;
        const big = Math.max(rr.width, rr.height);
        const src = tag === 'IMG' ? (el.currentSrc || el.src || '') : (tag === 'PICTURE' && el.querySelector('img') ? el.querySelector('img').currentSrc : '');
        const kind = big < 64 ? 'icon' : tag === 'svg' || tag === 'CANVAS' || /\.svg(\?|$)/i.test(src) ? 'illustration' : 'image';
        add(el, kind, sid, { src: src.split('?')[0].split('/').pop() || '' });
        continue;
      }
      // A card: a boxed container holding several things; listed as one element with its contents.
      const kids = [...el.querySelectorAll('h1, h2, h3, h4, h5, h6, p, img, svg, a, button, li')].filter(visible);
      // A wrapper of several alike children (a list of claims, a row of cards) is a group: number its children.
      const direct = [...el.children].filter(visible);
      const group = direct.length >= 2 && direct.every((k) => k.tagName === direct[0].tagName && k.className === direct[0].className);
      if (el !== b && !group && boxed(el) && kids.length >= 2 && rr.width >= 120 && rr.height >= 80 && rr.width < innerWidth * 0.9) {
        const inside = kids.filter((k) => !k.closest('svg') || k.tagName === 'svg').slice(0, 6).map((k) => (/^(IMG|svg)$/.test(k.tagName) ? (Math.max(k.getBoundingClientRect().width, k.getBoundingClientRect().height) < 64 ? 'icon' : 'picture') : `${k.tagName.toLowerCase()} "${clip(text(k), 30)}"`));
        add(el, 'card', sid, { inside: inside.join(', ') });
        continue;
      }
      if (/url\(/.test(cs.backgroundImage) && rr.width >= 160 && rr.height >= 160) { add(el, 'image', sid, { background: true }); continue; }
      const own = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
      if (['UL', 'OL'].includes(tag) && el.querySelectorAll('li').length >= 2) { add(el, 'list', sid, { inside: `${el.querySelectorAll('li').length} items` }); continue; }
      if (['P', 'BLOCKQUOTE', 'FIGCAPTION', 'LI', 'DT', 'DD', 'SPAN', 'DIV', 'SMALL', 'STRONG', 'LABEL'].includes(tag) && own.length >= 2) {
        const badge = rr.height <= 44 && own.length <= 28 && !transparent(cs.backgroundColor);
        add(el, badge ? 'badge' : tag === 'BLOCKQUOTE' ? 'quote' : 'text', sid);
        continue;
      }
      // Decoration: a visible shape with no text and no picture (blob, glow, divider shape).
      if (!own && !el.children.length && rr.width >= 40 && rr.height >= 40 && (!transparent(cs.backgroundColor) || cs.backgroundImage !== 'none' || cs.filter.includes('blur'))) add(el, 'shape', sid);
    }
  });

  // Flags: hints for the roaster.
  const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N} ]/gu, '').trim();
  const counts = new Map();
  for (const u of units) if (['text', 'heading', 'badge', 'quote'].includes(u.kind) && u.label) counts.set(norm(u.label), (counts.get(norm(u.label)) || 0) + 1);
  const res = patterns.map((p) => new RegExp(p, 'i'));
  units.forEach((u, i) => {
    // A short all-caps label right above a heading: the template eyebrow.
    const next = units[i + 1];
    const caps = u.label && u.label.length <= 40 && (getComputedStyle(u.el).textTransform === 'uppercase' || (u.label === u.label.toUpperCase() && /\p{L}/u.test(u.label)));
    u.eyebrow = u.kind === 'text' && caps && next && next.kind === 'heading' && next.section === u.section;
  });
  for (const u of units) {
    const f = [];
    const el = u.el;
    if (u.eyebrow) f.push('eyebrow');
    delete u.eyebrow;
    if (el.getAttribute('aria-hidden') === 'true' || el.getAttribute('role') === 'presentation' || (u.tag === 'img' && el.getAttribute('alt') === '') || u.kind === 'shape') f.push('decorative');
    if (movesEndlessly(el)) f.push('moves-endlessly');
    if (u.label && (counts.get(norm(u.label)) >= 3 || u.repeats >= 3)) f.push(u.repeats ? `repeated ×${u.repeats}` : 'repeated');
    if (/\d[\d.,]*\s*(\+|%|x\b|k\b|rb\b|ribu|juta|users|pelanggan|klien|clients|customers|tahun|years)/i.test(u.label) && !['action', 'navigation'].includes(u.kind)) f.push('number-claim');
    if (res.some((r) => r.test(u.label))) f.push('generic-copy');
    if (['action', 'icon'].includes(u.kind) && !u.label && el.closest('a, button')) f.push('no-label');
    if (/\p{Extended_Pictographic}/u.test(u.label) && u.kind !== 'action') f.push('emoji');
    // Cards that repeat their siblings' shape (icon + title + line, three times): the template row.
    if (u.kind === 'card' && el.parentElement) {
      const shape = (c) => [...c.querySelectorAll('h1, h2, h3, h4, h5, h6, p, img, svg, a, button')].filter((k) => visible(k) && (/^(IMG|svg)$/.test(k.tagName) || text(k))).map((k) => k.tagName).join();
      const twins = [...el.parentElement.children].filter((c) => c !== el && shape(c) === shape(el));
      if (twins.length >= 2) f.push('same-as-siblings');
    }
    u.flags = f;
    delete u.el;
  }
  return { title: document.title, pageHeight: document.documentElement.scrollHeight, sections, units, truncated: units.length >= 150 };
}, words);

const pad = (n) => String(n).padStart(2, '0');
data.units.forEach((u, i) => (u.id = `E${pad(i + 1)}`));

const COLOURS = { marquee: '#cf222e', disclosure: '#0969da', heading: '#1f6feb', text: '#8250df', action: '#d1242f', image: '#1a7f37', illustration: '#1a7f37', icon: '#bf8700', video: '#1a7f37', card: '#0969da', badge: '#bf3989', list: '#8250df', quote: '#8250df', navigation: '#57606a', form: '#d1242f', shape: '#cf222e' };
const drawLabels = () =>
  page.evaluate((colours) => {
    document.getElementById('dd-labels')?.remove();
    const layer = document.createElement('div');
    layer.id = 'dd-labels';
    layer.style.cssText = 'position:absolute;left:0;top:0;width:100%;pointer-events:none;z-index:2147483647';
    for (const el of document.querySelectorAll('[data-dd-el]')) {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2 || getComputedStyle(el).display === 'none') continue;
      const kind = el.getAttribute('data-dd-kind');
      const c = colours[kind] || '#d1242f';
      const box = document.createElement('div');
      box.style.cssText = `position:absolute;left:${r.left + scrollX}px;top:${r.top + scrollY}px;width:${r.width}px;height:${r.height}px;outline:2px solid ${c};outline-offset:-1px`;
      const tag = document.createElement('span');
      tag.textContent = `E${String(el.getAttribute('data-dd-el')).padStart(2, '0')}`;
      tag.style.cssText = `position:absolute;left:0;top:0;background:${c};color:#fff;font:bold 11px/1.4 monospace;padding:0 3px`;
      box.appendChild(tag);
      layer.appendChild(box);
    }
    document.body.appendChild(layer);
  }, COLOURS);
await page.evaluate((kinds) => kinds.forEach((k, i) => document.querySelector(`[data-dd-el="${i + 1}"]`)?.setAttribute('data-dd-kind', k)), data.units.map((u) => u.kind));

// Desktop: one picture per section, numbered.
await drawLabels();
const shots = [];
for (const s of data.sections) {
  const height = Math.min(Math.max(s.height, 40), 2400);
  const file = path.join(out, `desktop-${s.id}.png`);
  await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y: s.top, width: 1440, height } });
  shots.push(path.basename(file));
  s.shot = path.basename(file);
}

// Phone: the same numbers at 390px; which elements disappear.
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(600);
await scrollThrough();
const onPhone = await page.evaluate(() =>
  [...document.querySelectorAll('[data-dd-el]')].map((el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width >= 2 && r.height >= 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05;
  })
);
data.units.forEach((u, i) => {
  u.phone = onPhone[i] ? 'visible' : 'hidden';
  if (!onPhone[i]) u.flags.push('hidden-on-phone');
});
await drawLabels();
const phoneHeight = await page.evaluate(() => document.documentElement.scrollHeight);
const phoneShots = [];
for (let y = 0, i = 1; y < phoneHeight && i <= 12; y += 2400, i++) {
  const file = path.join(out, `mobile-${pad(i)}.png`);
  await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y, width: 390, height: Math.min(2400, phoneHeight - y) } });
  phoneShots.push(path.basename(file));
}
await browser.close();
await close();

const result = { url, time: new Date().toISOString(), title: data.title, pageHeight: data.pageHeight, sections: data.sections, elements: data.units, truncated: data.truncated, shots: { desktop: shots, phone: phoneShots } };
fs.writeFileSync(path.join(out, 'elements.json'), JSON.stringify(result, null, 2));

const esc = (s) => String(s || '').replace(/\|/g, '/');
const md = [
  `# Elements: ${esc(data.title)}`,
  '',
  `${data.units.length} elements in ${data.sections.length} sections${data.truncated ? ' (stopped at 150: the page has more)' : ''}. Pictures: ${shots.join(', ')}; phone: ${phoneShots.join(', ')}.`,
  'Fill the last three columns in `.design/reason.md` (rubric/reason.md). Flags are hints, not verdicts.',
  '',
  '| ID | Section | Kind | What it shows | Flags | Its job (for whom) | Lost without it | Verdict |',
  '| --- | --- | --- | --- | --- | --- | --- | --- |',
  ...data.units.map((u) => `| ${u.id} | ${u.section} | ${u.kind} | ${esc(u.label || u.inside || u.src || '(no text)')}${u.inside && u.label ? ` [${esc(u.inside)}]` : ''} ${u.rect.w}×${u.rect.h} | ${u.flags.join(', ')} |  |  |  |`),
  '',
  '## Sections',
  ...data.sections.map((s) => `- ${s.id} ${esc(s.heading)} (${s.shot})`),
];
fs.writeFileSync(path.join(out, 'elements.md'), `${md.join('\n')}\n`);

const flagged = data.units.filter((u) => u.flags.length);
console.log(`elements: ${data.units.length} in ${data.sections.length} sections → ${path.relative(process.cwd(), out)}/elements.md`);
const byFlag = {};
for (const u of flagged) for (const f of u.flags) (byFlag[f] ||= []).push(u.id);
for (const [f, ids] of Object.entries(byFlag)) console.log(`  ${f}: ${ids.slice(0, 12).join(' ')}${ids.length > 12 ? ` (+${ids.length - 12})` : ''}`);
