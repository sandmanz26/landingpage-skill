#!/usr/bin/env node
// Builds the evidence pack the jury reads instead of re-reading every screenshot
// and re-recording motion itself:
//   sheet-desktop.png, sheet-mobile.png  every captured screen on one image each
//   motion-sheet.png                     frames on load and while scrolling
//   page-text.txt                        the page's words, in order
//   evidence.json                        outline (headings, actions, prices, proof),
//                                        motion log, reduced-motion, idle navigation
//
//   node evidence.mjs <url> --dir <capture folder from inspect.mjs> [--idle 15]
import fs from 'node:fs';
import path from 'node:path';
import { launch, resolveTarget, parseArgs, gotoStable, dismissOverlays } from './lib/browser.mjs';
import { measureSmoothness } from './lib/smooth.mjs';
import { fileURLToPath } from 'node:url';

const args = parseArgs(process.argv.slice(2));
const target = args._[0];
const dir = path.resolve(args.dir || '.design/inspect');
const idleSeconds = Number(args.idle ?? 15);
if (!target) {
  console.error('Usage: node evidence.mjs <url | file> --dir <capture folder> [--idle 15]');
  process.exit(2);
}
fs.mkdirSync(dir, { recursive: true });
const { url, close } = await resolveTarget(target);
const browser = await launch();

// One image holding many screenshots, labelled, drawn by the browser itself.
async function sheet(files, columns, tileWidth, out) {
  if (!files.length) return null;
  const imgs = files.map((f) => ({ name: path.basename(f, '.png'), src: `data:image/png;base64,${fs.readFileSync(f).toString('base64')}` }));
  const html = `<html><body style="margin:0;background:#222;font:12px sans-serif;color:#fff">
    <div style="display:grid;grid-template-columns:repeat(${columns},${tileWidth}px);gap:4px;padding:4px">
    ${imgs.map((i) => `<figure style="margin:0"><img src="${i.src}" style="width:${tileWidth}px;display:block"><figcaption style="padding:2px 0">${i.name}</figcaption></figure>`).join('')}
    </div></body></html>`;
  const page = await browser.newPage({ viewport: { width: columns * (tileWidth + 4) + 4, height: 400 } });
  await page.setContent(html, { waitUntil: 'load' });
  await page.screenshot({ path: out, fullPage: true });
  await page.close();
  return path.relative(process.cwd(), out);
}

const pick = (prefix) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.startsWith(prefix) && f.endsWith('.png')).sort().map((f) => path.join(dir, f))
    : [];
const sheets = {
  desktop: await sheet([...pick('desktop-fold'), ...pick('desktop-overlay'), ...pick('desktop-page-')].slice(0, 16), 4, 340, path.join(dir, 'sheet-desktop.png')),
  mobile: await sheet([...pick('mobile-fold'), ...pick('mobile-overlay'), ...pick('mobile-page-')].slice(0, 16), 8, 160, path.join(dir, 'sheet-mobile.png')),
};

// --- live session: outline and motion
const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await context.newPage();
const load = await gotoStable(page, url, { timeout: 45000 });

const frames = [];
const frameDir = path.join(dir, 'motion-frames');
fs.mkdirSync(frameDir, { recursive: true });
const shot = async (label) => {
  const f = path.join(frameDir, `${String(frames.length).padStart(2, '0')}-${label}.png`);
  await page.screenshot({ path: f });
  frames.push(f);
};
const animations = () =>
  page.evaluate(() =>
    document.getAnimations().map((a) => {
      const t = a.effect && a.effect.target;
      const timing = a.effect ? a.effect.getComputedTiming() : {};
      const kf = a.effect && a.effect.getKeyframes ? a.effect.getKeyframes() : [];
      const props = [...new Set(kf.flatMap((k) => Object.keys(k).filter((x) => !['offset', 'computedOffset', 'easing', 'composite'].includes(x))))];
      return {
        target: t ? `${t.tagName.toLowerCase()}${t.className && typeof t.className === 'string' ? '.' + t.className.trim().split(/\s+/)[0] : ''}` : '?',
        hasText: !!(t && (t.textContent || '').trim().length > 3),
        duration: Math.round(timing.duration || 0),
        iterations: timing.iterations === Infinity ? 'infinite' : timing.iterations,
        easing: (a.effect && a.effect.getTiming().easing) || '',
        props,
        type: a.constructor.name,
      };
    })
  );

