# Roast

Every run roasts its own plan before anything is built. The user does not have to ask. A plan
that survives people trying to break it is worth building; one that does not should change now,
while change is cheap. The roast is allowed, and expected, to change the direction.

## When

- **Create, site, redesign:** after the strategy, before the direction is chosen. It attacks the
  strategy and the storyline, and the direction cards if they are already dealt.
- **Section:** after the spec, before building.
- **Review, restyle:** after the review, against the list of proposed fixes.
- The look step later judges the built page; that is a different job (`rubric/critic.md`).

## Who roasts

A **separate subagent with a fresh context**, so it has no stake in the plan. Give it the brief,
`.design/research.md`, `.design/strategy.md` (or the spec, or the fix list) and the direction cards
if any; nothing about what you hoped. If subagents are unavailable, do it as a separate step that
reads only those files, and say in the report that it was not independent.

It speaks in four voices, each in turn:

| Voice | Asks |
| --- | --- |
| **The sceptical customer** | Would I believe this? Is my real question answered before I am asked to act? Where would I leave? |
| **The competitor's marketer** | What could we copy in a day? Where is this weaker than us? Which of our strengths does it ignore? |
| **The owner / the money** | Does this page lead to the one action that pays? Is the offer clear enough to say yes to? Is any section there for decoration rather than for the sale? |
| **The senior art director** | Is the idea really this client's, or a category idea? Does the direction serve the story, or fight it? What is the cliché here? |

Then a **pre-mortem**: "Six months after launch this page failed. The three most likely reasons."

And a **check against the research**: every place where the plan contradicts or ignores a finding.

## Roast format (`.design/roast.md`)

```markdown
# Roast: <client> (<date>)

## Points
| # | Voice | Point | Evidence (research ref or reasoning) | Severity |
| 1 | Sceptical customer | Fear of pain is the top objection (R1) but the plan answers it in one line at the bottom | research #1 | high |

## Pre-mortem
1. ...

## Contradictions with the research
- ...

## Verdict
keep | change | redo, with the specific changes demanded.

## Response
| # | Decision | What changed, or why not |
| 1 | Accepted | New section 2 "Kalau takut sakit"; moved above the price |
```

The **Response** section is written by the builder, not by the roaster: every point is either
accepted (and the change is made in the strategy, storyline or direction choice) or rejected with a
reason. `progress.mjs` refuses to mark the roast done without it. Points of high severity cannot be
rejected without a reason the user would accept; show them at the strategy gate.

A roast that finds nothing is a failed roast: ask again, harder, or name why the plan is unusually
safe.
