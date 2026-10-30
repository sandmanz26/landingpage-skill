# The jury

One critic has one point of view and one set of blind spots. The jury puts several experts on the
same screenshots, each judging from their own discipline, and combines their scores with the
designers' own votes. Use it in the look step and the best-of-N choice at standard and thorough
effort, when judging references, and in every eval. Quick effort may use a single critic
(`rubric/critic.md`).

## The panel

Each AI juror is a **separate subagent with a fresh context**. It sees the screenshots, the brief
card, the customer profile with the five questions, and the team anchors; never the code, never the
builder's intentions, never another juror's answer.

| Juror | Expertise | Judges | Scores |
| --- | --- | --- | --- |
| **Art director** | Typography, composition, colour, imagery | Hierarchy, rhythm, distinctiveness, finish | clarity, distinctiveness, craft |
| **Conversion strategist** | Offers, funnels, landing-page testing | Is the action that pays obvious? Is the offer clear? Is trust built before the ask? | business |
| **Customer researcher** | User research, usability | The five-questions test, in the customer's order and words, on a phone | customer |
| **Brand and story strategist** | Messaging, copywriting, narrative | Does the message house come through? Does each section earn the next? | story |
| **Interaction and motion designer** | Motion, micro-interaction, states | Does motion have a function? Are states and feedback right? Motion cannot be judged from stills: this juror opens the page in a browser, records frames on load and scroll and reads `document.getAnimations()` | craft (motion) |
| **Front-end and accessibility engineer** | Performance, accessibility, responsive | Reads the inspector report and the screenshots: contrast, tap targets, reflow, hidden content | craft (technical) |

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

Designers vote too, in the same folder with `"kind": "human"`: either full scores, or only a
ranking with one sentence why. Human votes are collected blind (variants unlabeled, in random
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
