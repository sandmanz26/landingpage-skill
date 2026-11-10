---
name: design-director
description: >-
  Art direction and a checked build process for web pages that look designed for their subject
  instead of generated: landing pages, marketing and product sites, portfolios, multi-page sites,
  single sections, brand kits (elements, palette, type, a placeholder wordmark on a board), and improving, restyling, redesigning or reviewing an existing web UI or app
  screen. Use it whenever the user asks to design, build, redesign, restyle, polish, review or audit
  a web page, site, hero, section or dashboard, or says a page looks generic, templated or AI-made.
  Every run researches the business, competitors and customers, builds a storyline that serves both
  the business and the customer, roasts its own plan, applies the team's taste and the client's
  brand, asks the designer at short gates, checks the result in a real browser, and returns the
  research with the work. Not for backend work, data pipelines, slides or documents.
---

# Design Director

A model left to itself designs the average of every page it has seen, for a customer it has
imagined. This skill starts from research into the real business and its real customers, turns it
into a storyline, attacks that plan before building, puts the designer's taste in at the moments
that matter most, and checks the result with a browser and a second pair of eyes. Good design here
means three things at once: it serves the business, it answers the customer, and it looks right.

`<skill>` below means this skill's folder. Run scripts from the project root; working files go to
`.design/` there. Scripts need Node 18+ and Playwright with Chromium (`CHROME_PATH` if needed).

## Principles

1. **Research first, always.** Every run researches the business, the competitors and the customers
   (`research/method.md`) without being asked, and every decision can be traced to a finding. The
   research report is returned to the user with the work.
2. **Business and customer before looks.** The strategy names the action that pays and the
   customer's questions; the storyline answers them in order (`strategy/method.md`). Looks serve the
   story, not the other way round.
3. **Roast before you build, always.** A separate agent attacks the plan in four voices
   (`roast/method.md`); every point is accepted and acted on, or rejected with a reason. The roast
   may change the direction; that is its job.
4. **Decide before you build.** Every decision is written to `.design/` before code. Code only uses
   what the spec says.
5. **The designer chooses; you propose.** Short gates: the brief, the strategy, the direction, and
   the final result.
6. **The team's taste is data.** `team/taste.md` and the brand file outrank your own preferences. Brand elements come from `brand/method.md` (a kit from a `brand` run, or a short kit at the direction step).
7. **Never judge the look from code, and never judge alone.** Judge screenshots. At standard effort and above a
   jury of separate expert agents judges (`rubric/jury.md`), and designers' votes are combined with
   theirs; taste ties go to the humans, accessibility vetoes cannot be outvoted. The code is judged
   too, but on its own terms and by its own head: the engineering review (`rubric/council.md`).
8. **Respect what exists.** In an existing project, change tokens and components, not page overrides.
9. **Never invent proof.** No made-up testimonials, client logos, statistics, awards or press.
10. **Read only what the step needs.** Each step names its files; do not load the whole skill.
11. **Five heads sign off every job.** Product (vision, outcome, metric, scope), Business (market
   insight), Design (composition, system, accessibility), Creative (idea, brand, signature, motion)
   and Engineering (the code) each own their part (`rubric/council.md`). Four are played inside the
   roast and the jury that already run; Engineering reviews the code after the gate. The spec ends
   with their `## Council` sign-off.

## Start every run

1. **Mode.** Pick one from the request and the project. If unsure, state your reading in one line
   and continue.

   | Mode | When | File |
   | --- | --- | --- |
   | `create` | A new page | `modes/create.md` |
   | `site` | Several pages, or a stepped flow (sign-up, checkout, onboarding) | `modes/site.md` |
   | `section` | One section or component in an existing design | `modes/section.md` |
   | `review` | "Review", "audit", "why does this look off" (no code changes) | `modes/improve.md` |
   | `restyle` | Improve the look, keep the layout | `modes/improve.md` |
   | `redesign` | Rebuild the structure, keep content, stack and behaviour | `modes/improve.md` |
   | `brand` | A brand kit (elements, colours, type, shape, motion, a placeholder wordmark) shown on a board, before or without a page | `modes/brand.md` |

   Add `modes/app-screen.md` on top when the screen is worked in (dashboard, admin, settings,
   inbox, editor) rather than read. An admin panel, dashboard or back office with no agreed design
   system or component library is built with shadcn/ui (React + Tailwind) until the user approves
   another; tell them why (`rules/stack.md`). At the direction step ask whether the user wants
   to see 2–3 style variations (sidebar, modal, …) so the panel does not look generic; they pick
   from `adminoptions.mjs`'s page, or trust the AI (`admin/method.md`). A screen that lists
   records (three rows or more) follows the data-table rules of `admin/table.md`: right-aligned
   numbers, a bulk-action bar on selection, sticky identifier and actions on wide tables, and the
   rest, each with its reason and when not.