for (let i = 0; i < 5; i++) {
  await shot(`load-${i * 500}ms`);
  await page.waitForTimeout(500);
}
// Libraries are often bundled, so look inside the scripts too, not only at globals.
const libraries = await page.evaluate(async () => {
  // Module chunks loaded by import() are not in document.scripts; the resource list has them.
  const loaded = performance.getEntriesByType('resource').filter((r) => r.initiatorType === 'script' || /\.m?js(\?|$)/.test(r.name)).map((r) => r.name);
  const sources = [...new Set([...[...document.scripts].map((s) => s.src).filter(Boolean), ...loaded])].slice(0, 40);
  let code = [...document.scripts].map((s) => s.textContent || '').join('\n');
  for (const src of sources) {
    try {
      code += '\n' + (await (await fetch(src)).text());
    } catch {}
  }
  const has = (re) => re.test(code);
  return {
    // GSAP leaves _gsap on every element it animated, and ScrollTrigger leaves pin spacers.
    gsap: !!window.gsap || [...document.querySelectorAll('body *')].some((e) => e._gsap) || has(/GreenSock|gsap\.(to|from|set|timeline|registerPlugin)|_gsap/),
    scrollTrigger: !!window.ScrollTrigger || !!document.querySelector('.pin-spacer') || has(/ScrollTrigger/),
    splitText: has(/SplitText/),
    lenis: !!window.lenis || document.documentElement.classList.contains('lenis') || has(/lenis/i),
    locomotive: !!document.querySelector('[data-scroll-container]') || has(/LocomotiveScroll/),
    swiper: !!document.querySelector('.swiper') || has(/swiper/i),
    lottie: !!(window.lottie || window.bodymovin) || !!document.querySelector('lottie-player, dotlottie-player') || has(/bodymovin|lottie/i),
    framerMotion: !!document.querySelector('[data-framer-name], [data-framer-component-type]') || has(/framer-motion|motion\.div/),
    viewTransitions: has(/startViewTransition/),
  };
});
// Pop-ups seen during load stay in the frames above; close them so the outline and the scroll
// frames show the page itself.
const overlays = await dismissOverlays(page);
// Outline: what the page says and asks for, in order. Read at the top, before any
// scrolling, so positions and sticky headers are not skewed by the scroll offset.
await page.evaluate(() => window.scrollTo(0, 0));
// The words, so copy and story can be judged without squinting at screenshots.
const pageText = await page.evaluate(() => (document.body ? document.body.innerText : '').replace(/\n{3,}/g, '\n\n').slice(0, 20000));
fs.writeFileSync(path.join(dir, 'page-text.txt'), pageText);
const outline = await page.evaluate(() => {
  // Sticky panels sit wherever they are stuck (a bottom-sticky section shows up "on the first
  // screen" under the one covering it): measure document order with sticky turned off.
  const stickies = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'sticky');
  for (const e of stickies) {
    // Only a bar stays in view; a full-screen sticky panel gets covered by the next one.
    e.__ddSticky = e.getBoundingClientRect().height < innerHeight * 0.4;
    e.__ddPos = e.style.position;
    e.style.position = 'static';
  }
  const H = document.documentElement.scrollHeight || 1;
  const t = (e) => (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim();
  const at = (e) => Math.round(((e.getBoundingClientRect().top + scrollY) / H) * 100);
  const visible = (e) => {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none';
  };
  const stuck = (e) => {
    for (let x = e; x; x = x.parentElement) if (x.__ddSticky || (getComputedStyle(x).position === 'fixed' && x.getBoundingClientRect().height < innerHeight * 0.4)) return true;
    return false;
  };
  const headings = [...document.querySelectorAll('h1, h2, h3')].filter(visible).map((h) => `${h.tagName} ${at(h)}% ${t(h).slice(0, 90)}`).slice(0, 40);
  const buttons = [...document.querySelectorAll('a, button')].filter(visible).filter((b) => {
    // The fill is often painted by a child or a pseudo-element (Tailwind "group" buttons).
    const r = b.getBoundingClientRect();
    const painted = (cs) => parseFloat(cs.borderTopWidth) > 0 || !/rgba\(0, 0, 0, 0\)|transparent/.test(cs.backgroundColor) || cs.backgroundImage !== 'none';
    const fillsIt = (e) => {
      const q = e.getBoundingClientRect();
      return q.width * q.height >= 0.6 * r.width * r.height;
    };
    const looksLikeButton =
      b.tagName === 'BUTTON' ||
      /btn|button|cta/i.test(String(b.className)) ||
      painted(getComputedStyle(b)) ||
      painted(getComputedStyle(b, '::before')) ||
      painted(getComputedStyle(b, '::after')) ||
      [...b.querySelectorAll('*')].slice(0, 12).some((c) => c.tagName !== 'IMG' && fillsIt(c) && painted(getComputedStyle(c)));
    return t(b) && t(b).length < 40 && looksLikeButton;
  });
  const actions = {};
  for (const b of buttons) {
    const k = t(b);
    const top = b.getBoundingClientRect().top + scrollY;
    actions[k] = actions[k] || { label: k, count: 0, firstAt: at(b), firstScreen: top < innerHeight, sticky: false };
    actions[k].count++;
    actions[k].sticky = actions[k].sticky || stuck(b);
  }
  const body = document.body ? document.body.innerText : '';
  const prices = [...new Set(body.match(/(Rp\.?\s?\d[\d.,]*|[$€£]\s?\d[\d.,]*(\s?(k|K|M|\/mo|\/month|per month))?)/g) || [])].slice(0, 12);
  const proofWords = ['testimonial', 'review', 'rating', 'stars', 'trusted', 'customers', 'clients', 'case study', 'ulasan', 'pelanggan'];
  const lower = body.toLowerCase();
  for (const e of stickies) e.style.position = e.__ddPos;
  return {
    title: document.title,
    description: (document.querySelector('meta[name="description"]') || {}).content || '',
    headings,
    actions: Object.values(actions).sort((a, b) => a.firstAt - b.firstAt).slice(0, 20),
    prices,
    proofMentions: Object.fromEntries(proofWords.map((w) => [w, lower.split(w).length - 1]).filter(([, n]) => n > 0)),
    logoImages: [...document.querySelectorAll('img')].filter((i) => /logo/i.test((i.alt || '') + (i.src || ''))).length,
    forms: document.querySelectorAll('form').length,
    pageHeight: H,
  };
});

