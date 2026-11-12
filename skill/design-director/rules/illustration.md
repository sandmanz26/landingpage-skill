# Pictures when the client has none

A page without pictures looks unfinished next to the references the team admires; every one of
them is carried by photographs or illustration (owner, 2026-11-12: "saya merasakan perbedaan besar
ketika ada image or not"). So the picture question is settled at the brief, by the path the user
chose (`rules/brief-interview.md` → No photos: stand-in pictures), and never left to end as empty
boxes. The paths, best first:

| Path | What it gives | Needs | Tool |
| --- | --- | --- | --- |
| 1. The client's own photographs | The only pictures that prove anything | The client | - |
| 2. Stock photographs, keyed | Good photographs of the subject's world | A free key: Unsplash, Pexels or Pixabay (5 minutes), or pasted Unsplash links | `photos.mjs search` / `get` |
| 3. Stock photographs, open | Real but uneven pictures (Flickr, museums, Wikimedia) | Nothing | `photos.mjs search` (Openverse, Commons) |
| 4. AI-generated draft | A rough picture of the exact shot | Nothing (about one picture per 45 s) | `photos.mjs generate` |
| 5. Designed placeholders | A storyboard frame of each shot in the page's colours | Nothing | `placeholder.mjs` |
| 6. Drawn illustration | The subject drawn flat, with meaning | Nothing | by hand, below |
| 7. No pictures | Type, colour and shape carry the page | The `imagery` dial set to `type` | - |

**The quality bar decides, not the ladder.** A weak picture is worse than a good placeholder:
it makes the whole page read as generated. Look at every found or generated picture (the
`--sheet`, or the file) before it goes on the page, and use it only when all four hold:

1. it shows the right subject, the one the section talks about;
2. it has no artefacts (melted hands, wrong objects, garbled text) and is not a snapshot (flash,
   clutter, tilted, low resolution);
3. it sits with the other pictures: similar light, colour and distance, or one treatment from the
   brand kit makes them one set (`brand/method.md` → Imagery treatment);
4. it is honest: it shows the world around the client and is never presented as their own
   people, place, product or results.

When a path fails the bar for a shot, go down to designed placeholders or drawing for that shot;
do not ship the weak picture. Paths can mix on one page (two stock photographs, four placeholders),
as long as rule 3 holds.

## Finding photographs (paths 2 and 3)

`node <skill>/scripts/photos.mjs search "<an item from the subject inventory>" --sheet
.design/photos/sheet.png`, look at the sheet, then `photos.mjs get <ref>`; or `photos.mjs get
<pasted unsplash link>`. Keyed providers run first when their key is set
(`UNSPLASH_ACCESS_KEY`, `PEXELS_API_KEY`, `PIXABAY_API_KEY`); Openverse and Wikimedia Commons
always run. Search the subject's world, not the category: "tennis ball on clay court", "coach with
walkie-talkie at a wedding venue", not "happy people". Avoid posed stock smiles. Credits go to the
footer (`photos.mjs credits --html`). Pixabay pictures are downloaded, never hotlinked (its terms).

Measured 2026-11-12: without a key, Openverse answers but its pictures are mostly snapshots
(a yoga search returned one class photographed five times); expect to use few of them. Pexels and
Pixabay were not tested with a key here (no key in the session; the mapping is tested).

## AI-generated drafts (path 4)

`photos.mjs generate "<what the picture shows>" [--seed n]` asks Pollinations without a key.
Measured 2026-11-12: about one picture per 45 seconds per IP, 886×665 from the `sana` model, a
small `pollinations.ai` watermark, and weak accuracy (a "mate gourd with a metal straw" came back
as a plant in a cup; a figure had distorted limbs). So:

- it is a **draft stand-in**: use it for objects, places, textures and light, not for faces, hands,
  the client's product or anything a customer would take as real;
- keep the watermark (removing it is not ours to do); the licence for commercial use was not
  verified, so every one is replaced before launch;
- mark it `data-generated` on the page (`inspect.mjs` reports INFO `generated-image`), record it in
  `credits.json` (the script does), and name it in the deliver report;
- most results fail the quality bar; when two seeds fail, use a designed placeholder.

A connected image tool with better models (an MCP the user has) replaces this path and follows the
same marking and the same bar.

## Designed placeholders (path 5)

A placeholder is a picture too: a **storyboard frame** that shows the composition of the shot to
come (who or what, where it sits, where the light is) in the page's own colours, with the shot as
its label. It makes the page look planned, and it is the brief for the photographer.

```bash
node <skill>/scripts/placeholder.mjs --shot portrait --label "pelatih menggelar matras, pagi" \
  --ratio 4:5 --shape arch --kit .design/brand-kit.json --out assets/placeholders/coach.svg
node <skill>/scripts/placeholder.mjs sheet --kit .design/brand-kit.json   # all eight shots, to choose from
```

- Shots: `portrait`, `team`, `product`, `food`, `place`, `hands`, `detail`, `screen`. Pick the one
  that matches the shot list entry; the label is that entry, in the reader's language.
- Colours come from the brand kit (or `--ground --ink --accent`); the frame shape (`rect`, `round`,
  `arch`) is the kit's shape language, the ratio is the one the real photograph will have, so
  nothing moves when it arrives.
- Vary `--seed` (an even seed mirrors the frame) so two frames of one shot are not twins.
- The element carries `data-placeholder-image` (the SVG has it; add it to an `<img>`):
  `inspect.mjs` reports INFO `placeholder-image`, and the deliver report lists each with its shot.
- Never a grey box, a crossed rectangle, an icon in a square or "image here". A plain grey box
  stays allowed only in the skeleton step.

Placeholders show where a photograph will come. Where a picture has to **mean** something now (how
the service works, what the product does), draw it (below); the two sit well together because both
use the kit's colours and flat shapes.

## No pictures (path 7)

Only when the user chose it or the brand is typographic: set the `imagery` dial to `type`
(`rules/visual-dials.md`). Then type, colour fields, shape language and one signature element do
the work pictures would have done: larger display type, a stronger colour field per chapter, the
brand kit's hero element repeated down the page. Unless the dial says `type`, do not ship type alone.

## Telling the user

When there are no client photographs, the user is told at the start which path is used and what
it will look like, and the deliver report lists every stand-in: found photographs with credits,
AI-generated drafts, designed placeholders and drawings, with the shot list
(`rules/brief-interview.md` → Materials holds the words).

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
