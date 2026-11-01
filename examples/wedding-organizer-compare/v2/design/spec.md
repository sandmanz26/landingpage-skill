# Spec v3: Jalinan Wedding Organizer (standard effort, direction A "Hari H yang menempel")

Idea: the hours of the wedding day become the scroll. A large clock stays pinned while the crew's
work behind the scenes passes beneath it, one flat illustration per hour. Promise made visible:
"Kalian tinggal hadir."

## Targets (owner's dials, .design/targets.json)
colour calm (3 chromatic or fewer) · type ratio ≥ 6 · imagery illustration · motion story · price near action

## Tokens
- Colour (calm, 3 chromatic): teal #0F4C4A (grounds, headings) · coral #E8613C (the action only, plus one detail per drawing) · butter #F2C14E (light in drawings: sun, lamps; never text) · paper #F7F6F1 · ink #172321 · sage tint #EAF1EE (l ≥ 0.92, not chromatic) · line #C9D3CF
- Text on coral: ink (4.9:1). Paper on teal: 9:1. No paper text on coral.
- Type: Bricolage Grotesque 700-800 for display and the clock (opsz) · Figtree 400/600 body 17px · DM Mono 500 for times and labels. Clock 168px desktop, 56px phone bar; h1 clamp(3rem, 7vw, 6.4rem). Display ÷ body ≥ 6 via the clock and h1.
- Shape: radius 14px for cards and buttons (one radius), no shadows; drawings flat, no gradients.
- Avoid: gold, blush, script, floral frames, cream + serif + terracotta (rules/defaults.md).

## Sections (strategy v3 order, skeleton notes)
1. Hero: H1, sub, CTA + price line, hero drawing (best-of-3, below)
2. Harga dan ke mana uang pergi: 3 slips, 3 stages, norm line, extra, cancel, flow, why (Marwah lesson), help, CTA
3. Cek kami dulu: 6 checks as a checklist
4. Persiapan: H-365 to H+1 table + family line
5. Hari H (the device): full-width heading; two columns on desktop: pinned clock (sticky, JS only) | 6 panels (time label, drawing, one sentence); phone: clock bar sticky under the header; close line "Kalian? Tinggal hadir." + facts + adat line
6. Tanya jawab: details, two open
7. CTA akhir: 3 steps + WhatsApp. Sticky WhatsApp bar on phones after the hero CTA leaves the screen.

## Imagery plan (rules/illustration.md)
| Where | Shows | Source |
| Hero | the venue at dawn: janur arch, rows of chairs, the coordinator with walkie-talkie and clipboard, low sun | drawn in code (SVG) |
| 05.30 | crew member at the venue door with a walkie-talkie | drawn |
| 08.00 | clipboard and covered catering trays | drawn |
| 09.00 | ceremony table with cloth, flowers, two chairs | drawn |
| 11.00 | stage and a short queue of guests | drawn |
| 13.30 | side tent standing, rain lines | drawn |
| 15.00 | car boot with boxes being loaded | drawn |
Shot list for the client: coordinator with HT at a real venue · rundown on a clipboard, hand-marked · crew briefing before guests arrive · decoration being set up · family at the ceremony from behind · team portrait. Real photos replace drawings 05.30, 08.00 and the hero first.

## References and their roles
| Decision | From | Their style (style card) | Mapped to this client / asked |
| Flat drawings from the subject's own objects | Maxima ref-0004 | flat, illustration, many colours | adapted to the calm 3-colour palette (owner chose calm); Maxima's motion not taken (veto) |
| Pinned device built with CSS sticky, no library, nothing hidden without JS | Swehl ref-0007 | css-scroll-device, CLS 0 | the pinned clock; Swehl's pop-up and contrast not taken |
| Price and the money promise right under the first action | Future ref-0006 + team Always rule | restrained colour | price line under the hero CTA |

## Motion spec (motion/functions.md)
- Pinned clock: shows the time of the panel at the centre of the screen (IntersectionObserver); digits cross-fade 200 ms. Reduced motion: switch instantly. Without JS: hidden; panels carry their own times.
- Panel drawings: rise 24 px and fade in once when entering (500 ms ease-out), only with JS and no reduced-motion preference; text is never animated.
- Hero: the sun rises 12 px on load (900 ms). Reduced motion: static.
- Nothing loops; no scroll hijacking; no smooth-scroll library.

## Not on this page
Testimonials, counts, ratings, press logos · promo language · pop-ups · couple photos · gold, blush, script
