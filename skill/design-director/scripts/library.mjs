#!/usr/bin/env node
// The team library the skill reads while designing (modes/create.md, direction step).
//
//   node library.mjs build [--data <repo>/data/references]   judged batches + style cards → library/index.json
//   node library.mjs find <words...> [--tags flat,pill-shapes] [--n 3]   closest references for a brief
//   node library.mjs groups                                       the references grouped by sector and by style
//
// build runs in the repository after a batch is judged; the index ships inside the skill folder,
// so find works wherever the skill is installed. Patterns, numbers and verdicts only, never assets.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';
import { recipesForRef } from './motion.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const indexPath = path.join(here, '..', 'library', 'index.json');
const args = parseArgs(process.argv.slice(2));

// Sector from the business line, unless the entry names one. Indonesian and English words.
const SECTORS = [
  ['health', /clinic|klinik|health|kesehatan|therap|terapi|dental|gigi|medical|doctor|dokter|longevity|wellness|breastfeed|menyusui|sport|olahraga|tennis|tenis|fitness|gym|yoga|coach/i],
  ['event', /wedding|pernikahan|organizer|event|acara|conference|konferensi/i],
  ['fashion', /fashion|apparel|clothing|pakaian|busana|boutique|butik|streetwear|modest|hijab/i],
  ['food', /restaurant|restoran|cafe|kafe|coffee|kopi|food|makanan|bakery|catering|katering/i],
  ['software', /saas|software|app\b|platform|\bai\b|ai-|developer|tool|api\b/i],
  ['commerce', /shop|store|toko|e-?commerce|kits?\b|retail|marketplace|product/i],
  ['finance', /finance|bank|payment|pembayaran|insurance|asuransi|invest/i],
  ['education', /school|sekolah|course|kursus|education|pendidikan|learn/i],
  ['property', /property|properti|real estate|rumah|apartment|hotel|villa|guesthouse/i],
  ['beauty', /beauty|kecantikan|salon|skincare|cosmetic|kosmetik/i],
];
const sectorOf = (e) => e.sector || (SECTORS.find(([, re]) => re.test(e.business || '')) || ['other'])[0];