2. **Effort.** `quick` for a section or a small fix, `standard` for a page (default), `thorough` for a
   pitch, a flagship page or a whole site (best-of-3 on every key section). Subagent budget per run
   (measure and log the real number in the deliver report):

   | Effort | Subagents | Budget |
   | --- | --- | --- |
   | quick | one critic (the five heads played by the main session, not independent) | about 70k |
   | standard | reason roaster + 2 combined jurors + 1 verifier per later round + 1 engineering reviewer | about 320-430k |
   | thorough | 4 head roasters + reason roaster + hero jury (2) + full look panel (5-6, grouped by head) + 1 engineering reviewer + 2 per later round | about 850k-1.15M |

   Measured parts: reason roaster 93k (WO run-2 page, 67 elements, 9 calls); jurors 59-94k each.
   **Not measured yet (estimates):** the engineering reviewer about 70-110k (53k fixed overhead plus
   the source files of one page); each extra head roaster at thorough about 60-80k (overhead plus
   brief, research and strategy). Measure both on the next real run and replace these numbers.
   The main session comes on top. Run 2 (standard, before these limits) spent about 630k on
   subagents alone; most of it was two five-juror panels.
3. **Gate style.** `guided` (default): three direction cards. `quick`: one recommendation with a
   one-line reason and "continue?", for people who do not want to choose, or who have said
   "terserah" / "up to you". `autopilot`: no human in the loop (batch runs, evals); every choice is
   logged with its reason. Check `designers/<name>.md` for a saved preference.
