# Admin style: same structure, a different style (owner, 2026-11-09)

Admin panels and SaaS screens are more uniform than landing pages: the same sidebar, the same
dialog, the same table. Built straight from shadcn/ui defaults they look like every other panel.
This module is the one home for how an admin or app screen (`modes/app-screen.md`) gets a style of
its own: the ten style levers, the directions drawn from the team's admin references
(`admin/directions.json`, from `data/admin-patterns/`), the variation question, and the options page
the user picks from (`scripts/adminoptions.mjs`).

**The structure stays, the style changes.** Components, behaviour, keyboard and ARIA come from
shadcn/ui (`rules/stack.md`); a direction only changes tokens (the CSS variables of the Tailwind
theme) and a few small details.

## 1. The ten levers

| # | Lever | What it changes | Example from the references |
| --- | --- | --- | --- |
| 1 | **Surface** | The ground of panels: white, tinted, dark layers, glass | sb-003 dark layers; md-005 glass on near-black |
| 2 | **Active state** | How the current item shows: grey pill, lighter layer with an accent bar, glass pill, underline | sb-002 grey pill; sb-003 lighter layer |
| 3 | **Primary colour** | The one colour for the main action and the active mark | md-001 dark navy primary; owner on sb-003: "needs a primary colour to feel alive" |
| 4 | **Icons** | Outline or filled, stroke, muted or accent on the active item | sb-001 thin outline icons |
| 5 | **Typography** | Weight and size of titles, group labels (plain or small caps), tracking, tabular numbers | md-005 light, large, numbers in white |
| 6 | **Radius and shape** | Corners of the surface, controls and buttons; pills | sb-004 and md-001 very large corners; md-005 pill button |
| 7 | **Density and rhythm** | Row height, padding, gaps between groups | sb-001 airy groups; sb-003 tight rows |
| 8 | **Depth** | Shadow, floating cards on a canvas, glow, borders instead of shadow | sb-002 floating cards; md-005 warm glow |
| 9 | **Small details** | Shortcut hints, badges, subtitles, dividers, segmented controls, indent guides | sb-001 ⌘ hints; md-001 subtitle and wide primary |
| 10 | **Motion** | Hover and active transitions, how a dialog opens, always with a reduced-motion version (`motion/functions.md`) | (concept shots: motion not shown; written per direction) |

**Change 3–4 levers, consistently; not all ten.** A direction that changes everything is a new
design system, not a style, and loses shadcn/ui's tested defaults. Pick the 3–4 levers that carry
the character, apply each one the same way on every component (the sidebar's radius is the
dialog's radius), and leave the rest at the baseline. Each direction in `directions.json` names its
levers.

## 2. The directions

`admin/directions.json` holds the directions, each with its character in one line, when it fits
and when not, the levers it changes, the tokens (surface, inset, border, text, muted, accent,
primary, active state, icons, type, radius, density, shadow, glass, details, motion) and the
reference ids it comes from:

| Direction | Levers | From |
| --- | --- | --- |
| `soft-floating` Lembut melayang | shape, depth, primary, details | sb-001, sb-002, sb-004, md-001 |
| `dark-layered` Gelap berlapis, satu aksen | surface, active, primary, icons | sb-003 + the owner's note that it needs a primary colour |
| `glass-dark` Kaca gelap, cahaya hangat | surface, depth, shape, type | md-005 (fintech, tech) |

A new direction is added only from references with notes (`data/admin-patterns/`), with its
levers (3–4) and ids; accents are stand-ins until the brand sets them. Never copy a reference's
logo, icons or text (`rules/copyright.md`).

## 3. The brand kit wins

When `.design/brand-kit.json` exists (a `brand` run, `modes/brand.md`), its colours and shape
override a direction's: the `action` colour (else `signature`) becomes the accent and the primary,
`ink` the text and `ground` the canvas on light directions, `radii.large` the surface radius and
`radii.small` the controls (pills become the brand's radius), and the kit's fonts replace the system
face. The direction keeps its other levers (dark layers, glass, depth, density). `adminoptions.mjs`
applies this and says so on each option.

## 4. The variation question (direction step)

Asked at the direction step of every admin or app-screen run with guided gates, in the four-part
form (`rules/brief-interview.md` → How every question is asked):

> Panel admin biasanya mirip satu sama lain. Mau saya tunjukkan 2–3 variasi gaya dulu supaya
> hasilnya tidak terlihat generik? Ini menentukan tampilan sidebar, dialog dan tombol (strukturnya
> tetap sama, yang berubah warna permukaan, sudut, item aktif, dan bayangan). Contoh: **A** lembut
> melayang, kartu putih bersudut besar di atas latar abu muda; **B** gelap berlapis dengan
> satu warna aksen, seperti Linear; **C** kaca gelap dengan cahaya hangat, cocok untuk fintech.
> Rekomendasi: lihat variasinya (sekitar satu halaman, Anda cukup balas "Pilih B"), karena gaya
> panel lebih mudah dipilih dari gambar. Atau percayakan ke AI.

- **Ya:** `node <skill>/scripts/adminoptions.mjs [--kit .design/brand-kit.json] [--brief "<one
  line>"] [--components sidebar,modal,table] [--recommend <id>]` writes
  `.design/options/admin-options.html` (A/B/C side by side for every component the request needs:
  always the sidebar and a modal; a table when the screen lists records). Show it; the user copies
  the reply ("Pilih B", or a mix: "Pilih B, modal dari A"). Log it:
  `progress.mjs log "admin-style: B dark-layered (user: Pilih B)" --step direction --by user`.
- **Percayakan ke AI:** pick the direction whose "fits" matches the brief (sector, users, how long
  they work in it, density of data), render the page anyway so the user sees it, and say why in
  one line. Log `admin-style: <letter> <id> (percayakan ke AI: <reason>)`.
- **Tidak:** keep the shadcn/ui baseline restyled by the brand kit only. Log
  `admin-variations declined: <the user's words>`.

Quick gates: recommend one direction with its one-line reason and offer the page ("mau lihat
variasinya?"). Autopilot: the AI picks and logs `admin-style: … (autopilot: <reason>)`.

`progress.mjs done direction` refuses an admin run (the brief's `What:` line, as in
`rules/stack.md`) with guided gates until `.design/options/admin-options.html` exists with a logged
`admin-style:` choice, or `admin-variations declined` is logged. In an admin run the options page
also counts as the pictures the user chose from (the first-screen sketches rule).

## 5. Into the build

Write the chosen direction into `.design/spec.md` as tokens: `adminoptions.mjs` also writes
`.design/options/admin-options.json` with each option's shadcn/ui CSS variables (`--background`,
`--card`, `--primary`, `--radius`, `--sidebar-*`, …). Copy the chosen block into the theme; a mix
takes each lever from one direction and says which. Every component then uses the same tokens; a
lever that is not in the chosen direction stays at the shadcn/ui default.
