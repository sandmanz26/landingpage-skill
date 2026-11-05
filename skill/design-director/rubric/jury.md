# The jury

One critic has one point of view and one set of blind spots. The jury puts several experts on the
same screenshots, each judging from their own discipline, and combines their scores with the
designers' own votes. Use it in the look step and the best-of-N choice at standard and thorough
effort, when judging references, and in every eval. Quick effort may use a single critic
(`rubric/critic.md`).

## The panel

Each AI juror is a **separate subagent with a fresh context**. It sees the evidence pack (below),
the brief card, the customer profile with the five questions, and the team anchors; never the code,
never the builder's intentions, never another juror's answer.

| Juror | Expertise | Judges | Scores |
| --- | --- | --- | --- |
| **Art director** | Typography, composition, colour, imagery | Hierarchy, rhythm, distinctiveness, finish | clarity, distinctiveness, craft |
| **Conversion strategist** | Offers, funnels, landing-page testing | Is the action that pays obvious? Is the offer clear? Is trust built before the ask? | business |
| **Customer researcher** | User research, usability | The five-questions test, in the customer's order and words, on a phone | customer |
| **Brand and story strategist** | Messaging, copywriting, narrative | Does the message house come through? Does each section earn the next? | story |
| **Interaction and motion designer** | Motion, micro-interaction, states | Does motion have a function? Are states and feedback right? Motion cannot be judged from stills: this juror reads the motion log, reduced-motion and idle results in `evidence.json` and the frames in `motion-sheet.png`, and opens a browser only to check a specific doubt | craft (motion) |
| **Front-end and accessibility engineer** | Performance, accessibility, responsive | Reads the inspector report and the screenshots: contrast, tap targets, reflow, hidden content | craft (technical) |

## Panel size by effort (cost)

Each AI juror costs about 60-95k tokens (measured: 59-66k per juror on the WO run-2 page with the
digest brief, 73-94k per combined juror on references). Run 2's 630k came almost entirely from two
five-juror panels (hero best-of-3 and look). So the panel grows with the effort, not by habit:

| Effort | Look, round 1 | Later rounds (2-3) | Hero best-of-3 |
| --- | --- | --- | --- |
| quick | one critic with all six criteria (`rubric/critic.md`) | the same critic, top three only | no |
| standard | **two combined jurors**: *visual-motion* (art director + motion + accessibility: clarity, distinctiveness, craft) and *business-customer-story* (conversion + customer + story: business, customer, story) | **one verifier**: the previous top three and the new pack, scoring only the criteria the fixes touched | no (sketches at the direction gate choose the composition) |
| thorough | the full panel above (five or six jurors) | two combined jurors | yes, ranked by two combined jurors |

Every juror follows the reading order below and stays under 10 tool calls; a juror over budget is
reported in the critique with its token count.

## The evidence pack (read this, not every screenshot)

Capture once, before any juror starts, so no juror opens a browser or re-reads thirty screenshots:

```bash
node <skill>/scripts/inspect.mjs  <url or file> --out <dir> --quiet   # report.json, folds, pages
node <skill>/scripts/evidence.mjs <url or file> --dir <dir>          # sheets + evidence.json
node <skill>/scripts/digest.mjs   <dir>                              # digest.md from both
node <skill>/scripts/capture.mjs  <list.txt> --jobs 3                # all three, for a whole batch
```

| File | What it holds | Who needs it |
| --- | --- | --- |
| `digest.md` | One short summary of everything below plus the page text: read it first | Everyone |
| `desktop-fold.png`, `mobile-fold.png` | The first screen as the visitor sees it | Everyone |
| `sheet-desktop.png`, `sheet-mobile.png` | Every captured screen on one image | Everyone |
| `evidence.json` → `outline` | Headings with page position, actions (label, count, first screen, sticky), prices, proof mentions, forms | Conversion, customer, story |
| `evidence.json` → `motion`, `reducedMotion`, `idleNavigation` | Libraries, what moves on load, scroll and idle, what still moves under reduced motion, whether the page leaves by itself | Motion |
| `motion-sheet.png` | Frames on load and while scrolling | Motion, art director |
| `report.json` | Inspector findings: contrast measured on screen pixels, overflow, fonts, tap targets, hidden content | Engineer |
| `page-text.txt` | The page's words in order (the digest holds the first 6,000 characters) | Story, customer |
| `*-overlay.png` | The first screen once a pop-up or banner appeared; capture closes it afterwards | Everyone |

