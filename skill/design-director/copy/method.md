# Copy

Copy is not the text poured into a layout. It is where the brand is felt: in which words are
chosen, how long a sentence runs, what is said first, what is never said. A reader rarely notices
good copy; they notice that they understood, and that the business sounded like someone they
would trust. Bad copy fails in two quiet ways:

- **Written above the reader.** A model given a brief writes in its own register: formal,
  abstract, dense. The owner's army-site case: the first draft read "too high" and many users did
  not understand it; only after the reader was framed (who they are, how they talk, what they
  already know) did the copy land. So the reader comes first, in writing, before any line.
- **Written without reading experience.** Walls of text, the answer at the end of the paragraph,
  headings that are labels ("Layanan Kami") instead of answers, three ideas in one sentence.

This method runs in the copy step (`modes/create.md` step 8) and writes two files:
`.design/voice.md` (the reader and the voice, once per brand) and `.design/copy.md` (the page).

## 1. The reader (framing): `.design/voice.md` → "## Reader"

Write it from the research's customer voice, not from imagination:

- **Who reads, where, in what state.** "Calon prajurit dan orang tuanya, lulusan SMA, membaca di HP
  di sela kerja; cemas soal tes dan biaya." Device, time and worry change the copy more than age.
- **What they already know, and what they do not.** The terms they use themselves (quote them from
  reviews, WhatsApp, forums) and the terms of the trade they do not know.
- **Reading level target**, in plain words: "seperti pesan WhatsApp dari kakak kelas yang sudah
  lolos", not "formal dan profesional". Name a reference text the reader reads happily.
- **The three questions they would ask a friend** before deciding, in their words.

## 2. The voice: "## Voice"

Three traits, each written as **"X, not Y"** with one sentence that does it and one that does not.
The traits come from the brand and the strategy's message house; the "not Y" stops the voice
drifting into its cliché.

```markdown
| Trait | Not | Says | Never says |
| Tenang | Kaku | "Kalau hujan, tenda samping sudah berdiri sejak jam 10." | "Kami siap mengantisipasi segala kondisi cuaca." |
```

Then the mechanics: the address (Anda/kamu, `rules/copy-id.md`), sentence rhythm (short, with one
longer sentence to breathe), whether the brand jokes, how it talks about money and about fear.

**Felt, not stated.** A brand never describes its own character: not "kami ramah, terpercaya dan
profesional". It shows it: the reply time, the price written before the ask, the way a fear is
answered. `copycheck.mjs` fails self-praise words (`copy/words.json`).

## 3. The glossary: "## Glossary"

```markdown
| Say | Not | Why |
| biaya total | investasi | the reader pays, they do not invest |
| tes fisik | asesmen kesamaptaan jasmani | the reader's own word (12 of 20 forum posts) |
```

Every "Not" word fails `copycheck.mjs` when it appears in the copy. Grow it from customer voice
and from every reader test that tripped.

## 4. Write the page: `.design/copy.md`

Section by section, in the spec's order. For each section:

1. **The customer question it answers** (from the spec's Sections table), as a comment line.
2. **The headline is the answer**, not a label: "Biaya total Rp 4,2 juta, sekali bayar" beats
   "Biaya Pendaftaran". A reader who skims only the headlines and buttons must get the story.
3. **The first sentence says the thing; the rest proves or explains it.** Front-load: never build
   up to the point.
4. **Concrete before abstract.** A number, a name, a place, a time, an example from the reader's
   world; then, if needed, the general claim.
5. **Buttons say what happens** ("Kirim tanggal lewat WhatsApp"), never "Selengkapnya" or
   "Get started".

Format: `#`, `##`, `###` for headings, blank lines between paragraphs, `- ` for list items, and
buttons as markdown links `[Pesan lewat WhatsApp](#pesan)` so the checks can find them.

## 5. Reading experience (measured)

| Measure | Target | Fails at |
| --- | --- | --- |
| Sentence length | average 8-18 words | any sentence over 30 words |
| Paragraph | 1-3 sentences, about 50 words | over 80 words |
| Headline | fits two lines, about 32 characters at display size | over 60 characters |
| Long words (13+ letters) | under 8% of words | (warn only) |
| Self-praise and corporate abstractions | none | any (`copy/words.json`, team additions in `team/copy-words.json`) |
| Glossary "Not" words | none | any |
| Buttons | name the action | generic labels (warn) |

```bash
node <skill>/scripts/copycheck.mjs .design/copy.md --voice .design/voice.md
node <skill>/scripts/copycheck.mjs path/to/index.html --voice .design/voice.md   # the built page
```

It writes `.design/copycheck.json`; `progress.mjs done copy` refuses with a FAIL in it, or when it
is older than `copy.md`, or when `voice.md` lacks its Reader, Voice and Glossary sections.

## 6. Two reader tests (not measurable, never skipped)

- **Skim test.** Read only the headings and the buttons, top to bottom. Write the story they tell
  in three lines. If it is not the storyline from the strategy, rewrite the headlines.
- **Explain-back test.** As the reader from "## Reader" (their words, their level, their worry),
  say back in one or two sentences what the page offers, what it costs and what to do next. Any
  word you had to look up, any sentence you read twice, goes into the glossary and is rewritten.
  At standard effort the customer researcher juror repeats this test on the built page.

Write both results at the end of `copy.md` under "## Reader tests".
