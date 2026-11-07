#!/usr/bin/env node
// Keeps the run honest: the order of steps, the approvals at each gate, and the
// turn-back protocol. State lives in .design/progress.json; every change is
// appended to .design/decisions.log.
//
//   node progress.mjs init --mode create|review|restyle|redesign|section|site|brand
//                          [--effort quick|standard|thorough] [--gates guided|quick|autopilot]
//                          [--variants 1-3] [--choose jury|user]
//   Several variants: build .design/variants/v1 … vN/index.html; the jury (choice.json) or the
//   user (approve variant) picks the one to deliver.
//   node progress.mjs status | next
//   node progress.mjs check <step>              exit 1 if the step may not start yet
//   node progress.mjs done <step> [--note "..."]
//   node progress.mjs approve <brief|strategy|direction|choose|final> [--by user|claude] [--note "..."]
//   node progress.mjs skip <step> --reason "..."
//   node progress.mjs back <step> --reason "..." turn back: reopen this step and all after it
//   node progress.mjs log "<decision>" [--step s] [--by user|claude]
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib/browser.mjs';
import { validateKit } from './lib/brandkit.mjs';

const DIR = path.resolve('.design');
const STATE = path.join(DIR, 'progress.json');
const LOG = path.join(DIR, 'decisions.log');

// Steps per mode. "step:gate" means the step needs that approval before it can
// be marked done. Research and roast run in every mode: they are not optional.
const FLOWS = {
  create: ['brief:brief', 'research', 'strategy', 'roast:strategy', 'direction:direction', 'skeleton', 'spec', 'copy', 'build', 'reason', 'gate', 'look', 'deliver:final', 'learn'],
  site: ['brief:brief', 'research', 'sitemap', 'strategy', 'roast:strategy', 'direction:direction', 'skeleton', 'system', 'spec', 'copy', 'build', 'reason', 'gate', 'look', 'deliver:final', 'learn'],
  section: ['brief:brief', 'research', 'spec', 'roast', 'build', 'reason', 'gate', 'look', 'deliver:final'],
  review: ['context', 'research', 'before', 'reason', 'review', 'roast', 'deliver:final'],
  restyle: ['context', 'research', 'before', 'review', 'roast', 'choose:choose', 'fix', 'reason', 'after', 'gate', 'deliver:final', 'learn'],
  brand: ['brief:brief', 'research', 'strategy', 'roast:strategy', 'brand-directions:direction', 'kit', 'deliver:final', 'learn'],
  redesign: ['context', 'research', 'before', 'review', 'strategy', 'roast:strategy', 'choose:choose', 'direction:direction', 'spec', 'fix', 'reason', 'after', 'gate', 'deliver:final', 'learn'],
};
const stepsOf = (mode) => FLOWS[mode].map((x) => x.split(':')[0]);
const gateOf = (mode, step) => (FLOWS[mode].find((x) => x.split(':')[0] === step) || '').split(':')[1];
// Steps an effort level may skip, with a reason. Research and roast are never
// skippable; quick effort runs them in their light form.
const SKIPPABLE = {
  quick: ['skeleton', 'look', 'learn'],
  standard: ['learn'],
  thorough: [],
};
// Files that must exist before a step counts as done.
const EVIDENCE = {
  brief: 'brief.md',
  research: 'research.md',
  strategy: 'strategy.md',
  roast: 'roast.md',
  sitemap: 'sitemap.md',
  spec: 'spec.md',
  copy: 'copy.md',
  reason: 'reason.md',
  look: 'critique.md',
  review: 'critique.md',
  before: 'before/report.json',
  after: 'inspect/report.json',
};