// Scroll devices built without a library: full-screen sticky panels that stack or uncover
// each other (a "curtain" reveal) are pure CSS and never show up as a library.
const stickyPanels = await page.evaluate(() =>
  [...document.querySelectorAll('body *')]
    .filter((e) => getComputedStyle(e).position === 'sticky' && e.getBoundingClientRect().height >= innerHeight * 0.6)
    .map((e) => ({ tag: e.tagName.toLowerCase(), edge: getComputedStyle(e).top !== 'auto' ? 'top' : 'bottom', zIndex: getComputedStyle(e).zIndex }))
);
// Script-driven motion (GSAP and the like) never shows up in getAnimations(): watch
// where elements actually are instead.
const moverProbe = () =>
  page.evaluate(() => {
    const out = {};
    let i = 0;
    for (const el of document.querySelectorAll('body *')) {
      if (i++ > 4000) break;
      const cs = getComputedStyle(el);
      if (cs.display === 'none') continue;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.bottom < -200 || r.top > innerHeight + 200) continue;
      if (!el.__ddM) el.__ddM = Math.random().toString(36).slice(2);
      out[el.__ddM] = `${cs.transform}|${cs.opacity}|${Math.round(r.left)},${Math.round(r.top + scrollY)}`;
    }
    return out;
  });
