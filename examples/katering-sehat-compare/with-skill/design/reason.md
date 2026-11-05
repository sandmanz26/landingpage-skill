# Reason roast: Dapur Seimbang, katering makan siang ke kantor (round 1)
Roaster: subagent (independent; read only elements.md, the 9 desktop and 4 phone pictures, brief.md, spec.md Sections + Interactions, strategy.md questions) · elements.mjs run time: not given to the roaster

Customer questions used (strategy.md storyline): Q1 Apa ini, buat saya, berapa? · Q2 Isinya apa, kenyang, bukan salad diet? · Q3 Bosan nggak? · Q4 Total seminggu berapa, ada ikatan? · Q5 Gimana mulainya? · Q6 Area, jam antar, libur, bayar?

Not verified (pictures only, no browser): the weekday tabs, the scroll fill of the S03 box, the sticky header, the WhatsApp link targets and pre-filled text, and the answers inside the closed FAQ rows E40–E44.

## Elements
| ID | Element | Job (for whom) | Lost without it | Verdict |
| --- | --- | --- | --- | --- |
| E01 | Wordmark "Dapur Seimbang" with a small mark, top left | orients: whose page this is, back to top | the name; there is no logo anywhere else | keep |
| E02 | Header button "Chat WhatsApp"; on the phone (mobile-01) only a round green icon with no words | moves toward the action from any scroll position (spec: sticky bar) | the action once the hero CTA has scrolled away | fix: on the phone it is icon-only (`no-label` in practice); show "Chat" or "Pesan" next to the icon. On the first screen it duplicates E07; acceptable only because it is sticky |
| E03 | H1 "Makan siang seimbang." | answers Q1, but only the category | the page's first line | fix: any healthy-catering competitor can use these three words. The difference (diantar ke kantor, Jakarta Selatan) is in 16px text in E04. Put "ke kantor" in the H1 |
| E04 | Sub: diantar ke kantor di Jaksel, Senin–Jumat, nasi merah/shirataki, lauk, sayur, buah, menu ganti tiap hari | answers Q1 (for whom, where, when, what) | who, where and which days; the H1 does not say them | keep |
| E05 | "Rp 45.000" | answers Q1 "berapa" | the price on the first screen | keep |
| E06 | "per porsi · langganan mulai 5 hari" | answers Q1/Q4: unit and minimum | the minimum order before the click | keep |
| E07 | Button "Pesan lewat WhatsApp" | the action that pays | the main action on the first screen | keep |
| E08 | Large tilted drawing of the four-part box, cropped right (on the phone below the CTA, cropped) | carries the idea named in the spec (hero box drawing, all four parts) and shows the product as well as it can without photos | the only picture on the first screen | keep |
| E09 | The same box drawing again, upright, beside the four parts | spec signature: the box filling part by part as the rows scroll (desktop) | desktop: the fill animation, if it runs (not verified). Phone: nothing. Per spec it is shown already filled, so mobile-01 shows E08 and E09 back to back as the same picture | merge: on the phone keep one of E08/E09, not both. On desktop it stays only if the scroll fill really happens; a static second copy is a duplicate |
| E10 | H2 "Selalu empat bagian di setiap kotak." | answers Q2 | the section's claim | keep |
| E11 | "Bukan salad diet. Ini makan siang lengkap." | answers the Q2 objection ("sehat = nggak kenyang / salad") | the only direct answer to the objection | keep |
| E12 | Four rows with colour keys: Karbo (nasi merah atau shirataki, "pilih salah satu waktu pesan"), Lauk ("bergantian sepanjang minggu"), Sayur ("Selalu ada sayur di setiap kotak"), Buah ("Buah segar untuk penutup") | answers Q2: what is in the box | the four parts in words | fix: three of the four sublines are empty. "Selalu ada sayur di setiap kotak" repeats E10. "Lauknya bergantian" repeats S04. "Buah segar" is stock. Use real examples (from the sample week: tumis buncis wortel, pepes ikan, pepaya) or drop the sublines |
| E13 | H2 "Isinya ganti tiap hari. Bagiannya tetap." | answers Q3 | the section's claim | keep |
| E14 | "Contoh menu. Menu asli dikirim tiap minggu lewat WhatsApp." | required honesty: the dishes are samples | the label that keeps the sample dishes from passing as real | fix: keep "Contoh menu". "Menu asli dikirim tiap minggu lewat WhatsApp" is a process the brief does not give, so it is invented. Remove it or confirm it with the client |
| E15 | Box drawing for "Senin" (ayam), next to the day list | spec: the box's lauk changes with the selected day | desktop: the lauk change, if it happens (not verified; the still is the same as E08). Phone: nothing, since all five days are listed under a third identical box | merge: this is the third full copy of the same box. Keep it only on desktop and only if the lauk visibly changes per tab; drop it on the phone |
| E16 | Five day rows Senin–Jumat, each with lauk · sayur · buah (sample dishes), Senin highlighted | answers Q3 with a concrete week | the proof that the menu varies | keep (labelled sample by E14; the spec wanted centred tabs, but a list reads better, see Page) |
| E17 | "Karbonya tetap pilihanmu: nasi merah atau shirataki." | none new: the carb choice is already in E04, E12, E34, E36 and E41 | nothing | cut |
| E18 | H2 "Rp 45.000 sekotak. Mulai dari satu minggu." | answers Q4 | the price and the commitment in one line | keep |
| E19 | First of five small box drawings (aria-hidden), the row above the total | spec S4 picture: "five small boxes in a row" = one week, drawn | at most a glance-level "a week is five boxes"; E29 already says "5 hari × Rp 45.000" | fix: this is box copies four to eight on one page, five decorative images, with day labels too small to read on the phone. Make the row one picture with a text alternative ("5 kotak, Senin–Jumat"), or cut the whole row if it cannot say more than E29 |
| E20 | Label "Sen" under box 1 | part of the E19 row | nothing on its own (the days are named in S04) | merge into E19 |
| E21 | Small box 2 (decorative) | part of the E19 row | nothing on its own | merge into E19 |
| E22 | Label "Sel" | part of the E19 row | nothing on its own | merge into E19 |
| E23 | Small box 3 (decorative) | part of the E19 row | nothing on its own | merge into E19 |
| E24 | Label "Rab" | part of the E19 row | nothing on its own | merge into E19 |
| E25 | Small box 4 (decorative) | part of the E19 row | nothing on its own | merge into E19 |
| E26 | Label "Kam" | part of the E19 row | nothing on its own | merge into E19 |
| E27 | Small box 5 (decorative) | part of the E19 row | nothing on its own | merge into E19 |
| E28 | Label "Jum" | part of the E19 row | nothing on its own | merge into E19 |
| E29 | "Rp 225.000 / 5 hari × Rp 45.000" | answers Q4: the weekly total and its arithmetic | the number the customer actually pays | keep |
| E30 | Inclusions: one box per working day; karbo, lauk, sayur, buah; delivered to the office Mon–Fri | answers Q4 "what is included" | what the Rp 225.000 buys | keep |
| E31 | "Tidak perlu antre atau pilih menu tiap siang. Tidak ada paket bulanan wajib." | answers Q4 "ada ikatan?" (second sentence) | the no-lock-in answer | keep (the second sentence does the job; consider leading with it) |
| E32 | Button "Pesan 5 hari lewat WhatsApp" | the action, at the point where the price is known | the action right after the price | keep |
| E33 | H2 "Mulai langganan lewat satu chat." | answers Q5 | the section's claim | keep |
| E34 | Three numbered steps: Buka WhatsApp / Lengkapi empat hal / Tunggu balasan | answers Q5 and the "ribet pesannya" objection | how ordering works | keep |
| E35 | Label "Pesan yang terkirim:" | orients: names the bubble below | the cue that the bubble is the message itself | fix: wrong tense; nothing has been sent yet. Use "Pesan yang akan terkirim:" |
| E36 | Message bubble: "Halo Dapur Seimbang, saya mau langganan… Nama: / Alamat kantor: / Mulai tanggal: / Nasi merah atau shirataki:" | proves the Q5 claim (the pre-filled message) | the concrete "this is all you send" | keep |
| E37 | Button "Kirim pesan ini lewat WhatsApp" | the action, tied to the template | the action at the point of least doubt | keep |
| E38 | H2 "Soal jam antar, area, dan bayar." | orients: says what the FAQ covers (Q6) | the FAQ's label | keep |
| E39 | FAQ open: "Jam berapa makan siangnya sampai?" → depends on the route, ask on chat | answers Q6 honestly (the client has not given hours) | the answer to the first worry of an office worker | keep (a deferral, not an answer: launch blocker 1 in the brief) |
| E40 | FAQ "Kantor mana saja yang bisa diantar?" | answers Q6 (area) | the area question | keep (answer not visible; must not invent coverage) |
| E41 | FAQ "Boleh pilih nasi merah atau shirataki?" | none new: the sixth mention of the carb choice (E04, E12, E17, E34, E36) | nothing, unless the answer adds per-day choice or vegetarian/no-fish, which the brief says is not known | merge: drop the row; fold any new fact (per day or per subscription) into E12 |
| E42 | FAQ "Minimal pesan berapa hari?" | none new: already answered by E06, E18, E29 and E32 | nothing | merge: drop the row; S05 answers it |
| E43 | FAQ "Kalau aku cuti atau kerja dari rumah?" | answers a real Q6 question (libur/WFH) not asked anywhere else | the skip/shift rule | keep (answer not visible; the rule is still open with the client, so it must not be invented) |
| E44 | FAQ "Bayarnya bagaimana?" | answers Q6 (payment) | the payment question | keep (answer not visible; open with the client) |
| E45 | Closing H2 "Lima hari makan siang, satu chat." | moves toward the action; sums up the offer | the closing push | keep (it echoes E33 "satu chat"; acceptable) |
| E46 | "Chat langsung dengan Dapur Seimbang. Kirim nama dan alamat kantormu, kami balas jadwal antarnya." | moves toward the action: what happens next (spec S7) | the expectation after the tap | keep |
| E47 | Button "Chat 0812-3456-7890" | the action that pays, with the real number | the last action on the page | keep |
| E48 | Text "WhatsApp +62 812-3456-7890" directly under E47 | none new: the same number is on the button above | nothing; the number is visible on E47 | merge into E47 |
| E49 | Footer: name · area · WhatsApp number | required/orients: the business line | who and where, at the end | keep |
| E50 | "Gambar di halaman ini ilustrasi, bukan foto menu." | required: the brief forbids passing pictures off as the real food | the honesty note | keep |