// Style features: six dimensions that decide how a page looks, so references group by them.
function features(st) {
  if (!st) return new Set();
  const f = new Set();
  const t = (x) => st.tags.includes(x);
  f.add(st.palette.gradients <= 3 && st.palette.shadows <= 3 ? 'surface:flat' : t('glass') ? 'surface:glass' : 'surface:gradient-shadow');
  const fam = st.palette.families ?? st.palette.chromatic;
  f.add(fam >= 4 ? 'colour:bold' : 'colour:calm');
  if (t('dark')) f.add('colour:dark');
  const r = st.type.ratio;
  f.add(r >= 8 ? 'type:expressive' : r >= 4.5 ? 'type:firm' : 'type:quiet');
  if (t('serif')) f.add('type:serif');
  if (t('rounded-type')) f.add('type:rounded');
  if (t('photography')) f.add('imagery:photo');
  else if (t('illustration')) f.add('imagery:illustration');
  else if (t('type-only')) f.add('imagery:type');
  if (st.motion) f.add(t('scroll-choreography') || t('css-scroll-device') ? 'motion:story' : t('calm-motion') ? 'motion:calm' : 'motion:subtle');
  f.add(t('pill-shapes') ? 'shape:pill' : t('sharp-corners') ? 'shape:sharp' : 'shape:soft');
  return f;
}
const jaccard = (a, b) => {
  const inter = [...a].filter((x) => b.has(x)).length;
  return inter / (new Set([...a, ...b]).size || 1);
};
// Grouping by the group's core (features most members share), not by any one member, so a group
// cannot drift by chaining: a reference joins the group whose core it matches best, if it matches enough.
function styleGroups(entries) {
  const groups = [];
  const core = (g) => {
    const count = {};
    for (const m of g.members) for (const t of m.style.features) count[t] = (count[t] || 0) + 1;
    return new Set(Object.entries(count).filter(([, n]) => n / g.members.length >= 0.5).map(([t]) => t));
  };
  for (const e of entries.filter((x) => x.style)) {
    const fe = new Set(e.style.features);
    let best = null;
    let bestScore = 0;
    for (const g of groups) {
      const sc = jaccard(fe, core(g));
      if (sc > bestScore) [best, bestScore] = [g, sc];
    }
    if (best && bestScore >= 0.45) best.members.push(e);
    else groups.push({ members: [e] });
  }
  return groups.map((g, i) => {
    const count = {};
    for (const m of g.members) for (const t of m.style.features) count[t] = (count[t] || 0) + 1;
    const shared = Object.entries(count).filter(([, n]) => n / g.members.length >= 0.6).sort((a, b) => b[1] - a[1]).map(([t]) => t);
    return { id: `style-${i + 1}`, name: shared.slice(0, 5).join(' · ') || 'mixed', shared, members: g.members.map((m) => m.id) };
  });
}
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
        site: e.site || (e.url || '').replace(/^https?:\/\/(www\.)?/, '').split(/[./]/)[0],
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
        sector: e.sector || null,
        // How it moves, kept so it can be used again: the tested recipes this reference showed
        // (motion/recipes.json → seen_in) and the notes of whoever read it (batch entry → motion_notes).
        motion: { recipes: recipesForRef(e.id), notes: e.motion_notes || [] },
        style: style
          ? {
              features: [...features(style)],
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
  for (const e of entries) e.sector = sectorOf(e);
  const groups = styleGroups(entries);
  for (const e of entries) e.styleGroup = (groups.find((g) => g.members.includes(e.id)) || {}).id || null;
  const sectors = {};
  for (const e of entries) (sectors[e.sector] = sectors[e.sector] || []).push(e.id);
  const index = { builtAt: new Date().toISOString(), source: 'data/references (batch-*.json, captures/*/style.json)', count: entries.length, sectors, groups, entries };
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  const noStyle = entries.filter((e) => !e.style).map((e) => e.id);
  console.log(`library: ${entries.length} references → ${path.relative(process.cwd(), indexPath)}${noStyle.length ? ` (no style card yet: ${noStyle.join(', ')}; run style.mjs on their capture)` : ''}`);
} else if (cmd === 'groups') {
  if (!fs.existsSync(indexPath)) {
    console.error('No library/index.json yet: run library.mjs build.');
    process.exit(1);
  }
  const { entries, sectors, groups } = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  const site = (id) => (entries.find((e) => e.id === id) || {}).site || id;
  console.log('By sector:');
  for (const [sec, ids] of Object.entries(sectors || {})) console.log(`  ${sec.padEnd(10)} ${ids.map(site).join(', ')}`);
  console.log('\nBy style:');
  for (const g of groups || []) console.log(`  ${g.id} (${g.members.length}): ${g.name}\n    ${g.members.map(site).join(', ')}`);
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
      const hay = `${e.sector} ${e.business} ${e.patterns.join(' ')} ${(e.style ? e.style.tags : []).join(' ')} ${e.motion ? `${e.motion.recipes.join(' ')} ${e.motion.notes.join(' ')}` : ''}`.toLowerCase();
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
    if (e.motion && (e.motion.recipes.length || e.motion.notes.length)) console.log(`  motion: ${e.motion.recipes.length ? `recipes ${e.motion.recipes.join(', ')} (node motion.mjs get <id>)` : 'no recipe yet'}${e.motion.notes.length ? ` · ${e.motion.notes.slice(0, 2).join(' · ')}` : ''}`);
    if (e.veto) console.log(`  VETO: ${e.veto.slice(0, 160)}`);
    if (e.style && e.style.doNotCopy.length) console.log(`  do not copy: ${e.style.doNotCopy.slice(0, 3).join(' · ')}`);
  }
} else {
  console.error('Usage: node library.mjs build [--data dir] | groups | find <words...> [--tags a,b] [--n 3]');
  process.exit(2);
}
