# Jury brief: batch-003 (2026-10-31)

You are one juror on a panel judging two reference websites for a design team's library. Other
jurors judge other criteria; you never see their answers. Rubric: read
`skill/design-director/rubric/jury.md` (the panel and the evidence pack) and
`skill/design-director/rubric/critic.md` (critique format, criteria, caps). Team taste anchors:
`skill/design-director/team/taste.md`. All paths are relative to `/home/user/landingpage-skill`.

## The references

| id | url | captured in |
| --- | --- | --- |
| ref-0007 | https://swehl.com/ | `data/references/captures/ref-0007/` |
| ref-0008 | https://www.theresolute.ai/ | `data/references/captures/ref-0008/` |

Work out the business behind each page yourself from the page text (what it sells, to whom, the
action that pays). Label anything you infer as an inference.

## Read the evidence pack, in this order (do NOT open a browser)

1. `desktop-fold.png`, `mobile-fold.png` (first screen), and `desktop-overlay.png` /
   `mobile-overlay.png` (the first screen once a pop-up appeared; capture closed it afterwards)
2. `sheet-desktop.png`, `sheet-mobile.png` (every captured screen on one image)
3. `page-text.txt` (the page's words in order)
4. `evidence.json` (outline: headings with position, actions, prices, proof; motion: libraries,
   what moves on load, on scroll and with no input, reduced motion, idle navigation;
   `overlaysDismissed`), and `motion-sheet.png` (frames on load and while scrolling)
5. `report.json` (inspector: contrast measured on screen pixels, tap targets, hidden content...)

Open a single `desktop-page-NN.png` / `mobile-page-NN.png` only to check a specific doubt, and list
each one you opened. The pack holds measurements, not verdicts. Anything you claim beyond it is
marked "unverified".

## The team member's notes (claims to check, not truth)

A team member sent these notes. Check each claim that touches your expertise against the evidence:
confirmed, confirmed with correction, contested, or unverifiable, with the evidence. Correct wrong
terms. You do not know their score.

ref-0007 Swehl ("business category; quite good for a landing page"):
1. Simple colour play
2. Very balanced play of text sizes
3. Unique scrolling concept
4. CTA early on, positioned fixed at the bottom, with a circular radius

ref-0008 Resolute ("the scrolling is excellent"):
1. Every section is packaged with good scrolling
2. Transitions between pages are smooth
3. Every section has a unique design

## Answer

Write ONE file, `data/references/jury/batch-003/<your-juror-id>.json`:

```json
{
  "juror": "<your-juror-id>", "kind": "ai",
  "method": "what you read; which single screenshots you opened; anything you could not verify",
  "refs": {
    "ref-0007": {
      "business": "one line: what it sells, to whom, the action that pays (mark inferences)",
      "scores": { "<your criterion>": 1-10 },
      "reasons": { "<your criterion>": "why, citing files and measurements" },
      "claims": [ { "claim": "...", "verdict": "...", "evidence": "..." } ],
      "problems": ["top three, most important first"],
      "keep": ["what is worth taking into the library, as a pattern with its function"],
      "veto": "only if your role has veto power and a veto applies; otherwise omit"
    },
    "ref-0008": { "...": "same shape" }
  }
}
```

Score only your own criteria, 1-10, calibrated: 5 = competent but generic, 7 = good and clearly
working, 9 = best-in-class. Be specific and neutral: no praise words without evidence. Then reply
with a 5-line summary of your scores and the most important finding.
