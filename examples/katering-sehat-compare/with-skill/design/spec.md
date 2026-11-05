# Spec: Dapur Seimbang (v2: reason roast applied)
Idea: On this page, **the Dapur Seimbang box split into four parts (karbo · lauk · sayur · buah)** becomes **the one motif: a box whose four compartments stay fixed while the filling changes with each weekday; it is the hero shape, the colour system, the price unit and the week (5 boxes = the minimum order)**.
Direction: A one-motif (deal seed 971124372). No mix.

## Decisions
| Decision | Choice | Value |
| --- | --- | --- |
| Type personality | warm, slightly quirky grotesk display (food-friendly, not clinical) + plain readable text face | headings Bricolage Grotesque 700 (Google Fonts), body Figtree 400/600 (Google Fonts) |
| Type hierarchy | ratio about ×6 (team default) | H1 clamp(52px, 7.4vw, 108px) · price figure clamp(44px, 6vw, 84px) · H2 clamp(34px, 4.2vw, 60px) · H3 clamp(21px, 1.7vw, 25px) · body 18px · small 16px (nothing below 16px) |
| Colour | bold flat, one colour per box part, one reserved for the action | ground #F3F4EF (cool pale, not cream) · ink #17241C · karbo #8E2F3C (beras merah) · lauk #F2B829 (kunyit) · sayur #6FAE45 · buah #E04F7A (buah naga) · action #0F5132 (deep green, used only for the WhatsApp action) |
| Layout | 12-col feel, one wrap | wrap 1200px, side margin clamp(16px, 5vw, 64px) |
| Density | alternate | section gap 136px desktop / 72px phone; FAQ and steps dense, harga and penutup airy |
| Hero | split: headline + price + action left; the giant box cropped by the right edge | box ≈ 64vh, enters from the right; on phone a cropped band under the action |
| Imagery | drawn (no photos exist, photo search blocked) | inline SVG flat drawings of the box and its food; one drawing system (below) |
| Shape | two radii | 32px boxes/cards, 999px controls; the motif's compartments use 18px inner radius (part of the drawing, not UI) |
| Depth | flat; one hard offset shadow on buttons (press) | 0 4px 0 ink on the action; no soft shadows |
| Motion | feedback, orientation, one story | see motion spec |
| Copy voice | warm, practical, like a good neighbour who cooks — not a diet coach | headline ≤ 32 characters, sapaan per voice.md |
| Signature move | the box filling its four parts while you read them (sticky story) and the five-box week | |

