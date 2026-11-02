# Motion

Motion is part of the experience, planned in the spec, not decoration added at the end. There is no
quota: every moving thing has one of these functions.

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

## Motion spec (in `.design/spec.md`)

```markdown
## Motion spec
Tokens: --dur-fast 160ms; --dur-mid 320ms; --dur-slow 600ms; --ease-out cubic-bezier(.16,1,.3,1); --rise 24px; --stagger 70ms
Choreography: per section, heading → text → picture, rising --rise with opacity, once on entry
Page transitions: <none | cross-fade | shared element: card image → detail hero>
Signature move: <one, from the idea>
Reduced motion: content present, travel removed, cross-fades kept under 200ms
```

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
