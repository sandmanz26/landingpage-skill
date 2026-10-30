# Mode: create

A new page. Steps: brief → research → strategy → roast → direction → skeleton → spec → copy → build →
gate → look → deliver → learn. Run `progress.mjs check <step>` before each and `done <step>` after.
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
references with the role each one plays (see `rules/copyright.md`).

Show the direction gate (SKILL.md). Recommend the direction whose device carries something only
this client has, not the most familiar one. After the user chooses: write the choice (or the mix)
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
| Decision | From | Detail |

## Motion spec
(motion/functions.md)

## Not on this page
<project-specific bans, from the brand, taste and the user>
```

Check `rules/defaults.md`: if a choice in the table is one of the AI defaults, either change it or
write the reason it is right here. Colours: avoid the cream-and-terracotta "assistant palette" and
violet or indigo accents unless the brand owns them.

Imagery, in this order: the client's own → generated, if an image tool is available → real pictures
of the subject's world from open collections with a licence that allows commercial use, credited →
drawn in code from the subject itself → type and colour alone. Never present a found or generated
picture as the client's own product, room, dish or team.

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
- **Hero best-of-3** (standard and thorough effort): build three hero variants that differ in
  composition, not just colour, as `.design/variants/hero-a.html`, `-b`, `-c`. Screenshot each
  (`inspect.mjs <file> --out .design/variants/<x> --quiet`), then brief a critic subagent with
  `rubric/critic.md` (ranking format). Keep the winner, log why.
- Each section from its row in the spec. Carry the idea into every section, pricing, FAQ and footer
  included; the usual failure is a distinctive first screen followed by stock blocks.
- Sticky and fixed elements: give each sticky panel its own wrapper (the part of the page it belongs
  to), or it stays stuck over the sections that follow. Check it in the scrolled screenshots, not the
  first screen.
- Motion last, from the motion spec (`motion/functions.md`).

## 10. gate

```bash
node <skill>/scripts/lint.mjs <source files or folder>
node <skill>/scripts/inspect.mjs <url or path/to/index.html>
```

Fix every FAIL. Treat each WARN as wrong unless you can defend it to a designer in one sentence;
write that sentence in the report. Re-run until there is no FAIL, then `done gate` (it refuses if
the source changed after the last inspection).

## 11. look

Brief a critic subagent with `rubric/critic.md`: it gets the screenshots from `.design/inspect/`,
the brief card, the customer profile and the five most important customer questions from the
strategy, and the team anchors, and nothing else (not the code, not your intentions). Write its
critique to `.design/critique.md`. Fix the top three problems, inspect again, look again. At most
three rounds (one at quick effort).

If subagents are unavailable, do the look in a separate step that reads only the screenshots and
the rubric, and say in the report that the critique was not independent.

## 12. deliver (gate)

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
- WARNs kept, each with its one-sentence defence.

Copy the final screenshots to `.design/snapshots/<date>-v<n>/`. After the user approves:
`approve final`, `done deliver`.

## 13. learn

See SKILL.md. Standard effort may skip with a reason when the user gave no feedback.