4. **Guide, then let the user choose early.** Before research, help the user say what they want
   in one short message (`rules/brief-interview.md`): who and what for, the product behind it (vision,
   outcome, the one metric, what is in and out of scope: the Head of Product's question,
   `rubric/council.md`), 1–3 sites they like and 1
   they do not (turned into dials by `dials.mjs`), three feeling words, what exists (photos, product
   UI, brand assets: `rules/brief-interview.md` → Materials), what is ruled out. With no photos,
   ask whether stand-in pictures are needed and offer the three paths (pasted Unsplash links, search
   with the user's free Access Key, drawn or placeholders). When no image tool is connected and no
   photographs are found, say at once that the pictures will be drawn or dummies. At the direction gate the user picks from first-screen sketches of each direction; that
   choice sets the composition, so standard effort needs no hero best-of-3. Full-page variants (2–3 whole
   pages, `--variants`) are for thorough effort or when the user asks; the user chooses on
   `compare.mjs` (`--choose user`), the jury only in autopilot.
5. Run `node <skill>/scripts/progress.mjs init --mode <mode> --effort <effort> --gates <style> [--variants N --choose user|jury]`.
6. Read `team/taste.md`, the brand file (`brands/<client>.md`, or `.design/brand.md` in the
   project) if one exists, `designers/<name>.md` if the user is named, and `rules/precedence.md`.
7. Open the mode file and follow it step by step.

## Rules for every step

- Before a step run `progress.mjs check <step>`; after it run `progress.mjs done <step>`. When the
  script refuses, do what the message says. Never edit `.design/progress.json` by hand.
- **Gates.** Show the gate (formats below), then stop and wait for the user's answer. Run
  `progress.mjs approve <gate> --note "<the user's words>"` only after an explicit reply. Never
  approve for the user unless the run was started with `--gates autopilot`.
- Sample content may fill gaps the brief leaves (dish names, room rates); mark it `[SAMPLE]` in
  `.design/copy.md` and list it in the final report. Proof (quotes, logos, numbers about customers)
  is never sampled: leave the section out or ask for the real thing.
- References follow `rules/copyright.md`: at least three sources, one role each, no assets copied.
- When two rules conflict, `rules/precedence.md` decides. Name the conflict in the report.
- In a long session, re-read `.design/spec.md` before building each section.
- Do not report a check you did not run. If the browser or a subagent is unavailable, say so.
- **Explain every key decision** with its UX reason, its trade-off (when it would be wrong) and a
  source where there is one, in neutral words ("most guidance recommends … because …; an exception
  is …"), so the user can defend the design next to another AI's (`rules/rationale.md`).

## Gate formats

**Brief gate** (`approve brief`). A card of at most 10 lines: what it is, who it is for and their
situation, the one action, the product part (vision, outcome, the one metric, what is in and out of
scope: `rubric/council.md`), the real content and assets that exist (the `## Materials` section of
the brief: photos, product UI, brand assets, and the plan for what is missing), brand constraints,
what to avoid, and your one-line reading of anything unclear. Ask at most 5 questions, only for facts that
block the work.

**Strategy gate** (`approve strategy`, after the roast). This is where the user first sees the
research. Show, in this order:
1. the research summary: the 3–5 findings that change the design, the category clichés, the
   customer's top questions in their own words, and how many sources were read;
2. the strategy: the action that pays, the customer and their awareness level, the message house
   (promise, three pillars, objections), and the storyline as a list of beats;
3. what the roast changed, and any high-severity point you rejected, with the reason;
4. the open questions for the client and the proof that is missing.

**Direction gate** (`approve direction`).
- *Guided:* three cards from `draw.mjs`, each with the idea sentence, composition in one line, type
  and colour approach, and why it fits this subject. Say which you recommend and why. The user may
  pick one or mix ("type from A, layout from B"); write the mix into the spec.
  Under the cards, the **visual dials** (`rules/visual-dials.md`), each set to your recommendation
  with one reason and what it needs from the client: colour energy, type expression, imagery,
  motion, price. Name team references as presets ("warna seperti Swehl"). Translate vague words
  into dial values and show the translation back. The answer goes to `.design/targets.json`.
- *Quick:* the recommended card only, plus "the other two are in `.design/directions/` if you want
  them". Continue on "ok", "lanjut" or similar.

If the user answers "terserah" or takes the recommendation three times in a row, offer to switch
them to quick gates and, if they agree, write that to `designers/<name>.md`.

**Final gate** (`approve final`). The package from the mode file, written to `.design/deliver.md`:
what was built, screenshots at desktop and phone, what is sample content (`[SAMPLE]` copy, sample UI
marked `data-sample`, drawn or dummy pictures with the shot list), open issues (with the engineering
review's verdict, measured budget and open findings), **"Alasan
desain"**: at least three key decisions, each with its UX reason, trade-off and source, and the
head behind it where that helps (`rules/rationale.md`, `rubric/council.md`), and **"Supaya lebih bagus"**: at most five concrete things the user can do or decide to lift the result (pictures to
supply, with the shot list; real proof to collect; a dial worth turning; a higher effort level; the
signature motion, when the motion spec found no message to move), each with what it would
change.

## When the user changes their mind

Every step depends on the ones before it:
brief → research → strategy → roast → direction → skeleton → spec → copy → build → reason → gate →
look → deliver.

1. Find the earliest decision that changed ("go back to direction B" → `direction`; "the audience is
   students now" → `brief`; "the real problem is price, not fear" → `strategy`).
2. Say the impact in one line before doing anything: what will be redone and what stays.
3. Run `progress.mjs back <step> --reason "<what changed>"`, then redo from that step.
4. Keep earlier work: dealt directions stay in `.design/directions/`, old screenshots in
   `.design/snapshots/`. Never patch a new decision on top of a build made for the old one.

A small change (one colour, one size, one line of copy) is not a turn back: change the token or the
copy, log it with `progress.mjs log`, inspect again.

## When feedback is vague

"Kurang wow", "something's off", "not premium enough": do not guess and repaint the page.
1. Write 2–3 concrete hypotheses ("the hero has no single focal point", "type sizes are too close",
   "the photos are generic").
2. Make small variants of only the affected area (a hero crop A/B/C) and show them side by side.
3. The user picks; write what they picked into the spec as a rule for the rest of the page.

## Learning

At the end ask for one sentence of feedback. Turn it, and anything the user corrected during the
run, into proposed changes to `team/taste.md` (or `designers/<name>.md` for personal taste), shown
as a diff with the source (`project, date, who`). Apply only what the user approves.

## Files

| File | Read when |
| --- | --- |
| `modes/*.md` | The chosen mode, at the start |
| `rules/precedence.md` | At the start |
| `research/method.md` | The research step (every run) |
| `strategy/method.md` | The strategy step: business canvas, customer, message house, storyline |
| `roast/method.md` | The roast step (every run) |
| `rules/objective.md` | Building and fixing: what the inspector measures and the targets |
| `rules/defaults.md` | Writing the spec: the AI defaults to avoid and what to use instead |
| `rules/copyright.md` | Before using any reference |
| `rules/copy-id.md` | Writing copy in Bahasa Indonesia |
| `motion/functions.md` | Writing the motion spec and building motion: the site's message and its one signature motion (or "none found", offered to the user at delivery), the required entrance and state transitions with reduced-motion versions, pause control and budget |
| `copy/method.md`, `copy/words.json` | The copy step: the reader framed first, the voice felt not stated, the glossary, reading experience, the skim and explain-back tests |
| `kit/README.md`, `kit/sections.json` | The build step: which tested section answers which customer question, and the rules for using them |
| `brand/method.md` | The brand mode; the direction step of the design modes (read `.design/brand-kit.json` or write a short kit); a placeholder wordmark when there is no logo |
| `rubric/reason.md` | The reason step: every element of the built page names its job or goes |
| `rubric/critic.md` | Briefing the critic subagent; the critique format every juror uses |
| `rubric/jury.md` | The look step and best-of-N at standard effort and above; judging references |
| `rubric/council.md` | The five heads (Product, Business, Design, Creative, Engineering): what each owns, asks and may veto, where each speaks by effort; the Product question at the brief; the spec's `## Council` sign-off and the starting performance budget; the engineering review after the gate (reviewer brief and `.design/review/engineering.json`) |
| `library/intake.md` | When the team sends references with their notes |
| `rules/brief-interview.md` | Every question to the user (plain words, what it changes, an example per choice, a recommendation, "percayakan ke AI"); the brief step: the one guiding message, the materials (photos, product UI, brand assets; mock or placeholder for missing UI; telling the user about dummy pictures; with no photos, the three stand-in paths and the Unsplash Access Key steps), liked sites into dials, sketches at the direction gate |
| `rules/stack.md` | The brief step: the stack and component library; an admin panel, dashboard or back office defaults to shadcn/ui (React + Tailwind) until the user agrees another |
| `admin/table.md` | Building any screen that lists records (3+ rows): the data-table rules (the owner's nine basics, right-aligned numbers, the bulk-action bar, and research basics such as sticky header, states, density, row actions), each with why, when not, accessibility and dated sources; what the inspector measures |
| `rules/rationale.md` | Every gate and the deliver report: each key decision with its UX reason, its trade-off and a source, neutral; the "Alasan desain" section of `.design/deliver.md` |
| `admin/method.md`, `admin/directions.json` | The direction step of an admin or app screen: the ten style levers (change 3–4, consistently), the style directions from the team's admin references, the variation question, the brand kit overriding a direction, the chosen tokens into the shadcn/ui theme |
| `rules/visual-dials.md` | The direction gate: the dials, presets from the library, how to guide the user |
| `rules/illustration.md` | Writing the spec when the client has no pictures: photographs by the chosen stand-in path, drawing flat illustration, the shot list |
| `library/index.json` (via `library.mjs find`) | The direction step: the team's judged references with their style cards; adapt each to the client or ask (`modes/create.md`) |
| `team/taste.md`, `brands/`, `designers/` | At the start, if present |

## Scripts

| Command | Does |
| --- | --- |
| `progress.mjs init / check / done / approve / back / skip / log / status` | Order of steps, gates, turn back; content checks per step (brief Materials and Product part, spec `## Council` with all five heads, the engineering review with a verdict and no unanswered blocking finding before a standard or thorough look, an admin brief's Component library with the shadcn/ui default logged, an admin direction's style options with a logged choice or decline, spec Interactions and Motion spec, deliver.md with "Alasan desain" (3+ decisions with a trade-off), …) |
| `brandboard.mjs <brand-kit.json or directions.json> [--out .design/brand] [--no-pdf]` | The brand board: palette with roles and contrast pairs, type, shape and motion, elements, the placeholder wordmark, the brand in use (web hero, price card, social post); `board.html` and `board.pdf` |
| `draw.mjs --sector <s> [--tone <t>] [--have a,b] [--options 3]` | Deals directions into `.design/directions/` (`--list sectors`) |
| `inspect.mjs <url or file> [--out dir] [--allow rule]` | Real-browser check at 1440/768/390, screenshots, design inventory; INFO `placeholder-logo` and `sample-ui` (`data-sample`) for the deliver report; data tables (`admin/table.md`): numbers not right-aligned, checkboxes out of line or under 24px, cut values with no way to read them, selection with no bulk actions (clicks a row at desktop), wide tables without sticky identifier/actions |
| `lint.mjs <files or folders>` | Stock copy, placeholders, default styling patterns in source |
| `copycheck.mjs <copy.md or page> [--voice .design/voice.md]` | Reading experience and voice, measured: sentence and paragraph length, headline length, long words, self-praise, corporate abstractions, glossary words the reader does not use, generic buttons; prints the skim test |
| `kit.mjs list` / `get <names> [--out dir]` | Tested sections built from tokens (hero with arch photo, price near the action, evidence rows, reveal cards with a tap path, before/after, sticky story, proof quote, FAQ, closing action): the build's starting floor |
| `elements.mjs <url or file> [--out .design/reason]` | The built page with every element numbered, one picture per section and the phone pages, with hints (decorative, endless motion, repeated, unsourced number, stock copy, emoji, twin cards): the input of the reason roast |
| `evidence.mjs <url or file> --dir <dir>` | Evidence pack for the jury: contact sheets, motion frames, outline, motion, reduced-motion and idle results |
| `digest.mjs <dir>` | `digest.md`: the one short file a juror reads first (outline, motion, inventory, findings, page text) |
| `capture.mjs <list.txt> [--jobs 3]` | Runs inspect, evidence, digest and style for a whole batch in parallel |
| `dials.mjs suggest <liked dirs> [--dislike dirs]` | Sites the user likes and dislikes → suggested dials, with where they agree and what to avoid |
| `adminoptions.mjs [--kit f] [--brief "…"] [--components sidebar,modal,table] [--only ids] [--recommend id --why "…"]` | Admin style options: 2–3 directions from `admin/directions.json` rendered side by side as real components (sidebar, modal, table), labelled A/B/C with their character and reference ids, restyled by the brand kit, with the reply to copy ("Pilih B"); `.design/options/admin-options.html` + `.json` (shadcn/ui variables per option) |
| `compare.mjs <v1.html> <v2.html> … [--labels a,b] [--blind]` | A page for the user to compare variants side by side at desktop or phone width, score them and copy a reply |
| `photos.mjs search "<query>" [--sheet f.png]` / `get <ref or Unsplash link> [--by name --page link]` / `credits` | Licensed photographs of the subject's world (Unsplash with `UNSPLASH_ACCESS_KEY`, Openverse, Wikimedia Commons), downloaded with their credits; a pasted `images.unsplash.com` link loads without a key, credited "photographer unknown" until the name is given |
| `fit.mjs <inspect dir> [--targets .design/targets.json]` | The built page against the chosen dials and the team's taste; misses need a fix or a reason |
| `style.mjs <dir>` | Style card of a captured reference: palette, type, shape, motion, tags, do-not-copy |
| `library.mjs build` / `groups` / `find <words> --tags a,b` | Builds `library/index.json` from judged batches, grouping every reference by sector and by style on its own; finds the closest references with their style |
| `smooth.mjs <url> [--dir d] [--cpu 4]` | Scroll stutter against a plain page on the same machine |
| `jury.mjs score / rank <dir>` | Combines AI and human jurors: blended scores, disagreements, vetoes, best-of-N winner |
