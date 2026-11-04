# Mode: create

A new page. Steps: brief → research → strategy → roast → direction → skeleton → spec → copy → build →
reason → gate → look → deliver → learn. Run `progress.mjs check <step>` before each and `done <step>` after.
Research and roast always run; the user never has to ask for them.

## 1. brief (gate)

Read the request and the project. Find out what is real:

- the subject, the audience and their situation when they open the page;
- the one action the page must get (book, buy, sign up, chat on WhatsApp);
- the real content: services or products, prices, hours, address, numbers, quotes;
- **the imagery that truly exists**: their photos, product shots, a real interface, an image tool
  you can call, or nothing;
- brand constraints (colours, fonts, logo) and the stack;
- **materials to research from**: existing copy, the old site, brochures, chat exports, reviews,
  sales notes. Ask for them once if none were given; they are the best source of the customer's
  real voice.

Write `.design/brief.md`:

```markdown
# Brief: <name>
- What: <one sentence>
- For: <who, and their situation>
- One action: <the CTA>
- Real content: <what we have>
- Imagery that exists: <list, or "none">
- Brand: <fixed colours/fonts, or "free">
- Avoid: <what the user or the brand rules out>
- Stack: <static HTML / Next / Astro / ...>
- Materials: <what was given to research from, or "none yet">
- My reading: <one line on anything unclear>
```

Before writing it, guide the user in one message (`rules/brief-interview.md`): who and what for,
1–3 liked sites and 1 disliked (capture them and run `dials.mjs suggest`), three feeling words,
what exists, what is ruled out; skip what the request already answers.

Show it as the brief gate (SKILL.md). Ask only blocking questions, five at most. After the user
answers: `approve brief --note "..."`, then `done brief`.

## 2. research

Follow `research/method.md`: the business, 3–6 competitors and the category clichés, the customers
in their own words and their awareness level, the proof available and missing. Write
`.design/research.md`; every finding says what it changes in the design.

## 3. strategy

Follow `strategy/method.md`: business canvas, customer profile, message house, the storyline chosen
from the awareness level (one beat per section: the question the customer has at that point, the
answer, the proof, why they read on), and the subject inventory with the idea sentence. Write
`.design/strategy.md`, citing research findings by number.

## 4. roast (strategy gate)

Follow `roast/method.md`: a separate subagent attacks the strategy and storyline in four voices,
writes a pre-mortem and lists contradictions with the research. Answer every point in the
**Response** section: accept and change the strategy, or reject with a reason.

Then show the **strategy gate** (SKILL.md): the research summary, the strategy, and what the roast
changed. After the user answers: `approve strategy --note "..."`, then `done roast`.

## 5. direction (gate)

Deal directions:

```bash
node <skill>/scripts/draw.mjs --sector <sector> [--tone <tone>] [--have <assets>] --options 3 --brief "<one line>"
```

`--list sectors` shows the sectors; `--have` lists only assets that really exist (`photography`,
`product-photo`, `product-ui`, `illustration`, `video`). Read the three files it writes in
`.design/directions/`.

For each direction write the **idea sentence**, both blanks filled from the inventory in the
strategy, and say how the direction serves the storyline (a direction that fights the story loses,
however beautiful):

> On this page, **[something that belongs to the subject]** becomes **[the device the direction calls for]**.

Apply the **competitor test**: put the nearest real competitor in the sentence. If it still works,
the idea belongs to the category, not to this client; find another item from the inventory.

When the team library holds references (`library/index.json`), attach to each card the 2–3 closest
references with the role each one plays (see `rules/copyright.md`), and read their style first.

### Stored references: read the style, then adapt or ask

1. `node <skill>/scripts/library.mjs find <business type and customer words> --tags <the
   direction's tags>` lists the closest references with their style card (tags, type, palette,
   shape, motion), patterns, verdicts and a do-not-copy list.
2. Each reference plays one role (`rules/copyright.md`). Read its style card for that role only.
3. **Adapt without asking** when the role is structure, rhythm, a pattern or a motion device:
   rebuild it in the client's fonts and colours, and write the mapping in the spec ("Swehl's
   colour chapters → the brand's four colours, one per pillar").