const movedBetween = (a, b) => Object.keys(a).filter((k) => k in b && a[k] !== b[k]).length;
const idleA = await moverProbe();
await page.waitForTimeout(600);
const idleB = await moverProbe();
const movingWithoutInput = movedBetween(idleA, idleB);
const scrollSteps = [];
await page.mouse.move(300, 300);
for (let i = 0; i < 10; i++) {
  const before = await moverProbe();
  await page.mouse.wheel(0, 450);
  await page.waitForTimeout(160);
  const anims = await animations();
  const after = await moverProbe();
  if (i % 2 === 0) await shot(`scroll-${(i + 1) * 450}px`);
  // Elements whose transform or opacity changed: the page scroll itself only moves positions.
  const changed = Object.keys(before).filter((k) => k in after && before[k].split('|').slice(0, 2).join('|') !== after[k].split('|').slice(0, 2).join('|')).length;
  // Every other step, hold still: anything still changing here moves with no input
  // (marquees and carousels further down the page, not only at the top).
  let idle = null;
  if (i % 2 === 1) {
    await page.waitForTimeout(400);
    const x = await moverProbe();
    await page.waitForTimeout(700);
    const z = await moverProbe();
    idle = Object.keys(x).filter((k) => k in z && x[k].split('|').slice(0, 2).join('|') !== z[k].split('|').slice(0, 2).join('|')).length;
  }
  scrollSteps.push({ y: await page.evaluate(() => Math.round(scrollY)), running: anims.length, scriptDriven: changed, idleMoving: idle, sample: anims.slice(0, 6) });
}
const idleAlongPage = scrollSteps.filter((s) => s.idleMoving).map((s) => ({ y: s.y, moving: s.idleMoving }));
const all = scrollSteps.flatMap((s) => s.sample);
const loops = all.filter((a) => a.iterations === 'infinite');
const pauseControl = await page.evaluate(() =>
  [...document.querySelectorAll('button, [role="button"]')].some((b) => /pause|stop|jeda/i.test((b.getAttribute('aria-label') || '') + ' ' + (b.textContent || '')))
);

await context.close();

// Idle and reduced motion, each on a fresh load before any input (scrolling can
// cancel an idle timer): does the page change URL by itself, and what still moves
// when the visitor asks for less motion?
async function idleRun(reducedMotion) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion });
  const p = await ctx.newPage();
  const loaded = await gotoStable(p, url, { timeout: 45000 });
  // Closing a pop-up through a bare "#" link must not count as navigating.
  const bare = (u) => u.replace(/#$/, '');
  const start = bare(p.url());
  await p.waitForTimeout(1500);
  await dismissOverlays(p);
  const probe = () =>
    p.evaluate(() => {
      const out = {};
      let i = 0;
      for (const el of document.querySelectorAll('body *')) {
        if (i++ > 4000) break;
        const cs = getComputedStyle(el);
        if (cs.display === 'none') continue;
        if (!el.__ddM) el.__ddM = Math.random().toString(36).slice(2);
        out[el.__ddM] = `${cs.transform}|${cs.opacity}`;
      }
      return out;
    });
  const a = await probe();
  await p.waitForTimeout(800);
  const b = await probe().catch(() => ({}));
  const moving = Object.keys(a).filter((k) => k in b && a[k] !== b[k]).length;
  let scrollMoving = 0;
  if (reducedMotion === 'reduce') {
    for (let i = 0; i < 6; i++) {
      const x = await probe().catch(() => ({}));
      await p.mouse.wheel(0, 450);
      await p.waitForTimeout(160);
      const y = await probe().catch(() => ({}));
      scrollMoving = Math.max(scrollMoving, Object.keys(x).filter((k) => k in y && x[k] !== y[k]).length);
    }
    await p.evaluate(() => window.scrollTo(0, 0)).catch(() => {});
  }
  await p.waitForTimeout(idleSeconds * 1000);
  const navigated = bare(p.url()) !== start ? p.url() : null;
  await ctx.close();
  return { movingWithoutInput: moving, movingOnScroll: scrollMoving, navigatedTo: navigated, loadFailed: !!loaded.failed };
}
// Stutter while scrolling, beside a plain page measured on the same machine.
const plain = await resolveTarget(path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'evals/fixtures/clean.html'));
const smoothBaseline = await measureSmoothness(browser, plain.url);
await plain.close();
const smoothPage = await measureSmoothness(browser, url);
const smoothness = { page: smoothPage, baseline: smoothBaseline, longFramesOverBaseline: smoothPage.longFrames - smoothBaseline.longFrames, p95OverBaseline: Math.round((smoothPage.p95Ms - smoothBaseline.p95Ms) * 10) / 10 };
const normalIdle = await idleRun('no-preference');
const reducedIdle = await idleRun('reduce');
const idleNavigation = normalIdle.navigatedTo ? { navigatedTo: normalIdle.navigatedTo, afterSeconds: idleSeconds } : null;

const motionSheet = await sheet(frames, 4, 340, path.join(dir, 'motion-sheet.png'));
await browser.close();
await close();