AI defaults checked (`rules/defaults.md`): no purple; no cream+terracotta (ground is cool #F3F4EF; karbo maroon is a part colour, not the accent; the action is deep green); fonts not Inter/system; hero has one action, left-aligned; no eyebrow labels; no icon cards (the four parts are a drawn box with labels, not cards); no emoji; no blobs/glass; no fade-up on every section; no testimonials, no stats, no three pricing columns; footer is name + contact + credits.

## Tokens
:root { --ground:#F3F4EF; --surface:#FFFFFF; --ink:#17241C; --ink-soft:#3E4A42; --line:#D5D9CF; --karbo:#8E2F3C; --lauk:#F2B829; --sayur:#6FAE45; --buah:#E04F7A; --action:#0F5132; --on-action:#FFFFFF; --font-display:"Bricolage Grotesque", "Trebuchet MS", sans-serif; --font-text:"Figtree", "Segoe UI", sans-serif; --step-0:18px; --step-s:16px; --step-1:clamp(21px,1.7vw,25px); --step-2:clamp(34px,4.2vw,60px); --step-3:clamp(44px,6vw,84px); --step-4:clamp(52px,7.4vw,108px); --space-1:8px; --space-2:16px; --space-3:24px; --space-4:40px; --space-5:64px; --space-6:136px; --radius-l:32px; --radius-s:999px; --wrap:1200px; --dur-fast:160ms; --dur-mid:320ms; --ease:cubic-bezier(.16,1,.3,1) }

## Sections (from the storyline)
| # | Customer asks | Answer | Proof | Composition | Content | Picture |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | — | header: name + WhatsApp | real number | slim sticky bar (≤ 64px) | wordmark, "WhatsApp" button | none |
| 1 | Apa ini, buat saya, berapa? | lunch box to offices in Jaksel, Mon–Fri, Rp 45.000 | price, days, area | split; giant box cropped right | H1, sub, price line, action | hero box drawing (all four parts filled) |
| 2 | Isinya apa? kenyang? | always four parts | the drawn box, part by part | sticky story (kit story-sticky, restructured: drawing instead of photo) | 4 rows: karbo (choice), lauk, sayur, buah | the box filling part by part |
| 3 | Bosan nggak? | filling changes daily | Mon–Fri day list (buttons), on-page "Contoh menu" label | list of five days beside the box (v2: changed from centred tabs after the reason roast; the box is desktop-only) | 5 days `[SAMPLE]` dishes | the box with the day's lauk drawn |
| 4 | Seminggu berapa? ikatan? | 5 × Rp 45.000 = Rp 225.000; minimum one week | the arithmetic; one picture of five boxes (v2) | statement (kit price-action, restructured) | price, inclusions (the four parts, antar Senin–Jumat), action | five small boxes in a row |
| 5 | Gimana mulai? | chat, send 4 things, done | the message template | three-step row + message bubble | steps, the pre-filled message | none (the message is the picture) |
| 6 | Area, jam, libur, bayar? | honest answers | — | list (kit faq) | 6 questions | none |
| 7 | Oke, mulai | same action + what happens next | real number | full-bleed colour field (kit closing-action, restructured) | headline, action | none (v2: the motif band was never built and has no job; dropped) |
| 8 | — | footer | — | one line row | name, area, number, "gambar = ilustrasi" note | none |

## References and their roles
| Decision | From | Their style (style card) | Mapped to this client / asked |
| --- | --- | --- | --- |
| Colour chapters: one flat colour per pillar, one ink | Swehl ref-0007 | flat, many colours, one ink | one colour per box part (karbo/lauk/sayur/buah), used as fills in the drawing, the row markers and the price boxes; ink #17241C for all text (autopilot: adapted without asking) |
| Swap that shows what you get | Quite Nice ref-0013 | packet → finished bowl on hover, no tap path (gap) | weekday tab swaps the box's lauk drawing and the menu text; tap and keyboard first (fixes their phone gap) |
| Palette from the subject's materials; buttons that press | Summer Smash ref-0009 | optic yellow/court green; hard offset shadow pills | colours from beras merah, kunyit, sayur, buah naga; the action pill presses 4px on hover/active |
Do not copy: their missing alts, contrast failures, hidden content, endless motion, ignored reduced motion. Logo-swap test: none of the three would be recognised here (no arch, no ribbon, no product photography).

## Interactions
| Element | Visitor does | They see or get | Purpose: the customer question it answers | Phone and keyboard |
| --- | --- | --- | --- | --- |
| Weekday tabs (Sen–Jum) | taps/clicks a day | that day's lauk, sayur, buah in text, and the box drawing's lauk changes (ayam / ikan / tahu tempe) | "Bosan nggak? Menunya apa aja?" | buttons with role=tab, arrow keys move, Enter/Space select; without JS all five days are listed |
| FAQ rows | opens a question | the answer | area, jam antar, libur, bayar | native details/summary |
| WhatsApp buttons | taps | WhatsApp opens with the pre-filled template | "Gimana mulai?" | real link, 52px tall |
| Sticky box filling (scroll) | scrolls the four rows | the compartment named in the row fills with its colour and food | "Isinya apa?" | on phone not sticky: box shown filled above the rows; reduced motion: filled, no transition |

## Motion spec
Tokens: --dur-fast 160ms; --dur-mid 320ms; --ease cubic-bezier(.16,1,.3,1)
Feedback: buttons press (translateY 2px, shadow 4px→2px) on hover/active, focus ring 3px ink; tabs change colour 160ms.
Orientation: tab switch cross-fades the menu text and the lauk drawing (opacity 160ms).
Story (one): in section 2 each compartment fills (opacity 0.15 → 1 and scale .9 → 1 on the food shapes) when its row passes the middle of the screen. Default state is filled; the script adds the empty state only when JS runs and motion is allowed, so nothing is hidden without JS.
Page transitions: none. Signature move: the box filling.
Reduced motion: everything filled and visible, no transforms, cross-fades ≤ 160ms removed.

## Imagery plan
Drawing system (rules/illustration.md): flat fills from the five food colours + ink + white, no strokes except 0 (shapes only), corners rounded 18px for compartments, food as simple geometry: rice = many small rounded ovals on karbo; ayam = a drumstick (circle + rounded bar), ikan = a fish (ellipse + triangle tail), tahu tempe = two squares (one with dotted texture); sayur = leaf shapes + bean pods; buah = wedges/slices. All `role="img"` with aria-label, or aria-hidden when decorative repeats.
| Picture | Shows | Source |
| --- | --- | --- |
| Hero box | the four-part lunch box filled | drawn SVG (code) |
| Story box | same box, compartments fill | drawn SVG (code) |
| Week box | box with the day's lauk | drawn SVG (code) |
| Five small boxes | the week = minimum order | drawn SVG (code) |
Never presented as a photo of Dapur Seimbang's food; footer says "Gambar di halaman ini ilustrasi, bukan foto menu."
Shot list for the client (deliver.md): 8 photographs.

## Not on this page
Testimonials, ratings, customer counts, calories/macros, weight-loss words ("diet", "turun berat badan"), delivery times, ongkir claims, competitor prices, stock photos, green-and-white clean-eating look, cream+terracotta, eyebrow labels, icon cards, emoji.

## v2 changes (reason roast round 1)
- Phone: only the hero box is drawn; the story box and the week box are desktop-only (they were copies 2 and 3 within two screens). On the phone the week is a plain list of all five days, so nothing is behind the interaction.
- The five small boxes are now one picture with one text alternative and one caption.
- H1 is now "Makan siang seimbang ke kantormu." (3 lines at 1440 and 390; the inspector allows 3; see the deliver report).