4. **Ask the user** (one question, options, your recommendation first) when the reference's style
   and the client pull apart in a way the client would notice:
   - the role is visual (palette, type, shape) and the brand sets something else (the reference is
     flat and many-coloured, the brand is two muted colours);
   - the style needs what the client lacks (photography, an illustrator, a display-font licence);
   - two chosen references disagree (`expressive-type` against `quiet-type`);
   - the reference carries a tag the team rules forbid or condition (`ignores-reduced-motion`,
     `pop-up-on-load`, `endless-motion`): say what you will change.

   > Referensi Swehl memakai 6 warna datar, satu per bab; brand Anda dua warna kalem.
   > A) Pakai struktur bab berwarna dengan dua warna brand + tint-nya (rekomendasi: cerita tetap
   > terbaca, brand tetap utuh) · B) Tambah satu warna aksen hanya untuk bab · C) Tidak pakai bab berwarna

   At quick effort and in autopilot, adapt to the brand without asking and log the choice.
5. Never carry over anything in `doNotCopy`, under a veto, or from an entry marked `patternOnly`
   (those are used through their tags only).

With guided gates, build each direction's first screen as a quick sketch
(`.design/directions/sketch-a.html` …: real headline, action, dial values, the main picture idea)
and show them side by side with `compare.mjs` so the user chooses from pictures, not descriptions.
Start the dials from `.design/targets.suggested.json` when the user sent sites they like.

