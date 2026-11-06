# Mode: site

Several pages, or a stepped flow (landing → pricing → sign-up → onboarding). Steps: brief → research
→ sitemap → strategy → roast → direction → skeleton → system → spec → copy → build → reason → gate →
look → deliver → learn. Research and roast cover the whole site at once.
Everything not described here works as in `modes/create.md`.

## sitemap

Write `.design/sitemap.md`: every page, its one job, how people move between them, and which steps
of a flow carry logic (forms, toggles, states). The direction gate happens once, for the whole site.

## skeleton

Skeletons for the home page and the most different page (often a form or a detail page).

## system

Build the shared system before any page: tokens, navigation, footer, buttons, form fields, cards
(if the direction uses them), and one reference page that uses all of them. Every later page may
only use this system; a new component is added to the system first, then used.

## spec, copy, build

One spec section per page: its storyline beats (the strategy gives one storyline per page, all
serving the same message house), sections and content. For each step with behaviour, add a
logic spec: the rules, every state (idle, loading, success, error, empty), edge cases, and
acceptance tests with the expected answers written out. One `## Motion spec` serves the whole
site (`motion/functions.md`): the message and its signature motion, the entrance, and the page
changes and flow steps as its state transitions.

For more than three pages, build each page in its own subagent or session that loads `.design/`
only (brief, spec, system), so the context does not pile up.

## gate

Inspect every page. Then check consistency across pages: the same tokens, the same components,
no values outside the system (compare the inspector inventories), navigation identical, and every
acceptance test run and passing.
