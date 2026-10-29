#!/usr/bin/env node
// Keeps the run honest: the order of steps, the approvals at each gate, and the
// turn-back protocol. State lives in .design/progress.json; every change is
// appended to .design/decisions.log.
//
//   node progress.mjs init --mode create|review|restyle|redesign|section|site
//                          [--effort quick|standard|thorough] [--gates guided|quick|autopilot]
//   node progress.mjs status | next
//   node progress.mjs check <step>              exit 1 if the step may not start yet
//   node progress.mjs done <step> [--note "..."]
//   node progress.mjs approve <gate> [--by user|claude] [--note "..."]
//   node progress.mjs skip <step> --reason "..."
//   node progress.mjs back <step> --reason "..." turn back: reopen this step and all after it
//   node progress.mjs log "<decision>" [--step s] [--by user|claude]
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib/browser.mjs';

const DIR = path.resolve('.design');
const STATE = path.join(DIR, 'progress.json');
const LOG = path.join(DIR, 'decisions.log');

const FLOWS = {
  create: ['brief', 'argument', 'direction', 'skeleton', 'spec', 'copy', 'build', 'gate', 'look', 'deliver', 'learn'],
  site: ['brief', 'sitemap', 'argument', 'direction', 'skeleton', 'system', 'spec', 'copy', 'build', 'gate', 'look', 'deliver', 'learn'],
  section: ['brief', 'spec', 'build', 'gate', 'look', 'deliver'],
  review: ['context', 'before', 'review', 'deliver'],
  restyle: ['context', 'before', 'review', 'choose', 'fix', 'after', 'gate', 'deliver', 'learn'],
  redesign: ['context', 'before', 'review', 'choose', 'argument', 'direction', 'spec', 'fix', 'after', 'gate', 'deliver', 'learn'],
};
// Steps that may only be marked done once the named approval exists.
const GATES = { brief: 'brief', direction: 'direction', choose: 'choose', deliver: 'final' };
// Steps an effort level may skip, with a reason.
const SKIPPABLE = {
  quick: ['skeleton', 'look', 'learn', 'argument'],
  standard: ['learn'],
  thorough: [],
};
// Files that must exist before a step counts as done.
const EVIDENCE = {
  brief: 'brief.md',
  argument: 'argument.md',
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
  const flow = FLOWS[s.mode];
  const i = flow.indexOf(step);
  if (i < 0) return [`"${step}" is not a step of mode ${s.mode}. Steps: ${flow.join(' → ')}`];
  return flow.slice(0, i).filter((p) => !['done', 'skipped'].includes(s.steps[p].status)).map((p) => `step "${p}" is not done`);
}

function summary(s) {
  const flow = FLOWS[s.mode];
  const marks = { done: '✓', skipped: '–', pending: '·' };
  const line = flow.map((p) => `${marks[s.steps[p].status]} ${p}${GATES[p] ? (s.approvals[GATES[p]] ? ' [approved]' : ' [gate]') : ''}`).join('\n  ');
  const next = flow.find((p) => s.steps[p].status === 'pending');
  return `Mode ${s.mode} · effort ${s.effort} · gates ${s.gates}\n  ${line}\nNext: ${next || 'nothing; the run is complete'}`;
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
    const s = { mode, effort, gates, created: now(), steps: {}, approvals: {}, history: [] };
    for (const p of FLOWS[mode]) s.steps[p] = { status: 'pending' };
    save(s);
    log(`init mode=${mode} effort=${effort} gates=${gates}`);
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
    if (!Object.values(GATES).includes(gate)) fail(`Unknown gate "${gate}". Gates: ${[...new Set(Object.values(GATES))].join(', ')}`);
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
    if (GATES[step] && !s.approvals[GATES[step]]) fail(`"${step}" needs the ${GATES[step]} approval first. Show it to the user, then run: approve ${GATES[step]}`);
    if (EVIDENCE[step] && !fs.existsSync(path.join(DIR, EVIDENCE[step]))) fail(`"${step}" needs .design/${EVIDENCE[step]} to exist first.`);
    if (step === 'direction' && !fs.existsSync(path.join(DIR, 'directions'))) fail('"direction" needs the dealt directions in .design/directions/.');
    if (step === 'gate') {
      const rp = path.join(DIR, 'inspect/report.json');
      if (!fs.existsSync(rp)) fail('Run inspect.mjs on the page first.');
      const r = JSON.parse(fs.readFileSync(rp, 'utf8'));
      if (r.summary.fail > 0) fail(`The last inspection has ${r.summary.fail} FAIL. Fix them and inspect again.`);
      const reportTime = Date.parse(r.time);
      if (newestSourceMtime() > reportTime) fail('Source files changed after the last inspection. Inspect again.');
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
    const flow = FLOWS[s.mode];
    const i = flow.indexOf(arg);
    if (i < 0) fail(`Unknown step "${arg}". Steps: ${flow.join(' → ')}`);
    if (!args.reason) fail('back needs --reason (what changed)');
    const reopened = flow.slice(i).filter((p) => s.steps[p].status !== 'pending');
    for (const p of flow.slice(i)) {
      s.steps[p] = { status: 'pending' };
      if (GATES[p]) delete s.approvals[GATES[p]];
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
