# Handoff

Read this first if you are a new session, a different model or a different AI tool picking up
this project. It is kept up to date at every milestone. Last updated: **2026-11-02** (batch-004 Summer Smash Tennis judged; owner's five proposed standards evaluated).

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

Batch-003 (judged 2026-10-31, owner scores pending): swehl.com (ref-0007) and theresolute.ai
(ref-0008), notes from the owner, no scores. AI weighted: Swehl 5.8, Resolute 4.9 with two vetoes
(motion ignores reduced motion + endless text with no pause; unsourced health claims and a
misspelt "HIPPA" badge). Owner's notes: Swehl's "fixed-bottom CTA with circular radius" merged the
hero pill buttons (not fixed) with an arched newsletter pop-up that covers the hero after 1 s;
Resolute's "page transitions" are section transitions on one page; Swehl's "unique scroll" was
contested by three jurors (no library) but confirmed by the motion juror and a measurement (4
full-screen sticky panels, CSS curtain reveal). Review: `data/references/batch-003-review.md`; four
questions to the owner at its end. Third batch in a row where the owner's motion claims need
correction: the owner judges motion by feel, which nobody measures yet.

Owner answers for batch-003 (2026-11-01): 9.5 visual and 9.5 ship for both sites (recorded in
`jury/batch-003/owner.json`; blended: Swehl 7.9, Resolute 7.5, gaps 3.3 and 3.9; Resolute's vetoes
stand). The owner meant the arched-top newsletter pop-up (they like the shape), section
transitions while scrolling, and "smooth" = no stutter. The owner was told plainly that identical
9.5/9.5 scores do not yet separate taste from client-readiness, that "ship 9.5" contradicts the
evidence and the team's own approved "Never" rule, and that 11 references scored 8–9.5 carry little
ranking information; proposed: rank within each batch plus anchors (5 = tidy agency site, 9+ = top
5%). Waiting for their reply.

Smoothness (2026-11-01): `lib/smooth.mjs`, `scripts/smooth.mjs`, also inside `evidence.mjs` and the
digest. It measures frame times during a trackpad-like scroll against a plain page on the same
machine, plus long tasks (script blocking) and the WebGL renderer. This container renders with
SwiftShader (no GPU) on a slow CPU, so results rank pages by weight and are not what a laptop
shows. Measured: Playfolly 57.7 fps / 0 long frames, Scotch 54.7/0, Swehl 47/4, Future 44.7/13,
Maxima 3–18 38.5/22, Maxima 34.3/37, Replay 17.5/55, Resolute 1.9/237 with scripts blocking 81%
(plain page about 59.6/0). The owner was asked to run `smooth.mjs` on their own machine (with and
without `--cpu 4`).

Library the skill reads (2026-11-01): before this, `modes/create.md` pointed at
`library/index.json` but it did not exist, so judged references reached the skill only through
`team/taste.md`. Now: `style.mjs` writes a style card per capture (palette, type, shape, spacing,
motion, tags, doNotCopy); `library.mjs build` turns judged batches + style cards into
`skill/design-director/library/index.json`; `library.mjs find <words> --tags ...` returns the
closest references at the direction step; `modes/create.md` says: read the style, adapt
structural roles to the brand without asking, ask the user when the reference's visual style
conflicts with the brand, needs what the client lacks, conflicts with another reference or carries
a forbidden tag; never copy `doNotCopy`. Owner's request: "every time you save, read its style so
it can adapt or be asked to the user" (interpreted as: every stored reference).

First comparison, with vs without the skill (2026-11-01): one prompt ("Buatkan sebuah landing
page untuk wedding organizer"), two pages, a blind A/B artifact for the owner
(https://claude.ai/artifact/SxMfddTJtPUESjwoPxi7FG; A = no skill, B = with skill, random).
Files and the full skill run in `examples/wedding-organizer-compare/`. Measured: no-skill 4 inspector
FAIL and invented proof (320+ weddings, 4.9/5, named testimonials); with-skill 0 FAIL, no invented
proof, story built on research (2024-2025 WO fraud case → trust and money flow). Cost: no-skill
about 5 min / 83k tokens; with-skill about 40 min, subagents 148k tokens plus the main session
(not measured). The no-skill page has more features and an illustration and may well win on
first-glance visual; the owner's verdict is pending. Inspector bugs fixed in this run: smooth
scroll measured mid-scroll; elements measured under a sticky bar (now centred first); the style
tag hung the no-JavaScript check.

Why the first with-skill page looked weak (diagnosed 2026-11-01, told to the owner): the team's
taste was loaded but never enforced. Measured with the new `fit.mjs` against
`team/visual-defaults.json`: it missed all four dials (2 calm colours instead of bold; type ratio
x4.6 vs the owner's favourites x6.3-x24; no imagery at all; no scroll story); quick effort skipped
the hero best-of-3; autopilot meant no human at the direction gate; critic weights favour business
and story. Built in response: `rules/visual-dials.md` (dials + presets from the library + how to
guide the user), `team/visual-defaults.json`, `scripts/fit.mjs`, `rules/illustration.md`
(flat SVG from the subject + shot list), imagery detection in evidence/style, progress.mjs
requires `targets.json` at direction and a Fit section for misses at the look, critic cap,
"Supaya lebih bagus" list at the final gate. Owner said yes to "point 2" (build these and redo the
WO page at standard effort with them choosing); the critic-weight question was not answered, so
weights are unchanged.

Second wedding run (standard effort, guided gates), delivered 2026-11-01:
`examples/wedding-organizer-compare/v2/` (design/ holds brief, research v3 with 7 sources, strategy
v3, roast + response, directions, targets.json, skeleton notes, spec, copy, hero jury, look jury,
critique, deliver.md; build/ holds the generator: parts.py drawings + tokens, heroes.py, page.py).
Owner's answers at the gates: "Setuju brief dan strategi. Arah A. Dial: warna kalem, huruf tegas
x6, gambar ilustrasi, gerak cerita, harga dekat tombol ya." (calm colour differs from the team
default; logged as the user's instruction). Skeleton caught three structure problems (price too
late, clock before its heading, wrong clock without JS). Hero best-of-3: C (clock card) chosen 5/5
by the jury (about 59k tokens per juror). Look: 7.7 (clarity 8, distinctiveness 7, craft 7,
business 8, customer 8, story 8), no veto (about 66k tokens per juror with the digest brief, down
from 105-164k). Fixes: crew-by-guests table under the price cards, stages bar, phone sticky bars
no longer stack, font sizes 17 → 13. Not fixed by rule: proof of quality (never invented) → first
item of "Supaya lebih bagus". Fit 5/5, inspector 0 FAIL, 60 fps.
Measurement fixes found in this run: colour families now counted by clustering hues (tints of
one hue are one colour; 30° buckets split a teal family), pinned clock computed on every scroll.
Three-way blind test (A = run 2, B = no skill, C = run 1, random):
https://claude.ai/artifact/B4UxMgyAhNq2AroTQVGr3G (copy in `examples/wedding-organizer-compare/three-way/`).
Fit against the owner's dials: run 2 5/5, no skill 4/5, run 1 2/5. Waiting for the owner's scores
and the final-gate approval of run 2.

Taste-skill comparison (2026-11-01, owner asked "coba buat dulu dengan taste skill"): tasteskill v2.1.5
(commit 12af471, MIT) run by a fresh agent with the same prompt, autopilot choices listed in
`examples/wedding-organizer-compare/taste-skill/choices.md`. Correction of an earlier claim to the
owner: taste-skill v2 does have a real-browser inspector and a look-and-fix loop; it has no
per-project research, roast, multi-expert jury or team taste. Result: "Janur" WO Yogyakarta,
page-is-the-object (tabbed folders), credited museum photos, interactive rundown, no invented
proof; its own critic 7.4. Our measures: 1 FAIL (phone link tap target), fit 3/5 against the
owner's dials (photos not illustration, type x5.5), 58.5 fps / 0 long frames, at least 326k tokens
(the agent hit the account's 5-hour usage limit mid-run and was resumed; the part before the
interruption is not in that number), 88 steps, over 30 minutes. So taste-skill is not cheap
either; our run 2 subagents were about 630k plus the main session.
Four-way blind test (same URL as the three-way, version 2): https://claude.ai/artifact/B4UxMgyAhNq2AroTQVGr3G
— A no skill, B run 1, C run 2, D taste-skill (reshuffled so no version keeps its old letter).
Waiting for the owner's scores.

Variants and auto-grouping (2026-11-02, owner asked for a forced option to make several variants and
deliver the best or let the user pick, and for references to be grouped by the AI on its own):
- `progress.mjs init ... --variants 1-3 --choose user|jury` (thorough defaults to 3). Build refuses
  until `.design/variants/v1..vN/index.html` exist; the gate needs each variant's own inspection
  with 0 FAIL; the look needs `.design/variants/choice.json`, and `approve variant` when the user
  chooses. `scripts/compare.mjs` makes the side-by-side page (desktop/phone, scores, pick, reply to
  copy; `--blind` hides names). Create mode documents it ("Variants"); SKILL.md asks once
  "Satu versi, atau 2-3 varian untuk dipilih?".
- `library.mjs build` now assigns each reference a sector (from its business line, or an explicit
  `sector`) and a style group (six dimensions: surface, colour, type, imagery, motion, shape;
  grouped by each group's core so groups cannot drift by chaining). `library.mjs groups` prints
  them. With 8 references most groups have one member; groups become meaningful from about 5
  references per sector. Imagery dimensions are missing for references captured before imagery
  detection existed (re-run evidence.mjs to fill them).
- Taste-skill study, read from its own references/research.md (told to the owner): a one-off
  study (248 gallery sites, captured with headless Chrome, scored by 21 model reviewers with
  Awwwards weights), frozen into rules and 20 directions; per project only a subject inventory.
  Its own test table shows the baseline (no skill) usually scored higher with its single model
  juror; its measured win was 0 inspector FAILs vs 8-13. Worth adopting (MIT, with attribution):
  the "live thing" rule, assets.mjs (open-collection pictures with licences and credits), a
  minimum motion count. Not done yet; owner not yet asked to decide.

Guiding the user and choosing early (2026-11-02, owner: variants are for the user to choose,
which should cut process; guide the user to what they want so results scope down, not random):
- Told the owner: the saving comes from choosing early from cheap first-screen sketches, not from
  building 2-3 full pages and choosing late.
- `rules/brief-interview.md`: one guiding message before the brief gate, at most five questions
  with choices and a recommendation (who and what for; 1-3 liked sites and 1 disliked; three
  feeling words from a list; what exists; what is ruled out); "terserah" → team defaults.
- `scripts/dials.mjs suggest <liked capture dirs> [--dislike dirs]`: liked sites → suggested dials
  with agreement counts and "not a differentiator" notes when disliked sites share a value, plus
  things to avoid; writes `.design/targets.suggested.json` for the direction gate.
- Direction gate (guided): first-screen sketches per direction (`.design/directions/sketch-*.html`)
  shown with `compare.mjs`; `progress.mjs` refuses `done direction` without at least two. When the
  user chose from sketches: hero best-of-3 skipped, look at standard effort with two jurors (art
  director, customer researcher). Estimated effect on run-2-style cost: subagents from about 630k
  to about 130-200k (no hero jury; 2 look jurors) plus sketch building in the main session;
  not yet measured.
- Full-page variants remain for thorough effort or on request; user chooses unless autopilot.

Batch-004 (2026-11-02): Summer Smash Tennis (ref-0009, home + classes, method, coaches,
private-lessons, about; ids ref-0009-<page>), sector health (sport). Captured with capture.mjs in
16 minutes. Jury: first use of two combined jurors (visual-motion; business-customer-story),
87k + 94k tokens. Scores 8/8/7/6/6/6, weighted 6.8, no veto. Owner's five notes: frame-break and
bounce/spin confirmed with corrected terms (measured live: ball bounce, three spinning icons, buttons
lose their offset shadow on hover = the real micro-interaction); text-on-path "unique" contested;
map markers confirmed. Owner also proposed five standards; evaluated with library data: fonts
(9/9 sites: one text face 80-95% + one display face) agreed and quantified; motion agreed with the
reduced-motion condition (all three heavy-motion favourites ignore it); unique element agreed if
drawn from the subject; "human interaction" ambiguous, asked; photos as key visual agreed with
corrections (Unsplash never presented as the client's own, no generic stock, placeholders only in
drafts). Four taste rules proposed in `data/references/batch-004-review.md`, pending approval.
Photo sources from this cloud session: Unsplash images downloadable but search needs an API key,
Openverse blocked, Wikimedia rate-limited. Owner asked whether to build a photo finder.

Capture fixes from batch-003: `lib/browser.mjs` `gotoStable` retries server error pages (a 502
"upstream request failed" had been captured as Swehl's desktop) and every failed load is reported
(`page-did-not-load`; set `DD_LOAD_TRIES` to change the 3 tries); `dismissOverlays` closes
pop-ups and cookie banners after photographing them (`*-overlay.png`); evidence records
`stickyPanels` and measures the outline with sticky turned off (bottom-sticky panels had looked
like first-screen content); "stays-visible" now means a bar or fixed element under 40% of the
screen; `page-text.txt`; `jury.mjs score <dir>` scores every ref of batch-style juror files.

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
- Measured on batch-003 (2 sites, jurors read the evidence pack, no browser except one transition
  check): capture 8 min (0 tokens), jury 5 min 53 s wall time (jurors 2.8–5.9 min each),
  648,860 subagent tokens. Time per batch fell (about 14 min vs about 20 min) but tokens per site
  did **not** (324k vs 240k per site): jurors made 24–47 tool calls each and every call re-reads
  the growing context; the files they read were about 125 KB of text plus 10–20 images.
- Response (2026-10-31): `scripts/digest.mjs` writes `digest.md` (about 3k tokens: outline,
  actions, prices, motion, inventory, findings, the first 6,000 characters of page text);
  `capture.mjs` runs it; the brief template `rubric/jury-brief.md` tells jurors to read the digest,
  folds and sheets in one parallel turn and stay under 10 tool calls. Not yet measured: run it on
  batch-004 and record time and tokens here.
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

1. **Prove the skill beats no skill** (not yet shown): one example exists (wedding organizer,
   owner's verdict pending). Next: 3–5 briefs × (no skill, taste-skill, this skill), judged by the
   jury and 2+ designers who do not know which is which. Needs real or Excel briefs.
2. Owner's reply on the scoring proposal (rank within a batch + anchors) and on the conflict between
   "ship 9.5" for Resolute and the approved "Never" rule.
3. Batch-004: capture, then jurors with `rubric/jury-brief.md` (digest first); record time and
   tokens against batch-003 (5.9 min, 649k tokens for 2 sites).
4. Smoothness on a real machine: the owner runs `smooth.mjs` locally; record the numbers beside the
   container's.
5. Confirm with the owner that "ya tidak masalah" meant approving the six taste rules and two scores.
6. Build the reference pipeline (v0.4): read the Excel, capture each URL (layout + motion), run the
   jury, write library entries, derive directions/recipes/taste-rule proposals, version as an epoch.
7. Mini eval (see 1): 5 briefs × (no skill, taste-skill, ours) judged by 2 designers + AI jury.
8. Adopt taste-skill's open-collection image search (MIT, with attribution) to close the
   "no photos" gap seen in the Senyum Dental runs.
9. Owner to provide: 4–6 business models for test briefs, real (anonymised) briefs with customer
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
