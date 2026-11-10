# Add-on: app screens

Use on top of a mode when the screen is worked in (dashboard, admin, analytics, settings, billing,
inbox, editor) rather than read and scrolled. Different rules apply:

- **Component library:** with no design system or library agreed, build with shadcn/ui (React +
  Tailwind) until the user approves another, and tell them why; the brief records it on a
  `Component library:` line (`rules/stack.md`, checked by `progress.mjs done brief`). An existing
  project keeps its own (`modes/improve.md`).
- **Style variations (direction step):** admin screens look alike, so ask whether the user wants
  to see 2–3 style options first (four-part question with "percayakan ke AI", `admin/method.md` §4).
  "Ya": `adminoptions.mjs` renders A/B/C side by side (sidebar, modal, a table when the screen
  lists records) from the team's admin references, restyled by the brand kit when it exists; the
  user replies "Pilih B" and you log `admin-style: …`. "Percayakan ke AI": pick the direction whose
  "fits" matches the brief, render the page anyway and say why. "Tidak": log
  `admin-variations declined: …`. Same shadcn/ui structure, 3–4 of the ten style levers changed.
  With guided gates `progress.mjs done direction` checks it.
- **Data tables:** any screen that lists records follows `admin/table.md` (one home): import/export,
  sort, sticky identifier and actions on wide tables, checkboxes on one line with 24px targets,
  bulk-action bar with the count, filters that fit the data type, thumbnails for products,
  wrap-before-truncate, pagination, right-aligned numbers, and the states. Each rule has its reason
  and when not; cite the rule id in "Alasan desain" (`rules/rationale.md`). The inspector measures
  five of them (`table-*` findings).
- **Allowed here:** quiet 1px borders, small labels, tables, repeated panels, tabular figures,
  monospace for real code or IDs. They help people scan and work.
- **Priorities:** hierarchy of the task (what the user does most), alignment, density that fits the
  work, every state (loading, empty, error, partial, no permission), keyboard use and focus order.
- **Data:** realistic and consistent (numbers add up across panels, dates make sense). One finding
  per chart, stated in its title. No vanity numbers and no lorem data.
- **Not here either:** gradients and glows on panels or charts, rainbow chart palettes, icons in
  tinted squares as decoration, fake dashboards of grey bars.
- **Charts:** one series colour plus one highlight; label directly instead of a legend when there
  are few series.
- Run the inspector with `--app`; style rules meant for marketing pages are relaxed by the team's
  `taste-rules.json` where needed.
