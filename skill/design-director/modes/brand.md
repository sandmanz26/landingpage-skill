# Mode: brand

A brand kit for a business, before or without a page: the elements, colours, type, shape and motion
that make it recognisable, shown in use. Steps: brief → research → strategy → roast →
brand-directions → kit → deliver → learn. Research, strategy and roast work as in `modes/create.md`
(their checks apply); the method is `brand/method.md`. The logo itself is not made here: a
placeholder wordmark stands in (`brand/method.md` §9).

```bash
node <skill>/scripts/progress.mjs init --mode brand [--gates guided|quick|autopilot]
```

## 1. brief (gate)

Ask in one message, following `rules/brief-interview.md` → "How every question to the user is
asked" (plain words, what it changes, a concrete example per choice, a recommendation, "percayakan
ke AI"); skip what the request already answers:

- **the business**: what it sells, where, the price level;
- **the customer**: who, and the moment they meet the brand;
- **the wanted personality**: three words, each with an example ("hangat: seperti warung keluarga,
  bukan kafe minimalis");
- **existing assets**: logo, colours, signage, packaging, photos, uniforms, or "none";
- **brand references**: 1-3 brands or sites they like. For every reference ask what to take:

  > Dari referensi ini, apa yang mau diambil?
  > A) Rasa keseluruhannya: suasana dan struktur, dibangun ulang dengan aset Anda sendiri, tidak
  > disalin (`rules/copyright.md`) · B) Gayanya saja: warna, bentuk, huruf · C) Satu elemen saja
  > (misalnya lengkungnya) · Rekomendasi: B, supaya brand Anda tetap milik sendiri · Atau
  > percayakan ke AI.

Write `.design/brief.md` (the create format, plus "Personality", "References and what to take").
Show the brief gate, `approve brief`, `done brief`.

## 2. research, 3. strategy, 4. roast (strategy gate)

As in `modes/create.md` steps 2-4. The strategy's subject inventory and message house are the
sources of `brand/method.md` §1.

## 5. brand-directions (direction gate)

Build 2-3 brand directions with `brand/method.md`: for each, the sources (§1), a decision per
element family (§2), one hero element and 2-3 supporting (§3), rules of use (§4) and the UX effect
of each element (§5). Write them as `.design/brand/directions.json` (`{ "directions": [kit, …] }`,
format §10) and render one board:

```bash
node <skill>/scripts/brandboard.mjs .design/brand/directions.json --out .design/brand
```

The board shows each direction in use (a web hero, a price card, a social post) so the user sees
the brand, not a list. Show it with a recommendation and its reason; the user may mix ("warna dari
A, bentuk dari B"). Log the choice, `approve direction --note "..."`, `done brand-directions`
(the script wants `.design/brand/board.html` with at least two directions).

## 6. kit

The chosen direction (or mix) becomes the final kit:

- `.design/brand-kit.md` in the format of `brand/method.md` §8, with the five tests of §6 run on
  the board's applications and recorded under "## Tests";
- `.design/brand-kit.json` (§10): colours with roles, fonts, radii, motion easing and durations,
  the hero element, the supporting elements, the placeholder wordmark when there is no logo.

Render the final board: `brandboard.mjs .design/brand-kit.json --out .design/brand` (writes
`board.html` and `board.pdf`). `done kit` checks the sections and the JSON keys.

## 7. deliver (final gate)

Show: the research report, the kit with its sources and rules of use, the board (`board.pdf`), the
five test results, and **placeholders to replace**: the placeholder wordmark ("ganti dengan logo
dari desainer"), any sample text on the applications. Add "Supaya lebih bagus" (SKILL.md) and
"Alasan desain": the hero element, palette and type choices with their reason and trade-off
(`rules/rationale.md`; checked when `.design/deliver.md` is written). After
the user approves: `approve final`, `done deliver` (needs `.design/brand/board.pdf`).

A later `create` or `site` run in the same project reads `.design/brand-kit.json` at its direction
step instead of inventing elements.

## 8. learn

See SKILL.md.
