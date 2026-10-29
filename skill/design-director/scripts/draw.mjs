#!/usr/bin/env node
// Deals design directions so the first idea is not the category default.
// Reads the team library (library/directions.json, built from the team's own
// references) when it exists, otherwise the seed library from taste-skill.
//
//   node draw.mjs --sector <sector> [--tone <tone>] [--have product-photo,photography,...]
//                 [--options 3] [--seed N] [--exclude id1,id2] [--brief "one line"]
//   node draw.mjs --list sectors|tones
//   node draw.mjs --show <id>
//
// Writes each dealt direction to .design/directions/<letter>-<id>.md and prints
// a short card per direction for the direction gate.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const skillDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const teamLib = path.join(skillDir, 'library/directions.json');
const seedLib = path.join(skillDir, 'library/directions-seed.json');
const libPath = fs.existsSync(teamLib) ? teamLib : seedLib;
const lib = JSON.parse(fs.readFileSync(libPath, 'utf8'));

if (args.list) {
  const key = args.list === 'tones' ? 'tones' : 'sectors';
  console.log([...new Set(lib.flatMap((d) => d[key] || []))].sort().join('\n'));
  process.exit(0);
}
if (args.show) {
  const d = lib.find((x) => x.id === args.show);
  if (!d) {
    console.error(`No direction "${args.show}".`);
    process.exit(1);
  }
  console.log(render(d));
  process.exit(0);
}

// Seeded random, so a deal can be reproduced from its seed.
const seed = Number(args.seed) || Math.floor(Math.random() * 1e9);
let t = seed >>> 0;
const rand = () => {
  t += 0x6d2b79f5;
  let r = Math.imul(t ^ (t >>> 15), 1 | t);
  r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
  return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
};

const options = Math.max(1, Math.min(Number(args.options) || 3, 6));
const have = new Set(String(args.have || '').split(',').filter(Boolean));
const exclude = new Set(String(args.exclude || '').split(',').filter(Boolean));
const sector = args.sector;
const tone = args.tone;

let pool = lib.filter((d) => !exclude.has(d.id) && (d.needs || []).every((n) => have.has(n)));
const forSector = sector ? pool.filter((d) => (d.sectors || []).includes(sector)) : pool;
if (sector && forSector.length < options) {
  console.error(`Only ${forSector.length} directions list sector "${sector}"; adding general ones (sector "other").`);
  pool = [...forSector, ...pool.filter((d) => !forSector.includes(d) && (d.sectors || []).includes('other'))];
} else pool = forSector;
if (!pool.length) {
  console.error('No direction fits. Check --sector (see --list sectors) and --have.');
  process.exit(1);
}

const tags = (d) => new Set([...(d.sectionTags || []), ...(d.typeClasses || []), ...(d.paletteTags || [])]);
const distance = (a, b) => {
  const A = tags(a), B = tags(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  const union = new Set([...A, ...B]).size || 1;
  return 1 - inter / union;
};
const fit = (d) => 1 + (tone && (d.tones || []).includes(tone) ? 1 : 0) + rand() * 0.8;

// Greedy pick: good fit first, then the most different from what is already dealt.
const scored = pool.map((d) => ({ d, s: fit(d) }));
scored.sort((a, b) => b.s - a.s);
const dealt = [scored.shift().d];
while (dealt.length < options && scored.length) {
  scored.sort((a, b) => b.s * 0.5 + Math.min(...dealt.map((x) => distance(b.d, x))) - (a.s * 0.5 + Math.min(...dealt.map((x) => distance(a.d, x)))));
  dealt.push(scored.shift().d);
}

function firstSentences(text = '', n = 2) {
  return (text.match(/[^.!?]+[.!?]+/g) || [text]).slice(0, n).join('').trim();
}
function render(d) {
  const lines = [`# ${d.name} (${d.id})`, ''];
  for (const [k, label] of [
    ['idea', 'Idea'],
    ['composition', 'Composition'],
    ['typography', 'Typography'],
    ['colour', 'Colour'],
    ['imagery', 'Imagery'],
    ['richness', 'What makes it rich'],
    ['pitfalls', 'Pitfalls'],
  ])
    if (d[k]) lines.push(`## ${label}`, '', d[k], '');
  lines.push('## Tags', '');
  lines.push(`- Type classes: ${(d.typeClasses || []).join(', ')}`);
  lines.push(`- Palette tags: ${(d.paletteTags || []).join(', ')}`);
  lines.push(`- Section tags: ${(d.sectionTags || []).join(', ')}`);
  if (d.motion) lines.push(`- Motion: ${d.motion}`);
  if ((d.needs || []).length) lines.push(`- Needs: ${d.needs.join(', ')}`);
  return lines.join('\n');
}

const out = path.resolve('.design/directions');
fs.mkdirSync(out, { recursive: true });
for (const f of fs.readdirSync(out)) if (f.endsWith('.md')) fs.unlinkSync(path.join(out, f));
const letters = 'ABCDEF';
const cards = dealt.map((d, i) => {
  const file = path.join(out, `${letters[i]}-${d.id}.md`);
  fs.writeFileSync(file, render(d));
  return [
    `${letters[i]}. ${d.name}  (${d.id})`,
    `   Idea: ${firstSentences(d.idea)}`,
    `   Composition: ${firstSentences(d.composition, 1)}`,
    `   Type: ${(d.typeClasses || []).slice(0, 3).join(', ')} · Palette: ${(d.paletteTags || []).slice(0, 3).join(', ')}`,
    `   File: ${path.relative(process.cwd(), file)}`,
  ].join('\n');
});
fs.writeFileSync(
  path.join(out, 'deal.json'),
  JSON.stringify({ seed, library: path.basename(libPath), sector, tone, have: [...have], brief: args.brief || '', dealt: dealt.map((d) => d.id) }, null, 2)
);
console.log(`Dealt ${dealt.length} directions (seed ${seed}, library ${path.basename(libPath)}):\n`);
console.log(cards.join('\n\n'));
