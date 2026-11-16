#!/usr/bin/env node
// The floor: what every delivered page has, measured (rules/floor.md). It comes from the owner's
// verdict on the blind test of 2026-11-12, where five pages passed every other check and were all
// rejected: flat rectangles, too little content, no interaction, a monotonous layout with no brand
// in it, and the facts a visitor needs missing.
//
//   node floor.mjs <url or file> [--brief .design/brief.md] [--out .design/inspect/floor.json] [--type page|type]
//
// Seven measures, each with its number and its floor. A miss is fixed, or answered with a reason in
// .design/critique.md → "## Floor" (progress.mjs done gate). Exit 1 when anything is missed.
import fs from 'node:fs';
import path from 'node:path';
import { launch, resolveTarget, parseArgs } from './lib/browser.mjs';

// Rows of the brief's "## Visitor facts" table: | Fact | Value | On the page |. A fact with a value
// must be on the page, marked data-fact="<id>" (the id is the fact's first word, lower case).
export function visitorFacts(brief) {
  const m = /^##\s*(Visitor facts|Fakta pengunjung)\b[^\n]*\n([\s\S]*?)(?=^##\s|\s*$(?![\s\S]))/im.exec(brief || '');
  if (!m) return null;
  const rows = [];
  for (const line of m[2].split('\n')) {
    if (!line.trim().startsWith('|')) continue;
    const c = line.trim().replace(/^\||\|$/g, '').split('|').map((x) => x.trim());
    if (c.length < 2 || /^-+$/.test(c[0].replace(/[: ]/g, '')) || /^(fact|fakta)$/i.test(c[0])) continue;
    const id = (/\(([a-z][a-z0-9-]*)\)/.exec(c[0]) || [null, c[0].toLowerCase().split(/[^a-z0-9]+/).filter(Boolean)[0] || ''])[1];
    const value = c[1] || '';
    const absent = !value || /^(n\/a|-|tidak ada|none|not applicable)\b/i.test(value);
    rows.push({ id, fact: c[0], value, needed: !absent });
  }
  return rows;
}

export const FLOORS = { words: 300, sections: 7, navLinks: 3, interactions: 2, shapeShare: 0.6, layouts: 4, repeatRun: 2, brandShare: 0.7, picturesPerSection: 0.5, facts: 6,
  // By dial (rules/composition.md, rules/visual-dials.md): how much of the page leaves the plain row-and-column arrangement, and how far the brand reaches.
  composedShare: { grid: 0, composed: 0.4, wild: 0.6 }, brandShareBasic: 0.4 };

