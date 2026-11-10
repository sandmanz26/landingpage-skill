# The council: five heads shape every design job (owner, 2026-11-10)

The one home for the five heads, what each one owns, where each speaks and what each may stop. The
owner's reason: a design is only mature when the people who answer for the code, the craft, the
idea, the product and the money have each signed off their part. The council is **not a new panel
on top of the existing ones**: four heads are played by the roast and the jury the skill already
runs; one head (Engineering) is new, because nothing in the skill read the code before.

## The heads

| Head | Owns | Asks | Reads | May veto | Speaks at |
| --- | --- | --- | --- | --- | --- |
| **Head of Product** (new) | The product vision, the target user and the outcome for them, the success metric, the scope (what is in now, what is out), consistency with the product's existing patterns | Does this move the user toward the outcome the product exists for? Can we measure it with the one metric? Is anything here out of scope, or missing that is in? Does it behave like the rest of the product (names, flows, components)? | `brief.md` → `## Product`; `strategy.md` (customer, success measure); the product's existing screens when there are any | A feature or section outside the agreed scope; a page that contradicts the vision; a success measure that cannot be measured | Brief (the Product question), roast, spec sign-off, look (with Business), deliver |
| **Head of Business** | Market insight: the business, the competitors, the category clichés, the offer and the action that pays (`research/method.md`, `strategy/method.md` §1) | Which market fact changes this design? Is the action that pays obvious and the offer clear enough to say yes to? Where is it weaker than the competitor? | `research.md`, `strategy.md` | A promise the business cannot keep (the conversion strategist's veto, `rubric/jury.md`) | Research and strategy (it owns them), roast (competitor's marketer + the owner / the money), spec sign-off, look (conversion), deliver |
| **Head of Design** | Composition, hierarchy, the system (tokens, components, spacing rhythm), accessibility and usability as seen on screen | Does one thing lead on every screen? Is it one system? Can everyone read and operate it on a phone? | Screenshots and the evidence pack (`rubric/jury.md`), `fit.mjs`, the inspector report | An accessibility FAIL (the front-end and accessibility juror's veto, which it holds) | Skeleton, spec sign-off, look (art director + accessibility juror) |
| **Head of Creative** | The idea, the brand elements (`brand/method.md`), the signature, the motion message (`motion/functions.md`), distinctiveness | Is the idea this client's, or the category's (competitor test)? Do the brand elements carry the subject down the page? Does the signature motion say the message? | `strategy.md` §5 (the idea), the direction cards, `brand-kit.md`, the motion spec, screenshots and motion frames | Copying a reference's assets or anything on a `doNotCopy` list (`rules/copyright.md`, which outranks taste) | Roast (senior art director), direction, spec sign-off, look (brand and story + motion jurors) |
| **Head of Engineering** (new) | The code: semantic HTML, component structure, the stack's conventions (shadcn/ui and React when used, `rules/stack.md`), tokens instead of hard-coded values, the performance budget (page weight, images, JS), accessibility in code (labels, roles, names, focus order, visible focus), responsiveness in code, maintainability (no dead code, no copy-paste blocks, no page overrides in an existing system), security basics (no secrets in the source, safe links: `rel="noopener"` on `target="_blank"`, no inline credentials or tokens) | Would a senior engineer merge this? What breaks at the next change? What does it cost to load? | The source files, `brief.md` (Stack, Component library), `spec.md` (Tokens, Council), `inspect/report.json`, the lint output | A secret in the source; a security hole; a broken build; an accessibility failure in code (a control with no name, a focus trap); the stack's library bypassed without the user's agreement | Spec sign-off (stack, library, budget), the **engineering review** after the gate, deliver |

Taste is never a veto. A veto is answered by fixing it or by the user's explicit, logged decision
(`rules/precedence.md`: objective rules and copyright cannot be overruled even then).

## Where they speak, by effort (cost)

A subagent costs about 53k tokens before it reads anything. So the heads are **roles inside the
subagents that already run**, and only Engineering gets a subagent of its own at standard effort.

| Effort | Roast (plan) | Spec | After the gate | Look |
| --- | --- | --- | --- | --- |
| quick | The main session plays each head in turn, in one pass, in `roast.md` (one voice block per head); marked "not independent" | Main session writes `## Council` | Main session writes the engineering review with `"independent": false` | The one critic (`rubric/critic.md`) |
| standard | The roast subagent (`roast/method.md`) speaks as **Business** (competitor's marketer, owner / money) and **Product** (the new voice), next to the sceptical customer and the senior art director (Creative) | Main session writes `## Council`; each head's line comes from that head's evidence | **One new subagent: the Head of Engineering code review** (brief below) | The two combined jurors: *visual-motion* = **Design + Creative**; *business-customer-story* = **Product + Business** (`rubric/jury.md`) |
| thorough | Four subagents, one per head: Business, Product, Design, Creative (each attacks the plan from its own row above; same roast format, its voice only). Engineering does not roast a plan without code; its questions are answered at the spec | As standard | The engineering review subagent | The full panel, grouped by head (`rubric/jury.md` → The panel) |

Later look rounds do not re-run the engineering review: the main session checks each blocking and
major finding against the changed code and records it in `.design/critique.md` → `## Engineering`.
A second review subagent runs only when a fix rewrote a component or the stack changed.

## The spec sign-off (`spec.md` → `## Council`)

Every spec in `create`, `site` and `redesign` ends its decisions with one or two lines per head,
each signed against that head's evidence. This is what "instructions made mature" means: each part
of the spec has an owner who would defend it.

```markdown
## Council
- Product: vision "<one line from the brief>"; outcome <what changes for the user>; metric <the one number>; scope in <…> / out <…>
- Business: <the market point this page acts on> (research #<n>); action that pays <…>
- Design: <hierarchy and system in one line: grid, type scale ratio, the one thing that leads>
- Creative: <the idea sentence's device>; signature <element or motion>; brand elements <hero + supporting>
- Engineering: stack <…>; component library <…>; budget ≤ <n> KB first load, images ≤ <n> KB each, JS ≤ <n> KB; tokens only
```

`progress.mjs done spec` refuses the spec without `## Council`, without a line for each of the five
heads, without a metric on the Product line, or without a budget (a size in KB or MB) on the
Engineering line.

**Starting budget** when the brief sets none (a team starting point, not a measured standard; say
so when you use it): a marketing page ≤ 1,500 KB on first load, each image ≤ 200 KB at its displayed
size (modern format, `width`/`height` set, lazy below the first screen), JS ≤ 150 KB compressed;
an admin app built with React states its own JS budget. The inspector does not measure page
weight yet: the engineering review measures it from the files.

## The product question at the brief

The Head of Product speaks first, at the brief, in the four-part form of
`rules/brief-interview.md` (plain question, what it changes, an example, a recommendation, and
"percayakan ke AI"). The brief records the answer:

```markdown
## Product
- Vision: <what the product is for, in one sentence, the user's words where possible>
- User and outcome: <who, and what is different for them after using it>
- Metric: <the one number that shows it works: bookings per week, activation, orders per day>
- Scope: in <what this job covers now> · out <what it does not, and when it comes>
- Patterns: <the product's existing names, flows, components to stay consistent with, or "n/a: new product">
```

or one line, `- Product: vision: …; outcome: …; metric: …; scope: …; patterns: …`. With "percayakan ke
AI", write the proposal and mark it `(AI proposal)`. `progress.mjs done brief` refuses a brief in
`create`, `site` and `brand` (and so every app screen built in them) without the vision, outcome,
metric and scope. The strategy's **Success measure** (`strategy/method.md` §1) is this metric,
carried forward, not a second one.

## The engineering review (standard and thorough, after the gate)

A separate subagent with a fresh context, after `done gate` and before the look's jurors start (they
can run at the same time: the jurors read screenshots, the reviewer reads code). It reads the code,
never the screenshots' taste; the jury reads the screenshots, never the code.

### Brief for the reviewer (keep it lean: it sets the cost)

```text
You are the Head of Engineering (rubric/council.md → The heads). Review the code of a page you did
not write. Files: <.design>/brief.md (Stack, Component library, Product), <.design>/spec.md
(Tokens and Council only), <.design>/inspect/report.json (summary and findings only), the source
files listed below. No browser, no screenshots, no taste.
Turn 1, in parallel: brief.md, spec.md, report.json, and the list of source files with sizes
(e.g. `find <src> -type f -not -path '*/node_modules/*' | xargs ls -l`).
Turn 2, in parallel: the entry page and every stylesheet and script it loads (at most 6 files;
for a component project: the page, its components, the theme or tailwind config).
Turn 3, in parallel, only what a doubt needs: one grep for hard-coded colours/sizes outside the
tokens, one for `target="_blank"` without rel and for key-, token- or secret-like strings, the
package manifest. At most 9 tool calls in total.
Judge: semantic HTML and landmarks; component structure and the stack's conventions (shadcn/ui:
components from components/ui, theme variables, no restyled copies); tokens instead of hard-coded
values; the budget in spec.md (page weight from the file sizes, images, JS); accessibility in code
(labels, names, roles, focus order and visible focus, reduced motion in CSS); responsiveness in
code (no fixed widths that break reflow); maintainability (dead code, duplicates, overrides);
security basics (no secrets, safe links, no inline credentials).
Write <.design>/review/engineering.json in the format of rubric/council.md. Reply in five lines:
verdict, blocking count, the three findings that matter most, the budget as measured.
```

Source of the `<src>` list: the page's real location (the build step's files), not `.design/`.

