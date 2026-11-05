# Kit: tested sections

Sections the team wrote and tested, so a build starts from a working floor instead of from nothing:
each passes the inspector with 0 findings at 1440, 768 and 390, keeps all its content under reduced
motion and without JavaScript, and works by touch and keyboard. Everything visual comes from the
tokens at the top of `kit.css`; a project restyles by setting tokens from its spec.

```bash
node <skill>/scripts/kit.mjs list                 # each section, the customer question it answers, what it needs
node <skill>/scripts/kit.mjs get hero-arch faq --out .design/kit
```

Rules:

1. **Use a section only for the question it answers** (`sections.json` → `answers`). The spec's
   Sections table names it; the reason roast checks it. A kit section placed because it exists is
   still UI without a reason.
2. **Replace every word and picture.** The demo's content is sample content for a fictional clinic,
   marked `data-kit-sample`; the inspector fails a page that still carries it (`kit-sample`). The
   pictures in `img/` are placeholders and never ship.
3. **Restyle through the tokens**, then compose: change colour, type, radius and space in
   `kit:tokens`, not in each rule. The kit's look is neutral on purpose; the direction gives it one.
4. **Change the structure when the spec needs it**, and inspect again. The kit is a floor, not a
   template: a page made only of kit sections in kit order is the "competitor could use it" failure.

Add a section when a pattern proves itself in a delivered page: write it here with tokens only,
add it to `sections.json`, and keep `kit/index.html` at 0 findings (`npm test` checks it).
