#!/usr/bin/env node
// Combines the votes of AI and human jurors (rubric/jury.md).
//
//   node jury.mjs score <dir> [--ref <id>] [--human-weight 0.5] [--json]
//   node jury.mjs rank  <dir> [--human-weight 0.5] [--json]
//
// <dir> holds one JSON file per juror: { juror, kind: "ai"|"human", scores: {criterion: 1-10},
// ranking: ["B","A","C"], veto: "reason" }. Humans may instead give visual and ship (1-10).
// Writes <dir>/summary.json.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const [cmd, dir] = args._;
if (!['score', 'rank'].includes(cmd) || !dir) {
  console.error('Usage: node jury.mjs score|rank <dir> [--human-weight 0.5] [--json]');
  process.exit(2);
}
const hw = args['human-weight'] !== undefined ? Number(args['human-weight']) : 0.5;
const WEIGHTS = { business: 20, customer: 20, story: 15, clarity: 15, distinctiveness: 15, craft: 15 };

// A juror file may judge several items at once ({ refs: { "ref-0001": {...} } }); --ref picks one.
const jurors = fs
  .readdirSync(dir)
  .filter((f) => f.endsWith('.json') && !f.startsWith('summary'))
  .map((f) => ({ file: f, ...JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')) }))
  .map((j) => (args.ref && j.refs ? (j.refs[args.ref] ? { juror: j.juror, kind: j.kind, ...j.refs[args.ref] } : null) : j))
  .filter(Boolean)
  // Two-score human votes: "visual" is the human view on the look (distinctiveness and craft),
  // "ship" (would I send this to a client) is the human overall. Explicit scores win.
  .map((j) =>
    j.kind === 'human' && (typeof j.visual === 'number' || typeof j.ship === 'number')
      ? {
          ...j,
          scores: { ...(typeof j.visual === 'number' ? { distinctiveness: j.visual, craft: j.visual } : {}), ...(j.scores || {}) },
          overall: typeof j.overall === 'number' ? j.overall : j.ship,
        }
      : j
  );
if (!jurors.length) {
  console.error(`No juror files in ${dir}`);
  process.exit(1);
}
const ai = jurors.filter((j) => j.kind !== 'human');
const humans = jurors.filter((j) => j.kind === 'human');
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const blend = (a, h) => (a === null ? h : h === null ? a : a * (1 - hw) + h * hw);
const r1 = (x) => (x === null ? null : Math.round(x * 10) / 10);
const vetoes = jurors.filter((j) => j.veto).map((j) => `${j.juror}: ${j.veto}`);

let summary;
if (cmd === 'score') {
  const criteria = [...new Set(jurors.flatMap((j) => Object.keys(j.scores || {})))];
  const rows = criteria.map((c) => {
    const all = jurors.filter((j) => j.scores && j.scores[c] !== undefined).map((j) => j.scores[c]);
    const a = mean(ai.filter((j) => j.scores && j.scores[c] !== undefined).map((j) => j.scores[c]));
    const h = mean(humans.filter((j) => j.scores && j.scores[c] !== undefined).map((j) => j.scores[c]));
    const spread = Math.max(...all) - Math.min(...all);
    return { criterion: c, ai: r1(a), human: r1(h), final: r1(blend(a, h)), spread, flag: spread >= 3 };
  });
  const weighted = rows.filter((r) => WEIGHTS[r.criterion]);
  const total = weighted.reduce((s, r) => s + r.final * WEIGHTS[r.criterion], 0) / (weighted.reduce((s, r) => s + WEIGHTS[r.criterion], 0) || 1);
  // A human may give one overall score instead of per-criterion scores; blend it with the
  // weighted score of everything else and flag a large gap.
  const humanOverall = mean(humans.filter((j) => typeof j.overall === 'number').map((j) => j.overall));
  const final = r1(blend(total, humanOverall));
  const gap = humanOverall === null ? null : r1(Math.abs(humanOverall - total));
  // Beautiful but not shippable (or the reverse) is a taste signal worth reading, not noise.
  const humanVisual = mean(humans.filter((j) => typeof j.visual === 'number').map((j) => j.visual));
  const humanShip = mean(humans.filter((j) => typeof j.ship === 'number').map((j) => j.ship));
  const visualVsShip = humanVisual === null || humanShip === null ? null : r1(humanVisual - humanShip);
  summary = { cmd, jurors: jurors.length, ai: ai.length, humans: humans.length, humanWeight: humans.length ? hw : 0, rows, weighted: r1(total), humanOverall: r1(humanOverall), final, gap, humanVisual: r1(humanVisual), humanShip: r1(humanShip), visualVsShip, vetoes };
  if (!args.json) {
    console.log(`${jurors.length} jurors (${ai.length} AI, ${humans.length} human)${humans.length ? `, human weight ${hw}` : ', AI only: no human votes yet'}\n`);
    console.log('criterion        AI    human  final  spread');
    for (const r of rows)
      console.log(`${r.criterion.padEnd(16)} ${String(r.ai ?? '-').padEnd(5)} ${String(r.human ?? '-').padEnd(6)} ${String(r.final).padEnd(6)} ${r.spread}${r.flag ? '  ← jurors disagree, read both sides' : ''}`);
    console.log(`\nWeighted score: ${summary.weighted}`);
    if (humanOverall !== null)
      console.log(`Human overall: ${summary.humanOverall} → final ${final}${gap >= 2 ? `  ← AI and humans are ${gap} apart: find out why before trusting either` : ''}`);
    if (visualVsShip !== null && Math.abs(visualVsShip) >= 2)
      console.log(`Humans: visual ${summary.humanVisual} vs would ship ${summary.humanShip}  ← ${visualVsShip > 0 ? 'liked the look more than they would ship it' : 'would ship it although the look is not their taste'}`);
  }
} else {
  // Borda count: in a ranking of n, first place gets n-1 points, last gets 0.
  const borda = (group) => {
    const pts = {};
    for (const j of group) (j.ranking || []).forEach((v, i, arr) => (pts[v] = (pts[v] || 0) + (arr.length - 1 - i)));
    return pts;
  };
  const norm = (pts, n) => Object.fromEntries(Object.entries(pts).map(([k, v]) => [k, n ? v / n : 0]));
  const aiPts = norm(borda(ai), ai.filter((j) => j.ranking).length);
  const huPts = norm(borda(humans), humans.filter((j) => j.ranking).length);
  const variants = [...new Set(jurors.flatMap((j) => j.ranking || []))];
  const hasHumans = humans.some((j) => j.ranking);
  const final = variants
    .map((v) => ({ variant: v, ai: r1(aiPts[v] ?? 0), human: hasHumans ? r1(huPts[v] ?? 0) : null, final: r1(hasHumans ? (aiPts[v] ?? 0) * (1 - hw) + (huPts[v] ?? 0) * hw : aiPts[v] ?? 0) }))
    .sort((a, b) => b.final - a.final);
  const humanTop = hasHumans ? Object.entries(huPts).sort((a, b) => b[1] - a[1])[0][0] : null;
  const agreement = ai.filter((j) => j.ranking).map((j) => ({ juror: j.juror, agreesWithHumans: humanTop ? j.ranking[0] === humanTop : null }));
  summary = { cmd, jurors: jurors.length, ai: ai.length, humans: humans.length, ranking: final, winner: final[0].variant, humanTop, agreement, vetoes };
  if (!args.json) {
    console.log(`${jurors.length} jurors (${ai.length} AI, ${humans.length} human)\n`);
    console.log('variant  AI     human  final');
    for (const r of final) console.log(`${r.variant.padEnd(8)} ${String(r.ai).padEnd(6)} ${String(r.human ?? '-').padEnd(6)} ${r.final}`);
    console.log(`\nWinner: ${summary.winner}${humanTop ? ` · designers' first choice: ${humanTop}` : ''}`);
    if (humanTop) for (const a of agreement) console.log(`  ${a.juror}: ${a.agreesWithHumans ? 'agrees' : 'disagrees'} with the designers`);
  }
}
if (vetoes.length && !args.json) console.log(`\nVETO (cannot be outvoted):\n  ${vetoes.join('\n  ')}`);
fs.writeFileSync(path.join(dir, args.ref ? `summary-${args.ref}.json` : 'summary.json'), JSON.stringify(summary, null, 2));
if (args.json) console.log(JSON.stringify(summary, null, 2));
