# Mode: create

A new page. Steps: brief → argument → direction → skeleton → spec → copy → build → gate → look →
deliver → learn. Run `progress.mjs check <step>` before each and `done <step>` after.

## 1. brief (gate)

Read the request and the project. Find out what is real:

- the subject, the audience and their situation when they open the page;
- the one action the page must get (book, buy, sign up, chat on WhatsApp);
- the real content: services or products, prices, hours, address, numbers, quotes;
- **the imagery that truly exists**: their photos, product shots, a real interface, an image tool
  you can call, or nothing;
- brand constraints (colours, fonts, logo) and the stack.

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
- My reading: <one line on anything unclear>
```

Show it as the brief gate (SKILL.md). Ask only blocking questions, five at most. After the user
answers: `approve brief --note "..."`, then `done brief`.

## 2. argument

In your notes, **inventory the subject**: 8–12 things that belong to this client and no competitor.
Its name and what it means; its street, city and what that place looks like; the numbers in the
brief; the constraint it lives with; its materials, rituals, hours; the printed things of its
world (a menu, a ticket, a receipt, a label).

Then write the page as claims with proof, one line per section. The claims decide which sections
exist and in what order; delete any section that has no claim. This replaces the stock sequence of
hero, logos, three features, testimonial, pricing, CTA.

Write both to `.design/argument.md`. (Quick effort may skip this step with a reason.)

## 3. direction (gate)

Deal directions:

```bash
node <skill>/scripts/draw.mjs --sector <sector> [--tone <tone>] [--have <assets>] --options 3 --brief "<one line>"
```

`--list sectors` shows the sectors; `--have` lists only assets that really exist (`photography`,
`product-photo`, `product-ui`, `illustration`, `video`). Read the three files it writes in
`.design/directions/`.

For each direction write the **idea sentence**, both blanks filled from the inventory:

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

## 4. skeleton

Before any styling, check the structure. Build `.design/skeleton.html`: grey boxes for pictures,
the real headline and real copy lengths, one section per claim, composed as the direction says.
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

## 5. spec

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

## Sections
| # | Role | Claim | Composition | Content | Picture |

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

## 6. copy

Write the whole page as text in `.design/copy.md` before markup:

- every headline fits two lines at every width (about 32 characters is safe at a confident size);
- one supporting sentence right under the headline, saying plainly what this is;
- one primary action, named for what it does, on the first screen;
- every section the visitor came for is complete: the whole menu with prices, every room, the full
  price with what it includes;
- Bahasa Indonesia follows `rules/copy-id.md`;
- `[SAMPLE]` on any filled gap; no invented proof.

## 7. build

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

## 8. gate

```bash
node <skill>/scripts/lint.mjs <source files or folder>
node <skill>/scripts/inspect.mjs <url or path/to/index.html>
```

Fix every FAIL. Treat each WARN as wrong unless you can defend it to a designer in one sentence;
write that sentence in the report. Re-run until there is no FAIL, then `done gate` (it refuses if
the source changed after the last inspection).

## 9. look

Brief a critic subagent with `rubric/critic.md`: it gets the screenshots from `.design/inspect/`,
the brief card and the team anchors, and nothing else (not the code, not your intentions). Write its
critique to `.design/critique.md`. Fix the top three problems, inspect again, look again. At most
three rounds (one at quick effort).

If subagents are unavailable, do the look in a separate step that reads only the screenshots and
the rubric, and say in the report that the critique was not independent.

## 10. deliver (gate)

Show the package:

- what was built and where (files, how to open it);
- desktop and phone screenshots of the final version;
- the direction (id, seed), the idea sentence, and any redraws or mixes with reasons;
- the critic's final scores and what still falls short;
- every `[SAMPLE]` item to replace, every found picture with its credit, every picture that stands
  in for photography;
- WARNs kept, each with its one-sentence defence.

Copy the final screenshots to `.design/snapshots/<date>-v<n>/`. After the user approves:
`approve final`, `done deliver`.

## 11. learn

See SKILL.md. Standard effort may skip with a reason when the user gave no feedback.