Reading order for every juror: `digest.md`, the folds, the overlays and the sheets, read together in
one turn; then the raw JSON or a single full screenshot only to check a specific doubt, and say
which. Every extra turn re-reads everything read before it: in batch-003 jurors took 24-47 tool
calls and 105-164k tokens each, mostly from re-reading. Brief template: `rubric/jury-brief.md`.

No scroll library does not mean no scroll design: full-screen sticky panels stacking over each
other are pure CSS (`stickyPanels` in the digest). In batch-003 three of five jurors missed one for
that reason until a measurement settled it.
The pack holds measurements, not verdicts: a FLAG is something to judge (an endless marquee may be
fine with a pause control), and anything a juror claims beyond the pack is marked *unverified*.

One juror may judge a whole batch in one pass (`refs` in its answer file, below) when the batch
shares a business type; judge each reference against its own business, not against the others.

Each juror answers in the critique format of `rubric/critic.md`, scoring **only its own criteria**
(1–10, with reasons and evidence), plus its top three problems and one thing to keep. Write each
answer to `.design/jury/<round>/<juror>.json`:

```json
{ "juror": "conversion-strategist", "kind": "ai",
  "scores": { "business": 6 },
  "problems": ["No price on the first screen although the audience compares prices first (research #4)"],
  "keep": ["Booking button on every screen"],
  "ranking": ["B", "A", "C"] }
```

`ranking` is used only for best-of-N.

## Human jurors

Designers vote too, in the same folder with `"kind": "human"`: full scores, two scores, or only a
ranking with one sentence why. The two-score vote is the default for references:

```json
{ "juror": "owner", "kind": "human", "visual": 9, "ship": 6, "note": "Smooth motion, but no price" }
```

`visual` (how good the look is) counts as the human score for distinctiveness and craft; `ship`
(would I send this to a client) counts as the human overall. A gap of 2 or more between them is
reported: it separates taste from what sells, which one number cannot. Human votes are collected blind (variants unlabeled, in random
order). A client or a few real customers may join as jurors for **customer** and **business** only.

## Combining

```bash
node <skill>/scripts/jury.mjs score .design/jury/<round>     # scores per criterion, blended
node <skill>/scripts/jury.mjs rank  .design/jury/<round>     # best-of-N, Borda count
```

- **Blend:** when humans voted, the final score per criterion is 50% the human mean and 50% the AI
  mean (`--human-weight` to change it); otherwise AI only, and the report says so.
- **Disagreement:** a criterion where jurors are 3 or more points apart is flagged. Read both
  sides before acting; disagreement is information, not noise to average away.
- **Vetoes that cannot be outvoted:** an accessibility FAIL found by the engineer, and a promise the
  business cannot keep found by the conversion strategist. Taste never outvotes them.
- **Ties on taste go to the humans.**
- **Calibration:** `jury.mjs rank` reports how often each AI juror agrees with the human majority.
  Log it in `rubric/critic-calibration.md`. An AI juror under 60% agreement over the last 20 pairs
  has its weight halved until its brief is revised; one above 80% may decide alone on quick runs.

## Judging references

When the team sends references with notes (`library/intake.md`), the same panel reads them: the
human note is one juror's opinion, the AI jurors add theirs. The entry keeps every view, marks where
they agree, and flags where the human note is contradicted by evidence, so the note can be
corrected rather than copied into the library as fact.
