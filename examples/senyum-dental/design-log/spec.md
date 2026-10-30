# Spec: Senyum Dental (v1)
Idea: On this page, the 30-minute lunch-break visit becomes the fixed half of the screen: a clock face that moves from 12.00 to 12.30 as the visitor scrolls through each step.
Direction: split-stage (seed 109772034). The fixed half holds a drawn clock instead of a photograph (no photographs exist).

## Decisions
| Decision | Choice | Value |
| --- | --- | --- |
| Type personality | Soft serif for name, times and headings; calm sans for reading | Fraunces (variable, SOFT axis), Instrument Sans 400/600, self-hosted, OFL |
| Type hierarchy | Dramatic for the clock and price, modest headings | clock digits clamp(56px, 7vw, 112px); H1 clamp(40px, 4.4vw, 64px); H2 36px; body 19px/1.55 |
| Colour | Two-tone + brand accent | ground #F3F5F1 (cool paper, not cream), stage #DCE8E1 (pale green from the brand), ink #13221E, accent #0F5C4D (brand) on the action, the clock arc and the price field |
| Layout | Split 45/55, sticky stage left; price breaks the split full width | reading column max 46ch, padding 64px |
| Density | Airy reading column, dense price facts | section gap 144px desktop / 88px phone |
| Hero | Statement + proof in the reading column; the clock is the picture | |
| Imagery | Drawn in code from the subject: the clock face. No photographs, no icons | |
| Shape | Square, except the booking button (pill) | radius 0; button 999px |
| Depth | Flat; surfaces separated by tone only | no shadows, no borders except form fields |
| Motion | Feedback + story (clock hand follows scroll) | see motion spec |
| Copy voice | Calm, plain, reassuring; sapaan "Anda" | headlines ≤ 32 chars |
| Signature move | The clock that advances 12.00 → 12.30 as you read | |

## Tokens
:root { --ground:#F3F5F1; --stage:#DCE8E1; --ink:#13221E; --ink-2:#3C4D48; --accent:#0F5C4D; --on-accent:#FFFFFF;
--font-display:"Fraunces", Georgia, serif; --font-text:"Instrument Sans", system-ui, sans-serif;
--step-0:19px; --step-1:24px; --step-2:36px; --step-3:clamp(40px,4.4vw,64px); --step-4:clamp(56px,7vw,112px);
--space-1:8px; --space-2:16px; --space-3:24px; --space-4:32px; --space-5:48px; --space-6:64px; --space-7:96px; --space-8:144px; }

## Sections
| # | Role | Claim | Composition | Content | Picture |
| --- | --- | --- | --- | --- | --- |
| 1 | Hero | Dentist in your lunch break | statement | name, H1, lead, CTA, facts line | clock at 12.00 |
| 2 | Half hour | You know every step | numbered list with times | 5 steps 12.00–12.30 | clock advances per step |
| 3 | Price | No surprise bill | full-width field, number left, included list right | Rp 350.000 + 4 items | none |
| 4 | Dentists and hours | Always someone on duty | table | Mon–Sat 09.00–20.00, 3 dentists | clock shows opening hours |
| 5 | Booking | One message | form (live thing) | day + time → WhatsApp message prefilled | |
| 6 | Location | Easy to reach | figure: address set large + map link | Jl. Riau 12, Bandung | |
| 7 | Footer | — | name returns full width | contact | |

## References and their roles
None in this simulation (team library not built yet). Composition from the seed direction only.

## Motion spec
Tokens: --dur-fast 160ms; --dur-mid 320ms; --ease-out cubic-bezier(.16,1,.3,1)
Feedback: button and links, 160ms colour/underline.
Story: the clock hand and arc follow the reading position through section 2 (12.00 → 12.30), driven by scroll; without script the clock shows the full half hour.
Reduced motion: the clock jumps between steps without travel.
No reveal animations on text.

## Not on this page
Stock photos, cartoon teeth, icons, testimonials, shadows, gradients, the cream-and-terracotta palette.
