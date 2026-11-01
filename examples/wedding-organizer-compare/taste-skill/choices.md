# Choices made without the user (tasteskill v2 run)

The user was not available. Wherever the skill asks or decides "with the user", the skill's own default
or recommended option was taken. Each one is listed here.

1. **Reading of a vague brief** (SKILL.md step 1: "decide and state your reading in one line instead of
   asking; ask only when a missing fact blocks the work, for example no product name").
   The brief has no business name. Instead of asking, a sample client was set: **Janur**, a wedding
   organizer in Yogyakarta for Javanese (adat Jawa) and national weddings, one wedding per day. Page
   language: Bahasa Indonesia (the language of the request). Primary action: "Cek tanggal" (check whether
   the wedding date is free).
2. **Sector for the draw**: `event` (closest of the script's list; `--list sectors` has no "wedding
   services"). Sections passed in the order of the written argument:
   intro, how-it-works, list, gallery, pricing, faq, contact, footer. No `--tone` (the brief names none),
   no `--have` (the client has no photographs of its own).
3. **Choosing among the three dealt directions** (step 3: the agent chooses the one that can carry an item
   of the inventory). Dealt: colour-chapters, place-carries-it, page-is-the-object. Chosen:
   **page-is-the-object**, seed 139154662: the WO's own artefacts (the folder kept per couple, the
   minute-by-minute rundown) are the most specific items in the inventory.
4. **Redraws**: none. The dealt palette (oxblood and grey) was kept: it does not fight the subject (deep
   red is a colour of Javanese wedding dress and decoration). Two extra tones were derived from it for the
   five folders (a dark oxblood ground and a plum), within the same two-ink family.
5. **Blueprint adjustments forced by the house rules / inspector** (the sheet says house rules win):
   - the rundown row ends inside the page margins instead of bleeding off both screen edges (edge-text FAIL);
   - the small "when" caption above each moment became the opening words of its paragraph (eyebrow FAIL);
   - folded cards in the pinned deck hide their text and show a vertical spine label instead
     (covered-text FAIL); pin shortened to 260svh (house: two to three screens);
   - the contact card is not sticky over the photograph (pinned-over-picture WARN);
   - scroll reveals start at 40% opacity instead of 0 so nothing is ever blank if a reveal does not fire;
   - the footer scallops are an SVG mask, not a radial gradient (gradients are banned).
6. **Imagery** (step 6, order of preference): no own photos and no image tool, so real pictures from the
   open collections via `scripts/assets.mjs` (museum objects from the Art Institute of Chicago and the Met,
   documentary and archival photographs from Wikimedia Commons), credited in the footer. None of the
   dealt "City at night" photographs were used (night city streets do not fit the subject; they are
   atmosphere only). The janur arch on the front folder is drawn in SVG.
7. **No form backend** (Special cases): the date form is handled in script with `preventDefault`; it
   shows the weekday and Javanese pasaran of the chosen date, confirms on the page and offers a prefilled
   `mailto:` link.
8. **Sample content to confirm before launch**: the name Janur, address (Jl. Mondorakan 41, Kotagede),
   phone 0812 2700 4141, email halo@janur.id, Instagram handle, opening hours, all prices and packages,
   crew numbers (6/10/14), guest limits, "8 per bulan", rundown times, FAQ answers and policies
   (7-day hold, 30% deposit, one free reschedule). No testimonials, client names, logos or statistics were
   invented.
9. **Single-file delivery** (task constraint, not the skill): the skill's build normally keeps pictures in
   `assets/`; here every picture is resized and inlined as a data: URI by `build.mjs` so `index.html` is
   self-contained. Google Fonts is the only external request.
10. **Footage**: none used. The skill asks for one honest clip; Wikimedia Commons answered every video
    search with HTTP 429 (rate limited), the Internet Archive returned only an unrelated 1965 film and
    NASA nothing. The motion layer uses a slow drift on the contact photograph as its moving picture.
11. **Pictures not obtained**: the "Janur kuning" photograph and others on Commons could not be
    downloaded (HTTP 429); the intro uses the 1920 archival wedding photograph instead.
