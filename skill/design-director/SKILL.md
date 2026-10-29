---
name: design-director
description: >-
  Art direction and a checked build process for web pages that look designed for their subject
  instead of generated: landing pages, marketing and product sites, portfolios, multi-page sites,
  single sections, and improving, restyling, redesigning or reviewing an existing web UI or app
  screen. Use it whenever the user asks to design, build, redesign, restyle, polish, review or audit
  a web page, site, hero, section or dashboard, or says a page looks generic, templated or AI-made.
  It applies the team's taste profile and the client's brand, asks the designer at short gates,
  and checks the result in a real browser. Not for backend work, data pipelines, slides or documents.
---

# Design Director

A model left to itself designs the average of every page it has seen. This skill closes the open
decisions before any code is written, puts the designer's taste in at the two moments that matter
most, and checks the result with a browser and a second pair of eyes instead of trusting the code.

`<skill>` below means this skill's folder. Run scripts from the project root; working files go to
`.design/` there. Scripts need Node 18+ and Playwright with Chromium (`CHROME_PATH` if needed).

## Principles

1. **Decide before you build.** Every decision is written to `.design/` before code. Code only uses
   what the spec says.
2. **The designer chooses; you propose.** Two short gates: the brief and the direction.
3. **The team's taste is data.** `team/taste.md` and the brand file outrank your own preferences.
4. **Never judge from code.** Judge screenshots. The critic is a separate agent that did not build it.
5. **Respect what exists.** In an existing project, change tokens and components, not page overrides.
6. **Never invent proof.** No made-up testimonials, client logos, statistics, awards or press.
7. **Read only what the step needs.** Each step names its files; do not load the whole skill.

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

   Add `modes/app-screen.md` on top when the screen is worked in (dashboard, admin, settings,
   inbox, editor) rather than read.

2. **Effort.** `quick` for a section or a small fix, `standard` for a page (default), `thorough` for a
   pitch, a flagship page or a whole site (best-of-3 on every key section).
3. **Gate style.** `guided` (default): three direction cards. `quick`: one recommendation with a
   one-line reason and "continue?", for people who do not want to choose, or who have said
   "terserah" / "up to you". `autopilot`: no human in the loop (batch runs, evals); every choice is
   logged with its reason. Check `designers/<name>.md` for a saved preference.
4. Run `node <skill>/scripts/progress.mjs init --mode <mode> --effort <effort> --gates <style>`.
5. Read `team/taste.md`, the brand file (`brands/<client>.md`, or `.design/brand.md` in the
   project) if one exists, `designers/<name>.md` if the user is named, and `rules/precedence.md`.
6. Open the mode file and follow it step by step.

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

## Gate formats

**Brief gate** (`approve brief`). A card of at most 10 lines: what it is, who it is for and their
situation, the one action, the real content and assets that exist, brand constraints, what to
avoid, and your one-line reading of anything unclear. Ask at most 5 questions, only for facts that
block the work.

**Direction gate** (`approve direction`).
- *Guided:* three cards from `draw.mjs`, each with the idea sentence, composition in one line, type
  and colour approach, and why it fits this subject. Say which you recommend and why. The user may
  pick one or mix ("type from A, layout from B"); write the mix into the spec.
- *Quick:* the recommended card only, plus "the other two are in `.design/directions/` if you want
  them". Continue on "ok", "lanjut" or similar.

If the user answers "terserah" or takes the recommendation three times in a row, offer to switch
them to quick gates and, if they agree, write that to `designers/<name>.md`.

**Final gate** (`approve final`). The package from the mode file: what was built, screenshots at
desktop and phone, what is sample content, open issues.

## When the user changes their mind

Every step depends on the ones before it:
brief → argument → direction → skeleton → spec → copy → build → gate → look → deliver.

1. Find the earliest decision that changed ("go back to direction B" → `direction`; "the audience is
   students now" → `brief`).
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
| `rules/objective.md` | Building and fixing: what the inspector measures and the targets |
| `rules/defaults.md` | Writing the spec: the AI defaults to avoid and what to use instead |
| `rules/copyright.md` | Before using any reference |
| `rules/copy-id.md` | Writing copy in Bahasa Indonesia |
| `motion/functions.md` | Writing the motion spec and building motion |
| `rubric/critic.md` | Briefing the critic subagent |
| `team/taste.md`, `brands/`, `designers/` | At the start, if present |

## Scripts

| Command | Does |
| --- | --- |
| `progress.mjs init / check / done / approve / back / skip / log / status` | Order of steps, gates, turn back |
| `draw.mjs --sector <s> [--tone <t>] [--have a,b] [--options 3]` | Deals directions into `.design/directions/` (`--list sectors`) |
| `inspect.mjs <url or file> [--out dir] [--allow rule]` | Real-browser check at 1440/768/390, screenshots, design inventory |
| `lint.mjs <files or folders>` | Stock copy, placeholders, default styling patterns in source |
