#!/usr/bin/env node
// Measures scroll smoothness against a plain page on the same machine, so the result says
// "smoother or choppier than a page with no effects here" instead of an absolute number that
// depends on the computer.
//
//   node smooth.mjs <url | file> [--dir <capture folder>] [--cpu 4]
// With --dir the result is written to smoothness.json and added to evidence.json.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { launch, resolveTarget, parseArgs } from './lib/browser.mjs';
import { measureSmoothness } from './lib/smooth.mjs';

const args = parseArgs(process.argv.slice(2));
const target = args._[0];
if (!target) {
  console.error('Usage: node smooth.mjs <url | file> [--dir capture folder] [--cpu 4]');
  process.exit(2);
}
const cpu = Number(args.cpu || 1);
const here = path.dirname(fileURLToPath(import.meta.url));
const browser = await launch();
const plain = await resolveTarget(path.join(here, '..', 'evals/fixtures/clean.html'));
const baseline = await measureSmoothness(browser, plain.url, { cpu });
await plain.close();
const { url, close } = await resolveTarget(target);
const page = await measureSmoothness(browser, url, { cpu });
await close();
await browser.close();

const result = { url, time: new Date().toISOString(), page, baseline, longFramesOverBaseline: page.longFrames - baseline.longFrames, p95OverBaseline: Math.round((page.p95Ms - baseline.p95Ms) * 10) / 10 };
console.log(`page:     ${page.fps} fps, median ${page.medianMs} ms, p95 ${page.p95Ms} ms, ${page.longFrames} long frames (>50 ms), ${page.droppedShare}% dropped; scripts blocked ${page.scriptBlockedShare}% of the scroll (${page.longTasks} long tasks)`);
console.log(`renderer: ${page.renderer}`);
console.log(`baseline: ${baseline.fps} fps, median ${baseline.medianMs} ms, p95 ${baseline.p95Ms} ms, ${baseline.longFrames} long frames, ${baseline.droppedShare}% dropped (plain page, same machine)`);
if (page.loadFailed) console.log('  FLAG the page did not load: ignore this result');
if (args.dir) {
  fs.writeFileSync(path.join(args.dir, 'smoothness.json'), JSON.stringify(result, null, 2));
  const ev = path.join(args.dir, 'evidence.json');
  if (fs.existsSync(ev)) {
    const e = JSON.parse(fs.readFileSync(ev, 'utf8'));
    e.smoothness = result;
    fs.writeFileSync(ev, JSON.stringify(e, null, 2));
  }
}
