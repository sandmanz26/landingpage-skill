#!/usr/bin/env node
// Opens a page in a real browser at three widths, measures it, saves screenshots
// and writes .design/inspect/report.json. Exit code 1 when anything FAILs.
//
//   node inspect.mjs <url | index.html | folder> [--out .design/inspect]
//        [--rules extra-rules.json] [--allow rule1,rule2] [--app] [--quiet]
//
// Objective checks (contrast, overflow, fonts that never loaded, tap targets,
// hidden content...) are always on. Style checks (AI defaults such as purple
// gradients or icon-card rows) take their severity from rules/style-defaults.json,
// overridden by team/taste-rules.json, then .design/rules.json (brand), then --rules.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, resolveTarget, parseArgs } from './lib/browser.mjs';
import { measure, hiddenText, markSeen } from './lib/measure.mjs';

const args = parseArgs(process.argv.slice(2));
const target = args._[0];
if (!target) {
  console.error('Usage: node inspect.mjs <url | index.html | folder> [--out dir] [--rules file] [--allow a,b] [--app]');
  process.exit(2);
}

const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outDir = path.resolve(args.out || '.design/inspect');
fs.mkdirSync(outDir, { recursive: true });
for (const f of fs.readdirSync(outDir)) if (/\.(png|jpg)$/.test(f)) fs.unlinkSync(path.join(outDir, f));

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}
const rules = {
  ...readJson(path.join(skillDir, 'rules/style-defaults.json')),
  ...readJson(path.join(skillDir, 'team/taste-rules.json')),
  ...readJson(path.resolve('.design/rules.json')),
  ...(args.rules ? readJson(path.resolve(args.rules)) : {}),
};
delete rules._comment;
for (const r of String(args.allow || '').split(',').filter(Boolean)) rules[r] = 'off';
if (args.app) rules.__app = true;

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 390, height: 844 },
];

const report = {
  target,
  time: new Date().toISOString(),
  rules,
  viewports: {},
  checks: {},
  summary: { fail: 0, warn: 0 },
};

const { url, close } = await resolveTarget(target);
report.url = url;
const browser = await launch();

async function open(ctxOpts) {
  const context = await browser.newContext({ deviceScaleFactor: 1, ...ctxOpts });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e.message || e)));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await page.addInitScript(() => {
    window.__cls = 0;
    try {
      new PerformanceObserver((list) => {
        for (const e of list.getEntries()) if (!e.hadRecentInput) window.__cls += e.value;
      }).observe({ type: 'layout-shift', buffered: true });
    } catch {}
  });
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  } catch {
    await page.goto(url, { waitUntil: 'load', timeout: 30000 }).catch(() => {});
  }
  await page.waitForTimeout(1200);
  return { context, page, errors };
}

// Scrolls with real wheel input so scroll-triggered effects fire, counting the
// elements that animate on the way down.
async function scrollThrough(page, vh) {
  const moved = new Set();
  const sample = async () => {
    const n = await page.evaluate(() => {
      const ids = [];
      for (const a of document.getAnimations()) {
        const t = a.effect && a.effect.target;
        if (!t) continue;
        if (!t.__ddId) t.__ddId = Math.random().toString(36).slice(2);
        ids.push(t.__ddId);
      }
      return ids;
    });
    n.forEach((id) => moved.add(id));
    await page.evaluate(markSeen);
  };
  await sample();
  await page.mouse.move(200, 200);
  for (let i = 0; i < 60; i++) {
    const done = await page.evaluate(() => innerHeight + scrollY >= document.documentElement.scrollHeight - 2);
    if (done) break;
    await page.mouse.wheel(0, Math.round(vh * 0.8));
    await page.waitForTimeout(260);
    await sample();
  }
  await page.waitForTimeout(600);
  await sample();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
  return moved.size;
}

function add(list, severity, rule, message, sample) {
  list.push({ severity, rule, message, ...(sample ? { sample } : {}) });
}

