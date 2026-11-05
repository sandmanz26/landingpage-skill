# Skeleton notes (2026-11-05)
Inspected `.design/skeleton.html` → `.design/skeleton/` (desktop, tablet, mobile).

Found and fixed in the skeleton:
- H1 "Makan siang seimbang, diantar ke kantor." ran to 5 lines at desktop in a half-width column and 4 on phone (FAIL headline-lines). → H1 shortened to "Makan siang seimbang." (2 lines phone, 1–2 desktop); delivery, area and days move to the supporting sentence.
- Header button wrapped to two lines on phone → shortened to "WhatsApp" (the hero button carries the full label).
- Hero, Isi kotak and Seminggu were all "split" with the box at one side: same composition three times. → Seminggu recomposed as centred tabs over one box ("tabs"); Isi kotak becomes a sticky story (box sticky, four rows scroll).
- Footer text at the screen edge on phone (WARN): footer gets the wrapper padding in the build.

Compositions per section: hero = split (headline + giant cropped box) · isi kotak = sticky story · seminggu = tabs (centred) · harga = statement (big arithmetic) · cara pesan = three-step row · tanya jawab = list (accordion) · penutup = full-bleed colour field. No word twice in a row; "list"-like twice at most.
Rhythm: section gap 140px desktop / 72px phone, larger than any internal gap (max 48px). Dense: FAQ and steps. Airy: harga statement and penutup.
Phone: hero box moves below the action and is cropped to a shorter band so the price and button stay in the first screen; sticky story turns into a static box above the four rows (no sticky on phone); tabs stay one row of five (Sen…Jum fit at 390px).
Extreme content: longest H2 "Isinya ganti tiap hari. Bagiannya tetap." fits 2 lines at phone; FAQ has 5 items (tested); missing picture = the box is drawn in code, so it cannot be missing.
