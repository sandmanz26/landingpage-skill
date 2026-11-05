# Roast: Dapur Seimbang (2026-11-05)

**Not independent.** This environment cannot start subagents and the coordinator only runs the
reason roast and the jury. Per `roast/method.md` ("If subagents are unavailable, do it as a separate
step that reads only those files, and say in the report that it was not independent"), this roast
was written by the builder in a separate pass that re-read only brief.md, research.md and
strategy.md. Treat it as weaker than an independent roast.

## Points
| # | Voice | Point | Evidence (research ref or reasoning) | Severity |
| --- | --- | --- | --- | --- |
| 1 | Sceptical customer | The roof promises lunch "sampai di meja kantor" but nobody knows when it arrives. A lunch that lands at 13.30 is useless; the page cannot promise a time it does not have | research #4; brief "My reading" | high |
| 2 | Sceptical customer | Sample dish names in the week view will be read as the real menu; someone orders for "Senin: ayam bakar" and gets something else | strategy pillar 2 relies on `[SAMPLE]` | high |
| 3 | Senior art director | Drawn food rarely looks appetising, and appetite sells lunch. A flat-illustrated box can look like a kids' app or a cheap template; but a stock photo of a bento would be presented as their food | research #6, team taste "photographs as key visual" | high |
| 4 | Competitor's marketer | Any bento caterer can copy "a box with compartments" in a day. The idea leans on a category object | strategy competitor test admits it | medium |
| 5 | Sceptical customer | "Seimbang" is claimed with no nutrition information and nobody named who planned the menu; health-minded readers may not believe it | research #6 missing proof | medium |
| 6 | Competitor's marketer | Diet caterers show calories/macros; this page shows none and may look less serious | research #2 | medium |
| 7 | Owner / the money | Rp 225.000 up front for a kitchen the reader has never tasted is the real barrier; there is no trial | research #1, #5 | medium |
| 8 | Owner / the money | The storyline says "difference first" but has no comparison beat; the reader's real alternative (buying lunch near the office) is never addressed | research #7; strategy storyline table | medium |
| 9 | Senior art director | Breaking the green-and-white cliché invites the other AI default: cream + terracotta "warm kitchen" | `modes/create.md` colour warning | medium |
| 10 | Owner / the money | A pre-filled WhatsApp asking for name, address, date and carb up front feels like a form | strategy beat 5 | low |

## Pre-mortem
1. People chat, ask "jam berapa sampai? gedung saya masuk?", the owner cannot serve them, and the page's clicks turn into no sales — because the page hid the two facts that decide an office lunch.
2. The page looked like every template (salad stock photo, green, icon cards), so nobody believed a small kitchen was behind it.
3. Customers complained the menu was not what the page showed, because sample dishes were not marked on the page.

## Contradictions with the research
- Roof "sampai di meja kantor" implies a delivery time research #4 says is unknown.
- Awareness "comparing solutions" is an inference without any customer voice (research says 0 verbatim sources); the storyline should not depend on it heavily.
- Research #7 (the real alternative is buying lunch near the office) is not answered in any beat.

## Verdict
change: rewrite the roof without a time promise; mark sample menu on the page itself; pick imagery that makes food appetising without lying; make the week (Mon–Fri = the minimum) the distinctive device, not the box alone; add a no-numbers comparison with buying lunch yourself.

## Response
| # | Decision | What changed, or why not |
| --- | --- | --- |
| 1 | Accepted | Roof now "Makan siang seimbang, diantar ke kantor Anda di Jakarta Selatan, Senin–Jumat." No time on the page; "Jam berapa sampai?" is the first FAQ, answered "tergantung rute; tanyakan untuk alamat kantor Anda" and the delivery window is launch-blocking question #1 for the client |
| 2 | Accepted | The week view carries a visible label "Contoh menu — menu asli dikirim tiap minggu lewat WhatsApp" on the page, not only `[SAMPLE]` in copy.md; dishes use only the owner's categories (nasi merah/shirataki, ayam/ikan/tahu tempe, sayur, buah) |
| 3 | Accepted | Imagery plan: try licensed photographs of the ingredients' world via photos.mjs (raw ingredients, captioned as illustration, never as Dapur Seimbang's dish); the drawn box is a diagram of the four parts, not an attempt at appetite. If photos cannot be fetched, the drawing uses warm food colours and real dish shapes, and the shot list is the first "Supaya lebih bagus" item |
| 4 | Accepted | The signature becomes the **week**: five boxes Mon–Fri, the minimum order shown as one row; the box repeats as the price unit (1 kotak = Rp 45.000, 5 kotak = Rp 225.000) and in the order steps |
| 5 | Accepted | Copy claims only the structure ("selalu empat bagian"), never health outcomes; "who plans the menu" goes to the client questions |
| 6 | Rejected | No nutrition data exists and inventing it breaks "never invent proof"; the customer is not a dieter (research #2). Listed in "Supaya lebih bagus" as something the owner could add |
| 7 | Rejected (for the page) | A trial offer is a business decision; the page cannot invent one. Framed instead as "mulai dari satu minggu, tanpa paket bulanan" (true: minimum is 5 days). Trial listed for the owner to decide |
| 8 | Accepted | Harga section adds one line against buying lunch yourself, without numbers: "Tidak perlu antre atau pilih menu tiap siang" — no price comparison (unverified) |
| 9 | Accepted | Spec must avoid both green-white clean-eating and cream-terracotta; checked at direction and spec |
| 10 | Accepted | Pre-filled message is a short template with blanks ("Nama: / Alamat kantor: / Mulai tanggal: / Nasi merah atau shirataki:") — the reader can send it half-filled |
