# Jury brief: admin-a03 data tables (2026-11-10)

Four concept screenshots of data tables, sent by a team member who asked for a neutral judgement:
"I cannot judge these purely myself; give a neutral opinion; a failed UX audit is fine, record it."
Files in /home/user/landingpage-skill/data/admin-patterns/table/: tb-001.webp, tb-002.webp,
tb-003.webp, tb-004.webp. Read all four in ONE turn; under 6 tool calls. Concept shots: judge what is
visible; mark behaviour you cannot see as "not visible", never guess.

For each table:
1. kind (flat list, tree/hierarchy, expandable rows, grouped/nested, kanban-like…) and the job it suits;
2. UX audit, each item pass / fail / not visible with evidence: scannability (column order, alignment of
   numbers right, dates consistent), selection and bulk actions, sorting and filtering affordances,
   status encoding (not colour alone), hierarchy clarity, row actions discoverability, density for daily
   use, pagination/count, empty and long-value handling (truncation), contrast of secondary text,
   keyboard/accessibility signals;
3. style levers (surface, header treatment, row separation, chips/badges, icons/avatars, accent colour,
   radius, density) in a few words each;
4. scores 1-10: usability, clarity, style (5 = generic framework default, 7 = good, 9 = best-in-class);
5. take (patterns worth reusing, with their function) and avoid (failures to never copy).

Write /home/user/landingpage-skill/data/admin-patterns/table/jury-ux-visual.json:
{ "juror": "ux-visual", "kind": "ai", "method": "...", "refs": { "tb-001": { "kind": "...", "job": "...",
  "audit": [ { "check": "...", "result": "pass|fail|not visible", "evidence": "..." } ],
  "style_levers": { ... }, "scores": { "usability": n, "clarity": n, "style": n },
  "take": [ ... ], "avoid": [ ... ] }, ... }, "patterns_across": ["what the four teach together"] }
Reply in six lines.
