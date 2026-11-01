# Wedding organizer: with and without the skill (2026-11-01)

Owner's request: "buatkan sebuah landing page untuk wedding organizer ... 2 comparison antara dengan skill dan tidak ada skill", shown as an artifact.

- Same prompt for both: "Buatkan sebuah landing page untuk wedding organizer." Same model.
- `no-skill/`: built by a fresh agent told not to read this repository (about 5 min, 83k tokens).
- `with-skill/`: the create mode at quick effort with autopilot gates (the gates were decided by Claude, logged in `design/decisions.log`). `design/` holds brief, research (3 sources opened), strategy v2, roast (16 points) with response, direction deal, spec, copy, critique (7.4) with fixes, and the inspector report.
- Inspector: no-skill 4 FAIL (9.9px text, 15 low-contrast texts, small tap targets); with-skill 0 FAIL after fixing what the inspector found.
- No-skill invents proof (320+ weddings, 4.9/5 rating, named testimonials); with-skill invents none.
- Blind page: `comparison.html` (published as https://claude.ai/artifact/SxMfddTJtPUESjwoPxi7FG). A = no skill, B = with skill, assigned at random.
- Inspector bugs found during this run and fixed: smooth-scroll pages measured mid-scroll; elements measured under a sticky bar at the screen edge (now centred first); the style tag hung the no-JavaScript check.
- Limits: one brief, one run each; sample business data; the owner knew the process. Not a statistical result.
