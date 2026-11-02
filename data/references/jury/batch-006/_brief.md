# Jury brief: batch-006 (2026-11-02), two skincare / supplement e-commerce sites

You judge two reference websites for a design team's library, from their evidence packs only (no
browser, no code). Folders: /home/user/landingpage-skill/data/references/captures/ref-0011/ (ERLY, itserly.com) and /home/user/landingpage-skill/data/references/captures/ref-0012/ (Sunny Within,
sunnywithin.com), each with digest.md, desktop-fold.png, mobile-fold.png, sheet-desktop.png,
sheet-mobile.png. Note: ERLY's own web fonts failed to load in the capture (font-not-loaded), so
some text may show a fallback face; judge the layout, not the fallback.

Turn 1, in parallel: both digest.md files and both desktop-fold.png and sheet-desktop.png. Turn 2:
both mobile-fold.png and sheet-mobile.png. Under 10 tool calls in total. Judge each site against
its own business; do not rank them against each other.

The team member's notes (claims to check, not truth):
ref-0011 ERLY (skincare): 1. The layout is simple. 2. It works because of good photo choices. 3. The
typography is very minimal: big images, small text, big space. 4. The images carry it, so the eye
moves to the photos.
ref-0012 Sunny Within (supplements): 1. The layout is better than ERLY's. 2. It feels modern because
of a large, consistent corner radius. 3. The images support it; without them it would look old.
4. Colour play is good, consistent, and makes a brand rather than just a website.

Write ONE file, /home/user/landingpage-skill/data/references/jury/batch-006/<your-juror-id>.json:
{ "juror": "<id>", "kind": "ai", "method": "what you read, what you could not verify",
  "refs": {
    "ref-0011": { "business": "...", "scores": { "<criterion>": 1-10 }, "reasons": { "<criterion>": "evidence" },
      "claims": [ { "claim": "...", "verdict": "...", "evidence": "..." } ],
      "problems": ["top three"], "keep": ["patterns with their function"], "veto": null },
    "ref-0012": { "...": "same shape" } } }
Calibrate: 5 = competent but generic, 7 = good, 9 = best-in-class. Reply in six lines.
