#!/usr/bin/env node
// Captures a whole batch of references in parallel, so the jury starts with every
// evidence pack ready instead of each juror opening a browser:
//   inspect.mjs  → report.json, folds and page screenshots
//   evidence.mjs → contact sheets, motion sheet, evidence.json, page-text.txt
//   digest.mjs   → digest.md, the one short file each juror reads first
//
//   node capture.mjs <list.txt | list.csv> [--out data/references/captures]
//        [--jobs 3] [--idle 15] [--skip-existing]
//
// One reference per line: "<id> <url>" or "<id>,<url>". Lines starting with # are skipped.
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));
const list = args._[0];
if (!list) {
  console.error('Usage: node capture.mjs <list.txt | list.csv> [--out dir] [--jobs 3] [--idle 15] [--skip-existing]');
  process.exit(2);
}
const outRoot = path.resolve(args.out || 'data/references/captures');
const jobs = Math.max(1, Number(args.jobs || 3));

function parseList(text) {
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
    .map((l) => l.split(/[\s,;]+/).filter(Boolean))
    .filter((p) => p.length >= 2 && /^https?:\/\//.test(p[1]))
    .map(([id, url]) => ({ id, url }));
}

const refs = parseList(fs.readFileSync(list, 'utf8'));
if (!refs.length) {
  console.error(`No "<id> <url>" lines found in ${list}`);
  process.exit(2);
}

function run(script, argv) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, [path.join(here, script), ...argv], { stdio: ['ignore', 'pipe', 'pipe'] });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.on('close', (code) => resolve({ code, out, seconds: Math.round((Date.now() - started) / 1000) }));
  });
}

const results = [];
const started = Date.now();
let next = 0;
async function worker() {
  while (next < refs.length) {
    const ref = refs[next++];
    const dir = path.join(outRoot, ref.id);
    if (args['skip-existing'] && fs.existsSync(path.join(dir, 'evidence.json'))) {
      results.push({ ...ref, skipped: true });
      continue;
    }
    fs.mkdirSync(dir, { recursive: true });
    // inspect exits 1 when it finds FAILs; that is a result, not a crash.
    const inspect = await run('inspect.mjs', [ref.url, '--out', dir, '--quiet']);
    const evidence = await run('evidence.mjs', [ref.url, '--dir', dir, '--idle', String(args.idle ?? 15)]);
    await run('digest.mjs', [dir]);
    const flags = evidence.out.split('\n').filter((l) => l.trim().startsWith('FLAG')).map((l) => l.trim().slice(5));
    const ok = ['report.json', 'evidence.json', 'digest.md'].every((f) => fs.existsSync(path.join(dir, f)));
    results.push({ ...ref, ok, inspectSeconds: inspect.seconds, evidenceSeconds: evidence.seconds, flags, error: ok ? null : (inspect.out + evidence.out).slice(-600) });
    console.log(`${ok ? 'done' : 'FAILED'} ${ref.id} (${inspect.seconds}s + ${evidence.seconds}s)${flags.length ? ` · ${flags.length} flags` : ''}`);
  }
}
await Promise.all(Array.from({ length: Math.min(jobs, refs.length) }, worker));

const summary = { list: path.relative(process.cwd(), path.resolve(list)), jobs, seconds: Math.round((Date.now() - started) / 1000), results };
fs.mkdirSync(outRoot, { recursive: true });
fs.writeFileSync(path.join(outRoot, `capture-${path.basename(list).replace(/\.\w+$/, '')}.json`), JSON.stringify(summary, null, 2));
console.log(`\n${results.filter((r) => r.ok).length}/${refs.length} captured in ${summary.seconds}s with ${jobs} at a time`);
for (const r of results.filter((x) => x.flags && x.flags.length)) console.log(`  ${r.id}: ${r.flags.join(' | ')}`);
if (results.some((r) => r.ok === false)) process.exit(1);
