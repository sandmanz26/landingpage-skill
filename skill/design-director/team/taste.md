# Team taste

The team's own taste, loaded on every run. It outranks the skill's defaults (see
`rules/precedence.md`). Keep it short: every extra line dilutes the others. Each rule carries its
source so it can be reviewed and retired.

Format: `- <rule> — <why> (source: <project>, <date>, <who>)`

## Always
<!-- e.g. - Real photographs of the client's place, never stock — clients notice stock instantly (source: Senyum Dental, 2026-11-02, Rina) -->
- Put the price, or the answer to "what does it cost", near the main action when the business allows it — the strongest converter seen so far (source: batch-002 Future; missing on Playfolly and Maxima, 2026-10-30, owner + jury)

## Never
<!-- e.g. - Centred hero with two buttons — reads as a template to our clients (source: review session, 2026-11-05, team) -->
- Content that only appears through animation, motion without a reduced-motion path, or a page that navigates by itself — excludes people and hides the offer (source: batch-001 Replay, batch-002 Maxima, 2026-10-30, owner + jury)

## Prefer
<!-- e.g. - Square corners on pictures; one radius for controls -->
- Bold flat colour with clear roles, one colour reserved for the main action (source: batch-001/002 Maxima, Scotch, Playfolly, 2026-10-30, owner)
- Flat illustration or graphics drawn from the subject itself, not generic 3D vectors (source: batch-002 Maxima, batch-001 Replay, 2026-10-30, owner)
- Real product UI filled with the customer's own world, never empty mockups (source: batch-001 Scotch, batch-002 Future, 2026-10-30, owner + jury)
- Smooth, choreographed scroll storytelling with objects from the subject's world (old way vs new, cards that turn, letters that drop in), always with a static reduced-motion version (source: batch-001 Scotch, batch-002 Maxima, 2026-10-30, owner)

## Anchors
Designs the team approved or rejected, with one line on why. Screenshots go in `team/approved/` and
`team/rejected/`. The critic uses these to judge "fit".

| File | Verdict | Why |
| --- | --- | --- |
| `data/references/captures/ref-0004/desktop-fold.png` (Maxima) | Approved (owner 9) | Bold colour, expressive rounded display type, subject illustration, smooth choreographed scroll. Not for: its accessibility and business gaps |
| `data/references/captures/ref-0006/desktop-fold.png` (Future) | Approved (owner 8) | Photography of real members, one product screen in focus, price under the action |

## Critic weights
Business 20 · Customer 20 · Story 15 · Clarity 15 · Distinctiveness 15 · Craft 15

## Review
Rules older than three months are reviewed: keep, change or delete.
