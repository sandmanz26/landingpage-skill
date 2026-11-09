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
// A research report and a roast that pass the substantive checks (three sources; every point answered).
const RESEARCH = '# Research\n## Sources\n| # | Source | What it gave | Date read |\n| --- | --- | --- | --- |\n| 1 | Brief from the owner | offer and price | 2026-11-04 |\n| 2 | Competitor site A | their pricing page | 2026-11-04 |\n| 3 | 40 Google reviews | the fear of pain | 2026-11-04 |\n';
const ROAST = '# Roast\n## Points\n| # | Voice | Point | Evidence | Severity |\n| 1 | Customer | Price too late | R1 | high |\n| 2 | Competitor | Same hero as A | R2 | medium |\n| 3 | Owner | No proof | R3 | low |\n## Response\n| # | Decision | What changed |\n| 1 | Accepted | Price moved to the first screen |\n| 2 | Accepted | Hero built from the clinic photo |\n| 3 | Rejected | Proof waits for real reviews; marked as a gap |\n';
// A brand kit with the five headings of brand/method.md §8 and the five tests recorded.
const BRANDKIT = '# Brand kit: Test\n## Sources\n| Source | Ask | Answer |\n| The product | form | bento box |\n## Elements\n| Family | Decision | Source |\n| Shape | radius 28 | box |\n## Hero element\nThe box that fills by day.\n## Rules of use\n| Element | Where | How often | Never | Effect |\n| Box | hero, price | 3 | decoration | shows progress |\n## Tests\n- Cover-the-logo: pass\n- Blur: pass\n- Swap: pass\n- Down-the-page: every section has two\n- Source: all traced\n';
// A brief with the materials asked for (rules/brief-interview.md → Materials).
const BRIEF = '# Brief\n- What: test\n## Materials\n| Material | What exists | Plan |\n| --- | --- | --- |\n| Photos | none | photos.mjs: 0 usable; no image tool → drawn and dummy pictures, user told |\n| Product UI | n/a | - |\n| Brand assets | logo.svg | use it |\n';
// A motion spec with the message, its signature motion, the entrance and the state transitions (motion/functions.md).
const MOTION = '## Motion spec\nMessage: lunch arrives ready, every weekday\nSignature motion: the lunch box fills compartment by compartment on scroll, once\nEntrance: headline, sub, action, photo rise in 700ms · reduced: cross-fade 150ms\nState transitions: FAQ rows open with height-free reveal · reduced: instant\nLoops: none\n';
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
    for (const rule of ['overflow', 'font-not-loaded', 'contrast', 'hidden-content', 'reduced-motion', 'img-alt', 'purple-gradient', 'icon-card-row', 'centred-hero-two-ctas', 'display-sizes', 'fixed-cover'])
      check(`inspect detects ${rule}`, rules.has(rule), [...rules].join(', '));
    check('inspect exits 1 when something fails', r.status === 1);
    check('inspect saves screenshots', fs.readdirSync(out).some((f) => f.endsWith('.png')));
  }
  const c = run('inspect.mjs', [path.join(fixtures, 'clean.html'), '--out', path.join(tmp, 'clean'), '--quiet']);
  check('inspect passes the clean page', c.status === 0, c.stdout + c.stderr);
  const cr = path.join(tmp, 'clean', 'report.json');
  if (fs.existsSync(cr)) check('a closed drawer is not a fixed cover', !JSON.parse(fs.readFileSync(cr, 'utf8')).findings.some((f) => f.rule === 'fixed-cover'));
}

