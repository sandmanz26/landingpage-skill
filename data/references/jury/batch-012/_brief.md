# Jury brief: batch-012 (2026-11-10), three sites judged in one pass

Judge each site against its own business, from its evidence packs only (no browser, no code). Folders
under /home/user/landingpage-skill/data/references/captures/ (each has digest.md, desktop-fold.png,
mobile-fold.png, sheet-desktop.png, sheet-mobile.png, motion-sheet.png):
- ref-0018 SquadEasy (squadeasy.com/en): work it out from the page text (it reads as an employee
  engagement / team challenge platform sold to companies).
- ref-0019 Figure Film (figurefilm.co.uk, London production company) plus ref-0019-works and
  ref-0019-about: look for the patterns repeated across the three pages (the team member asked for this);
  the page text opens with aspect ratios (2.76:1 … 1:1).
- ref-0020 Coveo Music (an artist's site) plus ref-0020-release (a release page). A pop-up was closed on load.

Turn 1, in parallel: the three home digests and the three home desktop-fold.png + sheet-desktop.png.
Turn 2: the three motion-sheet.png, ref-0019-works and ref-0019-about sheet-desktop.png, ref-0020-release
sheet-desktop.png, and the three mobile-fold.png. Under 12 tool calls in total.

The team member's notes (claims to check, not truth):
- SquadEasy, 8 visual / 8.5 ship: excellent scrollcraft, every scroll moves frames and builds a harmony of
  elements; simple good layout; simple colouring; could not name the category.
- Figure Film, 7 / 8.2: a unique concept, retro/vintage yet minimalist, solid colours with effects; explore
  the other pages for the pattern.
- Coveo Music, 8 / 8.5: music; simple, not loud, plays with simple elements (text and images) and small
  motions; suits a portfolio; few contents and lots of white space; photos not monotonous, slight diagonal tilt.

Write ONE file, /home/user/landingpage-skill/data/references/jury/batch-012/<your-juror-id>.json:
{ "juror": "<id>", "kind": "ai", "method": "...",
  "refs": { "ref-0018": { "business": "...", "scores": { "<criterion>": 1-10 }, "reasons": { "<criterion>": "evidence" },
    "claims": [ { "claim": "...", "verdict": "...", "evidence": "..." } ],
    "motion": [ { "what": "...", "message it carries": "... or none", "verdict": "earns its place / decoration" } ],
    "problems": ["top three"], "keep": ["patterns with their function"], "veto": null }, "ref-0019": {...}, "ref-0020": {...} } }
Calibrate: 5 = competent but generic, 7 = good, 9 = best-in-class. Reply in six lines.
