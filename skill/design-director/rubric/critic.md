# The critic

The critic judges screenshots of a page it did not make. It runs as a **separate subagent with a
fresh context** so it cannot read the builder's intentions into the result. It never sees the code.

## Briefing the subagent

Give it exactly this, and nothing about what you meant to do:

```text
You are reviewing a web page you did not make. Read <skill>/rubric/critic.md and follow the
"Critique" (or "Ranking") format.
Brief card: <paste .design/brief.md>
Customer: <the customer profile from .design/strategy.md, and the five questions they most need
answered, from the research, in their own words>
Team anchors: <paste the "Anchors" section of team/taste.md, if any>
Screenshots: <list of paths: desktop fold and pages, mobile fold and pages>
Write your answer to <.design/critique.md | .design/variants/ranking.md>.
```

If subagents are not available, do the review as a separate step that loads only this file, the
brief card, the customer profile and questions, the anchors and the screenshots, and say in the
report that it was not independent.

The critic judges three things at once, because a page can be beautiful and still fail: does it
serve the **business** (the action that pays), does it serve the **customer** (their questions, in
their order, in their words), and does it **look** right (clear, distinctive, well made). The
storyline is what joins the first two.

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
13. **Fit.** Against the brief, the customer and the team anchors: is this the kind of page the team approves, or
    the kind it rejects? Say which anchor it is closest to.

## Score

Each criterion 1–10 with a one-line reason. Weights are the team's (`team/taste.md` → "Critic
weights"); without them use these:

| Criterion | Weight | Question |
| --- | --- | --- |
| Business | 20% | Is the action that pays obvious on every screen? Is the offer clear enough to say yes to? Is trust built before the ask? |
| Customer | 20% | The five-questions test (below): are their questions answered, in their order, in their words, on a phone? |
| Story | 15% | Does each section answer the question the previous one raised? Any section that is there by habit? |
| Clarity | 15% | Passes 1–2: does a stranger get it in five seconds? |
| Distinctiveness | 15% | Pass 4: does it belong to this client and no other? |
| Craft | 15% | Passes 3, 5–11: is it composed, consistent, finished? |

Caps: a failed five-second test caps Clarity at 4. A page a competitor could use caps
Distinctiveness at 5. Any broken thing visible in a screenshot caps Craft at 5. Fewer than four of
the five customer questions answered caps Customer at 5. No visible action on the first screen caps
Business at 4. Two or more missed visual targets (`fit.mjs`) without a reason in the Fit section cap
Distinctiveness at 6.

### The five-questions test

Read the page as the customer described in the brief, on the phone screenshots. For each of the
five questions you were given: is it answered? In which section (screenshot file)? Before or after
the customer is asked to act? In their words or in the company's?

| # | Customer question | Answered? | Where | Before the ask? | Their words? |

## Critique format

```markdown
## Five-questions test
| # | Customer question | Answered? | Where | Before the ask? | Their words? |

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