// Runs in the page. Sections are the blocks a visitor would call "parts of the page".
const measure = () => {
  const vw = innerWidth;
  const vis = (e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 1 && r.height > 1 && cs.display !== 'none' && cs.visibility !== 'hidden' && Number(cs.opacity) > 0.05; };
  const docTop = (e) => e.getBoundingClientRect().top + scrollY;
  // Sections: children of <main> (or body), descending through single wrappers and through blocks taller than 2.2 screens.
  let root = document.querySelector('main') || document.body;
  const wide = (e) => e.getBoundingClientRect().width >= vw * 0.6;
  const kids = (e) => [...e.children].filter((c) => vis(c) && wide(c) && !['SCRIPT', 'STYLE', 'NOSCRIPT'].includes(c.tagName) && c.getBoundingClientRect().height >= 120);
  for (let i = 0; i < 4 && kids(root).length === 1; i++) root = kids(root)[0];
  let sections = [];
  const collect = (e, depth) => {
    for (const c of kids(e)) {
      const h = c.getBoundingClientRect().height;
      if (h > innerHeight * 2.2 && depth < 3 && kids(c).length >= 2) collect(c, depth + 1);
      else sections.push(c);
    }
  };
  collect(root, 0);
  // The navigation and the footer are checked for being there; the shares below count the content sections.
  sections = sections.filter((s) => !['NAV', 'FOOTER'].includes(s.tagName)).sort((a, b) => docTop(a) - docTop(b));

  // 1. Content.
  const text = (document.querySelector('main') || document.body).innerText || '';
  const words = text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
  const nav = document.querySelector('nav, header [role="navigation"]');
  const navLinks = nav ? [...nav.querySelectorAll('a, button')].filter(vis).length : [...document.querySelectorAll('header a')].filter(vis).length;
  const footer = document.querySelector('footer');
  const footerWords = footer ? (footer.innerText || '').split(/\s+/).filter(Boolean).length : 0;

  // 2. Interaction: things the visitor operates that are not a plain link or the one action.
  const kinds = new Set();
  const count = (sel, kind) => { const n = [...document.querySelectorAll(sel)].filter(vis).length; if (n) kinds.add(kind); return n; };
  const interactions = {
    disclosure: count('[aria-expanded], details > summary', 'open-close'),
    tabs: count('[role="tab"], [role="radio"], input[type="radio"]', 'choose'),
    range: count('input[type="range"], [role="slider"]', 'slide'),
    form: count('form input:not([type="hidden"]):not([type="radio"]), form select, form textarea', 'fill-in'),
    carousel: count('[aria-roledescription="carousel"], [data-carousel], .swiper, [role="tabpanel"]', 'browse'),
    reveal: count('[data-interaction], [data-reveal], [data-flip], [data-compare]', 'reveal'),
    map: count('[data-map], iframe[src*="map"], iframe[src*="maps"]', 'map'),
    media: count('video[controls], audio[controls]', 'play'),
  };
  const scrollDriven = document.querySelectorAll('[data-progress], [data-enter]').length + [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().height > 120 && e.tagName !== 'HEADER' && e.tagName !== 'NAV').length;
  if (scrollDriven) kinds.add('scroll');

  // Per section: shape and depth, layout, brand, pictures.
  const rectOf = (e) => e.getBoundingClientRect();
  const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  const per = sections.map((s) => {
    const sr = rectOf(s);
    const els = [...s.querySelectorAll('*')].filter((e) => { const r = rectOf(e); return r.width >= 64 && r.height >= 64 && vis(e); }).slice(0, 400);
    const pictures = els.filter((e) => (e.tagName === 'IMG' || e.tagName === 'VIDEO' || e.tagName === 'CANVAS' || (e.tagName === 'svg' && !e.closest('button, a')) || (e.tagName === 'PICTURE')) && rectOf(e).width >= 120 && rectOf(e).height >= 90 && !e.parentElement.closest('svg')).filter((e, i, arr) => !arr.some((o) => o !== e && o.contains(e)));
    const bgPictures = els.filter((e) => /url\(/.test(getComputedStyle(e).backgroundImage)).length;
    const cues = new Set();
    for (const e of els) {
      const cs = getComputedStyle(e);
      const r = rectOf(e);
      const small = Math.min(r.width, r.height);
      const radius = parseFloat(cs.borderTopLeftRadius) || 0;
      const isControl = e.matches('a, button, input, select, textarea, label, [role="button"]');
      if (cs.clipPath && cs.clipPath !== 'none') cues.add('cut shape');
      if ((cs.maskImage && cs.maskImage !== 'none') || (cs.webkitMaskImage && cs.webkitMaskImage !== 'none')) cues.add('mask');
      if (!isControl && small >= 96 && (radius >= small * 0.3 || /%/.test(cs.borderTopLeftRadius) && parseFloat(cs.borderTopLeftRadius) >= 30) && (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || /url\(|gradient/.test(cs.backgroundImage) || ['IMG', 'VIDEO'].includes(e.tagName) || cs.overflow !== 'visible')) cues.add('round or arched shape');
      if (cs.transform && cs.transform !== 'none') { const m = /matrix\(([^)]+)\)/.exec(cs.transform); if (m) { const [a, b] = m[1].split(',').map(Number); if (Math.abs(Math.atan2(b, a)) > 0.02) cues.add('turned element'); } }
      // Breaking the frame: a picture or shape that leaves its section, or crosses the edge of the page column.
      if ((r.top < sr.top - 12 || r.bottom > sr.bottom + 12) && !['fixed', 'sticky'].includes(cs.position) && small >= 96) cues.add('breaks its section');
    }
    // Layering: two pictures or filled shapes that overlap without one containing the other.
    const layers = els.filter((e) => { const cs = getComputedStyle(e); return ['IMG', 'svg', 'VIDEO'].includes(e.tagName) || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && e.children.length < 6) || cs.position === 'absolute'; }).slice(0, 60);
    let layered = false;
    for (let i = 0; i < layers.length && !layered; i++) for (let j = i + 1; j < layers.length; j++) {
      const a = layers[i]; const b = layers[j];
      if (a.contains(b) || b.contains(a)) continue;
      const ra = rectOf(a); const rb = rectOf(b);
      const o = overlap(ra, rb);
      if (o > 2500 && o < ra.width * ra.height * 0.98 && o < rb.width * rb.height * 0.98) { layered = true; break; }
    }
    if (layered) cues.add('overlapping layers');
    // Composition (rules/composition.md): what takes a section out of equal rows and columns.
    const comp = new Set();
    if (layered) comp.add('overlap');
    if (cues.has('breaks its section')) comp.add('leaves its frame');
    if (cues.has('turned element')) comp.add('turned');
    const picBoxes = pictures.map(rectOf).filter((r) => r.width >= 120 && r.height >= 90);
    if (picBoxes.length >= 2) {
      const areas = picBoxes.map((r) => r.width * r.height);
      if (Math.max(...areas) / Math.min(...areas) >= 3) comp.add('scale contrast');
      // Staggered: two pictures that share a horizontal band but start at clearly different heights.
      let stag = false;
      for (let i = 0; i < picBoxes.length && !stag; i++) for (let j = i + 1; j < picBoxes.length; j++) {
        const a = picBoxes[i]; const b = picBoxes[j];
        const sideBySide = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 40 && (a.right <= b.left + 8 || b.right <= a.left + 8);
        if (sideBySide && Math.abs(a.top - b.top) >= 48) { stag = true; break; }
      }
      if (stag) comp.add('staggered');
    }
    // Type over a picture: a large line of text that crosses a picture's box.
    for (const t of s.querySelectorAll('h1, h2, h3, p, span, strong, em')) {
      const cs = getComputedStyle(t);
      if (parseFloat(cs.fontSize) < 40 || !vis(t) || t.closest('figure figcaption')) continue;
      const tr = rectOf(t);
      if (pictures.some((pic) => { if (pic.contains(t) || t.contains(pic)) return false; const o = overlap(tr, rectOf(pic)); return o > tr.width * tr.height * 0.15 && o > 3000; })) { comp.add('type over picture'); break; }
    }
    if (s.matches('[data-progress="pin"]') || s.querySelector('[data-progress="pin"], [data-track]')) comp.add('pinned or sideways');
    const drawn = [...s.querySelectorAll('svg')].filter((v) => rectOf(v).width >= 120 && v.querySelectorAll('path, circle, ellipse, polygon').length >= 3 && !v.closest('button, a')).length;
    if (drawn) cues.add('drawing');
    // Layout signature: how many columns the content starts in, where it is aligned, whether it holds a picture, whether it has its own ground.
    const blocks = [...s.querySelectorAll('h1, h2, h3, p, li, figure, img, svg, form, table, blockquote')].filter((e) => vis(e) && rectOf(e).width >= 60 && !e.parentElement.closest('figure, svg, li, blockquote, table'));
    const starts = [...new Set(blocks.map((e) => Math.round(rectOf(e).left / (vw / 12))))];
    const heading = s.querySelector('h1, h2, h3');
    const align = heading ? getComputedStyle(heading).textAlign.replace('start', 'left') : 'none';
    const bg = getComputedStyle(s).backgroundColor;
    return {
      top: Math.round(docTop(s)), height: Math.round(sr.height), heading: heading ? (heading.innerText || '').trim().slice(0, 50) : '',
      cues: [...cues], composed: [...comp], pictures: pictures.length + (bgPictures ? 1 : 0),
      layout: `${Math.min(4, starts.length)}col·${align}·${pictures.length ? 'pic' : 'text'}`, ground: bg !== 'rgba(0, 0, 0, 0)',
      brand: [...new Set([...s.querySelectorAll('[data-brand]'), ...(s.matches('[data-brand]') ? [s] : [])].map((e) => e.getAttribute('data-brand')).filter(Boolean))],
    };
  });
  const facts = [...new Set([...document.querySelectorAll('[data-fact]')].filter(vis).map((e) => e.getAttribute('data-fact').toLowerCase()))];
  return { words, navLinks, hasNav: !!nav, hasFooter: !!footer, footerWords, interactions, kinds: [...kinds], sections: per, facts, height: document.documentElement.scrollHeight };
};

