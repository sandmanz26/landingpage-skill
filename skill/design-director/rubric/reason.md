# The reason roast

Generated pages fail in a way the eye forgives and the customer does not: elements put there
because pages like this usually have them. Three icon cards, a stat row, a badge, a blob, a
marquee, an eyebrow label over every heading. Each looks finished; none was chosen. The reason
roast photographs the built page with every element numbered and makes each one say what it is
for. An element that cannot name its job goes.

The strategy roast (step 4) attacks the plan before the build. This one attacks the built page,
element by element, before the gate and the jury.

## Run it

```bash
node <skill>/scripts/elements.mjs <path/to/index.html> --out .design/reason
```

It writes `.design/reason/elements.md` (every element numbered E01 …, with what it shows, its size
and hints), one numbered picture per section (`desktop-S01.png` …) and the phone pages
(`mobile-01.png` …). With variants, run it per variant (`--out .design/variants/v1/reason`) and write
`variants/v1/reason.md`.

**Who roasts.** At standard and thorough effort, a separate subagent that gets only: `elements.md`,
the section and phone pictures, the brief card, the customer's questions from the strategy (numbered
Q1 …), and the spec's Sections and Interactions tables. Not the code, not your intentions: the
builder defends its choices, a fresh reader does not. At quick effort you do it yourself, after a
break from building (a new step that reads only those files), and say in the report that it was not
independent.

### Brief for the roaster (keep it lean: it sets the cost)

```text
You are the reason roaster (rubric/reason.md). Files: <.design>/reason/elements.md,
<.design>/reason/desktop-S*.png, <.design>/reason/mobile-*.png, <.design>/brief.md,
<.design>/spec.md (Sections and Interactions only), the customer questions Q1… from strategy.md.
Turn 1, in parallel: elements.md, brief.md, spec.md, strategy.md and every desktop-S*.png.
Turn 2: the mobile pictures. No browser, no code. At most 8 tool calls in total.
Write <.design>/reason.md in the format of rubric/reason.md: one row per element ID, then the Page
section. Leave Response empty: the builder writes it. Reply in five lines: counts of keep, fix,
merge and cut, and the three cuts or fixes that matter most.
```

## Four questions per element

1. **What is it, plainly?** Name the thing, not the component: "three cards, each an emoji, one
   word and one line: Fast, Secure, Scalable", not "feature cards".
2. **What is its job, and for whom?** One of these, with the reference:
   - answers a customer question (Q1 … from the strategy);
   - moves toward the action that pays (the action, the price, the contact, the next step);
   - proves a claim made elsewhere on the page (a real quote, a number with its source, a
     certificate, a real photograph of the place, product or people);
   - shows the product, the place, the people or the work;
   - carries the page's idea or the signature element named in the spec;
   - orients (navigation, a section title that says what is below, progress);
   - is required (legal, credits, privacy, accessibility, feedback on a control).

   "Looks nice", "fills the space", "balances the layout", "feels modern" and "pages like this
   have one" are not jobs. Beauty counts only when it carries the idea or the signature named in
   the spec (job 5), and then the spec says so.
3. **What would the customer lose without it?** If the answer is "nothing", the verdict is cut.
   If another element already does the same job, it is merge.
4. **Is it true and specific to this client?** Would a competitor's page carry the same element with
   the same words? A number with no source, a testimonial with no name, a generic icon, "trusted
   by thousands": fix with the real thing, or cut.

## Verdicts

| Verdict | When | What happens |
| --- | --- | --- |
| keep | Its job is named and the execution does it | Nothing |
| fix | The job is right, the execution is not: generic words, unsourced number, emoji as a picture, hover-only content, too small on the phone | Changed before the gate |
| merge | Two elements do one job (an eyebrow label that repeats its heading; two buttons to the same place in one screen) | One goes, the other stays |
| cut | No job, or a job nobody on this page needs | Removed before the gate |

## The hints in elements.md

The script flags what is often a sign of no reason. A flag is not a verdict; answer it.

| Flag | Usually means | Ask |
| --- | --- | --- |
| `decorative` | aria-hidden, empty alt, or a shape with no content | Does it carry the idea named in the spec? If not, cut |
| `moves-endlessly` | marquee, loop, pulsing badge | What does the motion add that a still version does not? Is there a pause? |
| `repeated` / `repeated ×N` | the same words three or more times | Is the repetition the point (a ticker of real orders) or filler? |
| `number-claim` | a number with +, %, "x", users, years | Where does the number come from? A price is fine; "10k+ users" needs a source |
| `generic-copy` | a stock phrase from `rules/lint-words.json` | Say what actually happens, in the client's words |
| `emoji` | emoji as a picture | Replace with the subject's own picture or drop it |
| `same-as-siblings` | a row of identical cards | Is it a real set (price tiers, hours of a day) or the three-icon-card template? |
| `eyebrow` | a short all-caps label right above a heading | Does it say something the heading does not? If not, merge it into the heading or drop it (`rules/defaults.md`) |
| `no-label` | an action or icon with no words | What does it do? Give it a label |
| `hidden-on-phone` | gone at 390px | Most customers are on a phone: was the job moved somewhere, or lost? |

## The page as a whole

After the elements, answer these in a few lines each:

- **First screen.** List its elements. Does each earn a place in the first five seconds? Does any
  compete with the main action?
- **Order.** Does each section answer the question the previous one raised? Name a section that is
  there by habit, if any.
- **Spec against page.** An element on the page that is not in the spec: give its job or cut it. A
  section or interaction in the spec that is not on the page: why?
- **The same job twice.** Two sections that answer the same question.

## Write .design/reason.md

```markdown
# Reason roast: <page> (round 1)
Roaster: <subagent | self, not independent> · elements.mjs run <time>

## Elements
| ID | Element | Job (for whom) | Lost without it | Verdict |
| E01 | Logo, top left | orients: back to the top | the visitor's anchor | keep |
| E05 | Three emoji cards "Fast, Secure, Scalable" | none: every competitor says it | nothing | cut |
| E08 | "Trusted by 10k+ teams" | proves a claim, no source | nothing true | fix: real client count or cut |

## Page
First screen: … Order: … Spec against page: … The same job twice: …

## Response
- E05 cut. E08 replaced by "212 pasangan sejak 2019 (kontrak di arsip)". E14 kept: … (reason)
```

Every element ID from `elements.md` has a row with a verdict; `progress.mjs done reason` refuses
otherwise. When any verdict is fix, merge or cut, the **Response** names each of those IDs with what
was done, or why it stays after all. After cutting, photograph the page again
(`elements.mjs <page> --out .design/reason/after`): `done reason` compares the two and refuses while
a cut element is still on the page. Then the gate inspects the changed page.

## What this roast does not do

It reads pictures and a list. It does not operate the page: interactions are judged from the spec's
Interactions table and the critic's pass 14. Pseudo-elements (`::before`, `::after`) and canvas
contents are not listed as elements; look for them in the pictures.
