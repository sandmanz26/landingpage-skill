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
2. **Produknya.** The Head of Product's question (`rubric/council.md`), in the four-part form:
   "Apa tujuan produk ini, dan apa yang berubah bagi pengguna setelah memakainya? Ini menentukan
   apa yang halaman utamakan dan angka apa yang kita pakai untuk menilai berhasil atau tidak.
   Contoh: 'karyawan kantor tidak perlu antre makan siang; ukurannya langganan mingguan; sekarang
   hanya landing page, aplikasi pemesanan kuartal depan'. Rekomendasi: satu angka saja yang Anda
   cek tiap minggu. Atau percayakan ke AI." The answer fills the brief's `## Product` (vision, user
   and outcome, metric, scope in/out, existing patterns); "percayakan ke AI" gives a proposal
   marked `(AI proposal)`. When 1 and 2 are both missing, ask them as one question, so the
   message stays at five.
3. **Contoh yang disukai.** "Kirim 1–3 situs yang Anda suka, dan kalau ada, 1 yang tidak Anda suka.
   Tidak harus dari bisnis yang sama." This is the strongest scoping tool: capture them
   (`capture.mjs` or inspect + evidence) and turn them into dials with
   `dials.mjs suggest <liked dirs> --dislike <dirs>`. When the user sends none, offer two or three
   from the team library (`library.mjs groups`, `library.mjs find`) by name and one line each.
4. **Rasa dalam tiga kata.** Offer a short list instead of an open question: hangat, tenang,
   mewah, berani, jenaka, rapi, tradisional, modern, intim, meriah. Translate the picks into dial
   values and say the translation back ("mewah + tenang = warna kalem, huruf ×6 serif tipis, foto").
5. **Yang sudah ada.** Photos, product UI, logo and brand colours, real prices, reviews. Ask for
   the materials as in **Materials** below; what is missing decides the imagery dial and what may
   never be invented.
6. **Yang tidak boleh.** Colours, styles or claims the brand or the user rules out.

When the request already answers a question, do not ask it. When the user answers "terserah",
take the team's taste (`team/visual-defaults.json`) and say so in one line.

## Materials: ask for them, and say what stands in when they are missing

Owner, 2026-11-06. Missing materials are the commonest reason a page looks unfinished, and the user
often has them but does not know they matter. In the one message, ask for each of the three below
in the four-part form above (plain question, what it changes, an example, a recommendation with
"percayakan ke AI"), then record the answer in the brief.

| Material | Ask, in plain words, with an example | When it is missing |
| --- | --- | --- |
| **Photos** of the real place, people, product, work | "Ada foto asli tempat, tim, atau produk Anda? Foto asli membuat halaman terasa milik Anda, bukan template. Contoh: foto dapur saat menyiapkan katering, 5-10 foto dari HP sudah cukup." | Ask whether stand-in pictures are needed and offer the three paths in **No photos: stand-in pictures** below; then a connected image-generation tool, then draw (`rules/illustration.md`). **If no image-generation tool is connected and `photos.mjs` finds nothing usable, tell the user at the start**: "Gambar di halaman ini akan berupa ilustrasi/dummy dulu, karena tidak ada foto dan tidak ada alat pembuat gambar yang terhubung", and repeat it in the deliver report with the shot list. Owner: "jika user tidak link ke mcp yang bisa generate image maka kita sampaikan bahwa kita menggunakan dummy dulu." |
| **Product UI**: screenshots, a Figma link, a screen recording (only when the product is software or has an app) | "Ada tangkapan layar atau file Figma dari aplikasi Anda? Calon pelanggan ingin melihat produknya sebelum mendaftar. Contoh: layar dasbor, layar pemesanan, tampilan di HP." | Follow up once. If there is still no interface, ask: "Belum ada tampilan aplikasinya. Mau saya buatkan **tiruan yang realistis dengan data contoh** (terlihat seperti aplikasi sungguhan, ditandai sebagai contoh, Anda ganti nanti) atau **placeholder berlabel** saja (kotak bertulisan 'tampilan aplikasi')? Rekomendasi: tiruan, karena pelanggan menilai dari produknya. Atau percayakan ke AI." **"Percayakan ke AI" chooses the mock.** The mock is built from the product's real features, every sample element carries `data-sample` (`inspect.mjs` reports INFO `sample-ui`), its numbers are never presented as customer results (SKILL.md: proof is never sampled), and it is listed in the deliver report. A placeholder is a labelled box with the shot needed. Owner: "follow up user untuk minta; jika belum ada interface tanya apakah perlu dibuatkan dummy atau placeholder saja." |
| **Brand assets**: logo, colours, fonts, a brand book | "Ada logo atau warna resmi? Kalau ada, halaman memakai itu; kalau belum, saya buatkan logo sementara dari nama Anda. Contoh: file logo PNG/SVG, kode warna dari desainer, atau foto papan nama toko." | A short brand kit at the direction step and a placeholder wordmark (`brand/method.md` §9), listed in the deliver report. |