const args = parseArgs(process.argv.slice(2));
const [cmd, arg] = args._;
const now = () => new Date().toISOString();
const fail = (msg) => {
  console.error(`REFUSED: ${msg}`);
  process.exit(1);
};
const load = () => {
  if (!fs.existsSync(STATE)) fail('No run in this folder. Start one with: progress.mjs init --mode <mode>');
  return JSON.parse(fs.readFileSync(STATE, 'utf8'));
};
const save = (s) => fs.writeFileSync(STATE, JSON.stringify(s, null, 2));
const log = (line) => fs.appendFileSync(LOG, `${now()}\t${line}\n`);
// Rows of a markdown table under a heading: [[cell, cell, …], …], header and divider rows dropped.
const tableRows = (text, heading) => {
  const at = text.search(new RegExp(`^##\\s*(${heading})\\b`, 'im'));
  if (at < 0) return [];
  const body = text.slice(at).split('\n').slice(1);
  const end = body.findIndex((l) => /^##\s/.test(l));
  return (end < 0 ? body : body.slice(0, end))
    .filter((l) => /^\s*\|/.test(l) && !/^\s*\|[\s:|-]+\|\s*$/.test(l))
    .map((l) => l.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim()))
    .filter((cells) => !/^(#|id|element|source|sumber|decision|keputusan)$/i.test(cells[0]) && !/^(#|id)$/i.test(cells[0]));
};
const section = (text, heading) => {
  const at = text.search(new RegExp(`^##\\s*(${heading})\\b`, 'im'));
  if (at < 0) return '';
  const rest = text.slice(at).split('\n');
  const end = rest.slice(1).findIndex((l) => /^##\s/.test(l));
  return (end < 0 ? rest : rest.slice(0, end + 1)).join('\n');
};

// brand-kit.md carries the five headings of brand/method.md §8, and its Tests name the five tests (§6).
function brandKitProblems() {
  const kp = path.join(DIR, 'brand-kit.md');
  if (!fs.existsSync(kp)) return ['.design/brand-kit.md does not exist (brand/method.md §8)'];
  const t = fs.readFileSync(kp, 'utf8');
  const out = [];
  const missing = ['Sources', 'Elements', 'Hero element', 'Rules of use', 'Tests'].filter((h) => !new RegExp(`^##\\s*${h}\\b`, 'im').test(t));
  if (missing.length) out.push(`.design/brand-kit.md has no ${missing.join(', ')} section (brand/method.md §8)`);
  else {
    const tests = section(t, 'Tests');
    const absent = ['cover', 'blur', 'swap', 'down', 'source'].filter((w) => !new RegExp(`\\b${w}`, 'i').test(tests));
    if (absent.length) out.push(`.design/brand-kit.md "## Tests" does not record the ${absent.join(', ')} test(s) (brand/method.md §6)`);
  }
  return out;
}

// Modes whose spec holds the page's motion spec and whose delivery is a page (.design/deliver.md),
// and modes whose brief asks for the materials (rules/brief-interview.md → Materials).
const PAGE_MODES = ['create', 'site', 'redesign'];
const MATERIAL_MODES = ['create', 'site', 'brand'];
const readDesign = (f) => (fs.existsSync(path.join(DIR, f)) ? fs.readFileSync(path.join(DIR, f), 'utf8') : '');
// "Key: value" line inside a block of text (bullets and bold allowed).
const lineValue = (text, key) => {
  const m = text.match(new RegExp(`^\\s*(?:[-*]\\s*)?\\**(?:${key})\\**\\s*:\\s*(.*)$`, 'im'));
  return m ? m[1].trim() : null;
};
// An admin request on the brief's What line (rules/stack.md); a page about a dashboard product is not one.
const ADMIN = /\b(admin|back[- ]?office|backoffice|dashboard|dasbor)\b/i;
const NOT_ADMIN = /\b(landing|marketing|website|situs|company profile|profil perusahaan)\b/i;
const AGREED = /\b(agreed|approved|disetujui|setuju|the user'?s|milik (user|pengguna|klien)|existing|sudah ada|design system)\b/i;
const NONE_FOUND = /^\(?(none found|tidak ditemukan|belum ditemukan)/i;

// The motion spec names the message and its signature motion, the entrance and the state
// transitions; with no message found it records the offer to the user (motion/functions.md).
function motionProblems(spec) {
  const mo = section(spec, 'Motion spec|Spesifikasi gerak');
  if (!mo) return ['spec.md has no "## Motion spec" section (motion/functions.md)'];
  const out = [];
  const msg = lineValue(mo, 'Message|Pesan');
  if (!msg || msg.length < 8) out.push('the Motion spec has no "Message:" line naming the site\'s message (or "Message: none found" with "Offered to the user: …")');
  else if (NONE_FOUND.test(msg)) {
    if (!/offered to the user|ditawarkan ke (user|pengguna)/i.test(mo)) out.push('"Message: none found" needs an "Offered to the user: <the motion that could carry the message>" note: do not invent motion, offer it in the deliver report');
  } else if (!lineValue(mo, 'Signature motion|Gerak khas') || lineValue(mo, 'Signature motion|Gerak khas').length < 8)
    out.push('the Motion spec names a message but no "Signature motion:" line: the one movement that shows it');
  const ent = lineValue(mo, 'Entrance|Pembuka');
  if (!ent || ent.length < 8) out.push('the Motion spec has no "Entrance:" line: an entrance on first load is required, with its reduced-motion version (owner\'s requirement 1)');
  if (!lineValue(mo, 'State transitions|Transisi')) out.push('the Motion spec has no "State transitions:" line: how each state change moves, or "none: no state changes"');
  return out;
}

// What the brief planned for missing materials: dummy or drawn pictures, a mock of the product UI.
function materialsPlan(brief) {
  const rows = tableRows(brief, 'Materials|Bahan');
  const row = (re) => rows.filter((c) => re.test(c[0] || '')).map((c) => c.slice(1).join(' ')).join(' ');
  return {
    dummyPictures: /\b(dummy|dummies|drawn|digambar|ilustrasi|illustration|placeholder)/i.test(row(/photo|foto|picture|gambar/i)),
    sampleUi: /\b(mock|sample|contoh|tiruan|dummy)/i.test(row(/\bui\b|interface|antarmuka|screenshot|figma/i)),
  };
}

function newestSourceMtime(root = process.cwd()) {
  let newest = 0;
  const SKIP = /^(node_modules|\.git|\.design|dist|build|\.next|\.astro|coverage|\.taste-skill)$/;
  const EXT = /\.(html?|css|scss|js|jsx|ts|tsx|vue|svelte|astro|json|svg)$/i;
  const walk = (d) => {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      if (SKIP.test(f.name)) continue;
      const p = path.join(d, f.name);
      if (f.isDirectory()) walk(p);
      else if (EXT.test(f.name)) newest = Math.max(newest, fs.statSync(p).mtimeMs);
    }
  };
  walk(root);
  return newest;
}

function blockers(s, step) {
  const flow = stepsOf(s.mode);
  const i = flow.indexOf(step);
  if (i < 0) return [`"${step}" is not a step of mode ${s.mode}. Steps: ${flow.join(' → ')}`];
  return flow.slice(0, i).filter((p) => !['done', 'skipped'].includes(s.steps[p].status)).map((p) => `step "${p}" is not done`);
}

function summary(s) {
  const flow = stepsOf(s.mode);
  const marks = { done: '✓', skipped: '–', pending: '·' };
  const line = flow
    .map((p) => {
      const g = gateOf(s.mode, p);
      return `${marks[s.steps[p].status]} ${p}${g ? (s.approvals[g] ? ` [${g} approved]` : ` [${g} gate]`) : ''}`;
    })
    .join('\n  ');
  const next = flow.find((p) => s.steps[p].status === 'pending');
  const v = (s.variants || 1) > 1 ? ` · ${s.variants} variants, chosen by the ${s.choose}` : '';
  return `Mode ${s.mode} · effort ${s.effort} · gates ${s.gates}${v}\n  ${line}\nNext: ${next || 'nothing; the run is complete'}`;
}

switch (cmd) {
  case 'init': {
    const mode = args.mode;
    if (!FLOWS[mode]) fail(`--mode must be one of ${Object.keys(FLOWS).join(', ')}`);
    if (fs.existsSync(STATE) && !args.force) fail('A run already exists here. Use `status`, `back <step>` to revise, or `init --force` to start over.');
    const effort = args.effort || (mode === 'section' ? 'quick' : 'standard');
    const gates = args.gates || 'guided';
    if (!SKIPPABLE[effort]) fail('--effort must be quick, standard or thorough');
    if (!['guided', 'quick', 'autopilot'].includes(gates)) fail('--gates must be guided, quick or autopilot');
    fs.mkdirSync(DIR, { recursive: true });
    const variants = Number(args.variants || (effort === 'thorough' ? 3 : 1));
    if (!(variants >= 1 && variants <= 3)) fail('--variants must be 1, 2 or 3');
    const choose = args.choose || (gates === 'autopilot' ? 'jury' : 'user');
    if (!['jury', 'user'].includes(choose)) fail('--choose must be jury or user');
    if (choose === 'user' && gates === 'autopilot') fail('An autopilot run has no user to choose: use --choose jury');
    const s = { mode, effort, gates, variants, choose, created: now(), steps: {}, approvals: {}, history: [] };
    for (const p of stepsOf(mode)) s.steps[p] = { status: 'pending' };
    save(s);
    log(`init mode=${mode} effort=${effort} gates=${gates} variants=${variants} choose=${choose}`);
    console.log(summary(s));
    break;
  }
  case 'status':
  case 'next':
    console.log(summary(load()));
    break;
  case 'check': {
    const s = load();
    const b = blockers(s, arg);
    if (b.length) fail(`"${arg}" cannot start yet: ${b.join('; ')}`);
    console.log(`OK: "${arg}" may start.`);
    break;
  }
  case 'approve': {
    const s = load();
    const gate = arg;
    const variantGate = gate === 'variant' && (s.variants || 1) > 1;
    if (!variantGate && !stepsOf(s.mode).some((p) => gateOf(s.mode, p) === gate)) fail(`Mode ${s.mode} has no gate "${gate}". Its gates: ${[...new Set(stepsOf(s.mode).map((p) => gateOf(s.mode, p)).filter(Boolean))].join(', ')}`);
    const by = args.by || (s.gates === 'autopilot' ? 'claude' : 'user');
    if (by === 'claude' && s.gates !== 'autopilot') fail('Only the user approves a gate unless the run uses --gates autopilot.');
    s.approvals[gate] = { by, at: now(), note: args.note || '' };
    save(s);
    log(`approve ${gate} by=${by}${args.note ? ` note=${args.note}` : ''}`);
    console.log(`Approved ${gate} (${by}).`);
    break;
  }
  case 'done': {
    const s = load();
    const step = arg;
    const b = blockers(s, step);
    if (b.length) fail(`Cannot mark "${step}" done: ${b.join('; ')}`);
    const gate = gateOf(s.mode, step);
    if (gate && !s.approvals[gate]) fail(`"${step}" needs the ${gate} approval first. Show it to the user, then run: approve ${gate}`);
    if (EVIDENCE[step] && !fs.existsSync(path.join(DIR, EVIDENCE[step]))) fail(`"${step}" needs .design/${EVIDENCE[step]} to exist first.`);
    if (step === 'roast') {
      // Every point gets its own answer: accepted with the change, or rejected with a reason.
      const r = fs.readFileSync(path.join(DIR, 'roast.md'), 'utf8');
      if (!/##\s*(Response|Tanggapan)/i.test(r)) fail('roast.md needs a "## Response" section answering every point (accepted and changed, or rejected with a reason).');
      const points = tableRows(r, 'Points|Poin').map((c) => c[0]).filter((n) => /^\d+$/.test(n));
      if (points.length < 3) fail('roast.md needs a "## Points" table with at least three numbered points (roast/method.md): a roast with fewer found nothing or was not done.');
      const answers = new Map(tableRows(r, 'Response|Tanggapan').map((c) => [c[0], c]));
      const unanswered = points.filter((n) => {
        const a = answers.get(n);
        return !a || !/^(accept|reject|diterima|ditolak|terima|tolak)/i.test(a[1] || '') || (a[2] || '').length < 8;
      });
      if (unanswered.length) fail(`roast.md: point(s) ${unanswered.join(', ')} have no answer in the Response table (| # | Accepted or Rejected | what changed, or why not |).`);
    }
    if (step === 'research') {
      const r = fs.readFileSync(path.join(DIR, 'research.md'), 'utf8');
      if (!/##\s*(Sources|Sumber)/i.test(r)) fail('research.md needs a "## Sources" section listing what was read, with dates.');
      const srcs = tableRows(r, 'Sources|Sumber').filter((c) => (c[1] || '').length >= 4);
      if (srcs.length < 3) fail(`research.md lists ${srcs.length} source(s): read at least three (the user's materials, competitors, customer voice) and list each in the Sources table.`);
    }
    if (step === 'reason') {
      // Every numbered element of the built page has a verdict (rubric/reason.md).
      const nvr = s.variants || 1;
      const dirs = nvr > 1 && s.mode !== 'review' ? Array.from({ length: nvr }, (_, i) => `variants/v${i + 1}`) : ['.'];
      for (const d of dirs) {
        const ej = path.join(DIR, d, 'reason', 'elements.json');
        const rm = path.join(DIR, d, 'reason.md');
        const rel = (f) => path.relative(DIR, f);
        if (!fs.existsSync(ej)) fail(`Photograph the page with numbered elements first: elements.mjs <page> --out .design/${rel(path.dirname(ej))}`);
        if (!fs.existsSync(rm)) fail(`Write .design/${rel(rm)}: a verdict for every element (rubric/reason.md).`);
        const ids = JSON.parse(fs.readFileSync(ej, 'utf8')).elements.map((e) => e.id);
        const text = fs.readFileSync(rm, 'utf8');
        const rows = new Map();
        for (const line of text.split('\n')) {
          const m = line.match(/^\|\s*(E\d+)\s*\|/);
          if (!m) continue;
          const cells = line.split('|').map((c) => c.trim()).filter(Boolean);
          rows.set(m[1], cells[cells.length - 1]);
        }
        const VERDICT = /^(keep|fix|merge|cut|pertahankan|perbaiki|gabung(kan)?|buang)\b/i;
        const missing = ids.filter((id) => !rows.has(id));
        const noVerdict = ids.filter((id) => rows.has(id) && !VERDICT.test(rows.get(id)));
        if (missing.length) fail(`.design/${rel(rm)} has no row for ${missing.slice(0, 10).join(', ')}${missing.length > 10 ? ` and ${missing.length - 10} more` : ''}: every element needs its job and a verdict.`);
        if (noVerdict.length) fail(`.design/${rel(rm)}: ${noVerdict.slice(0, 10).join(', ')} end without a verdict (keep, fix, merge or cut).`);
        const acted = ids.filter((id) => /^(fix|merge|cut|perbaiki|gabung|buang)/i.test(rows.get(id)));
        if (acted.length && s.mode !== 'review') {
          const resp = section(text, 'Response|Tanggapan');
          if (!resp) fail(`.design/${rel(rm)} has fix, merge or cut verdicts: add a "## Response" section saying what was done for each.`);
          const silent = acted.filter((id) => !new RegExp(`\\b${id}\\b`).test(resp));
          if (silent.length) fail(`.design/${rel(rm)} Response does not say what was done for ${silent.join(', ')}.`);
          // A cut is checked on the page itself: photograph it again and the element must be gone.
          const cut = ids.filter((id) => /^(cut|buang)/i.test(rows.get(id)));
          if (cut.length) {
            const after = path.join(DIR, d, 'reason', 'after', 'elements.json');
            if (!fs.existsSync(after)) fail(`Elements were cut (${cut.join(', ')}): photograph the changed page again with elements.mjs <page> --out .design/${rel(path.dirname(after))} so the cuts can be checked.`);
            const before = JSON.parse(fs.readFileSync(ej, 'utf8')).elements;
            const now = JSON.parse(fs.readFileSync(after, 'utf8')).elements;
            const key = (e) => `${e.kind}|${(e.label || e.src || e.inside || '').toLowerCase()}`;
            const still = new Set(now.map(key));
            const left = cut.filter((id) => {
              const e = before.find((x) => x.id === id);
              return e && (e.label || e.src) && still.has(key(e));
            });
            if (left.length) fail(`Cut but still on the page: ${left.map((id) => `${id} "${(before.find((x) => x.id === id).label || '').slice(0, 40)}"`).join(', ')}. Remove them, photograph again, or change the verdict with a reason.`);
          }
        }
      }
    }
    if (step === 'copy') {
      // The reader and the voice are written down, and the copy passes the reading checks (copy/method.md).
      const vp = path.join(DIR, 'voice.md');
      if (!fs.existsSync(vp)) fail('Write .design/voice.md first: the reader, the voice and the glossary (copy/method.md).');
      const v = fs.readFileSync(vp, 'utf8');
      const missing = [['Reader', 'Pembaca'], ['Voice', 'Suara'], ['Glossary', 'Glosarium']].filter((h) => !new RegExp(`^##\\s*(${h.join('|')})\\b`, 'im').test(v)).map((h) => h[0]);
      if (missing.length) fail(`.design/voice.md has no ${missing.join(', ')} section (copy/method.md).`);
      const cp = path.join(DIR, 'copycheck.json');
      if (!fs.existsSync(cp)) fail('Run copycheck.mjs .design/copy.md --voice .design/voice.md before marking the copy done.');
      const cc = JSON.parse(fs.readFileSync(cp, 'utf8'));
      if (Date.parse(cc.time) < fs.statSync(path.join(DIR, 'copy.md')).mtimeMs) fail('copy.md changed after the last copycheck: run it again.');
      if (cc.summary.fail > 0) fail(`copycheck found ${cc.summary.fail} FAIL (${cc.findings.filter((f) => f.severity === 'FAIL').map((f) => f.rule).join(', ')}): rewrite, then run it again.`);
      if (!/##\s*(Reader tests|Tes pembaca)/i.test(fs.readFileSync(path.join(DIR, 'copy.md'), 'utf8'))) fail('copy.md needs a "## Reader tests" section: the skim test and the explain-back test (copy/method.md §6).');
    }
    if (step === 'spec') {
      const sp = fs.readFileSync(path.join(DIR, 'spec.md'), 'utf8');
      if (!/##\s*(Interactions|Interaksi)/i.test(sp)) fail('spec.md needs an "## Interactions" section: every element the visitor operates, with what it reveals and the customer question it answers, or "none" (motion/functions.md → Interactions).');
      const ix = section(sp, 'Interactions|Interaksi');
      const rows = tableRows(sp, 'Interactions|Interaksi').filter((c) => c.length >= 4 && !/^element$/i.test(c[0]));
      if (!rows.length && !/\b(none|tidak ada)\b/i.test(ix)) fail('spec.md "## Interactions" is empty: list each interaction in the table, or write "none".');
      const noPurpose = rows.filter((c) => (c[3] || '').length < 4).map((c) => c[0]);
      if (noPurpose.length) fail(`spec.md Interactions: ${noPurpose.join(', ')} name no customer question (fourth column). An interaction with no purpose is cut, not built.`);
    }
    if (step === 'brief' && MATERIAL_MODES.includes(s.mode)) {
      // Photos, product UI and brand assets were asked for, and the plan for what is missing is written down.
      const mat = section(readDesign('brief.md'), 'Materials|Bahan');
      if (!mat) fail('brief.md needs a "## Materials" section: photos, product UI (or n/a) and brand assets, what exists and the plan for what is missing (rules/brief-interview.md → Materials).');
      const absent = [['photos', /photo|foto/i], ['product UI', /\bui\b|interface|antarmuka|screenshot|figma/i], ['brand assets', /brand|logo/i]].filter(([, re]) => !re.test(mat)).map(([n]) => n);
      if (absent.length) fail(`brief.md "## Materials" does not record ${absent.join(', ')}: ask for each (plain question, what it changes, an example) and write what exists and the plan (rules/brief-interview.md → Materials).`);
    }
    if (step === 'brief') {
      // Admin panels, dashboards, back offices name their component library; the default is shadcn/ui (rules/stack.md).
      const brief = readDesign('brief.md');
      const what = lineValue(brief, 'What|Apa') || '';
      const lib = lineValue(brief, 'Component library|Library komponen|Pustaka komponen');
      if (ADMIN.test(what) && !NOT_ADMIN.test(what) && !lib)
        fail('brief.md asks for an admin panel, dashboard or back office: add a "- Component library:" line. With none agreed, use shadcn/ui (React + Tailwind) as the default and tell the user why (rules/stack.md).');
      if (lib && !/shadcn/i.test(lib) && !AGREED.test(lib))
        fail(`brief.md "Component library: ${lib}": a library other than the shadcn/ui default needs the user's agreement on that line ("agreed", "the user's design system", "existing") (rules/stack.md).`);
      if (lib && /shadcn/i.test(lib) && /default|bawaan/i.test(lib) && !(fs.existsSync(LOG) && /component-library default/i.test(fs.readFileSync(LOG, 'utf8'))))
        log('decision step=brief by=claude component-library default: shadcn/ui (React + Tailwind) until the user approves another; consistent, accessible components, fast to build, restyled with tokens (rules/stack.md)');
    }
    if (step === 'spec' && PAGE_MODES.includes(s.mode)) {
      const probs = motionProblems(readDesign('spec.md'));
      if (probs.length) fail(`spec.md: ${probs.join('; ')} (motion/functions.md).`);
    }
    if (step === 'deliver' && PAGE_MODES.includes(s.mode)) {
      // The package is written down, and it carries what the earlier steps promised the user.
      const dm = readDesign('deliver.md');
      if (!dm) fail('Write the deliver package to .design/deliver.md first (modes/create.md step 13).');
      const better = section(dm, 'Supaya lebih bagus');
      if (!better) fail('.design/deliver.md needs a "## Supaya lebih bagus" section: at most five things the user can supply or decide, each with what it would change (SKILL.md, final gate).');
      const msg = lineValue(section(readDesign('spec.md'), 'Motion spec|Spesifikasi gerak'), 'Message|Pesan');
      if (msg && NONE_FOUND.test(msg) && !/motion|animasi|gerak/i.test(better))
        fail('The motion spec found no message to move: offer the signature motion to the user in .design/deliver.md "## Supaya lebih bagus" (motion/functions.md).');
      const plan = materialsPlan(readDesign('brief.md'));
      if (plan.dummyPictures && !/shot list|daftar (foto|gambar)/i.test(dm))
        fail('The brief planned drawn or dummy pictures: say so in .design/deliver.md with the shot list (rules/brief-interview.md → Materials).');
      if (plan.sampleUi && !/sample ui|data-sample|ui contoh|tiruan|mock/i.test(dm))
        fail('The brief planned a mock of the product UI: list the sample UI (data-sample) in .design/deliver.md with what to send to replace it (rules/brief-interview.md → Materials).');
    }
    if (step === 'brand-directions') {
      const bp = path.join(DIR, 'brand', 'board.html');
      if (!fs.existsSync(bp)) fail('"brand-directions" needs the board: brandboard.mjs .design/brand/directions.json --out .design/brand (modes/brand.md).');
      const n = (fs.readFileSync(bp, 'utf8').match(/<section class="kit"/g) || []).length;
      if (n < 2) fail(`.design/brand/board.html shows ${n} direction(s): show 2-3 brand directions on one board so the user can choose.`);
    }
    if (step === 'kit') {
      const probs = brandKitProblems();
      const jp = path.join(DIR, 'brand-kit.json');
      if (!fs.existsSync(jp)) probs.push('.design/brand-kit.json does not exist (brand/method.md §10)');
      else {
        let kit = null;
        try { kit = JSON.parse(fs.readFileSync(jp, 'utf8')); } catch { probs.push('.design/brand-kit.json is not valid JSON'); }
        if (kit) probs.push(...validateKit(kit, 'brand-kit.json'));
      }
      if (probs.length) fail(`"kit" is not done: ${probs.join('; ')}.`);
    }
    if (step === 'deliver' && s.mode === 'brand' && !fs.existsSync(path.join(DIR, 'brand', 'board.pdf')))
      fail('The brand delivery includes the board as a PDF: brandboard.mjs .design/brand-kit.json --out .design/brand (writes board.pdf).');
    if (step === 'direction') {
      // The page's brand elements are decided before the spec: a kit from a brand run, a short kit, or (autopilot) a logged default.
      const probs = brandKitProblems();
      const logged = fs.existsSync(LOG) && /brand-kit default/i.test(fs.readFileSync(LOG, 'utf8'));
      if (probs.length && !(s.gates === 'autopilot' && logged))
        fail(`"direction" needs the brand kit: ${probs.join('; ')}. Read .design/brand-kit.json from a brand run, or write a short kit with brand/method.md${s.gates === 'autopilot' ? '; in autopilot you may instead log a default: log "brand-kit default: <hero element, supporting elements>"' : ''}.`);
    }
    if (step === 'direction' && !fs.existsSync(path.join(DIR, 'directions'))) fail('"direction" needs the dealt directions in .design/directions/.');
    if (step === 'direction' && s.gates === 'guided') {
      const dd = path.join(DIR, 'directions');
      const sketches = fs.existsSync(dd) ? fs.readdirSync(dd).filter((f) => /^sketch-.*\.html$/.test(f)) : [];
      if (sketches.length < 2) fail('With guided gates the user chooses from pictures: build a first-screen sketch per direction (.design/directions/sketch-a.html, sketch-b.html …) and show them with compare.mjs (rules/brief-interview.md).');
    }
    if (step === 'direction' && !fs.existsSync(path.join(DIR, 'targets.json')))
      fail('"direction" needs .design/targets.json: the visual dials the user chose (rules/visual-dials.md), or team/visual-defaults.json copied with the reason.');
    if (step === 'look') {
      // At standard and thorough the look is a jury: at least two independent juror files.
      const c = fs.existsSync(path.join(DIR, 'critique.md')) ? fs.readFileSync(path.join(DIR, 'critique.md'), 'utf8') : '';
      if (s.effort !== 'quick' && !/not independent|tidak independen/i.test(c)) {
        const jd = path.join(DIR, 'jury');
        const jurors = fs.existsSync(jd)
          ? fs.readdirSync(jd, { recursive: true }).filter((f) => /\.json$/.test(f) && !/summary|owner|_/.test(path.basename(f))).filter((f) => {
              try { return JSON.parse(fs.readFileSync(path.join(jd, f), 'utf8')).kind === 'ai'; } catch { return false; }
            })
          : [];
        const need = s.effort === 'thorough' ? 5 : 2;
        if (jurors.length < need) fail(`At ${s.effort} effort the look is done by at least ${need === 2 ? 'two' : need} AI jurors (rubric/jury.md → Panel size): put their files in .design/jury/<round>/. Without subagents, say "not independent" in critique.md.`);
      }
      const ir = path.join(DIR, 'inspect/report.json');
      if ((s.variants || 1) === 1 && fs.existsSync(ir) && newestSourceMtime() > Date.parse(JSON.parse(fs.readFileSync(ir, 'utf8')).time))
        fail('The page changed after the last inspection (reason or look fixes): inspect again before the look is done.');
    }
    if (step === 'look' && fs.existsSync(path.join(DIR, 'targets.json'))) {
      const fp = path.join(DIR, 'inspect/fit.json');
      if (!fs.existsSync(fp)) fail('Run fit.mjs .design/inspect --targets .design/targets.json before the look.');
      const fit = JSON.parse(fs.readFileSync(fp, 'utf8'));
      const c = fs.readFileSync(path.join(DIR, 'critique.md'), 'utf8');
      if (fit.missed > 0 && !/##\s*Fit/i.test(c)) fail(`${fit.missed} visual target(s) missed (fit.json): fix them, or add a "## Fit" section to critique.md with the reason each stays.`);
      const fitText = section(c, 'Fit');
      const unexplained = fit.rows.filter((r) => !r.ok && !new RegExp(`\\b${r.dial}\\b`, 'i').test(fitText)).map((r) => r.dial);
      if (fit.missed > 0 && unexplained.length) fail(`critique.md "## Fit" does not explain the missed target(s): ${unexplained.join(', ')}. Name each one with its reason, or fix it.`);
    }
    // Variants: every one is built before the gate, and one is chosen before the look is done.
    const nv = s.variants || 1;
    if (nv > 1 && ['build', 'fix'].includes(step)) {
      const missing = Array.from({ length: nv }, (_, i) => `variants/v${i + 1}/index.html`).filter((f) => !fs.existsSync(path.join(DIR, f)));
      if (missing.length) fail(`This run makes ${nv} variants: build .design/${missing.join(', .design/')} (same research, copy and dials; different direction or composition).`);
    }
    if (nv > 1 && step === 'look') {
      const cp = path.join(DIR, 'variants/choice.json');
      if (!fs.existsSync(cp)) fail(`Choose the variant to deliver first: ${s.choose === 'jury' ? 'rank them with the jury (jury.mjs rank) and write' : 'show compare.mjs to the user, then write'} .design/variants/choice.json { "winner": "v2", "by": "${s.choose}", "why": "..." }.`);
      if (s.choose === 'user' && !s.approvals.variant) fail('The user chooses the variant: show the comparison, then run: approve variant --note "<their words>"');
    }
    if (step === 'gate') {
      // With variants, each one passes its own inspection (.design/variants/vN/inspect/).
      const reports = nv > 1 ? Array.from({ length: nv }, (_, i) => `variants/v${i + 1}/inspect/report.json`) : ['inspect/report.json'];
      for (const rel of reports) {
        const rp = path.join(DIR, rel);
        if (!fs.existsSync(rp)) fail(`Run inspect.mjs first so that .design/${rel} exists.`);
        const r = JSON.parse(fs.readFileSync(rp, 'utf8'));
        if (r.summary.fail > 0) fail(`The last inspection (.design/${rel}) has ${r.summary.fail} FAIL. Fix them and inspect again.`);
        if (nv === 1 && newestSourceMtime() > Date.parse(r.time)) fail('Source files changed after the last inspection. Inspect again.');
      }
    }
    s.steps[step] = { status: 'done', at: now(), note: args.note || '' };
    save(s);
    log(`done ${step}${args.note ? ` note=${args.note}` : ''}`);
    if (step === 'deliver')
      fs.writeFileSync(path.join(DIR, 'run-summary.json'), JSON.stringify({ mode: s.mode, effort: s.effort, gates: s.gates, created: s.created, delivered: now(), approvals: s.approvals, history: s.history }, null, 2));
    console.log(summary(s));
    break;
  }
  case 'skip': {
    const s = load();
    if (!args.reason) fail('skip needs --reason');
    if (!SKIPPABLE[s.effort].includes(arg)) fail(`"${arg}" may not be skipped at effort ${s.effort}.`);
    const b = blockers(s, arg);
    if (b.length) fail(b.join('; '));
    s.steps[arg] = { status: 'skipped', at: now(), note: args.reason };
    save(s);
    log(`skip ${arg} reason=${args.reason}`);
    console.log(summary(s));
    break;
  }
  case 'back': {
    const s = load();
    const flow = stepsOf(s.mode);
    const i = flow.indexOf(arg);
    if (i < 0) fail(`Unknown step "${arg}". Steps: ${flow.join(' → ')}`);
    if (!args.reason) fail('back needs --reason (what changed)');
    const reopened = flow.slice(i).filter((p) => s.steps[p].status !== 'pending');
    for (const p of flow.slice(i)) {
      s.steps[p] = { status: 'pending' };
      const g = gateOf(s.mode, p);
      if (g) delete s.approvals[g];
    }
    s.history.push({ at: now(), back: arg, reason: args.reason, reopened });
    save(s);
    log(`back ${arg} reason=${args.reason} reopened=${reopened.join(',') || 'none'}`);
    console.log(`Turned back to "${arg}". Reopened: ${reopened.join(', ') || 'nothing yet done'}. Kept: ${flow.slice(0, i).join(', ') || 'nothing'}.`);
    console.log(summary(s));
    break;
  }
  case 'log': {
    load();
    if (!arg) fail('log needs the decision text');
    log(`decision${args.step ? ` step=${args.step}` : ''} by=${args.by || 'claude'} ${arg}`);
    console.log('Logged.');
    break;
  }
  default:
    console.error('Commands: init, status, next, check, done, approve, skip, back, log');
    process.exit(2);
}