// progress
{
  const p = (...a) => run('progress.mjs', a);
  p('init', '--mode', 'create');
  check('progress refuses a step out of order', p('done', 'research').status === 1);
  check('progress refuses a gate without approval', p('done', 'brief').status === 1);
  check('progress refuses self-approval outside autopilot', p('approve', 'brief', '--by', 'claude').status === 1);
  fs.writeFileSync(path.join(tmp, '.design/brief.md'), BRIEF);
  p('approve', 'brief', '--note', 'ok');
  check('progress accepts an approved, evidenced step', p('done', 'brief').status === 0);
  fs.writeFileSync(path.join(tmp, '.design/research.md'), '# research\nno sources section');
  check('progress refuses research without sources', p('done', 'research').status === 1);
  fs.appendFileSync(path.join(tmp, '.design/research.md'), '\n## Sources\n| 1 | brief | ... | today |');
  check('progress refuses research with one source', p('done', 'research').status === 1);
  fs.writeFileSync(path.join(tmp, '.design/research.md'), RESEARCH);
  check('progress accepts research with sources', p('done', 'research').status === 0);
  fs.writeFileSync(path.join(tmp, '.design/strategy.md'), '# strategy');
  p('done', 'strategy');
  fs.writeFileSync(path.join(tmp, '.design/roast.md'), '# roast\n## Points\n| 1 | ... |');
  p('approve', 'strategy', '--note', 'ok');
  check('progress refuses a roast nobody answered', p('done', 'roast').status === 1);
  fs.appendFileSync(path.join(tmp, '.design/roast.md'), '\n## Response\n| 1 | Accepted | ... |');
  check('progress refuses a roast of one point with an empty answer', p('done', 'roast').status === 1);
  fs.writeFileSync(path.join(tmp, '.design/roast.md'), ROAST.replace('| 3 | Rejected | Proof waits for real reviews; marked as a gap |\n', ''));
  check('progress refuses a roast with an unanswered point', p('done', 'roast').status === 1);
  fs.writeFileSync(path.join(tmp, '.design/roast.md'), ROAST);
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
  const rl = spawnSync(process.execPath, [path.join(here, 'evidence.mjs'), path.join(fixtures, 'rate-limited.html'), '--dir', path.join(tmp, 'rate-limited'), '--idle', '1'], { cwd: tmp, encoding: 'utf8', env: { ...process.env, DD_LOAD_TRIES: '1' } });
  check('a rate-limit answer ("Too many requests", Solflare batch-010) is reported, not judged', /did not load/.test(rl.stdout), rl.stdout + rl.stderr);
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

// fit: the built page against the visual dials
{
  const dir = path.join(tmp, 'slop');
  const t1 = path.join(tmp, 'targets-hard.json');
  const t2 = path.join(tmp, 'targets-easy.json');
  fs.writeFileSync(t1, JSON.stringify({ typeRatio: 50, priceNearAction: false }));
  fs.writeFileSync(t2, JSON.stringify({ typeRatio: 1, priceNearAction: false }));
  const miss = run('fit.mjs', [dir, '--targets', t1]);
  const ok = run('fit.mjs', [dir, '--targets', t2]);
  check('fit reports a missed visual target', miss.status === 1 && /MISS type/.test(miss.stdout), miss.stdout + miss.stderr);
  check('fit passes a met visual target', ok.status === 0 && /All targets met/.test(ok.stdout), ok.stdout + ok.stderr);
}

// progress: the direction gate needs the dials
{
  const proj = path.join(tmp, 'dials');
  fs.mkdirSync(proj);
  const p = (...a) => run('progress.mjs', a, proj);
  p('init', '--mode', 'create', '--effort', 'quick', '--gates', 'autopilot');
  const d = path.join(proj, '.design');
  fs.writeFileSync(path.join(d, 'brief.md'), BRIEF);
  p('approve', 'brief'); p('done', 'brief');
  fs.writeFileSync(path.join(d, 'research.md'), RESEARCH);
  p('done', 'research');
  fs.writeFileSync(path.join(d, 'strategy.md'), '# Strategy');
  p('done', 'strategy');
  fs.writeFileSync(path.join(d, 'roast.md'), ROAST);
  p('approve', 'strategy'); p('done', 'roast');
  fs.mkdirSync(path.join(d, 'directions'));
  p('approve', 'direction');
  fs.writeFileSync(path.join(d, 'targets.json'), JSON.stringify({ colour: 'bold', typeRatio: 6 }));
  const noKit = p('done', 'direction');
  check('progress refuses an autopilot direction with no brand kit and no logged default', noKit.status !== 0 && /brand-kit default/.test(noKit.stderr), noKit.stderr);
  p('log', 'brand-kit default: hero = the product photo in an arch; supporting = arch radius, two-colour chapters');
  fs.rmSync(path.join(d, 'targets.json'));
  const without = p('done', 'direction');
  fs.writeFileSync(path.join(d, 'targets.json'), JSON.stringify({ colour: 'bold', typeRatio: 6 }));
  const withDials = p('done', 'direction');
  check('progress refuses a direction without the visual dials', without.status !== 0 && /targets\.json/.test(without.stdout + without.stderr), without.stdout + without.stderr);
  check('progress accepts a direction with the visual dials', withDials.status === 0, withDials.stdout + withDials.stderr);
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

// variants: the run builds each one and someone chooses before the look
{
  const proj = path.join(tmp, 'variants');
  fs.mkdirSync(proj);
  const p = (...a) => run('progress.mjs', a, proj);
  const init = p('init', '--mode', 'section', '--effort', 'quick', '--gates', 'guided', '--variants', '2', '--choose', 'user');
  check('progress starts a run with variants', init.status === 0 && /2 variants, chosen by the user/.test(init.stdout), init.stdout + init.stderr);
  const d = path.join(proj, '.design');
  fs.writeFileSync(path.join(d, 'brief.md'), BRIEF);
  p('approve', 'brief'); p('done', 'brief');
  fs.writeFileSync(path.join(d, 'research.md'), RESEARCH); p('done', 'research');
  fs.writeFileSync(path.join(d, 'spec.md'), '# Spec');
  check('progress refuses a spec without its Interactions section', p('done', 'spec').status !== 0);
  fs.writeFileSync(path.join(d, 'spec.md'), '# Spec\n## Interactions\n| Element | Visitor does | They get | Purpose | Phone |\n| Flavour card | hover | the bowl |  | tap |');
  check('progress refuses an interaction with no purpose', p('done', 'spec').status !== 0);
  fs.writeFileSync(path.join(d, 'spec.md'), '# Spec\n## Interactions\nnone'); p('done', 'spec');
  fs.writeFileSync(path.join(d, 'roast.md'), ROAST); p('done', 'roast');
  const noVariants = p('done', 'build');
  for (const v of ['v1', 'v2']) {
    fs.mkdirSync(path.join(d, 'variants', v), { recursive: true });
    fs.copyFileSync(path.join(fixtures, 'clean.html'), path.join(d, 'variants', v, 'index.html'));
  }
  const built = p('done', 'build');
  check('progress refuses the build until every variant exists', noVariants.status !== 0 && /variants\/v1\/index\.html/.test(noVariants.stderr) && built.status === 0, noVariants.stderr + built.stderr);
  const cmp = run('compare.mjs', [path.join(d, 'variants/v1/index.html'), path.join(d, 'variants/v2/index.html'), '--out', path.join(d, 'variants/compare.html'), '--labels', 'Satu,Dua']);
  const page = fs.existsSync(path.join(d, 'variants/compare.html')) ? fs.readFileSync(path.join(d, 'variants/compare.html'), 'utf8') : '';
  check('compare builds a page to choose between variants', cmp.status === 0 && /Varian 2 · Dua/.test(page) && /v1\/index\.html/.test(page), cmp.stdout + cmp.stderr);
}

// library groups references by sector and style on its own
{
  const data = path.join(tmp, 'refs-groups');
  const card = (tags, ratio, fam) => ({ tags, type: { families: [{ family: 'X', share: 100 }], display: ratio * 16, body: 16, ratio, sizes: { desktop: [ratio * 16, 16] } }, palette: { chromatic: fam, families: fam, gradients: 0, shadows: 0, backgrounds: [] }, shape: { radii: [] }, motion: null, doNotCopy: [] });
  const entries = [['g1', 'dental clinic', card(['flat', 'expressive-type'], 9, 5)], ['g2', 'health clinic', card(['flat', 'expressive-type', 'rounded-type'], 10, 5)], ['g3', 'saas tool', card(['glass', 'gradient-heavy', 'pill-shapes'], 3, 2)]];
  for (const [id, , st] of entries) {
    fs.mkdirSync(path.join(data, 'captures', id), { recursive: true });
    fs.writeFileSync(path.join(data, 'captures', id, 'style.json'), JSON.stringify(st));
  }
  fs.writeFileSync(path.join(data, 'batch-098.json'), JSON.stringify({ batch: 'batch-098', entries: entries.map(([id, what]) => ({ id, url: `https://${id}.example`, business: { what } })) }));
  const index = path.join(skill, 'library', 'index.json');
  const saved = fs.existsSync(index) ? fs.readFileSync(index) : null;
  run('library.mjs', ['build', '--data', data]);
  const g = run('library.mjs', ['groups']);
  if (saved) fs.writeFileSync(index, saved);
  check('library groups references by sector and by style', /health\s+g1, g2/.test(g.stdout) && /software\s+g3/.test(g.stdout) && /\(2\):.*\n\s+g1, g2/.test(g.stdout), g.stdout + g.stderr);
}

// dials: sites the user likes become suggested dials
{
  const out = path.join(tmp, 'targets.suggested.json');
  const r = run('dials.mjs', ['suggest', path.join(tmp, 'slop'), '--out', out]);
  const t = fs.existsSync(out) ? JSON.parse(fs.readFileSync(out, 'utf8')) : null;
  check('dials suggests targets from a liked site', r.status === 0 && !!t && [4, 6, 10].includes(t.suggested.typeRatio) && ['calm', 'bold'].includes(t.suggested.colour), r.stdout + r.stderr);
}

// false positives found on real references stay fixed (batch-007 Quite Nice and others)
{
  const out = path.join(tmp, 'shop');
  const r = run('inspect.mjs', [path.join(fixtures, 'shop.html'), '--out', out, '--quiet']);
  const rep = fs.existsSync(path.join(out, 'report.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')) : null;
  const rules = rep ? new Set(Object.values(rep.viewports).flatMap((v) => v.findings.map((f) => f.rule))) : new Set();
  check('carousel slides are not hidden content', r.status === 0 && !rules.has('hidden-content') && rules.has('carousel-slides'), [...rules].join(', '));
  check('an announcement bar and a doubled hover label are not two hero buttons', !rules.has('centred-hero-two-ctas'), [...rules].join(', '));
  check('padded full-width text is not text at the edge', !rules.has('text-at-edge'), [...rules].join(', '));
  run('evidence.mjs', [path.join(fixtures, 'shop.html'), '--dir', out, '--idle', '2']);
  const ev = fs.existsSync(path.join(out, 'evidence.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'evidence.json'), 'utf8')) : null;
  const im = ev ? ev.outline.imagery : {};
  check('a drawn PNG counts as illustration, a cut-out photo and a <picture> as one photo each', im.photos === 2 && im.illustrations === 1, JSON.stringify(im));
  check('a doubled hover label is one action', ev && ev.outline.actions.some((a) => a.label === 'Pesan 1 kotak'), ev && ev.outline.actions.map((a) => a.label).join(' | '));
}

// copy: written for the reader, measured (copy/method.md)
{
  const cdir = path.join(fixtures, 'copy');
  const high = run('copycheck.mjs', [path.join(cdir, 'too-high.md'), '--voice', path.join(cdir, 'voice.md'), '--out', path.join(tmp, 'cc-high.json')]);
  const rules = fs.existsSync(path.join(tmp, 'cc-high.json')) ? JSON.parse(fs.readFileSync(path.join(tmp, 'cc-high.json'), 'utf8')).findings.map((f) => f.rule) : [];
  check('copycheck fails copy written above the reader', high.status === 1 && ['long-sentence', 'self-praise', 'abstract-words', 'glossary', 'long-headline'].every((r) => rules.includes(r)), rules.join(', '));
  const plain = run('copycheck.mjs', [path.join(cdir, 'plain.md'), '--voice', path.join(cdir, 'voice.md'), '--out', path.join(tmp, 'cc-plain.json')]);
  check('copycheck passes plain copy in the reader\'s words', plain.status === 0, plain.stdout);
  const proj = path.join(tmp, 'copygate');
  fs.mkdirSync(path.join(proj, '.design'), { recursive: true });
  const d = path.join(proj, '.design');
  const p = (...a) => run('progress.mjs', a, proj);
  p('init', '--mode', 'create', '--effort', 'quick', '--gates', 'autopilot');
  const st = JSON.parse(fs.readFileSync(path.join(d, 'progress.json'), 'utf8'));
  for (const k of ['brief', 'research', 'strategy', 'roast', 'direction', 'skeleton', 'spec']) st.steps[k] = { status: 'done' };
  fs.writeFileSync(path.join(d, 'progress.json'), JSON.stringify(st));
  fs.copyFileSync(path.join(cdir, 'too-high.md'), path.join(d, 'copy.md'));
  const noVoice = p('done', 'copy');
  fs.copyFileSync(path.join(cdir, 'voice.md'), path.join(d, 'voice.md'));
  run('copycheck.mjs', ['.design/copy.md', '--voice', '.design/voice.md'], proj);
  const failing = p('done', 'copy');
  fs.copyFileSync(path.join(cdir, 'plain.md'), path.join(d, 'copy.md'));
  const stale = p('done', 'copy');
  run('copycheck.mjs', ['.design/copy.md', '--voice', '.design/voice.md'], proj);
  const ok = p('done', 'copy');
  check('progress wants the voice file and a passing, fresh copycheck before the copy is done', noVoice.status !== 0 && /voice\.md/.test(noVoice.stderr) && failing.status !== 0 && /FAIL/.test(failing.stderr) && stale.status !== 0 && ok.status === 0, [noVoice.stderr, failing.stderr, stale.stderr, ok.stderr].join(' | '));
}

// kit: the tested sections stay tested, and their sample content cannot ship
{
  const out = path.join(tmp, 'kit');
  const r = run('inspect.mjs', [path.join(skill, 'kit', 'index.html'), '--out', out, '--quiet', '--allow', 'kit-sample,system-font-only']);
  const rep = fs.existsSync(path.join(out, 'report.json')) ? JSON.parse(fs.readFileSync(path.join(out, 'report.json'), 'utf8')) : null;
  const all = rep ? [...Object.values(rep.viewports).flatMap((v) => v.findings), ...rep.checks.reducedMotion.findings].filter((f) => f.severity !== 'INFO') : [{ rule: 'no report' }];
  check('the kit demo passes the inspector with no findings at three widths and under reduced motion', r.status === 0 && all.length === 0, all.map((f) => f.rule).join(', '));
  const strict = run('inspect.mjs', [path.join(skill, 'kit', 'index.html'), '--out', path.join(tmp, 'kit-strict'), '--quiet']);
  check('the inspector fails a page that still carries kit sample content', strict.status === 1 && /kit-sample/.test(fs.readFileSync(path.join(tmp, 'kit-strict', 'report.json'), 'utf8')));
  const names = JSON.parse(fs.readFileSync(path.join(skill, 'kit', 'sections.json'), 'utf8')).sections.map((x) => x.name);
  const g = run('kit.mjs', ['get', ...names, '--out', path.join(tmp, 'kit-get')]);
  const html = fs.existsSync(path.join(tmp, 'kit-get', 'section.html')) ? fs.readFileSync(path.join(tmp, 'kit-get', 'section.html'), 'utf8') : '';
  const css = fs.existsSync(path.join(tmp, 'kit-get', 'kit.css')) ? fs.readFileSync(path.join(tmp, 'kit-get', 'kit.css'), 'utf8') : '';
  check('kit.mjs gives every listed section with its HTML and CSS', g.status === 0 && names.every((n) => html.includes(`kit:${n}`) && css.includes(`kit:${n}`)) && css.includes('kit:tokens'), g.stderr);
}

// reason roast: every element of the built page is numbered and needs a verdict
{
  const proj = path.join(tmp, 'reason');
  fs.mkdirSync(proj);
  const d = path.join(proj, '.design');
  const e = run('elements.mjs', [path.join(fixtures, 'slop.html'), '--out', path.join(d, 'reason')], proj);
  const ej = path.join(d, 'reason', 'elements.json');
  const els = fs.existsSync(ej) ? JSON.parse(fs.readFileSync(ej, 'utf8')).elements : [];
  const flags = new Set(els.flatMap((x) => x.flags));
  check('elements numbers the page and photographs each section', e.status === 0 && els.length >= 10 && fs.existsSync(path.join(d, 'reason', 'desktop-S01.png')) && fs.existsSync(path.join(d, 'reason', 'mobile-01.png')), e.stdout + e.stderr);
  check('elements flags template filler (emoji, twin cards, generic copy, unsourced numbers, eyebrows)', ['emoji', 'same-as-siblings', 'generic-copy', 'number-claim', 'eyebrow'].every((f) => flags.has(f)), [...flags].join(', '));
  const p = (...a) => run('progress.mjs', a, proj);
  p('init', '--mode', 'section', '--effort', 'quick', '--gates', 'quick');
  fs.writeFileSync(path.join(d, 'brief.md'), BRIEF);
  p('approve', 'brief'); p('done', 'brief');
  fs.writeFileSync(path.join(d, 'research.md'), RESEARCH); p('done', 'research');
  fs.writeFileSync(path.join(d, 'spec.md'), '# Spec\n## Interactions\nnone'); p('done', 'spec');
  fs.writeFileSync(path.join(d, 'roast.md'), ROAST); p('done', 'roast');
  p('done', 'build');
  const rows = (verdict) => els.map((x) => `| ${x.id} | thing | job | lost | ${verdict(x)} |`).join('\n');
  fs.writeFileSync(path.join(d, 'reason.md'), `# Reason\n${rows(() => 'keep')}`.replace(/\| E01 \|.*\n/, ''));
  const partial = p('done', 'reason');
  fs.writeFileSync(path.join(d, 'reason.md'), `# Reason\n${rows((x) => (x.flags.includes('emoji') ? 'cut' : 'keep'))}`);
  const noResponse = p('done', 'reason');
  const cutIds = els.filter((x) => x.flags.includes('emoji')).map((x) => x.id);
  fs.writeFileSync(path.join(d, 'reason.md'), `# Reason\n${rows((x) => (x.flags.includes('emoji') ? 'cut' : 'keep'))}\n## Response\n- emoji cards cut`);
  const vague = p('done', 'reason');
  fs.writeFileSync(path.join(d, 'reason.md'), `# Reason\n${rows((x) => (x.flags.includes('emoji') ? 'cut' : 'keep'))}\n## Response\n- ${cutIds.join(', ')} cut`);
  const notPhotographed = p('done', 'reason');
  fs.mkdirSync(path.join(d, 'reason', 'after'), { recursive: true });
  fs.copyFileSync(ej, path.join(d, 'reason', 'after', 'elements.json'));
  const stillThere = p('done', 'reason');
  fs.writeFileSync(path.join(d, 'reason', 'after', 'elements.json'), JSON.stringify({ elements: els.filter((x) => !cutIds.includes(x.id)) }));
  const ok = p('done', 'reason');
  check('progress wants a verdict for every element, and a response to every cut', partial.status !== 0 && /E01/.test(partial.stderr) && noResponse.status !== 0 && vague.status !== 0 && ok.status === 0, partial.stderr + noResponse.stderr + vague.stderr + ok.stderr);
  check('progress checks on a new photograph that cut elements are gone', notPhotographed.status !== 0 && stillThere.status !== 0 && /still on the page/.test(stillThere.stderr), notPhotographed.stderr + stillThere.stderr);
  // look at standard effort: two AI jurors, and an inspection newer than the page
  const st = JSON.parse(fs.readFileSync(path.join(d, 'progress.json'), 'utf8'));
  st.effort = 'standard';
  fs.writeFileSync(path.join(d, 'progress.json'), JSON.stringify(st));
  fs.copyFileSync(path.join(fixtures, 'clean.html'), path.join(proj, 'index.html'));
  run('inspect.mjs', [path.join(proj, 'index.html'), '--out', path.join(d, 'inspect'), '--quiet'], proj);
  p('done', 'gate');
  fs.writeFileSync(path.join(d, 'critique.md'), '# Critique');
  const noJury = p('done', 'look');
  fs.mkdirSync(path.join(d, 'jury', 'r1'), { recursive: true });
  for (const j of ['art', 'customer']) fs.writeFileSync(path.join(d, 'jury', 'r1', `${j}.json`), JSON.stringify({ juror: j, kind: 'ai', refs: {} }));
  const future = new Date(Date.now() + 60000);
  fs.utimesSync(path.join(proj, 'index.html'), future, future);
  const stale = p('done', 'look');
  fs.utimesSync(path.join(proj, 'index.html'), new Date(Date.now() - 600000), new Date(Date.now() - 600000));
  fs.writeFileSync(path.join(d, 'targets.json'), '{"colour":"bold"}');
  fs.writeFileSync(path.join(d, 'inspect', 'fit.json'), JSON.stringify({ rows: [{ dial: 'colour', ok: false }, { dial: 'type', ok: true }], missed: 1 }));
  fs.writeFileSync(path.join(d, 'critique.md'), '# Critique\n## Fit\nWe like it.');
  const vagueFit = p('done', 'look');
  fs.writeFileSync(path.join(d, 'critique.md'), '# Critique\n## Fit\n- colour: the brand book allows two colours only.');
  const looked = p('done', 'look');
  check('progress wants every missed dial explained by name', vagueFit.status !== 0 && /colour/.test(vagueFit.stderr), vagueFit.stderr);
  check('progress wants two AI jurors and a fresh inspection before the look is done', noJury.status !== 0 && /two AI jurors/.test(noJury.stderr) && stale.status !== 0 && /inspect again/.test(stale.stderr) && looked.status === 0, noJury.stderr + stale.stderr + looked.stderr);
}

// guided gates: the user chooses the direction from sketches
{
  const proj = path.join(tmp, 'sketches');
  fs.mkdirSync(proj);
  const p = (...a) => run('progress.mjs', a, proj);
  p('init', '--mode', 'create', '--effort', 'standard', '--gates', 'guided');
  const d = path.join(proj, '.design');
  fs.writeFileSync(path.join(d, 'brief.md'), BRIEF);
  p('approve', 'brief', '--note', 'ok'); p('done', 'brief');
  fs.writeFileSync(path.join(d, 'research.md'), RESEARCH); p('done', 'research');
  fs.writeFileSync(path.join(d, 'strategy.md'), '# S'); p('done', 'strategy');
  fs.writeFileSync(path.join(d, 'roast.md'), ROAST);
  p('approve', 'strategy', '--note', 'ok'); p('done', 'roast');
  fs.mkdirSync(path.join(d, 'directions'));
  fs.writeFileSync(path.join(d, 'targets.json'), '{}');
  p('approve', 'direction', '--note', 'A');
  const noKit = p('done', 'direction');
  check('progress wants a brand kit before a guided direction', noKit.status !== 0 && /brand-kit\.md/.test(noKit.stderr), noKit.stderr);
  fs.writeFileSync(path.join(d, 'brand-kit.md'), BRANDKIT);
  const without = p('done', 'direction');
  for (const x of ['a', 'b']) fs.copyFileSync(path.join(fixtures, 'clean.html'), path.join(d, 'directions', `sketch-${x}.html`));
  const withSketches = p('done', 'direction');
  check('progress wants first-screen sketches before a guided direction', without.status !== 0 && /sketch/.test(without.stderr) && withSketches.status === 0, without.stderr + withSketches.stderr);
}

// admin style variations: the options page, the logged choice or a logged decline (admin/method.md §4)
{
  const proj = path.join(tmp, 'admin-style');
  fs.mkdirSync(proj);
  const p = (...a) => run('progress.mjs', a, proj);
  const ADMIN_BRIEF = BRIEF.replace('- What: test', '- What: admin panel for orders and stock\n- Component library: shadcn/ui (React + Tailwind), default: none agreed; told the user');
  const toDirection = (dir) => {
    const d = path.join(dir, '.design');
    fs.writeFileSync(path.join(d, 'brief.md'), ADMIN_BRIEF);
    const q = (...a) => run('progress.mjs', a, dir);
    q('approve', 'brief', '--note', 'ok'); q('done', 'brief');
    fs.writeFileSync(path.join(d, 'research.md'), RESEARCH); q('done', 'research');
    fs.writeFileSync(path.join(d, 'strategy.md'), '# S'); q('done', 'strategy');
    fs.writeFileSync(path.join(d, 'roast.md'), ROAST);
    q('approve', 'strategy', '--note', 'ok'); q('done', 'roast');
    fs.mkdirSync(path.join(d, 'directions'));
    fs.writeFileSync(path.join(d, 'targets.json'), '{}');
    fs.writeFileSync(path.join(d, 'brand-kit.md'), BRANDKIT);
    q('approve', 'direction', '--note', 'ok');
    return d;
  };
  p('init', '--mode', 'create', '--effort', 'standard', '--gates', 'guided');
  const d = toDirection(proj);
  const none = p('done', 'direction');
  const made = run('adminoptions.mjs', ['--brief', 'Panel admin toko sambal', '--components', 'sidebar,modal,table', '--recommend', 'B', '--why', 'operasional seharian'], proj);
  const page = path.join(d, 'options/admin-options.html');
  const noPick = p('done', 'direction');
  p('log', 'admin-style: B dark-layered (user: Pilih B)', '--step', 'direction', '--by', 'user');
  const picked = p('done', 'direction');
  check('progress wants an admin run with guided gates to show the style options and log the choice (the options page stands in for the sketches)',
    none.status !== 0 && /admin\/method\.md/.test(none.stderr) && made.status === 0 && fs.existsSync(page) && noPick.status !== 0 && /no choice is logged/.test(noPick.stderr) && picked.status === 0,
    [none, made, noPick, picked].map((r) => r.stdout + r.stderr).join(' | '));
  const proj2 = path.join(tmp, 'admin-declined');
  fs.mkdirSync(proj2);
  const p2 = (...a) => run('progress.mjs', a, proj2);
  p2('init', '--mode', 'create', '--effort', 'standard', '--gates', 'guided');
  const d2 = toDirection(proj2);
  p2('log', 'admin-variations declined: langsung saja, pakai bawaan', '--step', 'direction', '--by', 'user');
  const noSketch = p2('done', 'direction');
  for (const x of ['a', 'b']) fs.copyFileSync(path.join(fixtures, 'clean.html'), path.join(d2, 'directions', `sketch-${x}.html`));
  const declined = p2('done', 'direction');
  check('progress accepts a logged decline of the admin variations (then the sketches are needed)', noSketch.status !== 0 && /sketch/.test(noSketch.stderr) && declined.status === 0, noSketch.stderr + declined.stderr);
  const html = fs.existsSync(page) ? fs.readFileSync(page, 'utf8') : '';
  const json = fs.existsSync(page.replace(/\.html$/, '.json')) ? JSON.parse(fs.readFileSync(page.replace(/\.html$/, '.json'), 'utf8')) : { options: [] };
  check('adminoptions renders A/B/C with a sidebar, a modal and a table, the references, the reply and shadcn/ui variables',
    ['A', 'B', 'C'].every((l) => html.includes(`data-option="${l}"`)) && (html.match(/class="sb[ "]/g) || []).length === 3 && (html.match(/role="dialog"/g) || []).length === 3 && (html.match(/<table>/g) || []).length === 3 &&
      /sb-003/.test(html) && /md-005/.test(html) && /Pilih/.test(html) && /Percayakan ke AI/.test(html) && json.recommend === 'B' && json.options.every((o) => o.shadcn['--primary'] && o.shadcn['--radius'] && o.levers.length >= 3 && o.levers.length <= 4),
    html.slice(0, 300));
  const ins = run('inspect.mjs', [page, '--out', path.join(tmp, 'admin-inspect'), '--app', '--quiet'], proj);
  const ir = path.join(tmp, 'admin-inspect/report.json');
  const rep = fs.existsSync(ir) ? JSON.parse(fs.readFileSync(ir, 'utf8')) : { summary: { fail: -1 }, findings: [] };
  check('the admin options page passes inspect without FAIL', ins.status === 0 && rep.summary.fail === 0, ins.stdout + ins.stderr + rep.findings.filter((f) => f.severity === 'FAIL').map((f) => f.rule).join(', '));
  const withKit = run('adminoptions.mjs', ['--kit', path.join(fixtures, 'brand/kit.json'), '--out', path.join(tmp, 'admin-kit/opts.html')], proj);
  const kj = fs.existsSync(path.join(tmp, 'admin-kit/opts.json')) ? JSON.parse(fs.readFileSync(path.join(tmp, 'admin-kit/opts.json'), 'utf8')) : { options: [] };
  check('adminoptions lets the brand kit override colours and shape', withKit.status === 0 && kj.kit === 'Dapur Seimbang' && kj.options.length === 3 && kj.options.every((o) => o.tokens.accent === '#E2A13B' && o.tokens.radius.surface === 28 && o.tokens.radius.button === 8),
    withKit.stdout + withKit.stderr + JSON.stringify(kj.options.map((o) => o.tokens.accent)));
  const bad = path.join(tmp, 'bad-directions.json');
  const dirs = JSON.parse(fs.readFileSync(path.join(skill, 'admin/directions.json'), 'utf8'));
  dirs.directions[0].levers = ['surface', 'active', 'primary', 'icons', 'type'];
  fs.writeFileSync(bad, JSON.stringify(dirs));
  const tooMany = run('adminoptions.mjs', ['--directions', bad, '--out', path.join(tmp, 'admin-bad/x.html')], proj);
  const one = run('adminoptions.mjs', ['--only', 'glass-dark', '--out', path.join(tmp, 'admin-bad/y.html')], proj);
  check('adminoptions refuses a direction that changes more than 4 levers, and fewer than two options', tooMany.status === 2 && /3-4 levers/.test(tooMany.stderr) && one.status === 2 && /2-3 directions/.test(one.stderr), tooMany.stderr + one.stderr);
}

// brand mode: board with directions, the kit, the PDF at delivery; brandboard renders and passes inspect
{
  const proj = path.join(tmp, 'brand');
  fs.mkdirSync(proj);
  const p = (...a) => run('progress.mjs', a, proj);
  p('init', '--mode', 'brand', '--gates', 'guided');
  const d = path.join(proj, '.design');
  fs.writeFileSync(path.join(d, 'brief.md'), BRIEF);
  p('approve', 'brief', '--note', 'ok'); p('done', 'brief');
  fs.writeFileSync(path.join(d, 'research.md'), RESEARCH); p('done', 'research');
  fs.writeFileSync(path.join(d, 'strategy.md'), '# S'); p('done', 'strategy');
  fs.writeFileSync(path.join(d, 'roast.md'), ROAST);
  p('approve', 'strategy', '--note', 'ok'); p('done', 'roast');
  p('approve', 'direction', '--note', 'B');
  const noBoard = p('done', 'brand-directions');
  const one = run('brandboard.mjs', [path.join(fixtures, 'brand/kit.json'), '--out', path.join(d, 'brand'), '--no-pdf'], proj);
  const oneDir = p('done', 'brand-directions');
  const two = run('brandboard.mjs', [path.join(fixtures, 'brand/directions.json'), '--out', path.join(d, 'brand')], proj);
  const twoDir = p('done', 'brand-directions');
  check('progress wants a board with at least two brand directions', noBoard.status !== 0 && one.status === 0 && oneDir.status !== 0 && /2-3 brand directions/.test(oneDir.stderr) && two.status === 0 && twoDir.status === 0, noBoard.stderr + one.stderr + oneDir.stderr + two.stderr + twoDir.stderr);
  check('brandboard writes the board and a PDF', fs.existsSync(path.join(d, 'brand/board.html')) && fs.existsSync(path.join(d, 'brand/board.pdf')) && fs.readFileSync(path.join(d, 'brand/board.pdf')).slice(0, 4).toString() === '%PDF', two.stdout + two.stderr);
  const ins = run('inspect.mjs', [path.join(d, 'brand/board.html'), '--out', path.join(tmp, 'board-inspect'), '--quiet'], proj);
  const ir = path.join(tmp, 'board-inspect/report.json');
  const rep = fs.existsSync(ir) ? JSON.parse(fs.readFileSync(ir, 'utf8')) : { summary: { fail: -1 }, findings: [] };
  check('the brand board passes inspect without FAIL', ins.status === 0 && rep.summary.fail === 0, ins.stdout + ins.stderr);
  check('inspect reports a placeholder wordmark as INFO', rep.findings.some((f) => f.rule === 'placeholder-logo' && f.severity === 'INFO'), rep.findings.map((f) => f.rule).join(', '));
  fs.writeFileSync(path.join(d, 'brand-kit.md'), BRANDKIT.replace(/## Tests[\s\S]*/, ''));
  const noTests = p('done', 'kit');
  fs.writeFileSync(path.join(d, 'brand-kit.md'), BRANDKIT);
  const bad = JSON.parse(fs.readFileSync(path.join(fixtures, 'brand/kit.json'), 'utf8'));
  delete bad.wordmark;
  fs.writeFileSync(path.join(d, 'brand-kit.json'), JSON.stringify(bad));
  const badJson = p('done', 'kit');
  fs.copyFileSync(path.join(fixtures, 'brand/kit.json'), path.join(d, 'brand-kit.json'));
  const kit = p('done', 'kit');
  check('progress wants brand-kit.md with its sections and a valid brand-kit.json', noTests.status !== 0 && /Tests/.test(noTests.stderr) && badJson.status !== 0 && /wordmark/.test(badJson.stderr) && kit.status === 0, noTests.stderr + badJson.stderr + kit.stderr);
  const bad2 = run('brandboard.mjs', [path.join(d, 'brand-kit.md')], proj);
  check('brandboard refuses an input that is not a kit', bad2.status !== 0);
  fs.rmSync(path.join(d, 'brand/board.pdf'));
  p('approve', 'final', '--note', 'ok');
  const noPdf = p('done', 'deliver');
  run('brandboard.mjs', [path.join(d, 'brand-kit.json'), '--out', path.join(d, 'brand')], proj);
  const delivered = p('done', 'deliver');
  check('progress wants the board PDF before a brand delivery', noPdf.status !== 0 && /board\.pdf/.test(noPdf.stderr) && delivered.status === 0, noPdf.stderr + delivered.stderr);
}

// materials at the brief, the motion message in the spec, and what the deliver report must carry
{
  const proj = path.join(tmp, 'materials');
  fs.mkdirSync(proj);
  const d = path.join(proj, '.design');
  const p = (...a) => run('progress.mjs', a, proj);
  p('init', '--mode', 'create', '--effort', 'quick', '--gates', 'autopilot');
  p('approve', 'brief');
  fs.writeFileSync(path.join(d, 'brief.md'), '# Brief\n- What: test');
  const noMat = p('done', 'brief');
  fs.writeFileSync(path.join(d, 'brief.md'), BRIEF.replace(/\| Product UI.*\n/, ''));
  const noUi = p('done', 'brief');
  fs.writeFileSync(path.join(d, 'brief.md'), BRIEF.replace('| Product UI | n/a | - |', '| Product UI | none after a follow-up | user: "percayakan ke AI" → realistic mock with sample data (data-sample) |'));
  const okBrief = p('done', 'brief');
  check('progress wants a "## Materials" brief naming photos, product UI and brand assets', noMat.status !== 0 && /## Materials/.test(noMat.stderr) && noUi.status !== 0 && /product UI/.test(noUi.stderr) && okBrief.status === 0, noMat.stderr + noUi.stderr + okBrief.stderr);
  const st = JSON.parse(fs.readFileSync(path.join(d, 'progress.json'), 'utf8'));
  for (const k of ['research', 'strategy', 'roast', 'direction', 'skeleton']) st.steps[k] = { status: 'done' };
  fs.writeFileSync(path.join(d, 'progress.json'), JSON.stringify(st));
  const spec = (motion) => fs.writeFileSync(path.join(d, 'spec.md'), `# Spec\n## Interactions\nnone\n${motion}`);
  spec('');
  const noMotion = p('done', 'spec');
  spec(MOTION.replace(/Message:.*\n/, ''));
  const noMessage = p('done', 'spec');
  spec(MOTION.replace(/Entrance:.*\n/, ''));
  const noEntrance = p('done', 'spec');
  spec(MOTION.replace(/Signature motion:.*\n/, ''));
  const noSignature = p('done', 'spec');
  spec(MOTION.replace(/Message:.*\nSignature motion:.*\n/, 'Message: none found\n'));
  const noOffer = p('done', 'spec');
  spec(MOTION.replace(/Message:.*\nSignature motion:.*\n/, 'Message: none found. Offered to the user: the menu card turning into the packed box, needs a real box photo\n'));
  const offered = p('done', 'spec');
  check('progress refuses a motion spec without Message, Entrance or a signature motion, and "none found" without an offer', [noMotion, noMessage, noEntrance, noSignature, noOffer].every((r) => r.status !== 0) && /Message:/.test(noMessage.stderr) && /Entrance:/.test(noEntrance.stderr) && /Signature motion/.test(noSignature.stderr) && /Offered to the user/.test(noOffer.stderr) && offered.status === 0, [noMotion, noMessage, noEntrance, noSignature, noOffer, offered].map((r) => r.stderr).join(' | '));
  const st2 = JSON.parse(fs.readFileSync(path.join(d, 'progress.json'), 'utf8'));
  for (const k of ['copy', 'build', 'reason', 'gate', 'look']) st2.steps[k] = { status: 'done' };
  fs.writeFileSync(path.join(d, 'progress.json'), JSON.stringify(st2));
  p('approve', 'final');
  const noReport = p('done', 'deliver');
  fs.writeFileSync(path.join(d, 'deliver.md'), '# Deliver\n## Supaya lebih bagus\n1. Kirim foto dapur asli.\n');
  const noMotionOffer = p('done', 'deliver');
  fs.appendFileSync(path.join(d, 'deliver.md'), '2. Motion: kartu menu yang berubah jadi kotak makan siang (butuh foto kotak asli).\n');
  const noShots = p('done', 'deliver');
  fs.appendFileSync(path.join(d, 'deliver.md'), '## Pictures\nDrawn and dummy pictures; shot list: kitchen at 10am, the box packed.\n');
  const noSampleUi = p('done', 'deliver');
  fs.appendFileSync(path.join(d, 'deliver.md'), '## Sample UI\nThe order screen is a mock with sample data (data-sample): send a screenshot to replace it.\n');
  const delivered = p('done', 'deliver');
  check('progress wants deliver.md with the motion offer, the shot list for dummy pictures and the sample UI', [noReport, noMotionOffer, noShots, noSampleUi].every((r) => r.status !== 0) && /deliver\.md/.test(noReport.stderr) && /signature motion/.test(noMotionOffer.stderr) && /shot list/.test(noShots.stderr) && /sample UI/.test(noSampleUi.stderr) && delivered.status === 0, [noReport, noMotionOffer, noShots, noSampleUi, delivered].map((r) => r.stderr).join(' | '));
  const clean = path.join(tmp, 'clean', 'report.json');
  const rep = fs.existsSync(clean) ? JSON.parse(fs.readFileSync(clean, 'utf8')) : { findings: [] };
  check('inspect reports data-sample elements as INFO sample-ui', rep.findings.some((f) => f.rule === 'sample-ui' && f.severity === 'INFO'), rep.findings.map((f) => f.rule).join(', '));
}

// an admin request names its component library; the shadcn/ui default is logged (rules/stack.md)
{
  const proj = path.join(tmp, 'stack');
  fs.mkdirSync(proj);
  const d = path.join(proj, '.design');
  const p = (...a) => run('progress.mjs', a, proj);
  p('init', '--mode', 'create', '--effort', 'quick', '--gates', 'autopilot');
  p('approve', 'brief');
  const brief = (what, lib) => fs.writeFileSync(path.join(d, 'brief.md'), BRIEF.replace('- What: test', `- What: ${what}${lib ? `\n- Component library: ${lib}` : ''}`));
  brief('landing page for an analytics dashboard product');
  const page = p('done', 'brief');
  p('back', 'brief', '--reason', 'test');
  p('approve', 'brief');
  brief('admin panel for orders and stock');
  const noLib = p('done', 'brief');
  brief('admin panel for orders and stock', 'MUI because it looks nice');
  const unagreed = p('done', 'brief');
  brief('admin panel for orders and stock', 'shadcn/ui (React + Tailwind), default: none agreed; told the user');
  const dflt = p('done', 'brief');
  const logged = fs.readFileSync(path.join(d, 'decisions.log'), 'utf8');
  p('back', 'brief', '--reason', 'user chose MUI');
  p('approve', 'brief');
  brief('panel admin pesanan', 'MUI (the user\'s design system, agreed 2026-11-07)');
  const agreed = p('done', 'brief');
  check('progress wants an admin brief to name its component library, shadcn/ui unless the user agreed another, and logs the default',
    page.status === 0 && noLib.status !== 0 && /Component library/.test(noLib.stderr) && unagreed.status !== 0 && /agreement/.test(unagreed.stderr) && dflt.status === 0 && /component-library default: shadcn\/ui/.test(logged) && agreed.status === 0,
    [page, noLib, unagreed, dflt, agreed].map((r) => r.stderr).join(' | '));
}

// photos: credits and a clear refusal without a search
{
  const proj = path.join(tmp, 'photos');
  fs.mkdirSync(proj);
  const none = run('photos.mjs', ['credits'], proj);
  const get = run('photos.mjs', ['get', 'unsplash:abc'], proj);
  check('photos keeps credits and refuses a download it has not searched', /No photographs recorded/.test(none.stdout) && get.status === 2 && /search first/.test(get.stderr), none.stdout + get.stderr);
}

// photos: a pasted Unsplash link, parsed and credited; fetch is mocked, no network
{
  const { parseUnsplashLink, linkCredit } = await import(path.join(here, 'lib/unsplash-link.mjs'));
  const img = parseUnsplashLink('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?ixlib=rb-4.0.3&w=800');
  const pg = parseUnsplashLink('https://unsplash.com/photos/a-close-up-of-a-flower-W9dLVt7Y0FU?utm_source=x');
  const old = parseUnsplashLink('https://unsplash.com/photos/W9dLVt7Y0FU');
  const loc = parseUnsplashLink('https://unsplash.com/de/fotos/eine-blume-W9dLVt7Y0FU');
  check('photos parses image links, photo pages (new, old, localised) and refuses Unsplash+ and other sites',
    img.kind === 'image' && img.key === 'photo-1500530855697-b586d89ba3ee' && pg.kind === 'page' && pg.id === 'W9dLVt7Y0FU' && old.id === 'W9dLVt7Y0FU' && loc.id === 'W9dLVt7Y0FU' &&
      parseUnsplashLink('https://plus.unsplash.com/premium_photo-1').kind === 'plus' && parseUnsplashLink('https://example.com/photos/x') === null && parseUnsplashLink('not a link') === null,
    JSON.stringify([img, pg, old, loc]));
  const unknown = linkCredit({ ref: 'unsplash-img:photo-1', file: 'a.jpg', imageUrl: 'https://images.unsplash.com/photo-1' });
  const known = linkCredit({ ref: 'unsplash:W9dLVt7Y0FU', file: 'b.jpg', imageUrl: 'https://images.unsplash.com/photo-2', pageUrl: 'https://unsplash.com/photos/W9dLVt7Y0FU', creator: 'Rina Putri' });
  check('photos records "photographer unknown" for an image link and the name when it is given',
    unknown.creator === 'unknown' && unknown.creatorKnown === false && /unknown/.test(unknown.credit) && /--by/.test(unknown.note) && known.credit === 'Photo by Rina Putri on Unsplash' && !known.note,
    JSON.stringify([unknown, known]));
  // The CLI with fetch replaced: images answer a tiny JPEG, a photo page answers HTML (or a bot wall).
  const mock = path.join(tmp, 'fetch-mock.mjs');
  fs.writeFileSync(mock, `globalThis.fetch = async (u) => {
  u = String(u);
  if (u.startsWith('https://images.unsplash.com/')) return new Response(new Uint8Array([255, 216, 255, 224, 0, 16]), { headers: { 'content-type': 'image/jpeg' } });
  throw new Error('unexpected fetch ' + u);
};\n`);
  const proj = path.join(tmp, 'photos-link');
  fs.mkdirSync(proj);
  const cli = (env, ...a) => spawnSync(process.execPath, ['--import', mock, path.join(here, 'photos.mjs'), ...a], { cwd: proj, encoding: 'utf8', env: { ...process.env, UNSPLASH_ACCESS_KEY: '', ...env } });
  const a = cli({}, 'get', 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800');
  const b = cli({}, 'get', 'https://images.unsplash.com/photo-2?w=800', '--by', 'Rina Putri', '--page', 'https://unsplash.com/photos/a-flower-W9dLVt7Y0FU');
  const c = cli({}, 'get', 'https://unsplash.com/photos/a-flower-W9dLVt7Y0FU');
  const credits = fs.existsSync(path.join(proj, '.design/photos/credits.json')) ? JSON.parse(fs.readFileSync(path.join(proj, '.design/photos/credits.json'), 'utf8')) : [];
  check('photos downloads a pasted image link without a key and writes its credit; a photo page without a key asks for the image address (never scraped)',
    a.status === 0 && b.status === 0 && credits.length === 2 && credits.some((x) => x.creator === 'unknown' && x.note) && credits.some((x) => x.credit === 'Photo by Rina Putri on Unsplash') &&
      c.status === 1 && /Copy image address/.test(c.stderr),
    [a, b, c].map((r) => r.stdout + r.stderr).join(' | '));
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
