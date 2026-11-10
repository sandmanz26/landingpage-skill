# Digest: COVEO — An Audio/Visual Project

URL: https://coveomusic.com/
Images in this folder: desktop-fold.png, mobile-fold.png, desktop-overlay.png, mobile-overlay.png, sheet-desktop.png, sheet-mobile.png, motion-sheet.png

## Outline (document order, % of page height)
- H1 12% COVEO
- H3 16% THE ART OF SONIC AND VISUAL Storytelling
- H3 42% DISCOGRAPHY The complete works
- H2 52% ALL RELEASES — ORDERED BY NEWEST FIRST
- H3 91% ACKNOWLEDGEMENTS
- H2 7% CREDITS

Actions: "CLOSE MODAL" ×1 @7% first-screen stays-visible · "Play/Pause Audio" ×1 @22% stays-visible · "PREVIEW" ×11 @54% · "Credits" ×1 @99% · "Licensing Inquires" ×1 @99% · "Press Kit" ×1 @99%
Prices: none · proof words: review 13 · logo images: 0 · forms: 0 · page height: 4618px
Pop-up or banner on load (closed for capture): CLOSE MODAL; see *-overlay.png

## Motion (measured, desktop)
- Libraries: lenis, locomotive, swiper, viewTransitions
- Full-screen sticky panels (CSS scroll device): 0
- Moving with no input: 37 elements at the top; further down: 900px (4), 1800px (5), 2700px (8), 3600px (1); endless loops 4 (0 with text); pause control: yes
- On scroll: up to 10 script-driven elements per step, up to 32 CSS/Web animations; durations 138-3000 ms; easings ease, linear, cubic-bezier(0.22, 1, 0.36, 1), cubic-bezier(0.34, 1.56, 0.64, 1), cubic-bezier(0.64, 0, 0.78, 0); properties opacity, filter, transform, strokeDashoffset
- Reduced motion: 1 still move on their own, 18 with the scroll
- Leaves the page by itself when idle: no
- Smoothness while scrolling (stutter): 59.9 fps, p95 frame 16.7 ms, 0 long frames >50 ms, 0% dropped; a plain page on the same machine: 59.6 fps, p95 16.7 ms, 0 long frames. Scripts blocked 0% of the scroll.
  Measured with software rendering (no GPU) on a slower CPU: this ranks pages by how heavy they are, it does not show what a laptop with a GPU shows. Run `smooth.mjs` on a real machine to judge stutter.
- Not measured: transitions to other pages.

## Design inventory (desktop)
- Fonts: Inter 92%, monospace 5%, Eiko 3%, Arial 1%; 7 sizes (60/14/13/12/11/10/8 px)
- Colours: 1 chromatic; text #524d46 #1d1812 #000000; backgrounds #000000 #eeeeee #1d1812 #d5d5d5 #ffffff
- Radii 8px 100% 50% 24% 12px 40px 4px 25%; shadows 2; gradients 1; backdrop blur 13; layout shift (CLS) 0

## Inspector findings
- FAIL tiny-text [desktop, tablet, mobile]: Text at 9.6px e.g. <p> "Previewing"
- FAIL tiny-text [desktop, tablet, mobile]: Text at 8.4px e.g. <p> "Music for the day-dreamers, the over-thinkers, the"
- FAIL img-alt [desktop, tablet, mobile]: 38 images without an alt attribute e.g.  | /assets/img/avatars/avatar-coveo.jpg
- FAIL contrast [tablet, mobile]: 2 text elements below WCAG AA (measured on screen pixels) e.g. #747474 on screen = 4.03:1 median, 4.03:1 in the worst tenth (needs 4.5) <p> "Previewing" | #000000 on #333333 = 1.66:1 (needs 4.5, not re-checked on screen) <span> "Play/Pause Audio"
- FAIL tap-target [mobile]: 4 controls smaller than 24x24px on a phone e.g. 102x16 <a> "Connell McCarthy" | 40x16 <button> "Credits"
- FAIL reduced-motion [reducedMotion]: 7 text elements stay hidden when the visitor asks for reduced motion e.g. Close modal | A project by
- WARN system-font-only [desktop, tablet, mobile]: Only a default typeface carries the page (Inter, monospace)
- WARN small-text [desktop, tablet, mobile]: Text at 10.8px e.g. <span> "Click to preview song"
- WARN body-size [desktop]: Running text at 9.6px (16px or more reads better) e.g. <p> "Music for the day-dreamers, the over-thinkers, the"
- WARN body-size [desktop, tablet, mobile]: Running text at 12px (16px or more reads better) e.g. <p> "Since childhood, I've been captivated by music. I "
- WARN small-text [desktop]: Text at 10.2px e.g. <p> "12 minutes 22 seconds"
- WARN body-size [desktop, tablet, mobile]: Running text at 8.4px (16px or more reads better) e.g. <p> "Music for the day-dreamers, the over-thinkers, the"
- WARN fixed-cover [desktop, tablet, mobile]: 1 fixed or sticky element(s) that are not a bar cover part of every screen; make it a slim bar or let it scroll away e.g. 320x264 (29% of the screen height) <div> "Credits Close modal A project by Connell McCarthy "
- WARN text-at-edge [mobile]: 2 text elements within 12px of the screen edge e.g. <span> "Play/Pause Audio" | <span> "Close modal"

