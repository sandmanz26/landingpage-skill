# Critique: Dapur Seimbang (look round 1)

Jury: two combined AI jurors (standard effort): `visual-motion` (clarity, distinctiveness, craft) and `business-customer-story` (business, customer, story). They are separate subagents run by the coordinator from the evidence pack only. Human votes: none.
Files: `.design/jury/r1/visual-motion.json`, `.design/jury/r1/business-customer-story.json`, combined with `jury.mjs score .design/jury/r1`.
**Only one look round.** This environment allows one round and no verifier juror, so the fixes below were checked by me (inspector, browser script, screenshots) and **not re-scored by a juror**.

## Scores (round 1, before fixes)
| Criterion | AI | Human | Final |
| --- | --- | --- | --- |
| Business | 7 | – | 7 |
| Customer | 7 | – | 7 |
| Story | 6 | – | 6 |
| Clarity | 8 | – | 8 |
| Distinctiveness | 6 | – | 6 |
| Craft | 6 | – | 6 |
Weighted 6.7. Veto: none. Disagreements: none can show, because each criterion had one juror (spread 0 by construction).

## Top three problems across both jurors (the jurors agreed on these)
1. **The hero box is cut off, so the four parts cannot be read, and the food does not look appetising.** Visual-motion problem 2; business-customer-story problem 2. Before: the box bled off the right edge, rice took half of it, and sayur and buah were slivers.
2. **The daily-changing filling is not visible, especially on the phone.** Visual-motion problem 1. Before: the week box showed the same food as the hero; on the phone there was no box at all.
3. **Below the price section the colour and layout loosen, and the buttons drift.** Visual-motion problem 3. Before: off-white sections with hairlines, the price button low in a right column, the send button floating beside the message.

## What was fixed (round 1 → v3)
1. **New drawing system** (`.design/build/drawing.py`).
   - The whole box is now inside the frame at -4°, on desktop and on the phone (320px, centred).
   - Rice is narrower (150 of 368px); lauk is the largest compartment, with a glazed chicken, kemangi and sambal.
   - Sayur and buah are full compartments with readable food.
2. **Five different days.** Each weekday has its own lauk, sayur and buah drawing: ayam panggang + buncis wortel + pepaya / pepes ikan + bening bayam + semangka / tahu tempe + capcay + melon / ayam suwir + urap + nanas / ikan bakar + kangkung + buah naga.
   - Every day row now carries its own small box, so the change shows on the phone and in still screenshots, with no interaction needed.
   - On desktop the large box is sticky. Pressing a day swaps all three fillings with a short scale settle (removed under reduced motion).
   - Verified in Playwright: clicking Jumat sets data-day=jum, shows the Jumat group, hides Senin, and changes the aria-label to "Kotak hari Jumat: Ikan bakar kecap, Tumis kangkung, Buah naga".
3. **Lower sections keyed to the compartment colours.**
   - Price: a filled karbo panel holds the five boxes and Rp 225.000; a white panel beside it holds the inclusions, with the button directly under them.
   - Steps: the top rules are coloured karbo, lauk and sayur.
   - Message: the preview sits on a filled sayur panel, with the button under one instruction line ("Isi titik-titiknya di WhatsApp, lalu kirim.").
   - On the phone, buttons are full width so their labels do not wrap.
4. **Smaller fixes.**
   - The karbo line now reads "Sebutkan pilihanmu waktu pesan langganan." (business-customer-story found the old line ambiguous).
   - A selector clash between the day buttons and the SVG groups was found and fixed during testing.

After the fixes: lint 0/0; inspect 0 FAIL, 0 WARN at 1440, 768 and 390; layout shift 0.009; copycheck shows no FAIL.

## Not fixed (needs the client, not design)
- **Delivery window and ongkir/area** (business-customer-story problem 1). The page cannot state them without the owner, so they stay in the FAQ as "ask on chat". This is launch blocker 1.
- **No person behind the order** (business-customer-story problem 3). The owner's first name, the kitchen's location and "dimasak pagi ini" would help, but none of them were given, and they cannot be invented.

## Fit
| Target | Result | Decision |
| --- | --- | --- |
| colour: bold | **MISS**: 4 colour families, flat, but `fit.mjs` counts 5 shadows, so "not flat" | **Kept, with a reason.** The 5 "shadows" are hard 0-blur offset edges under the WhatsApp buttons that move on hover and press. That is the press feedback the team's Always rule asks for ("every control gives feedback on hover, press and focus"), taken from the Summer Smash reference. They add no depth or softness. Removing them to pass the metric would remove the feedback. Since v3 the colour is used in filled panels (price, message, closing) as well as in the box. |
| type ×6 | OK ×6.7 | – |
| imagery: illustration | OK, 3+ drawings | Turned away from the team default "photo": the client has no photos, and photos.mjs could not reach Openverse or Commons (no Unsplash key) |
| motion: story | OK | The box fills part by part as you scroll (desktop); the day swap |
| fonts ≤ 2 | OK | Figtree 83% + Bricolage Grotesque 17% |
| price near action | OK | – |

## Kept (both jurors)
- The hero hierarchy: headline, offer line, price and one button in the first screen.
- The drawn box as the single motif.
- Five boxes = Rp 225.000.
- The pre-filled WhatsApp preview.
- Restrained motion that respects reduced motion.
- The honest labels "Contoh menu" and "ilustrasi, bukan foto menu".
