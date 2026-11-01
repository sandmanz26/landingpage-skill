#!/usr/bin/env node
// Writes digest.md: the one short file a juror reads with the folds and sheets, instead of
// report.json, evidence.json and the page text in full. Every juror turn re-reads everything
// read before it, so a small first read is the biggest saving in a jury.
//
//   node digest.mjs <capture folder> [--text 6000]
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const dir = args._[0];
if (!dir || !fs.existsSync(path.join(dir, 'report.json'))) {
  console.error('Usage: node digest.mjs <capture folder with report.json and evidence.json> [--text 6000]');
  process.exit(2);
}
const read = (f) => (fs.existsSync(path.join(dir, f)) ? fs.readFileSync(path.join(dir, f), 'utf8') : null);
const report = JSON.parse(read('report.json'));
const ev = read('evidence.json') ? JSON.parse(read('evidence.json')) : null;
const text = read('page-text.txt') || '';
const textLimit = Number(args.text || 6000);
const cut = (s, n) => (s.length > n ? s.slice(0, n) + '…' : s);
const out = [];
const line = (s = '') => out.push(s);

line(`# Digest: ${ev ? ev.outline.title : report.url}`);
line();
line(`URL: ${report.url}${ev && ev.outline.description ? ` · description: "${cut(ev.outline.description, 200)}"` : ''}`);
const images = ['desktop-fold', 'mobile-fold', 'desktop-overlay', 'mobile-overlay', 'sheet-desktop', 'sheet-mobile', 'motion-sheet'].filter((f) => fs.existsSync(path.join(dir, `${f}.png`)));
line(`Images in this folder: ${images.map((f) => `${f}.png`).join(', ')}`);
if (ev && ev.load && ev.load.failed) line('**WARNING: the page did not load (server error page). Do not judge this capture.**');
const loadFail = report.findings.find((f) => f.rule === 'page-did-not-load');
if (loadFail) line(`**WARNING: ${loadFail.message}**`);

if (ev) {
  const o = ev.outline;
  line();
  line('## Outline (document order, % of page height)');
  const seen = new Set();
  for (const h of o.headings) {
    const key = h.replace(/^H\d \d+% /, '');
    if (seen.has(key)) continue;
    seen.add(key);
    line(`- ${h}`);
  }
  line();
  line(`Actions: ${o.actions.map((a) => `"${a.label}" ×${a.count} @${a.firstAt}%${a.firstScreen ? ' first-screen' : ''}${a.sticky ? ' stays-visible' : ''}`).join(' · ') || 'none found'}`);
  line(`Prices: ${o.prices.join(', ') || 'none'} · proof words: ${Object.entries(o.proofMentions).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'} · logo images: ${o.logoImages} · forms: ${o.forms} · page height: ${o.pageHeight}px`);
  if (ev.overlaysDismissed && ev.overlaysDismissed.length) line(`Pop-up or banner on load (closed for capture): ${ev.overlaysDismissed.join(', ')}; see *-overlay.png`);

  const m = ev.motion;
  line();
  line('## Motion (measured, desktop)');
  line(`- Libraries: ${Object.entries(m.libraries).filter(([, v]) => v).map(([k]) => k).join(', ') || 'none detected (CSS-only motion is still possible: see sticky panels)'}`);
  line(`- Full-screen sticky panels (CSS scroll device): ${(m.stickyPanels || []).length}`);
  line(`- Moving with no input: ${m.movingWithoutInput} elements at the top; further down: ${(m.movingWithoutInputFurtherDown || []).map((s) => `${s.y}px (${s.moving})`).join(', ') || 'none'}; endless loops ${m.infiniteLoops} (${m.infiniteLoopsWithText} with text); pause control: ${m.pauseControl ? 'yes' : 'no'}`);
  line(`- On scroll: up to ${m.scriptDrivenOnScroll} script-driven elements per step, up to ${m.maxRunning} CSS/Web animations; durations ${m.durationsMs ? `${m.durationsMs.min}-${m.durationsMs.max} ms` : 'n/a'}; easings ${m.easings.join(', ') || 'n/a'}; properties ${m.properties.join(', ') || 'n/a'}`);
  line(`- Reduced motion: ${ev.reducedMotion.movingWithoutInput} still move on their own, ${ev.reducedMotion.movingOnScroll} with the scroll${ev.reducedMotion.loadFailed ? ' (RUN FAILED TO LOAD: unknown)' : ''}`);
  line(`- Leaves the page by itself when idle: ${ev.idleNavigation ? `yes, after ${ev.idleNavigation.afterSeconds}s → ${ev.idleNavigation.navigatedTo}` : 'no'}`);
  if (ev.smoothness) {
    const { page: sp, baseline: sb } = ev.smoothness;
    line(`- Smoothness while scrolling (stutter): ${sp.fps} fps, p95 frame ${sp.p95Ms} ms, ${sp.longFrames} long frames >50 ms, ${sp.droppedShare}% dropped; a plain page on the same machine: ${sb.fps} fps, p95 ${sb.p95Ms} ms, ${sb.longFrames} long frames. Scripts blocked ${sp.scriptBlockedShare ?? '?'}% of the scroll.`);
    if (/swiftshader|llvmpipe|software/i.test(sp.renderer || ''))
      line('  Measured with software rendering (no GPU) on a slower CPU: this ranks pages by how heavy they are, it does not show what a laptop with a GPU shows. Run `smooth.mjs` on a real machine to judge stutter.');
  } else line('- Not measured: frame smoothness (stutter).');
  line('- Not measured: transitions to other pages.');
}

const inv = report.viewports.desktop && report.viewports.desktop.inventory;
if (inv) {
  line();
  line('## Design inventory (desktop)');
  line(`- Fonts: ${inv.families.map((f) => `${f.family} ${f.share}%`).join(', ')}; ${inv.fontSizes.length} sizes (${inv.fontSizes.join('/')} px)`);
  line(`- Colours: ${inv.chromaticColours} chromatic; text ${inv.textColours.slice(0, 6).join(' ')}; backgrounds ${inv.backgroundColours.slice(0, 8).join(' ')}`);
  line(`- Radii ${inv.radii.join(' ')}; shadows ${inv.shadows}; gradients ${inv.gradients}; backdrop blur ${inv.backdropBlur}; layout shift (CLS) ${inv.cls}`);
}

line();
line('## Inspector findings');
for (const f of report.findings.filter((x) => x.severity !== 'INFO')) {
  const sample = f.sample ? ` e.g. ${cut((Array.isArray(f.sample) ? f.sample : [f.sample]).slice(0, 2).join(' | '), 220)}` : '';
  line(`- ${f.severity} ${f.rule} [${[].concat(f.where).join(', ')}]: ${f.message}${sample}`);
}

line();
line(`## Page text (first ${textLimit} characters of ${text.length})`);
line();
line(cut(text.trim(), textLimit));
fs.writeFileSync(path.join(dir, 'digest.md'), out.join('\n') + '\n');
console.log(`digest: ${path.join(dir, 'digest.md')} (${out.join('\n').length} characters)`);
