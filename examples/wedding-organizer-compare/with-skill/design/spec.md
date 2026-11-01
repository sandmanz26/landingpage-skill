# Spec: Jalinan Wedding Organizer

Idea: the WO's rundown sheet is the object. The hero shows the day's rundown as a paper sheet; the
preparation timeline is set the same way; price slips are pieces of the same stationery.

## Tokens
- Ground: deep venue green #20352D · Paper: #FAFAF6 · Ink (ballpoint blue-black): #1B2340 ·
  Muted ink: #4A5068 · Highlighter: #F2DD6E (marks what matters; also the CTA fill, ink text on it)
- Type: Archivo condensed 800 for headings (printed form headers) · Public Sans for text ·
  IBM Plex Mono for times, H-labels and small labels (the rundown's typed columns)
- Shape: paper sheets with a clipped corner and a dotted perforation; no shadows except one soft
  drop under the hero sheet; radius 2px (paper), pills avoided
- Motion: one moment: the highlighter strokes across two rundown lines on load (500 ms each,
  ease-out). Under prefers-reduced-motion the highlight is simply there. Nothing loops

## Sections (from strategy v2)
| # | Customer asks | Answer | Proof | Composition | Content | Picture |
| 1 | What, for me, what do I do | Hari H berjalan, kalian tinggal hadir | sample rundown | text left, rundown sheet right (stacks on phone) | H1, money subline, CTA + price line | the rundown sheet |
| 2 | Cost, money flow, vendors | 3 services, fee only, 3 stages, final payment H+1 | price slips + flow | 3 slips + flow row | prices [SAMPLE] | none |
| 3 | Real and good? | Cek kami dulu | checklist | checklist sheet | 5 checks | none |
| 4 | What happens when | H-365 → H+1 | timeline | rundown-style table | 7 rows | none |
| 5 | Will the day run | 1 per day, crew, backup | 4 pairs | two-column list | | none |
| 6 | Remaining questions | 7 FAQ | | details/summary | | none |
| 7 | After I tap | 3 steps | | closing band | | none |

## References and their roles
| Decision | From | Their style (style card) | Mapped to this client / asked |
| Colour chapters as quiet grounds | Swehl ref-0007 | flat, 6 colours, one ink | adapted to 2 grounds (green, paper) + one ink; autopilot, not asked |
| Price beside the first action | Future ref-0006 + team rule | restrained colour | the price line under the hero CTA |
| Worry named before the steps | Maxima ref-0004 | flat, expressive type | "Takut WO bodong?" line before the checklist; Maxima's motion not taken (veto) |
| The object idea | direction B (draw.mjs) | | the rundown sheet, not the invitation card |

## Not on this page
Testimonials, client counts, ratings, press logos (no real proof) · promo/bonus language ·
couple photos (none exist) · script fonts, gold, floral frames (category clichés) · pop-ups
