# Add-on: app screens

Use on top of a mode when the screen is worked in (dashboard, admin, analytics, settings, billing,
inbox, editor) rather than read and scrolled. Different rules apply:

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