## Page text (first 6000 characters of 3119)

PREVIEWING

{TRACK.TITLE}

0:00 / 0:00

Play/Pause Audio

Click to preview song

Music for the day-dreamers, the over-thinkers, the storytellers, and the wanderers — a soundtrack for those who find beauty in every moment, and meaning in every silence.

COVEO

AN AUDIO/VISUAL PROJECT

THE ART OF SONIC AND VISUAL
Storytelling

Since childhood, I've been captivated by music. I grew up with an upright grand piano in my parents' living room and I would spend hours improvising melodies and scores, drawn to its rich, warm sound. Though I learnt the basics of music theory, I preferred creating my own music or playing my favourite songs by ear. Over the years, I explored different instruments, including the trumpet in my high school band, but I always returned to the piano as my creative anchor.

My interest in technology quickly grew alongside my love for music, and I started experimenting with web development and graphic design. Eventually, I discovered electronic music which led to creating my own songs in GarageBand, blending my passion for technology and music.

As my skills developed, I created COVEO, a project that united my music and visual design. Each release is intended to capture a feeling or story, with instrumental tracks that evoke an emotional narrative. My songs often swell into euphoric climaxes before settling into bittersweet, stripped-back outros—a signature part of my sound.

Behind each song is a meticulous artwork process. I craft visuals from my photography, photo collages, 3D design, or whichever medium brings the vision to life. The process is detailed and intuitive, allowing me to connect the sonic and visual story that resonates both emotionally and aesthetically.

DISCOGRAPHY
The complete works
ALL RELEASES — ORDERED BY NEWEST FIRST

011

HOLD OUT HOPE

SEPTEMBER 2025

SINGLE, 4 SONGS

12 MINUTES 22 SECONDS

PREVIEW

010

WANNA GET TO KNOW YOU

SEPTEMBER 2022

SINGLE, 1 SONG

3 MINUTES 19 SECONDS

PREVIEW

009

JUST A MEMORY (STRIPPED)

JANUARY 2021

SINGLE, 1 SONG

3 MINUTES 49 SECONDS

PREVIEW

008

JUST A MEMORY

NOVEMBER 2020

SINGLE, 1 SONG

3 MINUTES 43 SECONDS

PREVIEW

007

STILL DREAMING

JANUARY 2020

SINGLE, 1 SONG

4 MINUTES 9 SECONDS

PREVIEW

006

ELOUISE

JUNE 2019

SINGLE, 1 SONG

3 MINUTES 52 SECONDS

PREVIEW

005

CHAPTER I

MARCH 2019

SINGLE, 1 SONG

3 MINUTES 20 SECONDS

PREVIEW

004

YOU AND I

NOVEMBER 2018

SINGLE, 1 SONG

3 MINUTES 4 SECONDS

PREVIEW

003

MEMORIES WE SHARE

NOVEMBER 2018

SINGLE, 1 SONG

3 MINUTES 18 SECONDS

PREVIEW

002

AUTUMN 14

OCTOBER 2018

SINGLE, 2 SONGS

6 MINUTES 13 SECONDS

PREVIEW

001

MY DREAMS OF YOU

JULY 2018

SINGLE, 1 SONG

4 MINUTES 28 SECONDS

PREVIEW
ACKNOWLEDGEMENTS

MUSIC FOR THE DAY-DREAMERS, THE OVER-THINKERS, THE STORYTELLERS, AND THE WANDERERS — A SOUNDTRACK FOR THOSE WHO FIND BEAUTY IN EVERY MOMENT, AND MEANING IN EVERY SILENCE.

CREDITS
CLOSE MODAL

A project by Connell McCarthy

Designed & Developed by Bo & Co Studio

Thanks for reading this, not many people do.

production.25-276.f0c9c2b

2014-2026 COVEO Music

All Rights Reserved

Credits
Licensing Inquires
Press Kit