### No photos: stand-in pictures (owner, 2026-11-07)

When the user has no photos, ask in the four-part form whether they want stand-in (dummy) pictures
until theirs exist, and if yes offer three paths, each with an example:

> "Belum ada foto asli. Mau saya pakaikan **gambar pengganti** dulu sampai foto Anda siap? Ini
> menentukan apakah halaman terlihat hidup sekarang atau masih kotak kosong. Ada tiga cara:
> **(a) Anda pilih sendiri di unsplash.com** lalu tempel link fotonya di sini, tanpa daftar apa pun
> (contoh: cari "dapur katering", klik foto, klik kanan → *Copy image address*, tempel
> `https://images.unsplash.com/photo-…`);
> **(b) saya cari otomatis** di Unsplash, butuh *Access Key* gratis dari Anda (langkahnya di bawah;
> contoh: saya cari "nasi kotak di meja kantor" dan kirim lembar pilihan 8 foto);
> **(c) ilustrasi gambar atau kotak berlabel** dengan daftar foto yang perlu Anda ambil (contoh:
> gambar datar papan rundown dan walkie-talkie, atau kotak bertulisan "foto tim di dapur, horizontal").
> Rekomendasi: (a) kalau Anda sempat memilih 5 menit, karena Anda yang paling tahu rasanya. Atau
> percayakan ke AI."

- **(a) Pasted links, no key.** `photos.mjs get <link>` takes an `images.unsplash.com/…` link (the
  image loads without a key) or an `unsplash.com/photos/…` page link (needs the key, or a page
  that answers; often bot-blocked, then ask for the image address). Credit the photographer:
  `credits.json` records the name when the link allows and says "photographer unknown" with how to
  fix it when it does not (`--by "<name>" --page <photo page link>`); ask the user for the page link
  or the name. `plus.unsplash.com` (Unsplash+) is a paid licence: refused.
- **(b) Automatic search, free Unsplash Access Key.** Give the user these steps:
  1. Sign up at unsplash.com/join.
  2. Open unsplash.com/developers and click **Register as a developer**.
  3. Go to unsplash.com/oauth/applications → **New Application**, accept the API guidelines, give
     it a name.
  4. Copy the **Access Key** only, never the **Secret Key**. A new app runs in demo mode: about 50
     requests per hour, enough for one project.
  5. Store it as the environment variable `UNSPLASH_ACCESS_KEY`: locally in the shell profile
     (`export UNSPLASH_ACCESS_KEY=…` in `~/.zshrc` or `~/.bashrc`, then a new terminal), in a cloud
     session in the environment's settings (secrets / environment variables). **Never paste it into
     the chat and never commit it into the skill or the project.**
  Then `photos.mjs search "<subject>" --sheet .design/photos/sheet.png`, show the sheet, `get` the
  chosen ones (`rules/illustration.md` step 1).
- **(c) Drawn illustration or labelled placeholders**, with the shot list (`rules/illustration.md`).

**"Percayakan ke AI"** → (b) when `UNSPLASH_ACCESS_KEY` is set, else (c). Every stand-in is listed
in the deliver report with the shot list; a found photograph is never presented as the client's own.
If the user says no stand-ins are needed, the plan is (c) placeholders in drafts only.

Research materials (old copy, brochures, chat exports, reviews) are asked for as in
`modes/create.md` step 1 and recorded in the same section. A `section` run skips this: it works
inside a design whose materials exist.

The brief records it (`progress.mjs done brief` refuses a brief in `create`, `site` and `brand`
without a `## Materials` section that names photos, product UI, and brand assets, "n/a" allowed
when there is no product UI):

```markdown
## Materials
| Material | What exists | Plan |
| Photos | none | stand-ins wanted: (a) user pastes 6 Unsplash links → photos.mjs get, credits; else (c) drawn and dummy pictures, user told at the start; shot list at delivery |
| Product UI | none after a follow-up | user: "percayakan ke AI" → realistic mock with sample data (data-sample) |
| Brand assets | no logo; colours free | short brand kit, placeholder wordmark |
| Image tool | none connected | - |
| Research materials | 40 Google reviews, old menu PDF | research step |
```

`progress.mjs done deliver` then wants `.design/deliver.md` to list the shot list when the brief
plans dummy or drawn pictures, and the sample UI when it plans a mock.

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
