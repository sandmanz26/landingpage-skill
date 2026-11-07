# Pictures when the client has none

A page without pictures looks unfinished next to the references the team admires; every one of
them is carried by photographs or illustration. Photographs are the key visual (team rule).

1. **Find photographs first**, by the path the user chose for stand-in pictures
   (`rules/brief-interview.md` → No photos: stand-in pictures): links they pasted
   (`photos.mjs get <unsplash link>`), or a search: `node <skill>/scripts/photos.mjs search "<an item from the subject
   inventory>" --sheet .design/photos/sheet.png`, look at the sheet, then `photos.mjs get <ref>`.
   Search the subject's world, not the category: "tennis ball on clay court", "coach with
   walkie-talkie at a wedding venue", not "happy people". Avoid posed stock smiles. Credits go to
   the footer (`photos.mjs credits --html`). A found photograph shows the world around the client
   and is never presented as their own people, place or product.
2. **Draw** what no honest photograph exists of (below), in one consistent flat language; drawn
   objects over a photograph's frame (the Summer Smash Tennis frame-break) add brand voice.
3. **Placeholders** only in drafts, marked as such, with the shot list; never in a delivered page,
   except a labelled product-UI placeholder the user chose (`rules/brief-interview.md` → Materials).

When no image-generation tool is connected and step 1 finds nothing usable, the user is told at the
start and in the deliver report that the pictures are drawn or dummies, with the shot list
(`rules/brief-interview.md` → Materials holds the rule and the words).

Unless the `imagery` dial says `type`, do not ship type alone.

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
