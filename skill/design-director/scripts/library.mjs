#!/usr/bin/env node
// The team library the skill reads while designing (modes/create.md, direction step).
//
//   node library.mjs build [--data <repo>/data/references]   judged batches + style cards → library/index.json
//   node library.mjs find <words...> [--tags flat,pill-shapes] [--n 3]   closest references for a brief
//
// build runs in the repository after a batch is judged; the index ships inside the skill folder,
// so find works wherever the skill is installed. Patterns, numbers and verdicts only, never assets.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(here, '..', 'library', 'index.json');
const args = parseArgs(process.argv.slice(2));
const [cmd, ...words] = args._;

if (cmd === 'build') {
  const data = path.resolve(args.data || path.join(here, '..', '..', '..', 'data', 'references'));
  const batches = fs.readdirSync(data).filter((f) => /^batch-\d+\.json$/.test(f)).sort();
  const entries = [];
  for (const b of batches) {
    const batch = JSON.parse(fs.readFileSync(path.join(data, b), 'utf8'));
    for (const e of batch.entries || []) {
      const stylePath = path.join(data, 'captures', e.id, 'style.json');
      const style = fs.existsSync(stylePath) ? JSON.parse(fs.readFileSync(stylePath, 'utf8')) : null;
      const owner = e.owner || {};
      const business = e.business || {};
      entries.push({
        id: e.id,
        site: e.site,
        url: e.url,
        batch: batch.batch,
        review: `data/references/${b.replace('.json', '-review.md')}`,
        business: typeof business === 'string' ? business : [business.type, business.what].filter(Boolean).join(': '),
        actionThatPays: business.action_that_pays || null,
        scores: {
          ai: (e.jury_scores || {}).weighted ?? null,
          ownerOverall: owner.overall ?? null,
          ownerVisual: owner.visual ?? null,
          ownerShip: owner.ship ?? null,
          final: (e.combined || {}).final ?? null,
        },
        veto: e.veto || null,
        patternOnly: !!e.pattern_only,
        patterns: e.library_candidates || [],
        avoid: e.avoid || [],
        style: style
          ? {
              tags: style.tags,
              type: { families: style.type.families.map((f) => f.family), display: style.type.display, body: style.type.body, ratio: style.type.ratio, sizes: style.type.sizes.desktop.length },
              palette: { chromatic: style.palette.chromatic, gradients: style.palette.gradients, shadows: style.palette.shadows, backgrounds: style.palette.backgrounds.slice(0, 5) },
              radii: style.shape.radii.slice(0, 4),
              motion: style.motion,
              doNotCopy: style.doNotCopy,
            }
          : null,
      });
    }
  }
  const index = { builtAt: new Date().toISOString(), source: 'data/references (batch-*.json, captures/*/style.json)', count: entries.length, entries };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  const noStyle = entries.filter((e) => !e.style).map((e) => e.id);
  console.log(`library: ${entries.length} references → ${path.relative(process.cwd(), indexPath)}${noStyle.length ? ` (no style card yet: ${noStyle.join(', ')}; run style.mjs on their capture)` : ''}`);
} else if (cmd === 'find') {
  if (!fs.existsSync(indexPath)) {
    console.error('No library/index.json yet: the team has not stored any references.');
    process.exit(1);
  }
  const { entries } = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const want = words.join(' ').toLowerCase().split(/[^\p{L}\p{N}-]+/u).filter((w) => w.length > 2);
  const wantTags = String(args.tags || '').split(',').filter(Boolean);
  const scored = entries
    .map((e) => {
      const hay = `${e.business} ${e.patterns.join(' ')} ${(e.style ? e.style.tags : []).join(' ')}`.toLowerCase();
      const words = want.filter((w) => hay.includes(w)).length;
      const tags = e.style ? wantTags.filter((t) => e.style.tags.includes(t)).length : 0;
      return { e, score: words + tags * 2 + (e.scores.final || e.scores.ai || 0) / 10 };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(args.n || 3));
  for (const { e } of scored) {
    console.log(`${e.id} ${e.site} · final ${e.scores.final ?? '-'} (AI ${e.scores.ai ?? '-'}) · ${e.business.slice(0, 90)}`);
    if (e.style) console.log(`  style: ${e.style.tags.join(', ')} · type ${e.style.type.families.join(' + ')} ${e.style.type.display}/${e.style.type.body}px · ${e.style.palette.chromatic} colours`);
    for (const p of e.patterns.slice(0, 4)) console.log(`  pattern: ${p}`);
    if (e.veto) console.log(`  VETO: ${e.veto.slice(0, 160)}`);
    if (e.style && e.style.doNotCopy.length) console.log(`  do not copy: ${e.style.doNotCopy.slice(0, 3).join(' · ')}`);
  }
} else {
  console.error('Usage: node library.mjs build [--data dir] | find <words...> [--tags a,b] [--n 3]');
  process.exit(2);
}
