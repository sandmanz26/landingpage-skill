#!/usr/bin/env node
// Does the built page hit the visual targets chosen at the direction gate (the dials), and the
// team's taste? Reads the inspector report and evidence of the page, writes fit.json.
//
//   node fit.mjs <inspect folder with report.json and evidence.json> [--targets .design/targets.json]
//
// Without --targets, team/visual-defaults.json (the team's taste as dials) is the target.
// Exit 1 when a target is missed: fix it, or write the reason in the critique's "Fit" section.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));
const dir = args._[0];
if (!dir || !fs.existsSync(path.join(dir, 'report.json'))) {
  console.error('Usage: node fit.mjs <inspect folder with report.json and evidence.json> [--targets targets.json]');
  process.exit(2);
}
const defaultsPath = path.join(here, '..', 'team', 'visual-defaults.json');
const targetsPath = args.targets || defaultsPath;
if (!fs.existsSync(targetsPath)) {
  console.error(`No targets: ${targetsPath}`);
  process.exit(2);
}
const targets = JSON.parse(fs.readFileSync(targetsPath, 'utf8'));
const st = spawnSync(process.execPath, [path.join(here, 'style.mjs'), dir], { encoding: 'utf8' });
if (st.status) {
  console.error(st.stderr);
  process.exit(1);
}
const style = JSON.parse(fs.readFileSync(path.join(dir, 'style.json'), 'utf8'));
const evPath = path.join(dir, 'evidence.json');
const ev = fs.existsSync(evPath) ? JSON.parse(fs.readFileSync(evPath, 'utf8')) : null;
const has = (t) => style.tags.includes(t);

const rows = [];
const row = (dial, want, got, ok, why) => rows.push({ dial, want, got, ok, why });

if (targets.colour) {
  const flat = style.palette.gradients <= 3 && style.palette.shadows <= 3;
  if (targets.colour === 'bold') row('colour', 'bold: 4+ flat colours with roles', `${style.palette.chromatic} colours, ${style.palette.gradients} gradients`, style.palette.chromatic >= 4 && flat, 'team Prefer: bold flat colour');
  else row('colour', 'calm: 3 colours or fewer', `${style.palette.chromatic} colours`, style.palette.chromatic <= 3);
}
if (targets.typeRatio) row('type', `display ÷ body ≥ ${targets.typeRatio}`, `${style.type.display}/${style.type.body}px = ×${style.type.ratio}`, style.type.ratio >= targets.typeRatio);
if (targets.imagery) {
  const im = style.imagery || { photos: 0, illustrations: 0, videos: 0 };
  const got = `${im.photos} photos, ${im.illustrations} illustrations, ${im.videos} videos`;
  const ok = { photo: im.photos + im.videos >= 2, illustration: im.illustrations >= 2, ui: im.photos + im.illustrations >= 1, type: true }[targets.imagery];
  row('imagery', targets.imagery, style.imagery ? got : 'not measured (run evidence.mjs)', !!style.imagery && ok);
}
if (targets.motion) {
  const m = style.motion;
  const story = !!m && (m.stickyPanels >= 2 || has('scroll-choreography') || (ev && ev.motion.scriptDrivenOnScroll >= 3) || (ev && ev.motion.maxRunning >= 3));
  const ok = { none: !m || (!story && !has('endless-motion')), subtle: !has('endless-motion'), story }[targets.motion];
  row('motion', targets.motion, m ? `${m.libraries.join(', ') || 'no library'}, ${m.stickyPanels} sticky panels, up to ${ev ? ev.motion.scriptDrivenOnScroll : '?'} moving on scroll` : 'not measured', !!ok);
}
// Team rules that are measurable: they apply whatever the dials say.
if (has('ignores-reduced-motion')) row('never', 'motion has a reduced-motion version', 'still moves under reduced motion', false, 'team Never rule');
if (ev && targets.priceNearAction !== false) row('always', 'a price near the main action', ev.outline.prices.length ? ev.outline.prices.slice(0, 3).join(', ') : 'no price on the page', ev.outline.prices.length > 0, 'team Always rule');

const missed = rows.filter((r) => !r.ok);
fs.writeFileSync(path.join(dir, 'fit.json'), JSON.stringify({ targets: path.relative(process.cwd(), targetsPath), rows, missed: missed.length }, null, 2));
console.log(`fit against ${path.relative(process.cwd(), targetsPath)}:`);
for (const r of rows) console.log(`  ${r.ok ? 'OK  ' : 'MISS'} ${r.dial.padEnd(8)} want ${r.want} · got ${r.got}${r.why && !r.ok ? ` (${r.why})` : ''}`);
console.log(missed.length ? `\n${missed.length} target(s) missed: fix them, or give the reason in the critique's Fit section.` : '\nAll targets met.');
process.exit(missed.length ? 1 : 0);
