#!/usr/bin/env node
// The fast read of a reference: one browser pass inside a time budget, for when the team wants a
// site's style or one element (library/intake.md → Three depths). It keeps what the long capture
// did not: HOW the page moves (what, on which trigger, how long, which easing), so a motion seen in
// a reference can be written down as a recipe and used again (motion/recipes.json).
//
//   node read.mjs <url or file> [--out data/references/captures/<id>] [--budget 90] [--frames 10]
//
// Writes read.json (facts), read.md (the short digest a reader starts from), read-sheet.png (the
// first screen while loading, the page while scrolling, the phone) and the frames in read-frames/.
// It measures; it does not judge. No scores come out of it.
import fs from 'node:fs';
import path from 'node:path';
import { launch, resolveTarget, parseArgs, dismissOverlays } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const target = args._[0];
if (!target) {
  console.error('Usage: node read.mjs <url or file> [--out dir] [--budget 90] [--frames 10]');
  process.exit(2);
}
const out = path.resolve(args.out || '.design/read');
const framesDir = path.join(out, 'read-frames');
fs.mkdirSync(framesDir, { recursive: true });
const BUDGET = Math.max(30, Number(args.budget || 90)) * 1000;
const FRAMES = Math.min(16, Math.max(4, Number(args.frames || 10)));
const started = Date.now();
const left = () => BUDGET - (Date.now() - started);
const read = { url: target, readAt: new Date().toISOString(), budgetSeconds: BUDGET / 1000, notDone: [], load: [], scroll: [], motion: {}, hover: [], phone: null };
const shots = [];
const shot = async (page, name, label) => {
  const file = path.join(framesDir, `${name}.jpg`);
  await page.screenshot({ path: file, type: 'jpeg', quality: 62 }).catch(() => {});
  if (fs.existsSync(file)) shots.push({ file, label });
};

// What is declared: libraries, canvases, running animations, keyframes and transitions in the CSS.
const declared = () => {
  const w = window;
  const libs = {
    gsap: !!w.gsap, scrollTrigger: !!(w.ScrollTrigger || (w.gsap && w.gsap.plugins && w.gsap.plugins.scrollTrigger)), lenis: !!(w.Lenis || w.lenis || document.documentElement.classList.contains('lenis')),
    locomotive: !!(w.LocomotiveScroll || document.querySelector('[data-scroll-container]')), swiper: !!(w.Swiper || document.querySelector('.swiper')), lottie: !!(w.lottie || w.bodymovin || document.querySelector('lottie-player, dotlottie-player')),
    three: !!w.THREE, pixi: !!w.PIXI, barba: !!w.barba, framerMotion: !!document.querySelector('[data-framer-name], [data-projection-id]'), viewTransitions: !!document.querySelector('meta[name="view-transition"]'),
  };
  const canvases = [...document.querySelectorAll('canvas')].map((c) => {
    const r = c.getBoundingClientRect();
    let webgl = false;
    try { webgl = !!(c.getContext('webgl2') || c.getContext('webgl')); } catch { webgl = false; }
    return { share: Math.round((Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0)) * 100) / (innerWidth * innerHeight)), webgl };
  });
  const name = (el) => (el ? `<${el.tagName.toLowerCase()}${el.id ? `#${el.id}` : ''}${typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/).slice(0, 2).join('.')}` : ''}>` : '');
  const running = document.getAnimations().slice(0, 80).map((a) => {
    const t = (a.effect && a.effect.getComputedTiming && a.effect.getComputedTiming()) || {};
    let props = [];
    try { props = [...new Set(a.effect.getKeyframes().flatMap((k) => Object.keys(k)))].filter((k) => !['offset', 'easing', 'composite', 'computedOffset'].includes(k)); } catch { props = []; }
    return { kind: a.constructor.name, name: a.animationName || a.transitionProperty || '', durationMs: Math.round(Number(t.duration) || 0), delayMs: Math.round(Number(t.delay) || 0), easing: t.easing || '', iterations: t.iterations === Infinity ? 'infinite' : t.iterations, properties: props.slice(0, 6), on: name(a.effect && a.effect.target) };
  });
  const keyframes = [];
  const transitions = {};
  let scrollDriven = 0;
  let unreadableSheets = 0;
  for (const sheet of document.styleSheets) {
    let rules;
    try { rules = sheet.cssRules; } catch { unreadableSheets++; continue; }
    const walk = (list) => {
      for (const r of list) {
        if (r.type === 7 || r.constructor.name === 'CSSKeyframesRule') keyframes.push(r.name);
        else if (r.cssRules && r.cssRules.length) walk(r.cssRules);
        else if (r.style) {
          if (r.style.animationTimeline && r.style.animationTimeline !== 'auto') scrollDriven++;
          const d = r.style.transitionDuration;
          if (d && d !== '0s') {
            const key = `${r.style.transitionProperty || 'all'} · ${d} · ${r.style.transitionTimingFunction || 'ease'}`;
            transitions[key] = (transitions[key] || 0) + 1;
          }
        }
      }
    };
    walk(rules);
  }
  const sticky = [...document.querySelectorAll('body *')].filter((e) => getComputedStyle(e).position === 'sticky').slice(0, 12).map((e) => ({ el: name(e), height: Math.round(e.getBoundingClientRect().height) }));
  return {
    libraries: Object.keys(libs).filter((k) => libs[k]), canvases, running,
    keyframes: [...new Set(keyframes)].slice(0, 40), cssScrollDriven: scrollDriven, unreadableSheets,
    transitions: Object.entries(transitions).sort((a, b) => b[1] - a[1]).slice(0, 12).map(([k, n]) => ({ rule: k, uses: n })),
    sticky, videos: document.querySelectorAll('video').length, autoplayVideos: document.querySelectorAll('video[autoplay]').length,
    pageHeight: document.documentElement.scrollHeight, title: document.title,
  };
};