const durations = all.map((a) => a.duration).filter((d) => d > 0);
const evidence = {
  url,
  time: new Date().toISOString(),
  sheets: { ...sheets, motion: motionSheet },
  load: { status: load.status, retries: load.retries, failed: !!load.failed },
  overlaysDismissed: overlays,
  outline,
  motion: {
    libraries,
    stickyPanels,
    maxRunning: Math.max(0, ...scrollSteps.map((s) => s.running)),
    durationsMs: durations.length ? { min: Math.min(...durations), max: Math.max(...durations) } : null,
    easings: [...new Set(all.map((a) => a.easing).filter(Boolean))].slice(0, 6),
    properties: [...new Set(all.flatMap((a) => a.props))].slice(0, 12),
    movingWithoutInput,
    movingWithoutInputFurtherDown: idleAlongPage,
    scriptDrivenOnScroll: Math.max(0, ...scrollSteps.map((s) => s.scriptDriven)),
    infiniteLoops: loops.length,
    infiniteLoopsWithText: loops.filter((a) => a.hasText).length,
    pauseControl,
    steps: scrollSteps,
  },
  smoothness,
  reducedMotion: { movingWithoutInput: reducedIdle.movingWithoutInput, movingOnScroll: reducedIdle.movingOnScroll, idleNavigation: reducedIdle.navigatedTo, loadFailed: reducedIdle.loadFailed },
  idleRunLoadFailed: normalIdle.loadFailed,
  idleNavigation,
};
fs.writeFileSync(path.join(dir, 'evidence.json'), JSON.stringify(evidence, null, 2));

const flags = [];
if (load.failed) flags.push('the page did not load (server error after 3 tries): this evidence describes an error page');
if (normalIdle.loadFailed || reducedIdle.loadFailed) flags.push(`the ${[normalIdle.loadFailed && 'idle', reducedIdle.loadFailed && 'reduced-motion'].filter(Boolean).join(' and ')} run loaded an error page: its results mean nothing, capture again`);
if (stickyPanels.length >= 2) flags.push(`${stickyPanels.length} full-screen sticky panels: a CSS scroll device (stacking or curtain reveal) even with no scroll library`);
if (smoothness.longFramesOverBaseline >= 5) flags.push(`stutters while scrolling: ${smoothPage.longFrames} long frames (>50 ms) vs ${smoothBaseline.longFrames} on a plain page, p95 ${smoothPage.p95Ms} ms`);
if (overlays.length) flags.push(`pop-up or banner on load, closed for the outline: ${overlays.join(', ')}`);
if (idleNavigation) flags.push(`page navigates by itself after ${idleSeconds}s idle → ${idleNavigation.navigatedTo}`);
if (reducedIdle.navigatedTo) flags.push('navigates by itself under reduced motion too');
if (reducedIdle.movingWithoutInput + reducedIdle.movingOnScroll > 0)
  flags.push(`under reduced motion ${reducedIdle.movingWithoutInput} elements still move on their own and ${reducedIdle.movingOnScroll} move with the scroll`);
if (movingWithoutInput > 0) flags.push(`${movingWithoutInput} elements move with no input at the top (loops, marquees, auto-play)`);
if (idleAlongPage.length) flags.push(`elements keep moving with no input further down at ${idleAlongPage.map((s) => `${s.y}px (${s.moving})`).join(', ')}${pauseControl ? '' : '; no pause control found'}`);
if (evidence.motion.infiniteLoopsWithText && !pauseControl) flags.push('endless moving text with no pause control');
if (!outline.actions.some((a) => a.firstScreen)) flags.push('no styled action in the first screen');
if (!outline.prices.length) flags.push('no price on the page');
console.log(`evidence: ${path.relative(process.cwd(), path.join(dir, 'evidence.json'))}`);
console.log(`  sheets: ${Object.values(evidence.sheets).filter(Boolean).join(', ')}`);
console.log(`  libraries: ${Object.entries(libraries).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none detected'}`);
console.log(`  actions: ${outline.actions.slice(0, 5).map((a) => `"${a.label}" ×${a.count} @${a.firstAt}%${a.sticky ? ' sticky' : ''}`).join(' · ')}`);
for (const f of flags) console.log(`  FLAG ${f}`);
