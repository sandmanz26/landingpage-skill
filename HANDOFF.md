# Handoff

Read this first if you are a new session, a different model or a different AI tool picking up
this project. It is kept up to date at every milestone. Last updated: **2026-10-31** (evidence pack and faster jury, after batch-002).

## 1. Goal

Build a skill (`skill/design-director/`) that makes AI-generated web design clearly better than
the default "AI slop", and better than the open-source **taste-skill v2** (Leonxlnx/taste-skill,
MIT). "Better" is judged by the owner's design team in blind votes, not by the model.

The owner's definition of good design (do not drift from it):
- it answers the **business** (the action that pays) **and** the **customer** (their questions,
  fears, words), joined by a **storyline**, not only aesthetics;
- decisions are **backed by research**, and the research is returned to the user;
- the plan is **roasted** before building, and the roast may change the direction;
- results are judged by **several expert AI jurors plus human jurors**, not one critic.

## 2. Working agreement with the owner

The owner (Indonesian; writes in Bahasa Indonesia; answer in Bahasa Indonesia) asked for this
explicitly:
- Act as a precise **AI and prompt engineer**. Stay neutral, chase the goal, **no sycophancy**.
- **Correct the owner when they are wrong** and say why; their notes and ideas are input to be
  checked and improved, not instructions to copy.
- Be honest about what was not verified (no access, no data, simulated steps).
- **Keep this handoff current** at every milestone, in enough detail that another model or AI can
  continue without the chat history.

## 3. Current state (v0.2 + jury)

Done and tested (`cd skill/design-director && npm test`):
- Skill core: `SKILL.md` router; modes create, site, section, review/restyle/redesign, app-screen.
- Mandatory steps in every mode: **research → strategy → roast** before direction
  (`research/method.md`, `strategy/method.md`, `roast/method.md`). Gates: brief, strategy,
  direction, choose (improve modes), final.
- **Jury** (`rubric/jury.md`, `scripts/jury.mjs`): art director, conversion strategist, customer
  researcher, brand/story strategist, interaction-motion-accessibility engineer (+ optional
  front-end engineer). AI and human votes blended 50/50 when humans vote; accessibility vetoes
  cannot be outvoted; taste ties go to humans; per-juror calibration against humans.
- Scripts (Node 18+, Playwright): `progress.mjs` (step order, gates, turn back, refuses research
  without sources and unanswered roasts), `draw.mjs` (deals 3 directions from the seed library
  copied from taste-skill, MIT, see `THIRD_PARTY_NOTICES.md`), `inspect.mjs` (real browser at
  1440/768/390, accessibility + AI-default checks, design inventory, scrolled viewport
  screenshots), `lint.mjs` (stock copy EN/ID, placeholders), `jury.mjs`, `selftest.mjs`.
- Rules: objective, AI defaults, copyright, precedence, Indonesian copy; motion as UX.
- Excel template for collecting references and test briefs: `templates/referensi-dan-brief.xlsx`.
- Examples: `examples/senyum-dental/` (full v0.1 run with page and design log),
  `examples/senyum-dental-v2/` (research → strategy → roast, stops at the strategy gate).
- Specs and rationale: `docs/SPEC.md` (§1–24).
- Team guide (claude.ai Doc, private): "Prompting Claude for Design: A Team Guide",
  https://claude.ai/artifact/L4QfVHybTmdhTvg4KKhEVv. Explainer page:
  https://claude.ai/artifact/SSVpDi4o3ce1emXfnu5Rpy.

Batch-001 (done 2026-10-30, awaiting the owner):
- Three sites the owner sent with notes (playfolly.com, replay.ai, scotchpos.com), captured with
  `inspect.mjs` (`data/references/captures/`), judged by five AI jurors
  (`data/references/jury/batch-001/`), reconciled in `data/references/batch-001.json` and the
  readable `data/references/batch-001-review.md` (Bahasa Indonesia).
- Result: of the owner's 10 claims, 3 confirmed, 5 confirmed with corrections, 2 contested; all
  three sites carry an accessibility veto; the notes were aesthetic only and missed the business
  and customer gaps the jurors found. Waiting on: the owner's 1–10 scores (human juror) and answers
  to the questions at the end of the review.
- Lessons fed back into the skill: the inspector now tracks text seen during the scroll (fixes
  false "hidden content" on reveal-and-hide pages, closed menus and hidden duplicates); a search
  snippet gave Playfolly the wrong business model ("configurator"; it is a waitlist), which is why
  research must open its sources; motion can only be judged live, so the motion juror observes the
  page in a browser.

Batch-002 (done 2026-10-30, owner answered 2026-10-31): Maxima Therapy (home + 3-18 page, same
template) and Future. Reconciled in `data/references/batch-002.json` and
`data/references/batch-002-review.md`. AI weighted vs owner: Maxima 5.0/9 and 4.7/9 (gap > 4),
Future 6.9/8. Key finding about the owner's taste across six references: their scores follow
distinctiveness and art direction, not business or customer. Proposed: from the next batch the
owner gives two scores (visual; would-ship-to-a-client), and six team-taste rules.
Owner's answers (2026-10-31): Maxima stays 9 "because the animation is smooth" (so the owner's
single score measures art direction and motion feel, which confirms the need for two scores);
"ya tidak masalah, kenapa tidak" was read as approving both the six rules and the two-score format
(the owner was told to correct this reading if wrong). The six rules are now in `team/taste.md`;
`jury/batch-002/owner.json` records the answers.

Inspector changes from batch-002: suspected contrast failures are re-measured on real screen
pixels (median of background pixels decides; worst tenth reported), text over photos in sibling
layers is no longer compared against white, symbol-only text is skipped, scrolling samples in
half-screen steps. The batch-002 captures were re-run on 2026-10-31 with the current inspector
(`report.json` is the current report; the earlier `report-v2.json` files were removed).

