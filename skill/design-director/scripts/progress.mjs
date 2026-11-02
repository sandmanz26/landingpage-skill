#!/usr/bin/env node
// Keeps the run honest: the order of steps, the approvals at each gate, and the
// turn-back protocol. State lives in .design/progress.json; every change is
// appended to .design/decisions.log.
//
//   node progress.mjs init --mode create|review|restyle|redesign|section|site
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

const DIR = path.resolve('.design');
const STATE = path.join(DIR, 'progress.json');
const LOG = path.join(DIR, 'decisions.log');

// Steps per mode. "step:gate" means the step needs that approval before it can
// be marked done. Research and roast run in every mode: they are not optional.
const FLOWS = {
  create: ['brief:brief', 'research', 'strategy', 'roast:strategy', 'direction:direction', 'skeleton', 'spec', 'copy', 'build', 'gate', 'look', 'deliver:final', 'learn'],
  site: ['brief:brief', 'research', 'sitemap', 'strategy', 'roast:strategy', 'direction:direction', 'skeleton', 'system', 'spec', 'copy', 'build', 'gate', 'look', 'deliver:final', 'learn'],
  section: ['brief:brief', 'research', 'spec', 'roast', 'build', 'gate', 'look', 'deliver:final'],
  review: ['context', 'research', 'before', 'review', 'roast', 'deliver:final'],
  restyle: ['context', 'research', 'before', 'review', 'roast', 'choose:choose', 'fix', 'after', 'gate', 'deliver:final', 'learn'],
  redesign: ['context', 'research', 'before', 'review', 'strategy', 'roast:strategy', 'choose:choose', 'direction:direction', 'spec', 'fix', 'after', 'gate', 'deliver:final', 'learn'],
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
      const r = fs.readFileSync(path.join(DIR, 'roast.md'), 'utf8');
      if (!/##\s*(Response|Tanggapan)/i.test(r)) fail('roast.md needs a "## Response" section answering every point (accepted and changed, or rejected with a reason).');
    }
    if (step === 'research') {
      const r = fs.readFileSync(path.join(DIR, 'research.md'), 'utf8');
      if (!/##\s*(Sources|Sumber)/i.test(r)) fail('research.md needs a "## Sources" section listing what was read, with dates.');
    }
    if (step === 'spec') {
      const sp = fs.readFileSync(path.join(DIR, 'spec.md'), 'utf8');
      if (!/##\s*(Interactions|Interaksi)/i.test(sp)) fail('spec.md needs an "## Interactions" section: every element the visitor operates, with what it reveals and the customer question it answers, or "none" (motion/functions.md → Interactions).');
    }
    if (step === 'direction' && !fs.existsSync(path.join(DIR, 'directions'))) fail('"direction" needs the dealt directions in .design/directions/.');
    if (step === 'direction' && s.gates === 'guided') {
      const dd = path.join(DIR, 'directions');
      const sketches = fs.existsSync(dd) ? fs.readdirSync(dd).filter((f) => /^sketch-.*\.html$/.test(f)) : [];
      if (sketches.length < 2) fail('With guided gates the user chooses from pictures: build a first-screen sketch per direction (.design/directions/sketch-a.html, sketch-b.html …) and show them with compare.mjs (rules/brief-interview.md).');
    }
    if (step === 'direction' && !fs.existsSync(path.join(DIR, 'targets.json')))
      fail('"direction" needs .design/targets.json: the visual dials the user chose (rules/visual-dials.md), or team/visual-defaults.json copied with the reason.');
    if (step === 'look' && fs.existsSync(path.join(DIR, 'targets.json'))) {
      const fp = path.join(DIR, 'inspect/fit.json');
      if (!fs.existsSync(fp)) fail('Run fit.mjs .design/inspect --targets .design/targets.json before the look.');
      const fit = JSON.parse(fs.readFileSync(fp, 'utf8'));
      const c = fs.readFileSync(path.join(DIR, 'critique.md'), 'utf8');
      if (fit.missed > 0 && !/##\s*Fit/i.test(c)) fail(`${fit.missed} visual target(s) missed (fit.json): fix them, or add a "## Fit" section to critique.md with the reason each stays.`);
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
