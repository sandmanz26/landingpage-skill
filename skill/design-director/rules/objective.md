# Objective rules

Measured by `scripts/inspect.mjs` on every run, whatever the taste. FAIL blocks delivery.

| Rule | FAIL | WARN |
| --- | --- | --- |
| Overflow | The page scrolls sideways at any width | |
| Fonts | A named typeface never loaded (the browser shows a fallback) | More than 2 typefaces carry the text |
| Contrast | Text below WCAG AA: 4.5:1, or 3:1 for text ≥ 24px (≥ 18.66px bold) | |
| Text size | Any text under 10px | Text under 12px; running text under 16px |
| Title | No visible h1 | More than one h1 |
| Headlines | h1 over 3 lines at any width | Large headings over 3 lines |
| Line length | | Paragraphs above ~95 characters per line (aim for 55–75) |
| Phone | Controls under 24×24px | Text within 12px of the screen edge |
| Images | Missing alt attribute; image fails to load | |
| Hidden content | Text still invisible after scrolling the whole page; text hidden under reduced motion | |
| Stability | Layout shift over 0.25 | Layout shift over 0.1; console errors |
| Without JavaScript | | Less than half of the text visible |

Targets the inspector reports as inventory (not pass/fail), to keep the system tight:

- 5 or fewer font sizes doing the visible work; body 16–20px, leading 1.45–1.6.
- Spacing on a 4px (or 8px) scale; few distinct values.
- One ground, one ink, one accent; few chromatic colours.
- One radius value plus at most one exception.
- Motion on `transform` and `opacity` only.