Show the direction gate (SKILL.md) with the visual dials (`rules/visual-dials.md`). Recommend the
direction whose device carries something only this client has, not the most familiar one, and set
the dials from the team's taste (`team/visual-defaults.json`) unless the brief or the brand says
otherwise; a recommendation that turns a dial away from the team's taste says why. After the user
chooses: write `.design/targets.json` (the dials with the user's words), the choice (or the mix)
with `progress.mjs log`, `approve direction --note "..."`, `done direction`.

Redraw (`draw.mjs` again with `--exclude <ids>`) only for a reason you can state: it needs an asset
that does not exist, it contradicts the brand, or the user rejected all three.

## 6. skeleton

Before any styling, check the structure. Build `.design/skeleton.html`: grey boxes for pictures,
the real headline and real copy lengths, one section per storyline beat, composed as the direction
says.
Inspect it (`inspect.mjs .design/skeleton.html --out .design/skeleton`) and look at the desktop and
mobile screenshots for:

- one grid, equal outer margins; asymmetry lives inside the grid;
- a one-word composition per section (split, list, full-bleed, statement, grid, index…): never the
  same word twice in a row, nor three times on the page;
- a clear rhythm: the gap between sections larger than any gap inside one; at least one dense and
  one airy section;
- the phone as its own composition: order, crops and headline breaks planned;
- **extreme content**: the longest real headline, 3 vs 7 items in a list, a missing picture,
  Indonesian text (usually longer than English).

Fix the skeleton, not the styled page. In `guided` gates, show the skeleton screenshots with the
direction choice or right after it. (Quick effort may skip this step with a reason.)

## 7. spec

Write `.design/spec.md`. Code may only use what is in it.

```markdown
# Spec: <name> (v1)
Idea: On this page, ... becomes ...
Direction: <id> (+ mix notes)

## Decisions
| Decision | Choice | Value |
| Type personality | ... | headings <font>, body <font> |
| Type hierarchy | ratio ... | H1 clamp(...), body ...px |
| Colour | strategy | ground #..., ink #..., accent #... on max ...% |
| Layout | ... | grid, margins |
| Density | ... | section gap ...px desktop / ...px phone |
| Hero | ... | ... |
| Imagery | source per tier (see below) | ratios, treatment |
| Shape | radius ... | |
| Depth | ... | |
| Motion | functions used | see motion spec |
| Copy voice | ... | headline max ... words, sapaan Anda/kamu |
| Signature move | one thing | |

## Tokens
:root { --ground: ...; --ink: ...; --accent: ...; --font-display: ...; --step-0 ... --step-5; --space-1 ... }

## Sections (from the storyline)
| # | Customer asks | Answer | Proof | Composition | Content | Picture |

## References and their roles
| Decision | From | Their style (style card) | Mapped to this client / asked |

## Interactions
| Element | Visitor does | They see or get | Purpose: the customer question it answers | Phone and keyboard |
(every hover, click-to-reveal, slider, flip, map or play on the page; "none" if the page has none.
A row with no purpose is cut, not built. motion/functions.md → Interactions)

## Motion spec
(motion/functions.md)

## Not on this page
<project-specific bans, from the brand, taste and the user>
```

Check `rules/defaults.md`: if a choice in the table is one of the AI defaults, either change it or
write the reason it is right here. Colours: avoid the cream-and-terracotta "assistant palette" and
violet or indigo accents unless the brand owns them.

Imagery, in this order: the client's own → licensed photographs of the subject's world found with
`photos.mjs` (Unsplash with `UNSPLASH_ACCESS_KEY`, Openverse, Wikimedia Commons; look at the
`--sheet` before choosing, credits recorded) → generated, if an image tool is available → drawn in
code from the subject itself (`rules/illustration.md`) → type and colour alone, only when the
`imagery` dial says `type`. On a live site, Unsplash photographs are hotlinked from their Unsplash
URL as the Unsplash API guidelines ask; copies are only for offline previews. Never present a found or generated picture as the client's own
product, room, dish or team. Write an **imagery plan** in the spec: every picture on the page, what
it shows, where it comes from, and the shot list for the client.

## 8. copy

Write the whole page as text in `.design/copy.md` before markup:

- every headline fits two lines at every width (about 32 characters is safe at a confident size);
- one supporting sentence right under the headline, saying plainly what this is;
- one primary action, named for what it does, on the first screen;
- every section the visitor came for is complete: the whole menu with prices, every room, the full
  price with what it includes;
- Bahasa Indonesia follows `rules/copy-id.md`;
- `[SAMPLE]` on any filled gap; no invented proof.

## 9. build

Order: tokens → hero → sections → pictures → states (hover, focus, error, empty) → motion.

- Tokens become CSS custom properties (or the Tailwind theme / component-library theme of the
  stack). Everything downstream uses tokens only.
- **Hero best-of-3** (standard and thorough effort; skipped when the user chose from sketches at the
  direction gate, and say so in the log): build three hero variants that differ in
  composition, not just colour, as `.design/variants/hero-a.html`, `-b`, `-c`. Screenshot each
  (`inspect.mjs <file> --out .design/variants/<x> --quiet`), then put them before the jury
  (`rubric/jury.md`): each AI juror ranks them, designers may add their ranking, and
  `jury.mjs rank` picks the winner. Keep the winner, log why.
- Each section from its row in the spec. Carry the idea into every section, pricing, FAQ and footer
  included; the usual failure is a distinctive first screen followed by stock blocks.
- Sticky and fixed elements: give each sticky panel its own wrapper (the part of the page it belongs
  to), or it stays stuck over the sections that follow. Check it in the scrolled screenshots, not the
  first screen.
- Motion last, from the motion spec (`motion/functions.md`).

## Variants (when the run makes 2–3)

Each variant is a whole page in `.design/variants/v<n>/index.html`, built from the same research,
strategy, copy and dials. They differ where the choice matters most: another direction from the
deal, or another composition of the same direction (as the hero best-of-3, but for the whole page).
Never make variants that differ only in colour. Inspect each (`inspect.mjs .design/variants/v<n>/index.html
--out .design/variants/v<n>/inspect`) and run `fit.mjs` on each; every one passes the gate.

- **User chooses:** `compare.mjs .design/variants/v1/index.html … --labels "<direction names>"`
  (add `--blind` to hide the names), show it, wait for the answer, `approve variant --note "..."`.
- **Jury chooses:** two jurors (art director and customer researcher) rank them from their evidence
  packs (`jury.mjs rank`); the winner is delivered, the others are listed as alternatives.

Write `.design/variants/choice.json` `{ "winner": "v2", "by": "user|jury", "why": "..." }`, copy
the winner to the page's real location, and continue with the look on that one.

## 10. reason

The built page is photographed with every element numbered, and every element must say what it
is for (`rubric/reason.md`). Models place UI because pages like this usually have it: icon cards,
stat rows, badges, blobs, marquees, eyebrow labels. This step finds them before the gate and the
jury.

```bash
node <skill>/scripts/elements.mjs <path/to/index.html> --out .design/reason
```

At standard and thorough effort a separate subagent roasts it from `elements.md`, the numbered
pictures, the brief card, the customer's questions and the spec's Sections and Interactions tables
(not the code). Each element gets its job (a customer question, the action that pays, proof, the
product, the idea, orientation, or a requirement) and a verdict: keep, fix, merge or cut. "Looks
nice" is not a job. Do every fix, merge and cut, write the **Response** in `.design/reason.md`, then
`done reason` (it refuses while an element has no verdict). With variants, run it for each variant
(`variants/vN/reason/`, `variants/vN/reason.md`).

## 11. gate

```bash
node <skill>/scripts/lint.mjs <source files or folder>
node <skill>/scripts/inspect.mjs <url or path/to/index.html>
```

Fix every FAIL. Treat each WARN as wrong unless you can defend it to a designer in one sentence;
write that sentence in the report. Re-run until there is no FAIL, then `done gate` (it refuses if
the source changed after the last inspection).

## 12. look

At standard and thorough effort, the look is done by the **jury** (`rubric/jury.md`); at standard
effort after the user chose from sketches, two jurors (art director and customer researcher) are
enough unless the user asks for more: each AI juror is
a separate subagent that gets the evidence pack (run `evidence.mjs <file> --dir .design/inspect`
after the gate's inspection: folds, contact sheets, `evidence.json`, `report.json`), the brief card, the customer
profile and the five most important customer questions from the strategy, and the team anchors,
and nothing else (not the code, not your intentions). Designers may add their votes in the same
folder. Combine with `jury.mjs score .design/jury/<round>` and write the combined critique to
`.design/critique.md`: the scores, the flagged disagreements, any veto, and the top three problems
across all jurors. At quick effort one critic (`rubric/critic.md`) is enough.

Before the jurors, run `fit.mjs .design/inspect --targets .design/targets.json` and give its result
to the jurors with the evidence pack. Every missed target is fixed, or `.design/critique.md` gets a
**Fit** section with the reason it stays (the user's later instruction, a brand rule, a measured
problem the target would cause).

Fix the top three problems (every veto first), inspect again, look again. At most three rounds
(one at quick effort).

If subagents are unavailable, do the look in a separate step that reads only the screenshots and
the rubric, and say in the report that the critique was not independent.

## 13. deliver (gate)

Show the package:

- **the research report** (`.design/research.md`): the findings that changed the design, the
  competitors and category clichés, the customer's questions in their words, the sources;
- **the rationale**: each major decision (storyline, idea, direction, key sections) with the research
  finding or roast point behind it;
- what was built and where (files, how to open it);
- desktop and phone screenshots of the final version;
- the direction (id, seed), the idea sentence, and any redraws or mixes with reasons;
- the critic's final scores, the five-questions test, and what still falls short;
- the hypotheses to test after launch, with the metric for each;
- every `[SAMPLE]` item to replace, every found picture with its credit, every picture that stands
  in for photography;
- WARNs kept, each with its one-sentence defence;
- the fit against the dials (`fit.mjs`), and **Supaya lebih bagus**: at most five things the user
  can supply or decide to lift the result, each with what it would change (SKILL.md, final gate).

Copy the final screenshots to `.design/snapshots/<date>-v<n>/`. After the user approves:
`approve final`, `done deliver`.

## 14. learn

See SKILL.md. Standard effort may skip with a reason when the user gave no feedback.