### Output (`.design/review/engineering.json`)

```json
{
  "reviewer": "head-of-engineering", "kind": "ai", "independent": true,
  "time": "2026-11-10T09:00:00Z",
  "verdict": "pass | fix | block",
  "stack": "static HTML + CSS | Next + shadcn/ui | …",
  "budget": { "target": "≤ 1500 KB first load", "measured": "640 KB (html 38, css 22, js 0, images 580)", "ok": true },
  "findings": [
    { "id": "ENG1", "severity": "blocking | major | minor",
      "area": "semantics | components | tokens | performance | a11y-code | responsive | maintainability | security",
      "where": "index.html:212", "issue": "Icon-only menu button has no accessible name",
      "fix": "aria-label=\"Buka menu\"", "status": "open | fixed" }
  ],
  "keep": ["Every colour and size comes from the :root tokens"],
  "method": "files read, greps run, anything not verified"
}
```

**Verdict**: `pass` (nothing blocking), `fix` (blocking or major findings with a clear fix),
`block` (a veto from the heads table applies). **Blocking** is reserved for the veto list; a
missed budget is major unless the brief made it a hard limit.

`progress.mjs done look` at standard and thorough effort refuses while the file is missing, has no
verdict, or has a blocking finding that is neither `"status": "fixed"` nor named by its id in
`.design/critique.md` → `## Engineering` with the answer (fixed how, or the user's logged decision).
At quick effort the main session writes the same file with `"independent": false`; it is not
required.

## In the deliver report

Each entry of "Alasan desain" may name the head that stands behind the decision
(`rules/rationale.md`), so the user knows whose argument to use: "Produk", "Bisnis", "Desain",
"Kreatif", "Engineering". The engineering review's verdict, the measured budget and any finding
left open go under the open issues.

## Not checkable by script

Whether a head's line is true, whether the quick-effort roles were really played apart, whether the
reviewer read every file it names, and page weight beyond what the reviewer measured from the files.