Evaluation speed (2026-10-31, owner asked "how do we make evaluation faster"):
- Measured cost before: batch-002 (3 sites) took about 20 minutes and about 720k subagent tokens.
  The motion juror alone took 10–12 minutes because it drove its own browser; every juror re-read
  15–30 screenshots.
- New **evidence pack**, captured once before the jury (`rubric/jury.md` § The evidence pack):
  `scripts/evidence.mjs` writes `sheet-desktop.png`, `sheet-mobile.png` (all screens on one image),
  `motion-sheet.png` (frames on load and scroll) and `evidence.json` (outline: headings with
  position, actions with first-screen and sticky, prices, proof mentions, forms; motion: libraries
  incl. bundled GSAP via `_gsap`/pin spacers/loaded chunks, what moves at the top and further down
  with no input, script-driven motion on scroll, reduced-motion behaviour, idle navigation).
  `scripts/capture.mjs <list.txt> --jobs 3` runs inspect + evidence for a whole batch.
- Measured after: `capture.mjs data/references/batch-002.txt --jobs 3` took 6 min 54 s for the 3
  sites, 0 tokens. On its own it reproduced the motion juror's key findings: Maxima navigates by
  itself after idle, keeps moving under reduced motion, uses GSAP + ScrollTrigger + SplitText +
  Lenis + Lottie; Future has a moving card strip with no pause control and has price ($50, $199/mo)
  and "Find Your Coach" on the first screen.
- Not yet measured: the jury's own time and tokens when reading the pack. Estimate (unverified):
  jurors no longer open a browser or read every screenshot, so roughly 3–5 minutes per juror and
  well under half the tokens. Measure it on the next batch and record the real numbers here.
- Known limits: the outline's action detection is heuristic (testimonial cards with backgrounds
  are counted as actions; counts vary a little between loads); Future's inspect took 313 s under
  parallel load (three viewports with half-screen scroll steps). Possible next cut: one browser
  load for inspect + evidence, or skip the 768 viewport for references.
- Jury: humans may vote with `visual` and `ship` (1–10). `visual` counts as the human score for
  distinctiveness and craft, `ship` as the human overall; a visual-vs-ship gap of 2 or more is
  reported. The Excel template now has the two columns (G visual, H layak kirim), and its generator
  is in the repo: `python3 templates/make_template.py` (formulas checked after a LibreOffice
  recalculation).

## 4. Decisions and why (do not undo without a reason)

| Decision | Why |
| --- | --- |
| Skill, not fine-tuning | Claude cannot be fine-tuned here; skills put knowledge in context. "Training" = epochs: data batch → derived rules/library → blind eval → release or roll back |
| Research, strategy, roast mandatory | Owner's requirement; taste-skill has a one-off gallery study but no per-project research or roast |
| Human gates (brief, strategy, direction, final) | Taste matters most at direction; cheapest place to put a human in |
| Team taste as data (`team/taste.md`) | taste-skill hard-codes its owner's taste; ours learns the team's |
| Script-enforced gates | Models skip prose steps in long sessions |
| Jury of several experts + humans | One critic has one blind spot; owner asked for it |
| Library stores patterns and numbers, never assets/code | Copyright (`rules/copyright.md`) |
| Pass mark for a release: ≥ 65% blind wins over 60 votes (p ≈ 0.014), with a hold-out set | 60% at 36 votes is chance-level |

## 5. Blockers and environment

- GitHub: pushing to `sandmanz26/landingpage-skill`, branch `claude/affectionate-cray-t2nlj1`, works
  since 2026-10-30 (earlier pushes failed with 403 until access was granted). No pull request yet.
- **Network**: the owner opened network access on 2026-10-30; the three reference sites and
  PubMed now load, but `www.awwwards.com` still fails (likely bot protection or still not allowed).
- Subagents: in the cloud session, spawn them only when the owner asks (they asked for the jury).
- Planned home: the owner's local machine with Claude Code (`README.md` has install steps).

## 6. Next steps, in order

1. Next batch (batch-003): write `data/references/batch-003.txt`, run `capture.mjs`, then the jury
   on the evidence packs only; measure the jury's time and tokens against batch-002 (about 20 min,
   about 720k tokens) and record it in §3. Ask the owner for two scores per site.
2. Confirm with the owner that "ya tidak masalah" meant approving the six taste rules and two scores.
3. Build the reference pipeline (v0.4): read the Excel, capture each URL (layout + motion), run the
   jury, write library entries, derive directions/recipes/taste-rule proposals, version as an epoch.
4. Mini eval: 5 briefs × (no skill, taste-skill, ours) judged by 2 designers + AI jury.
5. Adopt taste-skill's open-collection image search (MIT, with attribution) to close the
   "no photos" gap seen in the Senyum Dental runs.
6. Owner to provide: 4–6 business models for test briefs, real (anonymised) briefs with customer
   voice (reviews, WhatsApp questions), 2–3 designers for voting, more references with notes.

## 7. Map

```
HANDOFF.md            this file
CLAUDE.md, AGENTS.md  working agreement + pointer here (auto-read by Claude Code / other agents)
README.md             install and usage (Bahasa Indonesia)
docs/SPEC.md          full specification and rationale
skill/design-director/  the skill (see its SKILL.md)
templates/            Excel template for references and briefs + make_template.py (its generator)
data/references/      reference batches (batch-<n>.json/.txt, review), captures/<id>/ (report.json,
                      evidence.json, folds; sheets are regenerated, not committed), jury votes
examples/             simulation runs
THIRD_PARTY_NOTICES.md  taste-skill MIT notice
```
