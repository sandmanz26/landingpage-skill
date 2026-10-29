# Which rule wins

When two rules conflict, the higher one wins. Name every conflict you resolve in the report.

1. **Objective rules:** accessibility, contrast, no overflow, nothing broken, behaviour preserved
   (`rules/objective.md`).
2. **Copyright and references** (`rules/copyright.md`).
3. **The client's brand** (`brands/<client>.md` or `.design/brand.md`).
4. **This project's brief and the decisions logged in `.design/decisions.log`.**
5. **The designer's personal taste** (`designers/<name>.md`).
6. **The team's taste** (`team/taste.md`, `team/taste-rules.json`).
7. **This skill's defaults** (`rules/defaults.md`, `rules/style-defaults.json`).

The latest explicit instruction from the user overrides 3–7 for this project; log it. It never
overrides 1–2: explain the conflict instead.
