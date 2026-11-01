#!/usr/bin/env node
// Checks that the scripts work on this machine: run `npm test` in the skill folder.
// Uses the fixtures in evals/fixtures and a temporary folder; changes nothing else.
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const skill = path.resolve(here, '..');
const fixtures = path.join(skill, 'evals/fixtures');
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'design-director-'));
let failed = 0;

const run = (script, args, cwd = tmp) => spawnSync(process.execPath, [path.join(here, script), ...args], { cwd, encoding: 'utf8' });
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'pass' : 'FAIL'}  ${name}${ok ? '' : `\n      ${detail}`}`);
  if (!ok) failed++;
};

// lint
{
  const r = run('lint.mjs', [path.join(fixtures, 'slop.html')]);
  check('lint fails on placeholder text', r.status === 1 && /Lorem ipsum/i.test(r.stdout), r.stdout + r.stderr);
  check('lint flags stock copy', /supercharge/i.test(r.stdout) && /seamless/i.test(r.stdout), r.stdout);
  const c = run('lint.mjs', [path.join(fixtures, 'clean.html')]);
  check('lint passes the clean page', c.status === 0, c.stdout + c.stderr);
}

// inspect
{
  const out = path.join(tmp, 'slop');
  const r = run('inspect.mjs', [path.join(fixtures, 'slop.html'), '--out', out, '--quiet']);
  const report = fs.existsSync(path.join(out, 'report.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')) : null;
  check('inspect runs and writes a report', !!report, r.stderr);
  if (report) {
    const rules = new Set(report.findings.map((f) => f.rule));
    for (const rule of ['overflow', 'font-not-loaded', 'contrast', 'hidden-content', 'reduced-motion', 'img-alt', 'purple-gradient', 'icon-card-row', 'centred-hero-two-ctas'])
      check(`inspect detects ${rule}`, rules.has(rule), [...rules].join(', '));
    check('inspect exits 1 when something fails', r.status === 1);
    check('inspect saves screenshots', fs.readdirSync(out).some((f) => f.endsWith('.png')));
  }
  const c = run('inspect.mjs', [path.join(fixtures, 'clean.html'), '--out', path.join(tmp, 'clean'), '--quiet']);
  check('inspect passes the clean page', c.status === 0, c.stdout + c.stderr);
}

// progress
{
  const p = (...a) => run('progress.mjs', a);
  p('init', '--mode', 'create');
  check('progress refuses a step out of order', p('done', 'research').status === 1);
  check('progress refuses a gate without approval', p('done', 'brief').status === 1);
  check('progress refuses self-approval outside autopilot', p('approve', 'brief', '--by', 'claude').status === 1);
  fs.writeFileSync(path.join(tmp, '.design/brief.md'), '# brief');
  p('approve', 'brief', '--note', 'ok');
  check('progress accepts an approved, evidenced step', p('done', 'brief').status === 0);
  fs.writeFileSync(path.join(tmp, '.design/research.md'), '# research\nno sources section');
  check('progress refuses research without sources', p('done', 'research').status === 1);
  fs.appendFileSync(path.join(tmp, '.design/research.md'), '\n## Sources\n| 1 | brief | ... | today |');
  check('progress accepts research with sources', p('done', 'research').status === 0);
  fs.writeFileSync(path.join(tmp, '.design/strategy.md'), '# strategy');
  p('done', 'strategy');
  fs.writeFileSync(path.join(tmp, '.design/roast.md'), '# roast\n## Points\n| 1 | ... |');
  p('approve', 'strategy', '--note', 'ok');
  check('progress refuses a roast nobody answered', p('done', 'roast').status === 1);
  fs.appendFileSync(path.join(tmp, '.design/roast.md'), '\n## Response\n| 1 | Accepted | ... |');
  check('progress accepts an answered roast', p('done', 'roast').status === 0);
  const back = p('back', 'brief', '--reason', 'audience changed');
  check('progress turns back and reopens later steps', back.status === 0 && /Reopened: brief, research, strategy, roast/.test(back.stdout), back.stdout + back.stderr);
  check('progress logs decisions', fs.readFileSync(path.join(tmp, '.design/decisions.log'), 'utf8').includes('back brief'));
}

// jury
{
  const dir = path.join(tmp, 'jury');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'ad.json'), JSON.stringify({ juror: 'art-director', kind: 'ai', scores: { clarity: 8, craft: 6 }, ranking: ['A', 'B'] }));
  fs.writeFileSync(path.join(dir, 'eng.json'), JSON.stringify({ juror: 'engineer', kind: 'ai', scores: { craft: 2 }, veto: 'contrast 2.1:1', ranking: ['B', 'A'] }));
  fs.writeFileSync(path.join(dir, 'rina.json'), JSON.stringify({ juror: 'Rina', kind: 'human', scores: { clarity: 6 }, overall: 9, ranking: ['B', 'A'] }));
  const sc = run('jury.mjs', ['score', dir, '--json']);
  const s = JSON.parse(sc.stdout);
  check('jury blends AI and human scores', s.rows.find((r) => r.criterion === 'clarity').final === 7, sc.stdout);
  check('jury flags disagreement', s.rows.find((r) => r.criterion === 'craft').flag === true);
  check('jury keeps vetoes', s.vetoes.length === 1);
  check('jury blends a human overall score', s.humanOverall === 9 && s.final !== null);
  const rk = JSON.parse(run('jury.mjs', ['rank', dir, '--json']).stdout);
  check('jury ranks with human votes', rk.winner === 'B' && rk.humanTop === 'B');
}

// jury: two-score human votes
{
  const dir = path.join(tmp, 'jury2');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'ad.json'), JSON.stringify({ juror: 'art-director', kind: 'ai', scores: { distinctiveness: 7, craft: 7 } }));
  fs.writeFileSync(path.join(dir, 'cs.json'), JSON.stringify({ juror: 'conversion-strategist', kind: 'ai', scores: { business: 4 } }));
  fs.writeFileSync(path.join(dir, 'owner.json'), JSON.stringify({ juror: 'owner', kind: 'human', visual: 9, ship: 6 }));
  const s = JSON.parse(run('jury.mjs', ['score', dir, '--json']).stdout);
  check('jury reads a human visual score as distinctiveness and craft', s.rows.find((r) => r.criterion === 'craft').human === 9);
  check('jury reads a human ship score as the overall', s.humanOverall === 6 && s.visualVsShip === 3, JSON.stringify(s));
}

// jury: one file judging several references
{
  const dir = path.join(tmp, 'jury3');
  fs.mkdirSync(dir);
  fs.writeFileSync(path.join(dir, 'ad.json'), JSON.stringify({ juror: 'art-director', kind: 'ai', refs: { 'ref-1': { scores: { craft: 6 } }, 'ref-2': { scores: { craft: 4 } } } }));
  run('jury.mjs', ['score', dir]);
  check('jury scores every reference in a batch file', fs.existsSync(path.join(dir, 'summary-ref-1.json')) && fs.existsSync(path.join(dir, 'summary-ref-2.json')));
}

// evidence
{
  const dir = path.join(tmp, 'evidence');
  const r = run('evidence.mjs', [path.join(fixtures, 'motion.html'), '--dir', dir, '--idle', '3']);
  const ev = fs.existsSync(path.join(dir, 'evidence.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'evidence.json'), 'utf8')) : null;
  check('evidence runs and writes evidence.json', !!ev, r.stdout + r.stderr);
  if (ev) {
    check('evidence catches a page that navigates by itself', !!ev.idleNavigation, JSON.stringify(ev.idleNavigation));
    check('evidence catches motion with no input', ev.motion.movingWithoutInput > 0);
    check('evidence finds sticky panels used as a scroll device', ev.motion.stickyPanels.length >= 2, JSON.stringify(ev.motion.stickyPanels));
    check('evidence catches endless moving text', ev.motion.infiniteLoopsWithText > 0 && !ev.motion.pauseControl, JSON.stringify(ev.motion));
    check('evidence catches motion that ignores reduced motion', ev.reducedMotion.movingWithoutInput > 0, JSON.stringify(ev.reducedMotion));
    check('evidence outlines headings and actions', ev.outline.headings.length === 3 && ev.outline.actions.some((a) => a.label === 'Start today' && !a.firstScreen), JSON.stringify(ev.outline));
    check('evidence flags no price and no action on the first screen', /no price/.test(r.stdout) && /no styled action in the first screen/.test(r.stdout), r.stdout);
    fs.writeFileSync(path.join(dir, 'report.json'), JSON.stringify({ url: ev.url, viewports: {}, findings: [{ severity: 'FAIL', rule: 'contrast', message: 'low contrast', where: ['desktop'] }] }));
    const d = run('digest.mjs', [dir]);
    const digest = fs.existsSync(path.join(dir, 'digest.md')) ? fs.readFileSync(path.join(dir, 'digest.md'), 'utf8') : '';
    check('digest summarises outline, motion, findings and text', /Loved by teams/.test(digest) && /sticky panels \(CSS scroll device\): 2/.test(digest) && /FAIL contrast/.test(digest) && /Start today/.test(digest), d.stdout + d.stderr + digest.slice(0, 600));
    check('evidence draws a motion sheet and saves the page text', fs.existsSync(path.join(dir, 'motion-sheet.png')) && /Start today/.test(fs.readFileSync(path.join(dir, 'page-text.txt'), 'utf8')));
  }
}

// pop-ups are closed before the outline is read
{
  const dir = path.join(tmp, 'popup');
  run('evidence.mjs', [path.join(fixtures, 'popup.html'), '--dir', dir, '--idle', '1']);
  const ev = fs.existsSync(path.join(dir, 'evidence.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'evidence.json'), 'utf8')) : null;
  check('evidence closes a newsletter pop-up', !!ev && ev.overlaysDismissed.some((l) => /no thanks/i.test(l)) && !ev.idleNavigation, ev && JSON.stringify(ev.overlaysDismissed));
}

// a server error page is reported, never judged as the page
{
  const dir = path.join(tmp, 'error-page');
  const r = spawnSync(process.execPath, [path.join(here, 'evidence.mjs'), path.join(fixtures, 'error-page.html'), '--dir', dir, '--idle', '1'], { cwd: tmp, encoding: 'utf8', env: { ...process.env, DD_LOAD_TRIES: '1' } });
  check('evidence reports a page that did not load', /did not load/.test(r.stdout) && /loaded an error page/.test(r.stdout), r.stdout + r.stderr);
}

// smoothness: a page that blocks while scrolling stutters, a plain one does not
{
  const r = run('smooth.mjs', [path.join(fixtures, 'jank.html')]);
  const m = r.stdout.match(/page: .*?(\d+) long frames[\s\S]*baseline: .*?(\d+) long frames/);
  check('smoothness catches a page that stutters while scrolling', !!m && Number(m[1]) >= 10 && Number(m[2]) <= 2, r.stdout + r.stderr);
}

// capture
{
  const list = path.join(tmp, 'empty.txt');
  fs.writeFileSync(list, '# nothing here\nnot-a-url line\n');
  const r = run('capture.mjs', [list, '--out', path.join(tmp, 'captures')]);
  check('capture refuses a list without "<id> <url>" lines', r.status === 2 && /No "<id> <url>" lines/.test(r.stderr), r.stdout + r.stderr);
}

// style card from an inspector report (the slop fixture inspected above)
{
  const dir = path.join(tmp, 'slop');
  const st = run('style.mjs', [dir]);
  const card = fs.existsSync(path.join(dir, 'style.json')) ? JSON.parse(fs.readFileSync(path.join(dir, 'style.json'), 'utf8')) : null;
  check('style reads a style card with tags and a do-not-copy list', !!card && Array.isArray(card.tags) && card.doNotCopy.some((d) => /contrast/.test(d)) && card.type.body > 0, st.stdout + st.stderr);
}

// library: build from judged batches with style cards, then find by business words
{
  const data = path.join(tmp, 'refs');
  fs.mkdirSync(path.join(data, 'captures', 'ref-9'), { recursive: true });
  fs.writeFileSync(path.join(data, 'batch-099.json'), JSON.stringify({ batch: 'batch-099', entries: [{ id: 'ref-9', site: 'demo', url: 'https://example.com', business: { type: 'clinic', what: 'dental clinic' }, jury_scores: { weighted: 6 }, library_candidates: ['Price beside the booking button'] }] }));
  fs.writeFileSync(path.join(data, 'captures', 'ref-9', 'style.json'), JSON.stringify({ tags: ['flat'], type: { families: [{ family: 'Inter', share: 100 }], display: 64, body: 16, ratio: 4, sizes: { desktop: [64, 16] } }, palette: { chromatic: 2, gradients: 0, shadows: 0, backgrounds: ['#ffffff'] }, shape: { radii: ['8px'] }, motion: null, doNotCopy: ['contrast: low'] }));
  const index = path.join(skill, 'library', 'index.json');
  const saved = fs.existsSync(index) ? fs.readFileSync(index) : null;
  const b = run('library.mjs', ['build', '--data', data]);
  const f = run('library.mjs', ['find', 'dental', 'clinic', '--tags', 'flat']);
  if (saved) fs.writeFileSync(index, saved);
  else fs.rmSync(index, { force: true });
  check('library builds an index with style cards', /1 references/.test(b.stdout), b.stdout + b.stderr);
  check('library finds a reference with its style and do-not-copy list', /ref-9/.test(f.stdout) && /style: flat/.test(f.stdout) && /do not copy: contrast/.test(f.stdout), f.stdout + f.stderr);
}

// draw
{
  const a = run('draw.mjs', ['--sector', 'health', '--seed', '7']);
  const b = run('draw.mjs', ['--sector', 'health', '--seed', '7']);
  check('draw deals three directions', a.status === 0 && (a.stdout.match(/^[ABC]\. /gm) || []).length === 3, a.stdout + a.stderr);
  check('draw is reproducible from its seed', a.stdout === b.stdout);
}

fs.rmSync(tmp, { recursive: true, force: true });
console.log(failed ? `\n${failed} check(s) failed.` : '\nAll checks passed.');
process.exit(failed ? 1 : 0);
