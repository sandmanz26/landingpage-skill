# Handoff

Read this first if you are a new session, a different model or a different AI tool picking up
this project. It is kept up to date at every milestone. Last updated: **2026-10-30**.

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

Done and tested (`cd skill/design-director && npm test`, 31 checks):
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

In progress (2026-10-30):
- **Reference batch-001** (`data/references/`): three sites the owner sent with notes
  (playfolly.com, replay.ai, scotchpos.com). Captured with `inspect.mjs` into
  `data/references/captures/`. Five AI jurors write to `data/references/jury/batch-001/`.
  Next: reconcile the owner's notes with the jury (confirmed / contested / unverifiable) into
  `data/references/batch-001.json` and a readable review, then send the owner the questions.

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

- **GitHub push fails (403)** from the cloud session: the Claude GitHub App lacks access to
  `sandmanz26/landingpage-skill`. Commits exist locally on branch `claude/affectionate-cray-t2nlj1`;
  zips were sent to the owner. Fix: reconnect at https://claude.ai/connect-github.
- **Network**: the owner opened network access on 2026-10-30; the three reference sites and
  PubMed now load, but `www.awwwards.com` still fails (likely bot protection or still not allowed).
- Subagents: in the cloud session, spawn them only when the owner asks (they asked for the jury).
- Planned home: the owner's local machine with Claude Code (`README.md` has install steps).

## 6. Next steps, in order

1. Finish batch-001 reconciliation; ask the owner the open questions per reference.
2. Build the reference pipeline (v0.4): read the Excel, capture each URL (layout + motion), run the
   jury, write library entries, derive directions/recipes/taste-rule proposals, version as an epoch.
3. Mini eval: 5 briefs × (no skill, taste-skill, ours) judged by 2 designers + AI jury.
4. Adopt taste-skill's open-collection image search (MIT, with attribution) to close the
   "no photos" gap seen in the Senyum Dental runs.
5. Owner to provide: 4–6 business models for test briefs, real (anonymised) briefs with customer
   voice (reviews, WhatsApp questions), 2–3 designers for voting, more references with notes.

## 7. Map

```
HANDOFF.md            this file
CLAUDE.md, AGENTS.md  working agreement + pointer here (auto-read by Claude Code / other agents)
README.md             install and usage (Bahasa Indonesia)
docs/SPEC.md          full specification and rationale
skill/design-director/  the skill (see its SKILL.md)
templates/            Excel template for references and briefs
data/references/      reference batches, captures, jury votes
examples/             simulation runs
THIRD_PARTY_NOTICES.md  taste-skill MIT notice
```