Counts: keep 29 · fix 6 (E02, E03, E12, E14, E19, E35) · merge 14 (E09, E15, E20–E28, E41, E42, E48) · cut 1 (E17)

## Page
**First screen.** Desktop: E01, E02, E03, E04, E05, E06, E07, E08. Phone (mobile-01): E01, E02 (icon only), E03–E07, top of E08. Each answers Q1 or moves to the action. E02 and E07 go to the same place in one screen; acceptable only because E02 is the sticky bar for later scrolling, but on the phone it needs a word. The H1 (E03) carries the least information of anything in the first screen.

**Order.** Hero (what, price) → four parts (what is in it) → week (bored?) → price for the week → how to start → FAQ → close → footer. Each section answers the question the previous one raises, matching the strategy storyline. No section is there purely by habit. S08 (close) restates S06 one screen later, but the spec gives it a job (what happens next).

**Spec against page.** Missing or not visible: the S7 "four-part motif as a band edge" (S08 is a flat yellow field in desktop-S08 and on the phone; maybe a pseudo-element that did not render; check it or drop it from the spec). The S3 "tabs, centred": the page shows a left-aligned day list beside the box. On the phone all five days are listed, so whether the tabs work at all is not verified. The S2 box fill on scroll: not verifiable from stills. On the page but not in the spec: E14's "menu asli dikirim tiap minggu" promise (invented, fix), E48 (second number line, merge), E35 (label, fine).

