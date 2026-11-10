# Design rationale: every key decision comes with its reason (owner, 2026-11-10)

The one home for how the skill explains its design decisions to the user. The user often puts the
result next to what another AI or a colleague made. They can only defend this design if they know
why each key choice was made, what it costs, and where the idea comes from. A decision without a
reason looks like taste and is the first thing to be overruled.

## The rule

Every key design decision the skill makes is told to the user with:

1. **the decision**, in plain words ("angka di tabel rata kanan", "harga di layar pertama");
2. **the UX reason**: what it does for the person using the page, in one or two sentences, from the
   research, the strategy, the roast, a rule of this skill, or a named source;
3. **the trade-off**: what it costs or when it would be wrong ("kapan tidak": a smaller table, a
   different audience, a slower build);
4. **a source** where there is one: a research finding (R3), a roast point, a rule
   (`admin/table.md` T10), or an outside source with its link and the date read. "Pengalaman tim"
   or "pilihan gaya" is an honest source too; do not invent one.

**Neutral, not absolute.** Design is contextual. Write "most guidance recommends … because …; an
exception is …", never "this is the only right way". Where sources disagree, say so in one line.
When the user's own idea is the decision, give its reason the same way, and say plainly when the
evidence points elsewhere (`CLAUDE.md` working agreement: no sycophancy).

**Key decisions** are the ones a reviewer would question: the storyline and the order of sections,
the direction and its idea, the type and colour approach, the main action and where it sits, the
motion, the component library, the admin style, and any rule from `admin/table.md` that shapes a
table. Small choices (one spacing value) do not need an entry.

## Where it shows

- **At the gates** (SKILL.md, Gate formats): each recommendation already carries its one-line
  reason; add the trade-off when the user is choosing between options.
- **In the deliver report** (`.design/deliver.md`, `modes/create.md` step 13): a section
  `## Alasan desain` (or `## Design rationale`) with at least three key decisions. Write it as a
  table or as bullets:

```markdown
## Alasan desain

| Keputusan | Alasan UX | Trade-off / kapan tidak | Sumber |
| --- | --- | --- | --- |
| Harga di layar pertama | Pembeli bertanya "berapa?" sebelum yang lain (R2, 31 ulasan) | Kurang cocok bila harga per proyek; diganti "mulai dari" | research R2 |
| Angka rata kanan di tabel pesanan | Satuan sejajar dengan satuan, mudah dibandingkan | Nomor pesanan dan tanggal tetap rata kiri | admin/table.md T10; GOV.UK Table |
| Kolom aksi menempel di kanan | Aksi tidak hilang saat tabel digeser | Memakan lebar di ponsel; hanya satu kolom menempel di ponsel | admin/table.md T3 |
```

or `- **Harga di layar pertama**: alasan … · Trade-off: … · Sumber: …` (one line per decision,
with a `Trade-off:` or `Kompromi:` label).

## Checked

`progress.mjs done deliver` refuses `.design/deliver.md` without the section, or with fewer than
three entries that each name a trade-off (a table row with decision, reason and trade-off filled,
or a bullet with a `Trade-off:` / `Kompromi:` / `Kapan tidak:` label). It applies in `create`,
`site` and `redesign` (where the deliver report is required) and in any other mode that writes
`.design/deliver.md`. Not checkable by script: whether the reason is true, whether the source says
what the entry claims, and whether the wording is neutral. The roast and the user judge that.
