# Jury brief: batch-004 (2026-11-02), Summer Smash Tennis, Vancouver (home + 5 subpages)

You judge one reference website for a design team's library, from its evidence pack only (no
browser, no code). Paths are under /home/user/landingpage-skill/data/references/captures/.

Pages: ref-0009 (home), ref-0009-classes, ref-0009-method, ref-0009-coaches, ref-0009-private,
ref-0009-about. Each folder has digest.md (outline, actions, prices, motion, inventory, inspector
findings, page text), desktop-fold.png, mobile-fold.png, sheet-desktop.png, sheet-mobile.png,
motion-sheet.png.

Turn 1, in parallel: ref-0009/digest.md, ref-0009/desktop-fold.png, ref-0009/mobile-fold.png,
ref-0009/sheet-desktop.png, ref-0009/sheet-mobile.png, ref-0009/motion-sheet.png, and the five
subpage digest.md files. Turn 2 (optional): at most three subpage sheets or single screenshots to
check a doubt. Under 10 tool calls in total. Work out the business yourself from the page text and
mark inferences.

The team member's notes (claims to check, not truth). Check those that touch your expertise:
confirmed, confirmed with correction, contested, or unverifiable, with evidence; correct wrong terms.
1. Tennis balls that wobble; pictures cut through their frame and seem to come out of it
2. The icons look a little classic but are comfortable to read
3. Animated text running along a circular / wavy shape is unique
4. The map uses custom objects (tennis-ball pins) and is fun
5. The circular parts give micro-animation

Write ONE file, /home/user/landingpage-skill/data/references/jury/batch-004/<your-juror-id>.json:
{ "juror": "<id>", "kind": "ai", "method": "what you read, what you could not verify",
  "refs": { "ref-0009": {
    "business": "what it sells, to whom, the action that pays (mark inferences)",
    "scores": { "<criterion>": 1-10 }, "reasons": { "<criterion>": "evidence, cite files" },
    "claims": [ { "claim": "...", "verdict": "...", "evidence": "..." } ],
    "subpages": "what the subpages add or break, one line each",
    "problems": ["top three"], "keep": ["patterns worth the library, each with its function"],
    "veto": "only if your role has one and it applies" } } }
Calibrate: 5 = competent but generic, 7 = good, 9 = best-in-class. Reply in five lines.