**The same job twice.** (1) The four-part box is drawn 8 times (E08, E09, E15, E19–E27). On the phone the first three appear within about two screens, which dilutes the signature into wallpaper. (2) The carb choice is stated 6 times (E04, E12, E17, E34, E36, E41). (3) "Minimum 5 days" is stated 5 times (E06, E18, E29, E32, E42). (4) The WhatsApp number appears in E34, E47, E48 and E49. The FAQ rows E41 and E42 repeat the body of the page; the FAQ should carry only what the page does not answer (hours, area, leave/WFH, payment).

## Response
- **E02 fix:** on the phone the header button now reads "Chat" beside the icon (≤420px); "Chat WhatsApp" above that. Checked in the browser at 390px: innerText "Chat".
- **E03 fix:** H1 is now "Makan siang seimbang ke kantormu.", so the difference (delivered to the office) is in the headline. It runs 3 lines at 1440 and at 390 (the inspector allows 3; 2 lines would need a smaller size than the ×6 dial, or dropping "seimbang").
- **E12 fix:** the sublines now give examples from the sample week: "Contohnya ayam panggang bumbu kuning atau pepes ikan.", "Contohnya tumis buncis wortel atau sayur bening bayam.", "Contohnya pepaya, semangka, atau buah naga." All three are marked [SAMPLE] in copy.md. The karbo line "Pilih salah satu waktu pesan." stays because it says how the choice is made.
- **E14 fix:** "Menu asli dikirim tiap minggu lewat WhatsApp" was an invented process and is removed. The line now reads "Contoh menu satu minggu. Menu aslinya bisa berbeda."
- **E17 cut:** "Karbonya tetap pilihanmu…" is removed from the page and from copy.md.
- **E19 fix + E20, E21, E22, E23, E24, E25, E26, E27, E28 merge:** the five decorative mini boxes and five day labels are now one SVG picture (role=img, "Lima kotak makan siang, satu untuk tiap hari Senin sampai Jumat") with one caption: "Senin sampai Jumat: lima kotak". It stays because it carries the spec's signature (the box as the price unit, five = the minimum week) next to E29.
- **E35 fix:** the label now reads "Pesan yang akan terkirim:".
- **E09 merge:** on the phone the story box is gone; the hero box (E08) shows the same picture one screen earlier. On desktop it stays because the fill happens. Verified in Playwright at 1440: with the section at the top, data-on=1 and the buah part has opacity 0.18; with row 4 centred, data-on=4 and opacity 1. I fixed one bug here: the first version filled all four parts at once. The fill is now driven by row positions.
- **E15 merge:** on the phone the week box is gone and all five days are listed as text. On desktop it stays because the lauk changes: clicking Selasa set data-lauk=ikan, the fish drawing's opacity to 1 and the aria-label to "Kotak hari Selasa: Pepes ikan, Sayur bening bayam, Semangka" (verified in Playwright).
- **E41 merge:** the FAQ row "Boleh pilih nasi merah atau shirataki?" is removed; E12's karbo line already says to choose when ordering. Choosing per day vs. per subscription stays a client question.
- **E42 merge:** the FAQ row "Minimal pesan berapa hari?" is removed; S05 answers it (E18, E29, E31).
- **E48 merge:** the line "WhatsApp +62 812-3456-7890" under E47 is removed; the button carries the number, and so does the footer.
- **Page notes:** the S7 "motif band" from the spec was never built and is dropped from the spec (no job). Spec S3 is changed from "tabs, centred" to the day list the roaster preferred. The carb choice and the 5-day minimum are now stated fewer times: E17, E41 and E42 are gone.
