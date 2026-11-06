# Motion

Motion is part of the experience, planned in the spec, not decoration added at the end. There is no
quota: every moving thing has one of these functions, and the page's one signature motion carries
its message (below).

| Function | Examples | Rule |
| --- | --- | --- |
| Feedback | Hover, press, focus, loading on a button | On every control; 120–200ms |
| Orientation | Page change, opening a panel, switching tabs | Shows where things come from and go |
| Continuity | A thumbnail grows into the hero of the detail page | The same thing stays recognisable as it moves |
| Story | A scroll sequence that reveals how something works | At most 1–2 per page, drawn from the page's idea |
| Atmosphere | A muted video loop, a slow drift on a photograph | One, never in the way of reading |

## Interactions: meaning before movement

An interaction is something the visitor operates: hover to reveal, a card that turns, a
before/after slider, a clickable map, play to see detail, a row that opens. The team rule
(`team/taste.md`, Always) is that each has a meaning and a purpose. Before building one, write its
row in the spec's Interactions table:

- **What the visitor gets** is content from the subject, not an effect: the finished dish behind
  the packet, the mechanism and citations behind a health claim, the result behind "before".
- **The purpose** names the customer question it answers (from the storyline): "what will I
  actually eat?", "is this claim real?". No question, no interaction.
- **A familiar pattern is fine** (a flip card, an accordion): it earns its place through what it
  reveals, not through novelty.
- **Phone and keyboard:** hover does not exist on touch. Tap and focus do the same thing, or the
  revealed content is also visible without hovering. Content needed to decide never lives only
  behind hover.
- **Feedback** on every control (hover, press, focus) is the Feedback function above; it needs no
  row unless it reveals content.

Example (Quite Nice, batch-007): hovering a flavour card turns the packet into a photograph of the
finished bowl (answers "what will I eat?"); clicking "Support Your Microbiome" opens a drawer with
the mechanism and journal citations (answers "is this real?"). Measured gap: on a phone there is
no hover, so the bowl photographs never show there.

## Motion carries the message (owner, 2026-11-06)

The owner judges motion by what it says, not by how much moves (batch-009: Axis Group scored 9/9.5
from the owner while the jurors gave its craft 4). So the motion spec starts from the site's
**message**, the promise of the message house (`strategy/method.md`) in one line, and names the
**one signature motion** that shows it. It is a Story function: drawn from the subject, not an
effect laid over it. Examples from the library:

- **Axis Group** (batch-009, legal services for fintech): in "How we work" a client chat, a
  handwritten strategy note and a redlined document build on scroll, so a service with no product
  is seen being done; the hero turns the sectors served into the brand mark. Its cost is the
  warning: 56 endless loops without a pause and motion under reduced motion (craft 4).
- **Quilt** (batch-008, home climate): isometric rooms with a temperature badge each explain
  room-by-room control; the drawing carries what the product does.
- **Quite Nice** (batch-007, food): the hero photograph grows from its arch frame to full width on
  scroll, and drawn leaves and oats break out of the frame: the food is the event.

If no message worth moving is found (the promise has nothing to show in motion, or the only idea is
an effect), **do not invent motion**. Write `Message: none found` and `Offered to the user: <one
signature motion that could carry the message, and what it would need>`, keep feedback, entrance
and state transitions, and put the option in the deliver report under **"Supaya lebih bagus"**
(SKILL.md, final gate). Owner: "kalau kamu merasa belum menemukan message untuk dibuatkan motion
kamu bisa sampaikan ke user di akhir sebagai opsi".

## Transitions are required (owner's requirement 1, 2026-11-06)

"Transisi animasi itu wajib." Every page has:

- **an entrance on first load**: the first screen arrives in order (headline → sub → action →
  picture, or what the direction says) within about 800 ms in total, from a visible state
  (Rules below), never a loading screen;
- **transitions between states**: every open/close, tab, step, filter, form state (idle, loading,
  success, error) and page change moves with the Orientation or Continuity function instead of
  jumping; "none" only when the page has no state that changes.

Each one has a **reduced-motion version** written next to it (a short cross-fade or an instant
change; the content stays). Anything that moves by itself for **more than 5 seconds** has a visible
pause control (WCAG 2.2.2). **Budget:** `transform` and `opacity` only, no endless loop that carries
text, at most one Atmosphere loop, and the signature motion runs once per visit or on scroll, not on
a timer. `evidence.mjs` measures loops, loops with text and a pause control for the jurors.

## Motion spec (in `.design/spec.md`)

```markdown
## Motion spec
Message: <the site's message in one line, from the message house>
Signature motion: <the one movement that shows it, from the subject; when it runs>
(or) Message: none found. Offered to the user: <the motion that could carry it, what it needs>
Entrance: <first load: what arrives in what order, total duration> · reduced: <version>
State transitions: <each state change and how it moves, or "none: no state changes"> · reduced: <version>
Loops: <none | what loops, how long, the pause control>
Tokens: --dur-fast 160ms; --dur-mid 320ms; --dur-slow 600ms; --ease-out cubic-bezier(.16,1,.3,1); --rise 24px; --stagger 70ms
Choreography: per section, heading → text → picture, rising --rise with opacity, once on entry
Page transitions: <none | cross-fade | shared element: card image → detail hero>
Reduced motion: content present, travel removed, cross-fades kept under 200ms
```

`progress.mjs done spec` (create, site, redesign) refuses a Motion spec without a `Message:` line,
an `Entrance:` line and a `State transitions:` line, a found message without a `Signature motion:`
line, and `Message: none found` without `Offered to the user`. `done deliver` then wants the offer
in `.design/deliver.md` under "Supaya lebih bagus". A `section` run uses the page's motion spec.

## Implementation, lightest first

1. **CSS** for feedback and simple reveals.
2. **View Transitions API** for page changes and shared-element continuity; browsers without it
   simply change page.
3. **GSAP + ScrollTrigger** or **Motion** for choreography and scroll-linked sequences.
4. **Lenis** smooth scrolling only when the direction needs it.

## Rules the gate checks

- Animate `transform` and `opacity` only; no layout shift.
- Content is visible without JavaScript and never stays hidden if a script fails: reveal from a
  visible state, or add the hidden state from script.
- `prefers-reduced-motion: reduce` keeps every piece of content and removes the travel.
- No loading screen that holds the content back.
- The entrance and the state transitions in the motion spec are built, each with its reduced-motion
  version; a loop longer than 5 s has a pause control (above).
