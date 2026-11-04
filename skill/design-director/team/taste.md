# Team taste

The team's own taste, loaded on every run. It outranks the skill's defaults (see
`rules/precedence.md`). Keep it short: every extra line dilutes the others. Each rule carries its
source so it can be reviewed and retired.

Format: `- <rule> — <why> (source: <project>, <date>, <who>)`

## Always
<!-- e.g. - Real photographs of the client's place, never stock — clients notice stock instantly (source: Senyum Dental, 2026-11-02, Rina) -->
- Put the price, or the answer to "what does it cost", near the main action when the business allows it — the strongest converter seen so far (source: batch-002 Future; missing on Playfolly and Maxima, 2026-10-30, owner + jury)

- Two type families: one text face carrying 80-95% of the text, one display face used sparingly, one size scale — every reference so far follows it (source: 9 of 9 library sites incl. batch-004 Summer Smash Tennis, 2026-11-02, owner + data)
- Every control gives feedback on hover, press and focus — micro-interaction is what makes a page feel alive (source: batch-004 Summer Smash Tennis buttons that press down, 2026-11-02, owner)
- Every interaction has a meaning and a purpose, written in the spec before it is built: it shows the visitor something they need (what the product becomes, the evidence behind a claim, the place on a map), helps them decide, or answers their action; an interaction that only moves is decoration and is cut. It works on a phone and a keyboard too (tap or focus does what hover does) — a common pattern earns its place through what it reveals, not through novelty (source: batch-007 Quite Nice: a flavour card turns from the packet into the finished bowl, a benefit opens the mechanism with journal citations; owner asked for this rule explicitly, 2026-11-02)

## Never
<!-- e.g. - Centred hero with two buttons — reads as a template to our clients (source: review session, 2026-11-05, team) -->
- An element that cannot name its job: UI placed because pages like this usually have it (three icon cards, a stat row, a badge, a blob, an eyebrow label, a marquee), or chosen for looks alone without carrying the page's idea — the customer cannot use what the designer cannot explain; every element passes the reason roast (`rubric/reason.md`) (source: owner 2026-11-04, "banyak AI cuman sekedar menaruh UI tapi tidak paham apa yang dia taruh")
- Content that only appears through animation, motion without a reduced-motion path, or a page that navigates by itself — excludes people and hides the offer (source: batch-001 Replay, batch-002 Maxima, 2026-10-30, owner + jury)

- A fixed or sticky logo or badge that is not a slim bar: a large logo belongs to the first screen and scrolls away — it covers content on every screen (source: batch-005 A-Rete 280x183px fixed badge; inspector `fixed-cover`; decided by Claude on the owner's delegation 2026-11-02, owner to review)
- Display sizes without a scale: use 3-4 display steps, each with one role, the same role always the same size — sizes that jump without a pattern strain the eyes (source: batch-005 A-Rete 10 display sizes, same role at 35/50/53px; owner's note; inspector `display-sizes`; decided by Claude on the owner's delegation 2026-11-02, owner to review)
- Long paragraphs in ALL CAPS, or running text under 16px — they are hard to read (source: batch-005 A-Rete 15px all-caps paragraphs at 100+ characters a line; decided by Claude on the owner's delegation 2026-11-02, owner to review)
- A picture that touches a band edge while wide empty gaps stay at its sides; sections follow one spacing rhythm (full-bleed colour fields that meet on purpose are fine) (source: batch-005 A-Rete, owner's note 2; decided by Claude on the owner's delegation 2026-11-02, owner to review)

## Prefer
<!-- e.g. - Square corners on pictures; one radius for controls -->
- Bold flat colour with clear roles, one colour reserved for the main action (source: batch-001/002 Maxima, Scotch, Playfolly, 2026-10-30, owner)
- Flat illustration or graphics drawn from the subject itself, not generic 3D vectors — layered over or beside photographs, or alone only when no honest photograph exists (source: batch-002 Maxima, batch-001 Replay, 2026-10-30, owner; reconciled with the photographs rule 2026-11-02)
- Real product UI filled with the customer's own world, never empty mockups (source: batch-001 Scotch, batch-002 Future, 2026-10-30, owner + jury)
- Smooth, choreographed scroll storytelling with objects from the subject's world (old way vs new, cards that turn, letters that drop in), always with a static reduced-motion version (source: batch-001 Scotch, batch-002 Maxima, 2026-10-30, owner)

- One signature element drawn from the subject's world, used across the page (objects breaking a photo's frame, map markers, section dividers), never decoration without meaning such as random clouds — it keeps the page from feeling monotonous (source: batch-004 Tennis balls and racquets, batch-003 Swehl arches, batch-002 Maxima tilt, 2026-11-02, owner)
- At least one element the visitor operates, built from the subject's real content: a before/after slider, a clickable map, hover to reveal, play to see detail — it makes people pause and notice the content; its purpose follows the Always rule above (source: owner 2026-11-02; taste-skill study: every winning page had one)
- Photographs as the key visual: the client's own first; otherwise licensed photographs of the subject's world (Unsplash, open collections) found with photos.mjs, credited, never presented as the client's own people, place or product; placeholders only in drafts, with a shot list (source: batch-004 Tennis real student photos, batch-002 Future, 2026-11-02, owner)

- One or two corner radii used everywhere: a large one for cards and pictures (about 24-40px), a small one for controls — a soft, consistent shape reads as modern (source: batch-006 Sunny Within, owner's note; measured there at about 10 values, so the consistency is the lesson, not the copy; decided by Claude on the owner's delegation 2026-11-02, owner to review)

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
