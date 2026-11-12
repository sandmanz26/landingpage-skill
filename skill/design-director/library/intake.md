# Taking in references

How a reference sent by the team (a link and a note, in the Excel template or in chat) becomes a
library entry. The human note is valuable and fallible: it is one juror's view, checked against the
page itself and against the other jurors before it shapes the skill.

## Three depths of reading (owner, 2026-11-12: "bisa dibaca lebih cepat")

Ask what the contributor wants from the reference (the whole feel, the style, or one element:
`brand/method.md` §7) and read only as deep as that needs.

| Depth | What runs | Time and cost (measured 2026-11-12) | For |
| --- | --- | --- | --- |
| **Fast** | `read.mjs <url> --out data/references/captures/<id>`; the coordinator reads `read.md` and `read-sheet.png` and writes the entry | about 20 s a site, no subagent | the style, one element, a motion to keep; a first look at any reference |
| **With the page measured** | fast + `inspect.mjs` + `style.mjs` (the style card and the findings) | 1-7 minutes a page | references that enter the library with a style card |
| **Full** | `capture.mjs` (inspect, evidence, digest, style) and the jury (`rubric/jury.md`) | 4-12 minutes a page and about 190k tokens a batch; heavy WebGL sites may not finish | references that get scores and shape taste rules |

A fast read gives no scores. An entry read fast says so (`"read": "fast"`) and is judged by one
reader, not a panel. A site that opens only after an interaction (a WebGL story behind "Start")
is read as far as it opens; say what was not seen.

## The steps

1. **Record the note verbatim**, with who wrote it and when. Never rewrite the original.
2. **Parse it** into: what to take (part, device, quality), what to avoid, why it works (aesthetic,
   business, customer), and what it suits. Mark what the note leaves out: a note about looks only
   says nothing yet about the business or the customer.
3. **Find out the business** behind the site (research, short): what it sells, to whom, and the
   action the page wants. A visual choice can only be judged against that.
4. **Capture** the pages that do the selling, not only the home page: for a shop, the catalogue or a
   product page too; for a service, the page with prices or booking (batch-006: ERLY's home page
   showed no prices, its shop page did). Give subpages ids like `ref-0009-classes`. Capture the
   whole batch at once: write `<id> <url>` lines to `data/references/batch-<n>.txt`
   and run `capture.mjs data/references/batch-<n>.txt --jobs 3`. Each reference gets its evidence
   pack in `data/references/captures/<id>/`. Without network access the entry stays
   `pending-capture` and no visual claim is confirmed.
5. **Jury** (`rubric/jury.md`): the AI jurors read the evidence packs, not the live sites. Their
   views are added beside the human note. The human score is two numbers, `visual` and `ship`
   (would send it to a client), 1–10 each.
6. **Reconcile**: for each claim in the note, mark *confirmed* (the capture and the jurors agree),
   *contested* (a juror disagrees, with evidence) or *unverifiable* (not visible in the capture).
   Wrong terms are corrected in the parsed fields (for example "wireframe" for a real product UI),
   while the original note stays as written.
7. **Questions back** to the contributor: anything unclear, unfinished or contested.
8. **Group it and store it.** `library.mjs build` sorts every reference by sector (from the business
   line, or an explicit `sector`) and by style group (surface, colour, type, imagery, motion, shape)
   without the contributor having to: `library.mjs groups` shows the groups, and the batch review
   lists where each new reference landed. Groups mean something from about 5 references per sector.
9. **Read its style and store it.** `style.mjs <capture>` writes the style card (palette, type,
   shape, spacing, motion, plain-word tags, and what must not be copied); `capture.mjs` does this
   for the whole batch. Then `library.mjs build` puts the judged entries with their style cards into
   `library/index.json`, which the skill reads at the direction step to adapt each reference to
   the client or ask the user where they conflict (`modes/create.md`). Taste rules derived from the
   batch still need the owner's approval before they enter `team/taste.md`.

10. **Keep its motion** (`motion/functions.md` → Recipes). From `read.md` (and the motion numbers
    of the full capture) write `motion_notes` in the entry: what moves, on which trigger, how long,
    and what it says. Then map each movement worth keeping to a recipe in `motion/recipes.json`
    (add the reference to that recipe's `seen_in` with the measured fact), or write a new recipe
    with its block in `motion/index.html`, `motion.css` and `motion.js`, and run `npm test` (the
    demo must stay at 0 FAIL, 0 WARN). `library.mjs build` then lists the recipes with the
    reference, so `library.mjs find` returns motion that can be built, not only a tag.

Entries for a batch go to `data/references/batch-<n>.json` with a readable review beside it.
