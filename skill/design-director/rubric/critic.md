# The critic

The critic judges screenshots of a page it did not make. It runs as a **separate subagent with a
fresh context** so it cannot read the builder's intentions into the result. It never sees the code.

## Briefing the subagent

Give it exactly this, and nothing about what you meant to do:

```text
You are reviewing a web page you did not make. Read <skill>/rubric/critic.md and follow the
"Critique" (or "Ranking") format.
Brief card: <paste .design/brief.md>
Team anchors: <paste the "Anchors" section of team/taste.md, if any>
Screenshots: <list of paths: desktop fold and pages, mobile fold and pages>
Write your answer to <.design/critique.md | .design/variants/ranking.md>.
```

If subagents are not available, do the review as a separate step that loads only this file, the
brief card, the anchors and the screenshots, and say in the report that it was not independent.

## How to look

Open the desktop fold, then the desktop pages, then the mobile fold and pages. Make each pass on its
own.

1. **One second.** Glance and look away. What did you see? There should be one answer: a word, an
   image, an object. "A website" means there is no focal point.
2. **Five seconds as a stranger.** What is this, who is it for, what do I do next? If the title only
   makes sense after scrolling, it is not a title.
3. **Squint.** Text becomes grey bars. The page should reduce to two or three masses of clearly
   different size. Many similar masses means nothing leads.
4. **Cover the logo.** Could this page belong to a competitor? Does the idea reach the pricing, the
   FAQ and the footer, or does the page turn into stock blocks after the first screen?
5. **Edges.** Follow the left edge of every text block down the page. Two or three positions reused
   on purpose is composed; six is improvised.
6. **Space and frame.** Equal outer margins? Gap between sections larger than inside them? Any hole
   (empty by accident) rather than rest (empty by decision)? Any section with text in one half and
   nothing in the other?
7. **Type.** A decisive jump from body to headline? More than five sizes? Orphans? Paragraphs wider
   than about 75 characters?
8. **Colour.** Which colour holds most of the surface, which supports, where is the accent? An accent
   in ten places means nothing.
9. **Pictures.** Real, doing a job, consistent in crop and treatment? Any grey box, stretched photo,
   fake screen?
10. **Sameness.** One word per section's composition. The same word twice in a row, or three times on
    the page, is the template showing.
11. **Phone.** Its own composition, or the desktop squeezed? Is the first screen still one clear thing?
12. **Completeness.** Is everything the visitor came for there, at a readable size?
13. **Fit.** Against the brief and the team anchors: is this the kind of page the team approves, or
    the kind it rejects? Say which anchor it is closest to.

## Score

Each criterion 1–10 with a one-line reason. Weights are the team's (`team/taste.md` → "Critic
weights"); without them use these:

| Criterion | Weight | Question |
| --- | --- | --- |
| Clarity | 25% | Passes 1–2: does a stranger get it in five seconds? |
| Distinctiveness | 25% | Pass 4: does it belong to this client and no other? |
| Craft | 25% | Passes 3, 5–11: is it composed, consistent, finished? |
| Fit | 25% | Passes 12–13: right for this audience, brand and team taste? |

Caps: a failed five-second test caps Clarity at 4. A page a competitor could use caps
Distinctiveness at 5. Any broken thing visible in a screenshot (overflow, cut text, missing image,
unreadable contrast) caps Craft at 5.

## Critique format

```markdown
## Scores
| Criterion | Score | Reason |
...
| Weighted | x.x | |

## Top three problems
1. <what> — <where: screenshot file and area> — <why it matters> — <smallest fix>
2. ...
3. ...

## Keep
- <three things that work and must survive the fixes>
```

Be specific and plain. No praise without a reason, no problem that is not visible in a screenshot.

## Ranking format (best-of-N)

```markdown
| Rank | Variant | Weighted score | Why, in one line |
| 1 | B | 7.6 | ... |
| 2 | A | 6.9 | ... |
| 3 | C | 6.1 | ... |
Keep: B. Borrow from A: <at most one thing, or "nothing">.
```

## Calibration

The critic is still a model with a model's taste. Each time designers vote on pairs the critic also
ranked, record agreement in `rubric/critic-calibration.md`. Below 70% agreement over the last 20
pairs, revise the weights and the anchors before using the critic to choose variants again.
