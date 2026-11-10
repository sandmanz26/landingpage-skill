# Modes: review, restyle, redesign

Work on a UI that already exists. Its brand, design system, content and behaviour are assets, not
obstacles. The commonest failure is a half-applied new style: some components changed, others not,
so the page ends up mixed. Work at the lowest layer that fixes the problem.

| Mode | Steps |
| --- | --- |
| `review` | context → research → before → reason → review → roast → deliver |
| `restyle` | context → research → before → review → roast → choose → fix → reason → after → gate → deliver → learn |
| `redesign` | context → research → before → review → strategy → roast → choose → direction → spec → fix → reason → after → gate → deliver → learn |

Research and roast always run. A review that judges only looks misses the reason most pages
underperform: they do not answer the customer, or do not lead to the action that pays.

## context

Read the project before touching anything and write `.design/context.md`:

- stack and styling method (plain CSS, CSS modules, Tailwind v3 `tailwind.config.*` or v4 `@theme`,
  styled-components), component library (shadcn/ui, MUI, Chakra…), where tokens live;
- brand assets: logo, fixed colours and fonts (copy them to `.design/brand.md` if there is no
  `brands/<client>.md`);
- what must survive: routes, forms, data, behaviour, tracking, copy the client wrote;
- page or app screen (add `modes/app-screen.md` for the latter).

## research

Follow `research/method.md`, starting from the existing page itself: it is the first piece of
content to audit (claim, proof, objection answered, keep/rewrite/cut). Add competitors and customer
voice as for a new page.

## before

```bash
node <skill>/scripts/inspect.mjs <url or file> --out .design/before
node <skill>/scripts/lint.mjs <source folder>
```

From the inspector's inventory, write the **design debt** in numbers into `context.md`: distinct
colours, font sizes, spacing values and how many are off the 4px grid, radii, shadows. Twelve font
sizes and nineteen greys is a finding in itself.

## review

Brief a critic subagent with `rubric/critic.md` on the before screenshots, with the customer and
their five questions from the research. Judge three lenses: **business** (is the action that pays
clear?), **customer** (are their questions answered, in order, in their words?) and **look**.
Write `.design/critique.md` as a ranked list:

```markdown
| # | Lens | Finding | Evidence | Impact | Risk | Layer to fix |
| 1 | Customer | The top fear (pain, research #1) is never answered | five-questions test, mobile-page-03.png | high | low | content + one section |
| 2 | Look | Hero has no focal point: four elements at similar size | desktop-fold.png; sizes 32/28/24/22px | high | low | tokens (type scale) |
```

Layer is one of: content, token, component, page. Prefer findings fixed at the content, token or
component layer; they fix every page at once.

## roast

Follow `roast/method.md` against the list of proposed fixes: would these changes make the page
sell better and answer the customer better, or only look different? Answer every point in the
Response section.

In `review` mode, `deliver` is the research summary, the ranked findings after the roast, and the
three changes that would move the page most, each with its UX reason, trade-off and source
(`rules/rationale.md`), and the run stops. Change no code.

## choose (gate)

Show the findings as a checklist and let the user pick what to do now. Record the picks with
`approve choose --note "..."`.

## strategy, direction, spec (redesign only)

As in `modes/create.md` (strategy, then the roast and the strategy gate), with the existing
content. Pass `--have` honestly. When the brand fixes colours or fonts, keep them and take only
composition from the direction. The brand kit at the direction step (`modes/create.md` → "Brand kit") starts from the existing site's elements (`brand/method.md` §1 "What exists").

## fix

- **Lowest layer first.** Token → component → page. Never add a page-level override when a token
  or component change fixes it.
- **Content first** when the review found business or customer problems: the storyline order, the
  missing answers to objections, the proof next to its claim. A better-looking page that still does
  not answer the customer has not been improved.
- **Order of work:** type (faces and scale) → colour (ground, ink, accent) → frame and spacing
  (margins, rhythm, headings on sections) → states (hover, focus, loading, empty, error) → components.
- **Map, don't replace.** Change values inside the existing system: the Tailwind theme, the CSS
  variables, the component library's theme. No framework or styling-library migration. Check the
  dependency file before adding anything, and ask before adding a dependency.
- **Consolidate.** Collapse near-duplicate values onto the scale (15px and 16px become 16px).
- **Keep behaviour.** Routes, forms, handlers, data and analytics stay untouched.

## reason

As in `modes/create.md` step 10 (`rubric/reason.md`). In `review` it runs on the existing page
after `before`: its cut and fix verdicts become findings in the review, with the element numbers
and pictures, and no Response is needed. In `restyle` and `redesign` it runs on the changed page
after `fix`.

## after

```bash
node <skill>/scripts/inspect.mjs <url or file>
```

Compare with `.design/before`: the same inventory numbers side by side. Then check for regressions:
every link, form and menu that worked before still works (click through, or write a short
Playwright check for the critical paths).

## gate, deliver, learn

As in `modes/create.md` (in `redesign` the package is written to `.design/deliver.md` and checked
the same way). The deliver package leads with the research summary and the before/after table:

```markdown
| Measure | Before | After |
| Distinct font sizes | 12 | 6 |
| Distinct greys | 19 | 5 |
| Spacing values off the 4px grid | 23 | 0 |
| Inspector FAIL | 9 | 0 |
```

followed by before/after screenshots at desktop and phone.
