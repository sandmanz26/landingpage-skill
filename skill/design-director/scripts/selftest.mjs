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
  fs.writeFileSync(path.join(tmp, '.design/brief.md'), '# brief');
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
  fs.writeFileSync(path.join(d, 'brief.md'), '# Brief');
  p('approve', 'brief'); p('done', 'brief');
  fs.writeFileSync(path.join(d, 'research.md'), RESEARCH);
  p('done', 'research');
  fs.writeFileSync(path.join(d, 'strategy.md'), '# Strategy');
  p('done', 'strategy');
  fs.writeFileSync(path.join(d, 'roast.md'), ROAST);
  p('approve', 'strategy'); p('done', 'roast');
  fs.mkdirSync(path.join(d, 'directions'));
  p('approve', 'direction');
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
  fs.writeFileSync(path.join(d, 'brief.md'), '# Brief');
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
  fs.writeFileSync(path.join(d, 'brief.md'), '# Brief');
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
  fs.writeFileSync(path.join(d, 'brief.md'), '# Brief');
  p('approve', 'brief', '--note', 'ok'); p('done', 'brief');
  fs.writeFileSync(path.join(d, 'research.md'), RESEARCH); p('done', 'research');
  fs.writeFileSync(path.join(d, 'strategy.md'), '# S'); p('done', 'strategy');
  fs.writeFileSync(path.join(d, 'roast.md'), ROAST);
  p('approve', 'strategy', '--note', 'ok'); p('done', 'roast');
  fs.mkdirSync(path.join(d, 'directions'));
  fs.writeFileSync(path.join(d, 'targets.json'), '{}');
  p('approve', 'direction', '--note', 'A');
  const without = p('done', 'direction');
  for (const x of ['a', 'b']) fs.copyFileSync(path.join(fixtures, 'clean.html'), path.join(d, 'directions', `sketch-${x}.html`));
  const withSketches = p('done', 'direction');
  check('progress wants first-screen sketches before a guided direction', without.status !== 0 && /sketch/.test(without.stderr) && withSketches.status === 0, without.stderr + withSketches.stderr);
}

// photos: credits and a clear refusal without a search
{
  const proj = path.join(tmp, 'photos');
  fs.mkdirSync(proj);
  const none = run('photos.mjs', ['credits'], proj);
  const get = run('photos.mjs', ['get', 'unsplash:abc'], proj);
  check('photos keeps credits and refuses a download it has not searched', /No photographs recorded/.test(none.stdout) && get.status === 2 && /search first/.test(get.stderr), none.stdout + get.stderr);
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
