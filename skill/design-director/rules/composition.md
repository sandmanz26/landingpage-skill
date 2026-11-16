# Composition: layouts that are not rows and columns

The owner on the skill's pages (2026-11-16): "UI yang digenerate terlalu generic, terpaku pada
aturan row column yang ada. Menurut saya harus lebih 'wild' secara layout untuk memberikan
experience." On the references they admire they name the same thing from the other side: Outfit
"penataan product berbeda dari biasanya", L'Oiseau Dé "susunan layout tidak monoton".

A model left alone stacks full-width bands and fills each with equal cards. A designer keeps one
grid and then **breaks it on purpose**: sizes differ, things overlap, type crosses pictures, cells
stay empty, a chapter moves sideways. This file is the vocabulary for that. `floor.mjs` measures
how much of a page is composed (`rules/floor.md` → composition), by the layout dial.

## The layout dial (`rules/visual-dials.md`)

| Value | Say to the user | Floor (sections composed) | For |
| --- | --- | --- | --- |
| `grid` | **Rapi**: rata dan sejajar, aman | none | forms, documentation, admin, a client who asks for "aman" |
| `composed` | **Tersusun** (default): satu grid, dilanggar dengan sengaja di beberapa bagian | 40% | most pages |
| `wild` | **Bebas**: ukuran kontras, tumpang-tindih, huruf melintasi gambar, bab yang bergerak | 60% | fashion, beauty, culture, food and drink brands, portfolios, launches |

The team default is `composed`; for fashion, beauty and other brand-led sectors recommend `wild`
and say what it costs (more pictures, more build time, a phone version planned per section).

## Six moves that take a section off the rows

1. **Scale contrast.** The largest picture in a section is at least three times the smallest. One
   product fills half the screen, the next is a thumbnail.
2. **Stagger.** Neighbours do not start on the same line: offset by 48px or more, or by a row.
3. **Overlap.** A picture sits on the corner of another, on the section edge, or on the type.
4. **Type over picture.** A display line (40px and up) crosses a picture or runs behind it.
5. **Empty cells.** Leave grid cells empty on purpose; space is part of the arrangement.
6. **Leave the frame, or move.** A picture leaves its section; a chapter is pinned and its content
   moves through it, or sideways (`motion/recipes.json`).

One grid stays underneath (12 columns, equal outer margins): the moves are spans, offsets and
layers on that grid, never random positions. Two moves in a section are enough; six is noise.

## Compositions seen in the team's references

Use the name in the spec's Sections table (column Composition). Each is rebuilt in the client's
own content and code (`rules/copyright.md`): the arrangement is the lesson, not the look.

| Name | What it is | Good for | Seen in | Build |
| --- | --- | --- | --- | --- |
| `scale-scatter` | Items of one list at three sizes on the grid, with empty cells and small captions | a product range, a portfolio, a menu with pictures | Outfit (ref-0025) | CSS grid, 12 columns; each item `grid-column: <start> / span <2-6>`; `margin-top` in steps of the row gap; captions 12-14px in the action colour |
| `offset-pair` | Two pictures of different sizes, staggered, with the text in the gap | a product with its detail, a person and their work | Indigo (ref-0028) | grid `7fr 4fr`; second picture `margin-top: 30%`; text `align-self: end` |
| `type-over-picture` | A giant thin title on the lower edge of a full-bleed picture, or a script word crossing its side | a hero, a chapter opening | L'Oiseau Dé (ref-0027), Capitolium (ref-0026), The Other Side of Truth (ref-0022) | picture `position: relative`; title `position: absolute; bottom: -0.15em` with `mix-blend-mode` or the ground colour; keep the real `<h1>` |
| `checker-fields` | Picture tile, colour tile, picture tile: the colour tiles hold a small centred label and a tiny picture | categories, services, a range by type | L'Oiseau Dé (ref-0027) | grid of equal cells; alternate `background` and picture; label centred, 14px, a 96px thumbnail under it |
| `stepped-drift` | Small pictures stepping down diagonally across a colour field beside one short statement | values, a process, "why us" without icon cards | L'Oiseau Dé (ref-0027) | grid 6 columns; picture n at `grid-column: n+1; grid-row: n`; statement pinned left |
| `window-open` | A row of arched or cut windows onto one scene; one widens until it fills the screen | a place, a material, the world behind a product | Capitolium (ref-0026), Swehl (ref-0007) | `clip-path` or an arch radius on wrappers; the middle one scales with `--p` (`motion.mjs get frame-grow`) |
| `chapter-cover` | A full-screen cover per chapter: one picture, a title in the brand's lettering, then the content | a story in parts, collections, a long page that needs breath | Indigo (ref-0028), The Other Side of Truth (ref-0022) | 100vh section, `position: sticky` cover under the content that scrolls over it; ground change with `chapter-ground` |
| `horizontal-track` | A pinned chapter whose panels move sideways while the visitor scrolls | a walk through a place, a timeline, a lookbook | Capitolium (ref-0026) | tall wrapper, sticky 100vh child, inner track `transform: translateX(calc(var(--p) * -N%))`; on a phone a normal vertical list |
| `object-thread` | One object (the product) floats from section to section and ties them together | a single hero product | Indigo's ring (ref-0028), Mana's can (ref-0021) | `motion.mjs get protagonist-travel` |
| `pedestal` | The product alone on a plinth or colour field, the title crossing behind it | a launch, a hero product, a limited edition | Capitolium (ref-0026) | product `z-index` above a display word; plinth as a simple shape from the kit |
| `statement-band` | One sentence in the action colour as large as the column allows, a rule above, a small mark at the right | the promise, the close of a page | Outfit (ref-0025) | `font-size: clamp(3rem, 8vw, 8rem)`, `letter-spacing: -.04em`; no button competing beside it |
| `index-in-type` | A list set as large type lines with a small note after each | brands carried, services, clients (real ones only) | L'Oiseau Dé (ref-0027) | inline list, 40-64px, notes 12px raised; wraps freely |

## Rules

- **Every section names its composition** in the spec, and no two neighbours share one
  (`modes/create.md` step 6). Cards in a row, three columns of text and a centred block are still
  allowed, but they do not count as composed, and at most two sections of a page may use them when
  the dial is `wild`.
- **Content first.** A composition is chosen for what the section has to say (a range → scale-scatter;
  a place → window-open). A composition with nothing to show is decoration (`rubric/reason.md`).
- **The phone is composed too.** Keep scale contrast and stagger in one or two columns; turn
  sideways tracks and pinned chapters into plain vertical sequences; never let a turned or
  overlapping element push the page wider (`inspect.mjs` fails overflow).
- **Reading still works.** Text over a picture passes contrast; lines stay under 75 characters;
  the action stays where a thumb finds it. Wild is the arrangement, not the legibility.
- **Pictures are required.** Most of these need real pictures at two or three sizes; with designed
  placeholders they still work (`placeholder.mjs` with different ratios), with no pictures use
  `statement-band`, `index-in-type`, type-over-colour and the shape language instead.