// A sample of visible elements with where they are and how they are transformed, taken before and
// after a scroll step: the difference says what the scroll did to each.
const sample = () => {
  const out = [];
  let i = 0;
  for (const el of document.querySelectorAll('body *')) {
    if (i >= 900) break;
    const r = el.getBoundingClientRect();
    if (r.width < 40 || r.height < 24 || r.bottom < -innerHeight || r.top > innerHeight * 2) continue;
    const cs = getComputedStyle(el);
    if (cs.display === 'none') continue;
    if (!el.__ddId) el.__ddId = ++window.__ddSeq || (window.__ddSeq = 1);
    i++;
    out.push({ id: el.__ddId, tag: `<${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? `.${el.className.trim().split(/\s+/)[0]}` : ''}>`, x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height), o: Number(cs.opacity), t: cs.transform === 'none' ? '' : cs.transform, pos: cs.position, text: (el.childElementCount === 0 ? el.textContent || '' : '').trim().slice(0, 40) });
  }
  return { scrollY: Math.round(scrollY), items: out };
};
function scrollEffects(a, b) {
  const dy = b.scrollY - a.scrollY;
  if (Math.abs(dy) < 20) return { moved: 0, note: 'the page did not scroll' };
  const before = new Map(a.items.map((x) => [x.id, x]));
  const eff = { pinned: [], slower: [], faster: [], sideways: [], fadedIn: [], fadedOut: [], scaled: [], rotated: [] };
  const scaleOf = (t) => { const m = /matrix\(([^)]+)\)/.exec(t); if (!m) return 1; const [p, q] = m[1].split(',').map(Number); return Math.hypot(p, q); };
  const angleOf = (t) => { const m = /matrix\(([^)]+)\)/.exec(t); if (!m) return 0; const [p, q] = m[1].split(',').map(Number); return Math.round((Math.atan2(q, p) * 180) / Math.PI); };
  for (const y of b.items) {
    const x = before.get(y.id);
    if (!x || x.pos === 'fixed') continue;
    const moved = y.y - x.y; // a plain element moves by -dy
    const ratio = moved / -dy;
    const who = `${y.tag}${y.text ? ` "${y.text}"` : ''}`;
    const onScreen = y.y < 900 && y.y + y.h > 0;
    if (!onScreen) continue;
    if (Math.abs(moved) < 3 && x.y < 900 && x.y + x.h > 0) eff.pinned.push(who);
    else if (ratio > 0.08 && ratio < 0.85) eff.slower.push(`${who} ×${ratio.toFixed(2)}`);
    else if (ratio > 1.15 && ratio < 4) eff.faster.push(`${who} ×${ratio.toFixed(2)}`);
    if (Math.abs(y.x - x.x) > 24 && Math.abs(y.w - x.w) < 4) eff.sideways.push(`${who} ${y.x - x.x > 0 ? '→' : '←'}${Math.abs(y.x - x.x)}px`);
    if (y.o - x.o > 0.4) eff.fadedIn.push(who);
    if (x.o - y.o > 0.4) eff.fadedOut.push(who);
    const s = scaleOf(y.t) / scaleOf(x.t);
    if (s > 1.08 || s < 0.92) eff.scaled.push(`${who} ×${s.toFixed(2)}`);
    if (Math.abs(angleOf(y.t) - angleOf(x.t)) >= 4) eff.rotated.push(`${who} ${angleOf(y.t) - angleOf(x.t)}°`);
  }
  const res = { scrolledPx: dy };
  for (const [k, v] of Object.entries(eff)) if (v.length) res[k] = { count: v.length, examples: v.slice(0, 4) };
  return res;
}

