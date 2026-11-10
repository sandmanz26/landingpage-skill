# Digest: COVEO — Chapter I

URL: https://coveomusic.com/chapter-i
Images in this folder: desktop-fold.png, mobile-fold.png, desktop-overlay.png, mobile-overlay.png, sheet-desktop.png, sheet-mobile.png, motion-sheet.png

## Outline (document order, % of page height)
- H2 12% COVEO
- H1 8% CHAPTER I
- H2 39% BEHIND THE SONG
- H2 39% CREDITS
- H2 62% ALL RELEASES — ORDERED BY NEWEST FIRST

Actions: "LISTEN ON SPOTIFY" ×1 @11% first-screen · "LISTEN ON APPLE MUSIC" ×1 @11% first-screen · "CLOSE MODAL" ×2 @12% first-screen stays-visible · "LISTEN ON SOUNDCLOUD" ×1 @13% first-screen · "LISTEN ON BANDCAMP" ×1 @13% first-screen · "LISTEN ON YOUTUBE" ×1 @13% first-screen · "Play/Pause Audio" ×1 @30% stays-visible · "PREVIEW" ×12 @33% · "Credits" ×1 @99% · "Licensing Inquires" ×1 @99% · "Press Kit" ×1 @99%
Prices: none · proof words: review 13 · logo images: 0 · forms: 0 · page height: 3367px
Pop-up or banner on load (closed for capture): CLOSE MODAL, CLOSE MODAL; see *-overlay.png

## Motion (measured, desktop)
- Libraries: lenis, locomotive, swiper, viewTransitions
- Full-screen sticky panels (CSS scroll device): 0
- Moving with no input: 0 elements at the top; further down: 900px (2), 1350px (2), 2250px (11); endless loops 8 (0 with text); pause control: yes
- On scroll: up to 8 script-driven elements per step, up to 24 CSS/Web animations; durations 138-3000 ms; easings ease, linear, cubic-bezier(0.34, 1.56, 0.64, 1); properties opacity, transform, strokeDashoffset, filter
- Reduced motion: 0 still move on their own, 13 with the scroll
- Leaves the page by itself when idle: no
- Smoothness while scrolling (stutter): 59.8 fps, p95 frame 16.7 ms, 0 long frames >50 ms, 0% dropped; a plain page on the same machine: 59.8 fps, p95 16.8 ms, 0 long frames. Scripts blocked 0% of the scroll.
  Measured with software rendering (no GPU) on a slower CPU: this ranks pages by how heavy they are, it does not show what a laptop with a GPU shows. Run `smooth.mjs` on a real machine to judge stutter.
- Not measured: transitions to other pages.

## Design inventory (desktop)
- Fonts: Inter 82%, monospace 17%, Arial 1%; 6 sizes (48/19/13/12/11/10 px)
- Colours: 1 chromatic; text #524d46 #1d1812 #000000 #ffffff; backgrounds #000000 #eeeeee #1d1812 #ffffff #222222 #dddddd
- Radii 8px 100% 4px 12px 40px 24px 50% 25%; shadows 4; gradients 0; backdrop blur 22; layout shift (CLS) 0.001

## Inspector findings
- FAIL tiny-text [desktop, tablet, mobile]: Text at 9.6px e.g. <p> "Previewing"
- FAIL img-alt [desktop, tablet, mobile]: 15 images without an alt attribute e.g.  | /assets/releases/chapter-i/chapter-i-140.jpg
- FAIL contrast [desktop]: 1 text elements below WCAG AA (measured on screen pixels) e.g. #ffffff on screen = 3.77:1 median, 1.42:1 in the worst tenth (needs 4.5) <button> "Preview"
- FAIL contrast [tablet]: 3 text elements below WCAG AA (measured on screen pixels) e.g. #747474 on screen = 4.03:1 median, 4.03:1 in the worst tenth (needs 4.5) <p> "Previewing" | #000000 on #333333 = 1.66:1 (needs 4.5, not re-checked on screen) <span> "Play/Pause Audio"
- FAIL tap-target [mobile]: 4 controls smaller than 24x24px on a phone e.g. 102x16 <a> "Connell McCarthy" | 40x16 <button> "Credits"
- FAIL contrast [mobile]: 5 text elements below WCAG AA (measured on screen pixels) e.g. #747474 on screen = 4.32:1 median, 2.70:1 in the worst tenth (needs 4.5) <p> "Previewing" | #ffffff on screen = 1.57:1 median, 1.33:1 in the worst tenth (needs 4.5) <p> "{track.title}"
- FAIL reduced-motion [reducedMotion]: 8 text elements stay hidden when the visitor asks for reduced motion e.g. Close modal | Follow COVEO to stay connected
- WARN system-font-only [desktop, tablet, mobile]: Only a default typeface carries the page (Inter, monospace)
- WARN small-text [desktop, tablet, mobile]: Text at 10.2px e.g. <a> "Listen on Apple Music"
- WARN fixed-cover [desktop]: 1 fixed or sticky element(s) that are not a bar cover part of every screen; make it a slim bar or let it scroll away e.g. 320x264 (29% of the screen height) <div> "Credits Close modal A project by Connell McCarthy "
- WARN fixed-cover [tablet, mobile]: 2 fixed or sticky element(s) that are not a bar cover part of every screen; make it a slim bar or let it scroll away e.g. 320x105 (10% of the screen height) <div> "COVEO Close modal Follow COVEO to stay connected" | 320x264 (26% of the screen height) <div> "Credits Close modal A project by Connell McCarthy "
- WARN text-at-edge [mobile]: 11 text elements within 12px of the screen edge e.g. <span> "Play/Pause Audio" | <span> "Close modal"

## Page text (first 6000 characters of 2242)

PREVIEWING

{TRACK.TITLE}

0:00 / 0:00

Play/Pause Audio
COVEO
CLOSE MODAL

Follow COVEO to stay connected

COVEO
CHAPTER I
LISTEN ON SPOTIFY
LISTEN ON APPLE MUSIC
LISTEN ON SOUNDCLOUD
LISTEN ON BANDCAMP
LISTEN ON YOUTUBE
PREVIEW

RELEASE TYPE

SINGLE, 1 SONG

RELEASE DATE

MARCH 23 2019

TOTAL RUNTIME

3 MINUTES 20 SECONDS

BEHIND THE SONG

Chapter I first came together back in May 2016 during a time when I was feeling pretty burnt out on the electronic stuff I’d been making. I was exploring the Pacific Northwest, diving into indie folk music, and had just finished reading Into the Wild—all of that inspired me to create something more organic and natural.

The track sat on my hard drive for years collecting dust until I finally decided to finish it. It’s a chill, cinematic piece that tells a bit of a story as it unfolds.

Fun fact: it’s actually the first half of a two-part series…the second half is still waiting patiently on my hard drive.

CREDITS

PERFORMED BY

COVEO

WRITTEN BY

Connell McCarthy

PRODUCED BY

COVEO

Source: COVEO Music

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