export function judge(m, { facts = null, type = 'page', layout = 'composed', brand = 'strong' } = {}) {
  const F = FLOORS;
  const rows = [];
  const add = (id, name, got, floor, ok, fix, source) => rows.push({ id, name, got, floor, ok, fix, source });
  const n = m.sections.length;
  add('content', 'Enough content to be a real page', `${m.words} words, ${n} sections, ${m.hasNav ? `navigation with ${m.navLinks} links` : 'no navigation'}, ${m.hasFooter ? `footer with ${m.footerWords} words` : 'no footer'}`,
    `${F.words}+ words, ${F.sections}+ sections, navigation with ${F.navLinks}+ links, a footer with contact`,
    m.words >= F.words && n >= F.sections && m.hasNav && m.navLinks >= F.navLinks && m.hasFooter && m.footerWords >= 8,
    'Add the sections a visitor expects from this kind of business (what it is, the offer in full, how it works, the place and hours, the people, proof, questions, contact), a navigation bar and a footer with contact and hours',
    'owner 2: "content terlalu sedikit sehingga nampak seperti lo fidelity"');
  if (facts === null) add('facts', 'The facts a visitor needs', 'the brief has no "## Visitor facts" table', `${F.facts}+ facts listed in the brief, each one on the page`, false, 'Write "## Visitor facts" in .design/brief.md (rules/floor.md → Facts) and mark each on the page with data-fact="<id>"', 'owner 5: "fasilitas, jam operational dll tidak tersampaikan"');
  else {
    const needed = facts.filter((f) => f.needed);
    const missing = needed.filter((f) => !m.facts.includes(f.id));
    add('facts', 'The facts a visitor needs', `${needed.length - missing.length} of ${needed.length} facts on the page${missing.length ? ` (missing: ${missing.map((f) => f.id).join(', ')})` : ''}; ${facts.length} listed`,
      `${F.facts}+ facts listed, every one with a value on the page (data-fact)`, facts.length >= F.facts && !missing.length,
      'Put each missing fact where a visitor looks for it (hours and address near the action and in the footer; facilities in their own section) and mark it data-fact="<id>"', 'owner 5');
  }
  add('interaction', 'Something to operate', `${m.kinds.length} kind(s): ${m.kinds.join(', ') || 'none'}`, `${F.interactions}+ kinds of interaction with a purpose, one of them operated by the visitor (not only scroll)`,
    m.kinds.length >= F.interactions && m.kinds.some((k) => k !== 'scroll'),
    'Add interactions from the subject (motion.mjs list, kit.mjs list): a schedule or price the visitor sets, a card that reveals the result, steps that build on scroll; each with its purpose in the spec', 'owner 3: "tidak ada interaksi experience"');
  const shaped = m.sections.filter((s) => s.cues.length).length;
  add('shape', 'Shape and depth, not flat rectangles', `${shaped} of ${n} sections have a shape or depth cue (${[...new Set(m.sections.flatMap((s) => s.cues))].join(', ') || 'none'})`,
    `${Math.round(F.shapeShare * 100)}% of sections with at least one: a round, arched or cut shape, a turned element, overlapping layers, something that breaks its frame, a drawing (a shadow on a rectangle does not count)`,
    n > 0 && shaped / n >= F.shapeShare,
    'Use the brand kit\'s shape language in every section: frames that are not rectangles, pictures that overlap or leave their frame, layers, a drawn object; rectangles in a row are the failure', 'owner 1: "semua element terasa flat, permainan rectangle tidak menarik"');
  const sigs = m.sections.map((s) => s.layout);
  let run = 1; let worst = 1;
  for (let i = 1; i < sigs.length; i++) { run = sigs[i] === sigs[i - 1] ? run + 1 : 1; worst = Math.max(worst, run); }
  const distinct = new Set(sigs).size;
  add('layout', 'A layout that changes', `${distinct} different section layouts in ${n} sections; the same layout up to ${worst} times in a row`, `${F.layouts}+ different layouts, the same one at most ${F.repeatRun} times in a row`,
    distinct >= Math.min(F.layouts, Math.max(1, n - 1)) && worst <= F.repeatRun,
    'Give each section its own composition (split, full-bleed picture, list beside a sticky picture, statement, grid, table): change the columns, the alignment, the ground and where the picture sits', 'owner 4: "layout terasa flat dan monoton"');
  const wantComposed = F.composedShare[layout] ?? F.composedShare.composed;
  const composed = m.sections.filter((s) => (s.composed || []).length).length;
  if (wantComposed > 0) add('composition', 'Composed, not only rows and columns', `${composed} of ${n} sections are composed (${[...new Set(m.sections.flatMap((s) => s.composed || []))].join(', ') || 'none'}); layout dial "${layout}"`,
    `${Math.round(wantComposed * 100)}% of sections with at least one: pictures at clearly different scales, staggered pictures, overlap, something that leaves its frame, a turned element, large type over a picture, a pinned or sideways chapter`,
    n > 0 && composed / n >= wantComposed,
    'Rebuild sections with the compositions of rules/composition.md (scale-scatter, offset-pair, type-over-picture, window-open, checker-fields, stepped-drift…): equal cards in a row are the generic layout the owner rejected', 'owner 2026-11-16: "terpaku pada aturan row column… harus lebih wild secara layout"');
  const branded = m.sections.filter((s) => s.brand.length).length;
  const wantBrand = brand === 'basic' ? F.brandShareBasic : F.brandShare;
  add('brand', 'The brand in every section', `${branded} of ${n} sections carry a brand element (data-brand: ${[...new Set(m.sections.flatMap((s) => s.brand))].join(', ') || 'none'}); brand dial "${brand}"`, `${Math.round(wantBrand * 100)}% of sections carry an element of the brand kit, marked data-brand="<element>"`,
    n > 0 && branded / n >= wantBrand,
    'Carry the brand kit\'s hero and supporting elements into every section, the price, the questions and the footer included, and mark each use data-brand="<element name>" (brand/method.md → Rules of use)', 'owner 4: "saya tidak mendapatkan esensi brand"');
  const pics = m.sections.reduce((a, s) => a + s.pictures, 0);
  if (type !== 'type') add('pictures', 'Pictures down the page', `${pics} picture(s) in ${n} sections`, `at least one picture for every two sections (photographs, drawings or designed placeholders)`, n > 0 && pics / n >= F.picturesPerSection,
    'Add pictures by the path chosen at the brief (rules/illustration.md): photographs that pass the quality bar, designed placeholders (placeholder.mjs), drawings of the subject', 'owner 2026-11-12: "perbedaan besar ketika ada image or not"');
  return { rows, missed: rows.filter((r) => !r.ok).length };
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  const target = args._[0];
  if (!target) {
    console.error('Usage: node floor.mjs <url or file> [--brief .design/brief.md] [--out .design/inspect/floor.json] [--type page|type] [--layout grid|composed|wild] [--brand basic|strong]');
    process.exit(2);
  }
  const briefPath = args.brief || (fs.existsSync('.design/brief.md') ? '.design/brief.md' : null);
  const facts = briefPath && fs.existsSync(briefPath) ? visitorFacts(fs.readFileSync(briefPath, 'utf8')) : null;
  const { url, close } = await resolveTarget(target);
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(url, { waitUntil: 'load', timeout: 45000 }).catch(() => {});
  // Walk the page once so content revealed on entry is there to be measured.
  const h = await page.evaluate(() => document.documentElement.scrollHeight).catch(() => 900);
  for (let y = 0; y < Math.min(h, 30000); y += 700) { await page.evaluate((v) => scrollTo(0, v), y); await page.waitForTimeout(90); }
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForTimeout(400);
  const m = await page.evaluate(measure);
  await browser.close();
  await close();
  const type = args.type || (fs.existsSync('.design/targets.json') && /"imagery"\s*:\s*"type"/.test(fs.readFileSync('.design/targets.json', 'utf8')) ? 'type' : 'page');
  const dial = (k, d) => { try { const t = JSON.parse(fs.readFileSync(args.targets || '.design/targets.json', 'utf8')); return t[k] || d; } catch { return d; } };
  const layout = args.layout || dial('layout', 'composed');
  const brand = args.brand || dial('brand', 'strong');
  const { rows, missed } = judge(m, { facts, type, layout, brand });
  const report = { target, time: new Date().toISOString(), brief: briefPath, dials: { layout, brand, type }, floors: FLOORS, measured: m, rows, missed };
  const out = args.out || (fs.existsSync('.design') ? '.design/inspect/floor.json' : null);
  if (out) { fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true }); fs.writeFileSync(out, JSON.stringify(report, null, 2)); }
  console.log(`floor: ${rows.length - missed} of ${rows.length} met${out ? ` → ${out}` : ''}`);
  for (const r of rows) console.log(`  ${r.ok ? 'ok  ' : 'MISS'} ${r.name}: ${r.got}${r.ok ? '' : `\n       floor: ${r.floor}\n       fix:   ${r.fix}`}`);
  if (args.sections) for (const s of m.sections) console.log(`    · ${String(s.top).padStart(5)}px ${s.layout.padEnd(28)} cues: ${s.cues.join(', ') || '-'} · composed: ${(s.composed || []).join(', ') || '-'} · pictures ${s.pictures} · "${s.heading}"`);
  process.exit(missed ? 1 : 0);
}
