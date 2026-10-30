# Evals

How we know a version of the skill is better, not just different.

## Contestants

For every brief, a fresh agent builds the page three ways, each in its own empty folder:

1. **baseline:** no design skill;
2. **taste-skill:** taste-skill v2 installed;
3. **design-director:** this skill, at the version under test (gates in `autopilot`, so no human
   steers it during the eval).

Every result is photographed by the same `scripts/inspect.mjs` so lighting is equal.

## Briefs

- `briefs/`: 15 briefs used while improving the skill.
- `holdout/`: 5 briefs never read while changing the skill. They are only run to confirm a release.
- Format: `briefs/_template.md`. Prefer real past projects, anonymised. Include real content; some
  briefs must have no testimonials or photographs, to test honesty under gaps.

## Voting

Designers see two results side by side (desktop and phone screenshots), unlabeled and in random
order, and pick the one they would ship, with one sentence why. At least 3 designers; every pair of
contestants on every brief.

- 20 briefs × 3 designers = 60 votes per pairing.
- **Pass:** design-director wins ≥ 65% of its votes against each other contestant (p ≈ 0.014 at 60
  votes; 60% would be p ≈ 0.08, too close to chance).
- Also recorded: inspector FAIL counts, lint counts, and the AI jury's scores and rankings
  (`rubric/jury.md`) on the same pairs, so each AI juror's agreement with the designers is measured
  (`jury.mjs rank`, logged in `rubric/critic-calibration.md`). The pass mark is decided by the
  designers' votes; the AI jury is calibrated against them, not the other way round.

## Trigger tests

`trigger-tests.json` lists prompts that must and must not trigger the skill. Run each in a fresh
session with the skill installed and record whether it loaded. Target: all "should" load, no
"should not" loads.

## Run log

Each delivered run leaves `.design/run-summary.json` in its project. Collect them into
`runs.jsonl` (one JSON object per line) to follow quality over time.
