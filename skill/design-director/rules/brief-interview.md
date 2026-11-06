# Guiding the user to what they want

A vague request ("buatkan landing page untuk wedding organizer") leaves every decision to chance.
Before research, help the user narrow it down in one short exchange, so the work scopes down
instead of drifting. Guide, do not interrogate: one message, at most five questions, each with
choices and a recommendation, and "terserah" always allowed.

## How every question to the user is asked (all steps and gates)

The user is often not a designer (owner, 2026-11-06: "berikan keterangan yang jelas, contoh yang
jelas"). Every question, at the brief, at a gate or anywhere else, has four parts:

1. **The question in plain words**, no design jargon ("Mau warnanya tenang atau berani?", not "Mau
   palet monokromatik atau komplementer?").
2. **What it changes**, in one line ("Ini menentukan apakah halaman terasa kalem atau ramai").
3. **A concrete example for each choice**: a site they may know, a picture (sketch, swatch, a
   screenshot from the library), or a one-line description of how it would look for *their*
   business ("Berani: hijau tua penuh di bagian harga, kuning untuk tombol, seperti Quite Nice").
4. **A recommendation with its reason, and "percayakan ke AI"** as an answer that is always
   accepted; the choice then follows the recommendation and is logged as such.

A question without an example is not asked: find the example first, or decide and say so.

## The one message (brief step, before the brief gate)

Ask only what is missing from the request and the project. In this order:

1. **Siapa dan untuk apa.** "Halaman ini untuk siapa, dan apa satu hal yang harus mereka lakukan?"
   Offer the likely answers for this business (cek tanggal via WhatsApp / isi form / beli).
2. **Contoh yang disukai.** "Kirim 1–3 situs yang Anda suka, dan kalau ada, 1 yang tidak Anda suka.
   Tidak harus dari bisnis yang sama." This is the strongest scoping tool: capture them
   (`capture.mjs` or inspect + evidence) and turn them into dials with
   `dials.mjs suggest <liked dirs> --dislike <dirs>`. When the user sends none, offer two or three
   from the team library (`library.mjs groups`, `library.mjs find`) by name and one line each.
3. **Rasa dalam tiga kata.** Offer a short list instead of an open question: hangat, tenang,
   mewah, berani, jenaka, rapi, tradisional, modern, intim, meriah. Translate the picks into dial
   values and say the translation back ("mewah + tenang = warna kalem, huruf ×6 serif tipis, foto").
4. **Yang sudah ada.** Photos, logo, brand colours, real prices, reviews. What is missing decides
   the imagery dial and what may never be invented.
5. **Yang tidak boleh.** Colours, styles or claims the brand or the user rules out.

When the request already answers a question, do not ask it. When the user answers "terserah",
take the team's taste (`team/visual-defaults.json`) and say so in one line.

## What the answers become

- The brief card (`.design/brief.md`) records the answers in the user's words.
- `.design/targets.suggested.json` from `dials.mjs` (or from the three words) is shown at the
  direction gate as the starting position of the dials; where the liked sites disagree, ask.
- Liked and disliked sites become references with roles (`rules/copyright.md`); their do-not-copy
  lists apply.

## Then let the user choose early, not late

At the direction gate (guided gates) build each direction's **first screen as a quick sketch**
(`.design/directions/sketch-a.html`, `-b`, `-c`): the real headline and sub, the action, the dial
values, the main picture idea; nothing below the first screen. Put them side by side with
`compare.mjs .design/directions/sketch-a.html .design/directions/sketch-b.html .design/directions/sketch-c.html --labels "<names>"`
and let the user pick or mix. Choosing from sketches costs a few minutes; choosing between finished
pages costs a whole build per page. Because the user has chosen the composition:

- the hero best-of-3 with the jury is skipped (the user already chose it);
- at standard effort the look uses two jurors (art director and customer researcher) instead of
  five, unless the user asks for more;
- full-page variants (`--variants`) stay available for thorough effort or when the user asks.
