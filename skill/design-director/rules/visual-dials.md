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
| Imagery | **Foto** (milik klien, atau foto berlisensi dari dunia subjeknya) · **Ilustrasi datar dari subjeknya** · **UI produk** · **Tipografi saja** | `"imagery": "photo"` / `"illustration"` / `"ui"` / `"type"` | The client's photos, or none: `photos.mjs` finds licensed ones (Unsplash needs a free key), illustration is drawn in code (`rules/illustration.md`) |
| Motion | **Diam** · **Halus**: muncul dan transisi ringan · **Cerita lewat scroll**: objek bergerak mengikuti scroll, selalu dengan versi statis | `"motion": "none"` / `"subtle"` / `"story"` | Nothing; story motion costs build time and phone performance |
| Layout | **Rapi**: rata dan sejajar, aman · **Tersusun**: satu grid, dilanggar dengan sengaja (ukuran berbeda, bertumpuk) · **Bebas**: kontras ukuran besar, huruf melintasi gambar, bab yang bergerak (Outfit, Indigo) | `"layout": "grid"` / `"composed"` / `"wild"` | More pictures and build time for `wild`; `rules/composition.md` |
| Brand | **Dasar dulu**: warna, huruf, logo sementara · **Kuat**: elemen brand di setiap bagian, bentuk, ilustrasi dan gerak khas (wajib ditanyakan untuk fashion, beauty, produk perempuan, gaya hidup) | `"brand": "basic"` / `"strong"` | For `strong`: the brand kit in full (`brand/method.md`), ideally a `brand` run first |
| Price | Next to the main action, or not (only when the business cannot show one) | `"priceNearAction": true` / `false` | The real price |

Write `.design/targets.json` with the chosen values and, for each, the user's words:

```json
{ "colour": "bold", "typeRatio": 6, "imagery": "illustration", "motion": "story", "layout": "wild", "brand": "strong",
  "priceNearAction": true,
  "said": { "colour": "warnanya seperti Swehl", "typeRatio": "hurufnya seperti Maxima tapi lebih tenang" } }
```

`floor.mjs` reads `layout` and `brand` from `targets.json`: the share of sections that must be
composed (`grid` none, `composed` 40%, `wild` 60%) and that must carry a brand element (`basic`
40%, `strong` 70%).

**Brand-led sectors** (owner, 2026-11-16: "kategori fashion, woman, beauty harus memiliki esensi
branding yang jauh lebih kuat, tapi kita confirm ke user apakah dia mau dengan branding tertentu
atau mau basic dulu"). For fashion, beauty, women's products, lifestyle, food and drink brands and
anything sold on identity, ask the Brand dial as its own question at the brief
(`rules/brief-interview.md`), recommend **Kuat** with **Bebas** layout, and say what it needs.
"Percayakan ke AI" in these sectors means `strong`.

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
| Outfit | calm: paper, ink, one red | large tight grotesk, a statement as large as the column | product photography at three scales | subtle; a counter loader | layout `wild` (scale-scatter); product detail too plain (owner) |
| L'Oiseau Dé | calm: greens, lime, cream | thin wide display over the picture | portrait and product photography | subtle, pinned sections | layout `composed` (checker-fields, stepped-drift); a Framer template |
| Indigo | calm: black, white, one violet | cut-paper lettering as chapter titles | photography, the jewel as a floating object | story, 5 chapters | layout `wild`; a sound gate before the content, 43,000px tall |
| Capitolium | calm: marble cream, slate, gold | engraved capitals and a script word | video and photography in arched windows | story, pinned and sideways chapters | layout `wild`; an entrance screen and a loader before content |

## How to guide the user

Show the dials as part of the direction gate (SKILL.md), already set to a recommendation with one
reason each, so a user who does not want to choose can say "lanjut". Name what each choice costs:
"Foto asli butuh 6–10 foto dari klien; kalau belum ada, ilustrasi datar bisa dibuat sekarang."
When the user's words are vague ("lebih mewah", "lebih modern"), translate them into dial values
and show the translation back: "Lebih mewah = warna kalem, huruf ×6 serif tipis, foto. Betul?"
