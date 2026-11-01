# Pictures when the client has none

A page without pictures looks unfinished next to the references the team admires; every one of
them is carried by photographs or illustration. When the client has no images, do not ship type
alone by default (unless the `imagery` dial says `type`): draw flat illustrations in code, and give
the user a shot list so real photographs can replace or join them later.

## Drawing flat illustration in SVG

The team prefers flat illustration drawn from the subject itself (`team/taste.md`).

1. **Objects from the subject inventory** (strategy step), not generic symbols: for a wedding
   organizer the rundown on a clipboard, a walkie-talkie, the janur arch, a table plan, a crew name
   tag; for a clinic the chair, the lamp, the appointment card. Never hearts, rings and doves for
   every wedding, never a lightbulb for "ideas".
2. **One drawing system for the whole page:** 3–5 colours from the palette (flat fills, no
   gradients, no drop shadows), one stroke width or none, one corner treatment, the same light
   direction if any. Shapes are geometric and simplified: rectangles, circles, arcs, a few paths.
3. **Size with intent:** one large hero drawing (at least a third of the first screen) and smaller
   drawings that mark chapters, so the eye always has something to rest on. Pictures carry
   meaning: the drawing shows what the section says (the payment flow as two hands passing an
   envelope, not a decoration in the corner).
4. **People:** faceless or simple-faced figures in mixed skin tones and dress, never one stereotype.
5. **Accessible:** `role="img"` with an `aria-label` that says what it shows; decorative ones get
   `aria-hidden="true"`. Text never lives inside the SVG.
6. **Light:** inline SVG, a few kilobytes each; animate with transform and opacity only, behind
   `prefers-reduced-motion: no-preference`.

## Shot list for the user

Always deliver a shot list with the page, so the client knows what to photograph:

- 6–10 photographs of the real place, people and work, in the order the page needs them;
- for each: what is in frame, the moment, horizontal or vertical, and where it goes on the page;
- real people at work beat posed smiles; one wide shot of the place, details of the work, faces of
  the team.

Example (wedding organizer): the coordinator with a walkie-talkie at a real venue · the rundown on
a clipboard, hand-marked · the crew briefing before guests arrive · a detail of the decoration being
set up · the couple's family at the akad, from behind · the team portrait.