for (const vp of VIEWPORTS) {
  const { context, page, errors } = await open({ viewport: { width: vp.width, height: vp.height } });
  const shots = [];
  const fold = path.join(outDir, `${vp.name}-fold.png`);
  await page.screenshot({ path: fold });
  shots.push(fold);
  const animated = await scrollThrough(page, vp.height);
  const m = await page.evaluate(measure, { rules, viewport: vp.name });
  const hidden = await page.evaluate(hiddenText);
  const cls = await page.evaluate(() => window.__cls || 0);

  // Screens as a visitor sees them: scroll, then photograph the viewport, so
  // sticky and fixed elements appear where they really are.
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const sliceH = vp.height;
  const slices = Math.min(Math.ceil(height / sliceH), 14);
  for (let i = 0; i < slices; i++) {
    const p = path.join(outDir, `${vp.name}-page-${String(i + 1).padStart(2, '0')}.png`);
    await page.evaluate((y) => window.scrollTo(0, y), i * sliceH);
    await page.waitForTimeout(250);
    await page.screenshot({ path: p });
    shots.push(p);
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  const findings = m.findings;
  if (hidden.count > 0)
    add(findings, 'FAIL', 'hidden-content', `${hidden.count} text elements were never visible during a full scroll (a reveal that never fires?)`, hidden.samples);
  if (cls > 0.25) add(findings, 'FAIL', 'layout-shift', `Layout shift ${cls.toFixed(3)} (over 0.25)`);
  else if (cls > 0.1) add(findings, 'WARN', 'layout-shift', `Layout shift ${cls.toFixed(3)} (over 0.1)`);
  if (errors.length) add(findings, 'WARN', 'console-errors', `${errors.length} console or page errors`, errors.slice(0, 5));
  if (height > sliceH * 14) add(findings, 'WARN', 'screenshots-capped', `Page is ${height}px tall; only the first ${slices} screens were captured`);

  report.viewports[vp.name] = {
    width: vp.width,
    pageHeight: height,
    findings,
    inventory: { ...m.inventory, animatedElements: animated, cls: Number(cls.toFixed(3)) },
    screenshots: shots.map((s) => path.relative(process.cwd(), s)),
  };
  await context.close();
}

// Reduced motion: every piece of content must still be there.
{
  const { context, page } = await open({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await scrollThrough(page, 900);
  const hidden = await page.evaluate(hiddenText);
  const p = path.join(outDir, 'reduced-motion-fold.png');
  await page.screenshot({ path: p });
  const findings = [];
  if (hidden.count > 0)
    add(findings, 'FAIL', 'reduced-motion', `${hidden.count} text elements stay hidden when the visitor asks for reduced motion`, hidden.samples);
  report.checks.reducedMotion = { findings, screenshot: path.relative(process.cwd(), p) };
  await context.close();
}

// Without JavaScript: the content should still be readable.
{
  const visibleChars = async (js) => {
    const { context, page } = await open({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: js });
    const n = await page.evaluate(() => {
      let total = 0;
      const walk = document.createTreeWalker(document.body || document.documentElement, NodeFilter.SHOW_TEXT);
      while (walk.nextNode()) {
        const el = walk.currentNode.parentElement;
        if (!el) continue;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (cs.visibility === 'hidden' || cs.display === 'none' || parseFloat(cs.opacity) < 0.05 || r.width === 0) continue;
        total += walk.currentNode.textContent.trim().length;
      }
      return total;
    });
    await context.close();
    return n;
  };
  const withJs = await visibleChars(true);
  const withoutJs = await visibleChars(false);
  const findings = [];
  if (withJs > 200 && withoutJs < withJs * 0.5)
    add(findings, 'WARN', 'needs-javascript', `Without JavaScript only ${withoutJs} of ${withJs} characters of text are visible`);
  report.checks.noJavaScript = { findings, withJs, withoutJs };
}

await browser.close();
await close();

const all = [
  ...Object.entries(report.viewports).flatMap(([k, v]) => v.findings.map((f) => ({ ...f, where: k }))),
  ...Object.entries(report.checks).flatMap(([k, v]) => v.findings.map((f) => ({ ...f, where: k }))),
];
// The same finding at several widths is one problem: group it.
const grouped = new Map();
for (const f of all) {
  const key = `${f.severity}|${f.rule}|${f.message}`;
  if (grouped.has(key)) {
    if (!grouped.get(key).where.includes(f.where)) grouped.get(key).where.push(f.where);
  }
  else grouped.set(key, { ...f, where: [f.where] });
}
report.findings = [...grouped.values()].sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'FAIL' ? -1 : 1));
report.summary.fail = report.findings.filter((f) => f.severity === 'FAIL').length;
report.summary.warn = report.findings.filter((f) => f.severity === 'WARN').length;
fs.writeFileSync(path.join(outDir, 'report.json'), JSON.stringify(report, null, 2));

if (!args.quiet) {
  for (const f of report.findings.filter((x) => x.severity !== 'INFO')) {
    console.log(`${f.severity.padEnd(4)} ${f.rule} [${f.where.join(', ')}]: ${f.message}`);
    if (f.sample) for (const s of [].concat(f.sample).slice(0, 3)) console.log(`       · ${typeof s === 'string' ? s : JSON.stringify(s)}`);
  }
  const d = report.viewports.desktop.inventory;
  console.log('\nInventory (desktop):');
  console.log(`  fonts: ${d.families.map((f) => `${f.family} ${f.share}%`).join(', ')}`);
  console.log(`  font sizes (${d.fontSizes.length}): ${d.fontSizes.join(', ')}`);
  console.log(`  colours: ${d.textColours.length} text, ${d.backgroundColours.length} background, ${d.chromaticColours} chromatic`);
  console.log(`  spacing values: ${d.spacing.distinct} distinct, ${d.spacing.offScale} off the 4px grid`);
  console.log(`  radii: ${d.radii.join(', ') || 'none'} · shadows: ${d.shadows} · gradients: ${d.gradients} · blur panels: ${d.backdropBlur}`);
  console.log(`  moving elements: ${d.animatedElements} · transitions declared: ${d.transitions} · layout shift: ${d.cls}`);
  console.log(`\n${report.summary.fail} FAIL, ${report.summary.warn} WARN. Screenshots and report.json in ${path.relative(process.cwd(), outDir) || '.'}`);
}
process.exit(report.summary.fail > 0 ? 1 : 0);
