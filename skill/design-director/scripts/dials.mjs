#!/usr/bin/env node
// Turns the sites a user likes (and dislikes) into suggested visual dials, so the brief starts from
// what they showed instead of vague words. Reads the style cards (style.mjs) of captured sites.
//
//   node dials.mjs suggest <capture dir> [<capture dir> ...] [--dislike <dir>,<dir>] [--out .design/targets.suggested.json]
//
// Capture a site first: inspect.mjs <url> --out <dir>, evidence.mjs <url> --dir <dir> (or capture.mjs).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));
const [cmd, ...likes] = args._;
const dislikes = String(args.dislike || '').split(',').map((x) => x.trim()).filter(Boolean);
if (cmd !== 'suggest' || !likes.length) {
  console.error('Usage: node dials.mjs suggest <capture dir> [...] [--dislike dir,dir] [--out file]');
  process.exit(2);
}

function card(dir) {
  const p = path.join(dir, 'style.json');
  if (!fs.existsSync(p) || (fs.existsSync(path.join(dir, 'report.json')) && fs.statSync(path.join(dir, 'report.json')).mtimeMs > fs.statSync(p).mtimeMs)) {
    const r = spawnSync(process.execPath, [path.join(here, 'style.mjs'), dir], { encoding: 'utf8' });
    if (r.status) {
      console.error(`No style card for ${dir}: ${r.stderr.trim()}`);
      process.exit(1);
    }
  }
  const st = JSON.parse(fs.readFileSync(p, 'utf8'));
  return { dir, url: st.url, st };
}

// One reading per dial for one site.
function read(st) {
  const fam = st.palette.families ?? st.palette.chromatic;
  const t = (x) => st.tags.includes(x);
  return {
    colour: fam >= 4 ? 'bold' : 'calm',
    typeRatio: st.type.ratio >= 8 ? 10 : st.type.ratio >= 5 ? 6 : 4,
    imagery: t('photography') ? 'photo' : t('illustration') ? 'illustration' : t('type-only') ? 'type' : null,
    motion: !st.motion ? null : t('scroll-choreography') || t('css-scroll-device') ? 'story' : t('calm-motion') ? 'subtle' : 'subtle',
  };
}
const liked = likes.map(card);
const disliked = dislikes.map(card);
const majority = (vals) => {
  const c = {};
  for (const v of vals.filter((x) => x !== null)) c[v] = (c[v] || 0) + 1;
  const top = Object.entries(c).sort((a, b) => b[1] - a[1]);
  if (!top.length) return { value: null, agree: 0, of: 0 };
  return { value: isNaN(top[0][0]) ? top[0][0] : Number(top[0][0]), agree: top[0][1], of: vals.filter((x) => x !== null).length };
};
const readsL = liked.map((x) => read(x.st));
const readsD = disliked.map((x) => read(x.st));
const out = { suggested: {}, confidence: {}, sources: liked.map((x) => x.url), avoid: [] };
const words = {
  colour: { bold: 'warna berani (4+ keluarga warna)', calm: 'warna kalem (3 keluarga warna atau kurang)' },
  typeRatio: { 4: 'huruf tenang (judul sekitar 4× teks)', 6: 'huruf tegas (sekitar 6×)', 10: 'huruf ekspresif (10× ke atas)' },
  imagery: { photo: 'foto', illustration: 'ilustrasi', type: 'tipografi saja' },
  motion: { story: 'cerita lewat scroll', subtle: 'gerak halus' },
};
const lines = [];
for (const dial of ['colour', 'typeRatio', 'imagery', 'motion']) {
  const m = majority(readsL.map((r) => r[dial]));
  if (m.value === null) continue;
  out.suggested[dial] = m.value;
  out.confidence[dial] = m.of ? `${m.agree} of ${m.of}` : 'n/a';
  const disagree = m.agree < m.of;
  lines.push(`- ${words[dial][m.value]}: ${m.agree} dari ${m.of} situs yang disukai${disagree ? ' (tidak sepakat: tanyakan ke user)' : ''}`);
  const d = majority(readsD.map((r) => r[dial]));
  if (d.value !== null && d.value === m.value) lines.push(`  perhatian: situs yang TIDAK disukai juga ${words[dial][d.value]}; dial ini bukan pembedanya`);
}
for (const x of disliked) {
  const bad = x.st.tags.filter((tg) => ['glass', 'gradient-heavy', 'shadowed', 'ignores-reduced-motion', 'pop-up-on-load', 'endless-motion', 'many-type-sizes', 'layout-shift'].includes(tg));
  if (bad.length) out.avoid.push({ url: x.url, tags: bad });
}
if (out.avoid.length) lines.push(`- hindari (dari situs yang tidak disukai): ${[...new Set(out.avoid.flatMap((a) => a.tags))].join(', ')}`);
out.priceNearAction = true;
const dest = path.resolve(args.out || '.design/targets.suggested.json');
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, JSON.stringify(out, null, 2));
console.log(`Dial yang disarankan dari ${liked.length} situs yang disukai${disliked.length ? ` dan ${disliked.length} yang tidak` : ''}:`);
console.log(lines.join('\n'));
console.log(`\n${path.relative(process.cwd(), dest)}: tunjukkan ke user di gerbang arah; setelah disetujui, salin ke .design/targets.json.`);
