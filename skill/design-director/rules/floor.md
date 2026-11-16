# The floor: what every delivered page has

On 2026-11-12 the owner judged five pages blind (three made without the skill, two with it at quick
effort) and rejected all five: "masih jelek semua, belum ada yang memenuhi expected saya". Every one
had passed the checks that existed then. Their reasons, in their words (2026-11-16):

1. "semua element terasa flat, permainan menggunakan konsep rectangle tidak terlihat menarik"
2. "content tidak terasa seperti sedang membuka website yang proper dan terlalu sedikit sehingga
   nampak seperti lo fidelity"
3. "tidak ada interaksi experience"
4. "layout terasa flat dan monoton, saya tidak mendapatkan esensi brand yang ada"
5. "kalau saya sebagai user saya tidak bisa melihat data yang saya butuhkan seperti fasilitas, jam
   operational dll tidak tersampaikan"

So a page can be honest, accessible and tidy and still be a wireframe. The floor is the list of
things that were missing, each measured by `floor.mjs` on the built page (eight measures; the
layout and brand dials of `.design/targets.json` set two of the floors). It is a floor, not the
goal: a page that only just clears it is still average. It applies at every effort, quick included.

```bash
node <skill>/scripts/floor.mjs <path/to/index.html>            # reads .design/brief.md, writes .design/inspect/floor.json
node <skill>/scripts/floor.mjs <page> --sections               # also prints each section's layout, cues and pictures
```

| Measure (id) | Floor | What counts | Owner's point |
| --- | --- | --- | --- |
| Content (`content`) | 300+ words in `<main>`, 7+ sections, a navigation bar with 3+ links, a footer with contact | A section is a child of `<main>` (the script descends through single wrappers) | 2 |
| Facts (`facts`) | 6+ facts in the brief's `## Visitor facts`, every one that has a value on the page | The element holding a fact carries `data-fact="<id>"` | 5 |
| Interaction (`interaction`) | 2+ kinds, at least one operated by the visitor | open-close (`aria-expanded`, `<details>`), choose (tabs, radios), slide (range), fill-in (a form), browse (carousel), reveal (`data-interaction`, `data-reveal`, `data-compare`), map, play; scroll motion (`data-progress`, `data-enter`, a sticky stage) is one kind and never enough alone | 3 |
| Shape and depth (`shape`) | 60% of sections with a cue | A round, arched or cut shape (not a button), a turned element, overlapping layers, something that leaves its section, a drawing. A shadow on a rectangle does not count | 1 |
| Layout (`layout`) | 4+ different section layouts, the same one at most twice in a row | Layout = columns the content starts in · heading alignment · with or without a picture | 4 |
| Composition (`composition`) | 40% of sections composed (60% when the layout dial is `wild`, none when `grid`) | Pictures at clearly different scales (3× in area), staggered pictures, overlap, something that leaves its frame, a turned element, large type over a picture, a pinned or sideways chapter (`rules/composition.md`) | "terpaku pada aturan row column… harus lebih wild" (2026-11-16) |
| Brand (`brand`) | 70% of sections carry a brand element (40% when the brand dial is `basic`) | The element carries `data-brand="<name from the brand kit>"` | 4 |
| Pictures (`pictures`) | One picture for every two sections | Photographs, drawings (SVG with shapes), designed placeholders, video. Skipped when the `imagery` dial is `type` | 2, and "perbedaan besar ketika ada image or not" |

Calibration (2026-11-16, `floor.mjs` without a brief, so facts and brand could not pass): the five
rejected pages met 0, 1, 2, 2 and 3 of 7 (the two skill pages 0 and 1). Sites the owner scored 8 and
above separate from them on shape (Mana 5 of 7 sections, Swehl 7 of 8, against 1-2) and on pictures
(20-27 against 0-2), **not** on word count (Mana 143 words, Swehl 332): a proper site is made of
sections, pictures, shapes and facts, not of more text. Section detection is written for pages this
skill builds (`<main>` with its sections as children); on other sites its counts are rough.

## Facts: what a visitor needs to find

At the brief, list what a visitor of this kind of business looks for, before any design. Ask the
client for each; a fact not given yet is filled with a marked sample or left with its reason.

```markdown
## Visitor facts
| Fact | Value | On the page |
| --- | --- | --- |
| Hours | Mon-Sat 06.30-07.30 | hero, footer |
| Address | Jl. … [SAMPLE] | place section, footer |
| Facilities | mats, lockers, parking | facilities section |
| Price | Rp 120.000 a class; 10 for Rp 950.000 | price section |
| Contact | WhatsApp … [SAMPLE] | every action, footer |
| How to book | message the date and "kelas 06.30" | steps section |
| Payment | n/a: the client has not decided | - |
```

Start from this list and keep what fits the business: hours · address and how to get there ·
parking · facilities · services or menu in full · prices and what they include · how to book or
order · payment · who does the work (people, qualifications) · policies (cancel, refund, warranty,
insurance) · service area or delivery · languages · accessibility · contact and reply time ·
what to bring or prepare. The id is the first word of the Fact cell, lower case (`hours`,
`address`), or a word in brackets: `Jam buka (hours)`. Facts are content, so the rule for proof
holds: a sample is marked, never presented as real (SKILL.md).

## How each measure is met (and where its rule lives)

- **Content:** the storyline gives one section per customer question (`strategy/method.md`); a
  local business usually needs: what it is and for whom, the offer in full, how it works, the place
  and hours, facilities, the people, prices, proof (only real), questions, the closing action. Add
  navigation and a footer that repeats contact, hours and address.
- **Interaction:** the spec's Interactions table (`motion/functions.md`): at least two rows with a
  purpose, built from the kit (`kit.mjs list`: reveal cards, before/after, sticky story) or the
  motion recipes (`motion.mjs list`). "none" is no longer an answer for a page.
- **Shape and depth:** the brand kit's shape language (`brand/method.md` §2) in every section:
  frames that are not rectangles (arch, circle, cut corner), pictures that overlap a neighbour or
  leave their frame, layers, drawn objects from the subject, a tilted print. Rows of rectangles
  with a border or a shadow are the failure the owner named.
- **Layout:** one composition word per section, never the same twice in a row (`modes/create.md`
  step 6, `rubric/critic.md` → Sameness): split, picture full-bleed, statement, list beside a
  sticky picture, grid, table, timeline.
- **Composition:** the moves and named compositions of `rules/composition.md`; equal cards in a
  row do not count. Measured 2026-11-16: sites the owner admires have 57-80% of sections composed
  (Outfit 4 of 5, Mana 4 of 6, Swehl 4 of 7), the rejected pages 0-17%.
- **Brand:** the kit's hero and supporting elements reach the price, the questions and the footer
  (`brand/method.md` §4 Rules of use); mark each use `data-brand`.
- **Pictures:** by the path chosen at the brief (`rules/illustration.md`): photographs that pass
  the quality bar, designed placeholders, drawings.

## Under the floor

`progress.mjs done gate` (create, site, redesign) wants `.design/inspect/floor.json`, newer than
the source, and for every missed measure either a fix or a line in `.design/floor.md`:

```markdown
- pictures: the user chose a page with no pictures (imagery dial "type") on 2026-11-16
```

A reason names who decided and why; "not enough time" or "quick effort" is not a reason. Kept
misses are listed in the deliver report under open issues. The markers (`data-fact`, `data-brand`)
make the page say where each thing is; they do not make it good, so the critic and the jury still
look at whether the fact is easy to find and the brand element is really the kit's.
