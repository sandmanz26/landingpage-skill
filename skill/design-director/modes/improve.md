# Modes: review, restyle, redesign

Work on a UI that already exists. Its brand, design system, content and behaviour are assets, not
obstacles. The commonest failure is a half-applied new style: some components changed, others not,
so the page ends up mixed. Work at the lowest layer that fixes the problem.

| Mode | Steps |
| --- | --- |
| `review` | context → before → review → deliver |
| `restyle` | context → before → review → choose → fix → after → gate → deliver → learn |
| `redesign` | context → before → review → choose → argument → direction → spec → fix → after → gate → deliver → learn |

## context

Read the project before touching anything and write `.design/context.md`:

- stack and styling method (plain CSS, CSS modules, Tailwind v3 `tailwind.config.*` or v4 `@theme`,
  styled-components), component library (shadcn/ui, MUI, Chakra…), where tokens live;
- brand assets: logo, fixed colours and fonts (copy them to `.design/brand.md` if there is no
  `brands/<client>.md`);
- what must survive: routes, forms, data, behaviour, tracking, copy the client wrote;
- page or app screen (add `modes/app-screen.md` for the latter).

## before

```bash
node <skill>/scripts/inspect.mjs <url or file> --out .design/before
node <skill>/scripts/lint.mjs <source folder>
```

From the inspector's inventory, write the **design debt** in numbers into `context.md`: distinct
colours, font sizes, spacing values and how many are off the 4px grid, radii, shadows. Twelve font
sizes and nineteen greys is a finding in itself.

## review

Brief a critic subagent with `rubric/critic.md` on the before screenshots. Write
`.design/critique.md` as a ranked list:

```markdown
| # | Finding | Evidence | Impact | Risk | Layer to fix |
| 1 | Hero has no focal point: four elements at similar size | desktop-fold.png; sizes 32/28/24/22px | high | low | tokens (type scale) |
```

Layer is one of: token, component, page. Prefer findings fixed at the token or component layer;
they fix every page at once.

In `review` mode, `deliver` is this list with the three changes that would move the page most, and
the run stops. Change no code.

## choose (gate)

Show the findings as a checklist and let the user pick what to do now. Record the picks with
`approve choose --note "..."`.

## argument, direction, spec (redesign only)

As in `modes/create.md`, with the existing content. Pass `--have` honestly. When the brand fixes
colours or fonts, keep them and take only composition from the direction.

## fix

- **Lowest layer first.** Token → component → page. Never add a page-level override when a token
  or component change fixes it.
- **Order of work:** type (faces and scale) → colour (ground, ink, accent) → frame and spacing
  (margins, rhythm, headings on sections) → states (hover, focus, loading, empty, error) → components.
- **Map, don't replace.** Change values inside the existing system: the Tailwind theme, the CSS
  variables, the component library's theme. No framework or styling-library migration. Check the
  dependency file before adding anything, and ask before adding a dependency.
- **Consolidate.** Collapse near-duplicate values onto the scale (15px and 16px become 16px).
- **Keep behaviour.** Routes, forms, handlers, data and analytics stay untouched.

## after

```bash
node <skill>/scripts/inspect.mjs <url or file>
```

Compare with `.design/before`: the same inventory numbers side by side. Then check for regressions:
every link, form and menu that worked before still works (click through, or write a short
Playwright check for the critical paths).

## gate, deliver, learn

As in `modes/create.md`. The deliver package leads with the before/after table:

```markdown
| Measure | Before | After |
| Distinct font sizes | 12 | 6 |
| Distinct greys | 19 | 5 |
| Spacing values off the 4px grid | 23 | 0 |
| Inspector FAIL | 9 | 0 |
```

followed by before/after screenshots at desktop and phone.
