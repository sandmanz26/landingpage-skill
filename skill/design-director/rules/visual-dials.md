# Visual dials

At the direction gate the user steers the look with a few dials instead of vague words. Each dial
has plain choices, a number the build must hit, and what the choice needs from the client. The
chosen values go to `.design/targets.json`; `fit.mjs` checks the built page against them, and the
critic reads the result. When the user does not choose (quick gate style, "terserah", autopilot),
the team's taste is the target: `team/visual-defaults.json`.

## The dials

| Dial | Choices (say them to the user like this) | Target in `targets.json` | Needs from the client |
| --- | --- | --- | --- |
| Colour energy | **Kalem**: 2–3 warna, tenang · **Berani**: 4–6 warna datar, satu warna khusus untuk tombol utama | `"colour": "calm"` / `"bold"` | Brand colours, if any |
| Type expression | **Tenang**: judul sekitar 4× teks · **Tegas**: sekitar 6× (Swehl, Future) · **Ekspresif**: 10× ke atas, huruf jadi gambar (Maxima) | `"typeRatio": 4` / `6` / `10` | A display-font licence if the brand has one |
| Imagery | **Foto asli** · **Ilustrasi datar dari subjeknya** · **UI produk** · **Tipografi saja** | `"imagery": "photo"` / `"illustration"` / `"ui"` / `"type"` | Photos (with a shot list, below) or nothing: illustration is drawn in code (`rules/illustration.md`) |
| Motion | **Diam** · **Halus**: muncul dan transisi ringan · **Cerita lewat scroll**: objek bergerak mengikuti scroll, selalu dengan versi statis | `"motion": "none"` / `"subtle"` / `"story"` | Nothing; story motion costs build time and phone performance |
| Price | Next to the main action, or not (only when the business cannot show one) | `"priceNearAction": true` / `false` | The real price |

Write `.design/targets.json` with the chosen values and, for each, the user's words:

```json
{ "colour": "bold", "typeRatio": 6, "imagery": "illustration", "motion": "story",
  "priceNearAction": true,
  "said": { "colour": "warnanya seperti Swehl", "typeRatio": "hurufnya seperti Maxima tapi lebih tenang" } }
```

## Presets from the team library

Name references the user knows; their numbers come from the style cards (`library.mjs find`).
Rebuild the dial values in the client's own fonts and colours; never copy the reference
(`rules/copyright.md`).

| Like | Colour | Type | Imagery | Motion | Watch out |
| --- | --- | --- | --- | --- | --- |
| Maxima | bold, 8 flat colours | ×24, rounded display | flat illustration | story (GSAP) | no reduced-motion path, contrast fails: never copy |
| Swehl | bold, 6 flat colours, one ink | ×6.3 | product photography | CSS curtain (sticky panels) | pop-up over the hero, yellow-on-tan contrast |
| Future | calm, monochrome so photos carry colour | ×6.3, thin serif display | real member photography | subtle | endless card strip without pause |
| Scotch | calm, dark | ×4 | real product UI | subtle | ignores reduced motion |
| Resolute | many colours, gradients, glass | ×4.4 | 3D and stock | story, very heavy | two vetoes: do not use as a preset |

## How to guide the user

Show the dials as part of the direction gate (SKILL.md), already set to a recommendation with one
reason each, so a user who does not want to choose can say "lanjut". Name what each choice costs:
"Foto asli butuh 6–10 foto dari klien; kalau belum ada, ilustrasi datar bisa dibuat sekarang."
When the user's words are vague ("lebih mewah", "lebih modern"), translate them into dial values
and show the translation back: "Lebih mewah = warna kalem, huruf ×6 serif tipis, foto. Betul?"
