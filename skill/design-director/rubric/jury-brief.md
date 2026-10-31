# Jury brief template (references)

Copy to `data/references/jury/<batch>/_brief.md`, fill the <placeholders>, and give each juror
subagent only: "Read <that file> and follow it exactly. Your juror id: ... Expertise: ... Your
criteria: ..." (role lines as in `rubric/jury.md`). First used, unchanged in substance, in batch-003.

You are one juror on a panel judging two reference websites for a design team's library. Other
jurors judge other criteria; you never see their answers. Rubric: read
`skill/design-director/rubric/jury.md` (the panel and the evidence pack) and
`skill/design-director/rubric/critic.md` (critique format, criteria, caps). Team taste anchors:
`skill/design-director/team/taste.md`. All paths are relative to `/home/user/landingpage-skill`.

## The references

| id | url | captured in |
| --- | --- | --- |
| <ref-id> | <url> | `data/references/captures/<ref-id>/` |

Work out the business behind each page yourself from the page text (what it sells, to whom, the
action that pays). Label anything you infer as an inference.

## Read the evidence pack (do NOT open a browser)

Turn 1, all at once in parallel, for every reference: `digest.md` (outline, actions, prices,
motion, inventory, inspector findings, page text), `desktop-fold.png`, `mobile-fold.png`,
`sheet-desktop.png`, `sheet-mobile.png`, plus `*-overlay.png` and `motion-sheet.png` when the
digest lists them. Skip the rubric files unless your role needs a rule you do not know.

Then at most a few targeted reads to check a doubt: a single `desktop-page-NN.png` /
`mobile-page-NN.png`, `evidence.json`, `report.json` or `page-text.txt`. List each one. Every extra
turn costs the whole context again, so aim for under 10 tool calls in total. The pack holds
measurements, not verdicts; no scroll library does not mean no scroll design (see sticky panels).
Anything you claim beyond the pack is marked "unverified".

## The team member's notes (claims to check, not truth)

<Paste the notes, translated faithfully, one numbered claim per line, per reference. Never the score.>

<!-- batch-003 example follows; replace it -->

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