let browser;
const finish = async (reason) => {
  if (reason) read.notDone.push(reason);
  read.seconds = Math.round((Date.now() - started) / 1000);
  // The sheet: every frame with its label, small, in reading order.
  try {
    if (shots.length && browser) {
      const page = await browser.newPage({ viewport: { width: 1300, height: 400 } });
      const cells = shots.map((s) => `<figure><img src="data:image/jpeg;base64,${fs.readFileSync(s.file).toString('base64')}"><figcaption>${s.label}</figcaption></figure>`).join('');
      await page.setContent(`<style>body{margin:0;background:#1b1b1b;color:#eee;font:12px system-ui,sans-serif}div{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;padding:8px}img{width:100%;display:block}figure{margin:0}figcaption{padding:3px 0 6px}</style><div>${cells}</div>`);
      await page.screenshot({ path: path.join(out, 'read-sheet.png'), fullPage: true });
      await page.close();
    }
  } catch (e) {
    read.notDone.push(`sheet: ${e.message}`);
  }
  fs.writeFileSync(path.join(out, 'read.json'), JSON.stringify(read, null, 2));
  const m = read.motion;
  const list = (o) => (o ? `${o.count} (${o.examples.join('; ')})` : '0');
  const md = [
    `# Read: ${m.title || read.url}`,
    `${read.url} · read in ${read.seconds}s of ${read.budgetSeconds}s${read.notDone.length ? ` · NOT DONE: ${read.notDone.join('; ')}` : ''}`,
    '', '## How it moves (measured)',
    `- Libraries: ${(m.libraries || []).join(', ') || 'none found'} · canvases: ${(m.canvases || []).length}${(m.canvases || []).some((c) => c.webgl) ? ' (WebGL)' : ''}${(m.canvases || []).length ? `, largest covers ${Math.max(...m.canvases.map((c) => c.share))}% of the first screen` : ''} · videos: ${m.videos || 0} (${m.autoplayVideos || 0} autoplay)`,
    `- Running at load: ${(m.running || []).length} animation(s)${(m.running || []).length ? `; e.g. ${m.running.slice(0, 5).map((a) => `${a.name || a.kind} ${a.durationMs}ms ${a.easing}${a.iterations === 'infinite' ? ' ∞' : ''} [${a.properties.join(',')}] on ${a.on}`).join(' | ')}` : ''}`,
    `- CSS keyframes: ${(m.keyframes || []).length}${(m.keyframes || []).length ? ` (${m.keyframes.slice(0, 12).join(', ')})` : ''} · CSS scroll-driven rules: ${m.cssScrollDriven || 0}${m.unreadableSheets ? ` · ${m.unreadableSheets} stylesheet(s) could not be read (other origin)` : ''}`,
    `- Transitions most used: ${(m.transitions || []).slice(0, 6).map((t) => `${t.rule} ×${t.uses}`).join(' | ') || 'none declared in readable CSS'}`,
    `- Sticky elements: ${(m.sticky || []).length}${(m.sticky || []).length ? ` (${m.sticky.slice(0, 4).map((s) => `${s.el} ${s.height}px`).join(', ')})` : ''} · page height ${m.pageHeight || '?'}px`,
    '', '## While loading (first screen)',
    ...read.load.map((l) => `- ${l.atMs}ms: ${l.visibleText} text element(s) visible, ${l.running} animation(s) running`),
    '', '## While scrolling (desktop, what each step did)',
    ...read.scroll.map((s, i) => `- step ${i + 1} at ${s.at}px: pinned ${list(s.pinned)} · slower ${list(s.slower)} · faster ${list(s.faster)} · sideways ${list(s.sideways)} · faded in ${list(s.fadedIn)} · scaled ${list(s.scaled)} · rotated ${list(s.rotated)}${s.note ? ` · ${s.note}` : ''}`),
    '', '## On hover (first controls)',
    ...(read.hover.length ? read.hover.map((h) => `- ${h.el}: ${h.changes.join(', ')}${h.transition ? ` · ${h.transition}` : ''}`) : ['- nothing measured']),
    '', `Phone first screen: ${read.phone ? read.phone.note : 'not captured'}`,
    '', 'Frames: read-sheet.png (load-*, scroll-*, phone). Motion seen here becomes reusable only when it is written as a recipe: motion/recipes.json (library/intake.md).', '',
  ].join('\n');
  fs.writeFileSync(path.join(out, 'read.md'), md);
  console.log(`read: ${path.relative(process.cwd(), out)}/read.md in ${read.seconds}s${read.notDone.length ? ` (not done: ${read.notDone.join('; ')})` : ''}`);
  if (browser) await browser.close().catch(() => {});
  process.exit(0);
};
// Whatever happens, the read ends inside the budget with what it has.
const watchdog = setTimeout(() => finish('time budget reached'), BUDGET + 8000);
watchdog.unref();

