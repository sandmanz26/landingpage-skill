# Project notes for Claude

Read `HANDOFF.md` before doing anything: goal, state, decisions, blockers, next steps.

Working agreement with the owner (they asked for it explicitly):
- Answer in Bahasa Indonesia.
- Act as a precise AI and prompt engineer: neutral, goal-driven, no sycophancy. When the owner is
  wrong, say so and explain why; treat their notes and ideas as input to check and improve.
- Say plainly what was not verified (no access, no data, simulated steps).
- Update `HANDOFF.md` at every milestone so another model or AI can continue without the chat.
- Run `cd skill/design-director && npm test` after changing any script.
- Every change to the skill fits its structure (the owner asked, 2026-11-06): put it in the module that owns
  the topic (modes/, copy/, motion/, rules/, rubric/, team/, kit/, scripts/), update SKILL.md's tables and
  the step that uses it, enforce it in progress.mjs or a check when it is a rule, and add a selftest. No
  loose files, no rule that lives in only one place, no duplicate of an existing rule.
