# Three-way test results (filled in as runs finish)

| Run | Subagent tokens | Time | Tool calls | Inspector FAIL / WARN | Fit vs team defaults | copycheck FAIL |
| --- | --- | --- | --- | --- | --- | --- |
| no-skill | 93,155 | 4.8 min | 20 | 3 / 7 (h1 4 lines, contrast ×2, 1 small tap target) | 3 of 6 (missed colour, type ratio ×4.4, imagery: 1 drawing, 0 photos) | 0 |
| design-director (standard, autopilot) | 900,464 in all: builder 679,555 (three segments, 193,122 + 219,081 + 267,352, because each resume re-reads the whole transcript), reason roaster 80,534, two jurors 70,614 + 69,763 | about 30 min | 94 builder + 35 others | 0 / 0 | 4 of 6 against the team defaults (colour misses on the hard press shadows; imagery: 3 drawings, 0 photos, the run turned the dial to illustration because no photos could be fetched) | 0 |
| taste-skill v2.5.0-16 | at least 427,587 (the part after the 5-hour usage limit; the part before it was not reported) | at least 27.8 min + the unreported part | 24 after the resume | 1 / 0 (8 small tap targets on the phone) | 3 of 6 (colour: 2 families and 4 gradients; type ×4.5; no scroll story; imagery OK: 3D product renders count as photos) | 0 (110 words in all) |

Notes:
- Every run had the same constraints: no owner at the gates, no photographs (no Unsplash key; Openverse and Commons unreachable), the same message.
- design-director's cost is inflated by this test's set-up: the builder stopped twice for the coordinator's roaster and jurors and re-read its whole transcript on each resume. A single-session run has not been measured.
- taste-skill's own checks after its run: check.mjs clean at 5 widths; consistency.mjs 111 checks with 4 FAIL left (section-air, split-pair, section-gaps, a placeholder flag on the owner's phone number); perf.mjs 4 FAIL (stills without width/height/lazy).
- Fit is measured against the team defaults for all three. design-director turned its own imagery dial to illustration (no photos available) and passes 5 of 6 against its own targets.
- Blind letters for the owner: lihat/mapping-3.json (open only after scoring).

## Owner's blind verdict (2026-11-06, no numbers given)

- P (no-skill): "transition animation-nya hidup" on first load; looks like no-skill and "AI slop". Guessed right.
- Q (taste-skill): "tidak tahu tapi yang pasti fail". The owner first opened it from file://, where its module script and render specs cannot load, so the page showed no pictures; whether the verdict holds when served over http is not confirmed.
- R (design-director): "terbaik", with two notes: no entrance/transition animation; from the WhatsApp section down it loses energy, "kaku dan sangat template". The second note matches juror r1 problem 3, which the builder fixed without a re-score: the fix did not land for the owner.