try {
  const { url, close } = await resolveTarget(target);
  browser = await launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const t0 = Date.now();
  const nav = page.goto(url, { waitUntil: 'commit', timeout: Math.min(30000, left()) }).catch((e) => read.notDone.push(`load: ${e.message.split('\n')[0]}`));
  await nav;
  for (const at of [400, 1200, 2500, 4500]) {
    if (left() < 30000) { read.notDone.push('load frames cut short'); break; }
    await page.waitForTimeout(Math.max(0, at - (Date.now() - t0)));
    const facts = await page.evaluate(() => ({ running: document.getAnimations().length, visibleText: [...document.querySelectorAll('h1,h2,h3,p,a,button,li')].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && r.top < innerHeight && r.bottom > 0 && Number(cs.opacity) > 0.5 && cs.visibility !== 'hidden' && (e.innerText || '').trim(); }).length })).catch(() => ({ running: 0, visibleText: 0 }));
    read.load.push({ atMs: at, ...facts });
    await shot(page, `load-${at}`, `load ${at} ms`);
  }
  await dismissOverlays(page).catch(() => {});
  read.motion = await page.evaluate(declared).catch((e) => ({ error: e.message }));

  // Hover: what the first controls do, and how fast.
  if (left() > 40000) {
    const controls = await page.$$('a, button, [role="button"]');
    let n = 0;
    for (const c of controls) {
      if (n >= 6 || left() < 40000) break;
      const box = await c.boundingBox().catch(() => null);
      if (!box || box.width < 40 || box.height < 20 || box.y > 900 || box.y < 0) continue;
      const style = () => c.evaluate((e) => { const s = getComputedStyle(e); return { color: s.color, background: s.backgroundColor, transform: s.transform, opacity: s.opacity, shadow: s.boxShadow, deco: s.textDecorationLine, tr: `${s.transitionProperty} ${s.transitionDuration} ${s.transitionTimingFunction}`, label: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 30) }; }).catch(() => null);
      const a = await style();
      await c.hover({ timeout: 1500, force: true }).catch(() => {});
      await page.waitForTimeout(450);
      const b = await style();
      if (a && b) {
        const changes = ['color', 'background', 'transform', 'opacity', 'shadow', 'deco'].filter((k) => a[k] !== b[k]);
        if (changes.length) { read.hover.push({ el: `"${a.label}"`, changes, transition: /0s/.test(a.tr) && !/[1-9]/.test(a.tr) ? '' : a.tr }); }
        n++;
      }
    }
    await page.mouse.move(2, 2).catch(() => {});
  }

  // Scroll: wheel steps (so smooth-scroll libraries respond), a frame and a diff per step.
  const height = (read.motion && read.motion.pageHeight) || 900;
  const stepPx = Math.max(300, Math.min(900, Math.round((Math.min(height, 900 * 14) - 900) / FRAMES)));
  await page.mouse.move(720, 450).catch(() => {});
  for (let i = 0; i < FRAMES; i++) {
    if (left() < 16000) { read.notDone.push(`scroll stopped at step ${i} of ${FRAMES}`); break; }
    const a = await page.evaluate(sample).catch(() => null);
    await page.mouse.wheel(0, stepPx).catch(() => {});
    await page.waitForTimeout(700);
    const b = await page.evaluate(sample).catch(() => null);
    if (a && b) read.scroll.push({ at: b.scrollY, ...scrollEffects(a, b) });
    await shot(page, `scroll-${String(i + 1).padStart(2, '0')}`, `scroll ${b ? b.scrollY : '?'} px`);
  }
  await ctx.close().catch(() => {});

  if (left() > 9000) {
    const pctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' });
    const pp = await pctx.newPage();
    await pp.goto(url, { waitUntil: 'commit', timeout: Math.max(3000, Math.min(15000, left() - 6000)) }).catch(() => {});
    await pp.waitForTimeout(Math.max(500, Math.min(3000, left() - 5000)));
    const text = await pp.evaluate(() => (document.body ? document.body.innerText.trim().length : 0)).catch(() => 0);
    read.phone = { note: text > 40 ? `${text} characters of text on the first load` : 'almost no text on the first load (a loader, a canvas, or a desktop-only page)' };
    await shot(pp, 'phone', 'phone 390');
    await pctx.close().catch(() => {});
  } else read.notDone.push('phone screen');
  await close();
  await finish();
} catch (e) {
  await finish(`error: ${e.message.split('\n')[0]}`);
}
