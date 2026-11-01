# The pinned poster (pinned-poster)

## Idea

Something stays put while everything else changes. A title holds its place across the viewport and the images beneath it swap; the name is split to two opposite corners and the page passes between the halves; a single frame stays centred while its contents change. Every scroll step is a new cover of the same magazine. The idea suits subjects that are a series (a book of portraits, a line-up, a collection, a set of projects): the fixed element says what the series is, the changing element shows its members.

## Composition

A sticky layer holds the fixed element for the height of two to three viewports: usually the title at 10–14vw across the middle or top of the screen, or two words pinned to the top-left and bottom-right corners. Under it, a stack of full-height panels scrolls by, each a single large photograph (portrait 4:5, centred, 40–50% of the viewport wide) with one line of caption at the same small size everywhere. The title sits above the images in the stacking order and uses `mix-blend-mode: difference` or a solid colour that reads on every panel. When the pinned run ends, the page releases into ordinary flowing sections with a narrow measure. Build with `position: sticky`; never hijack the scroll.

## Typography

The pinned title is the only large type on the page. Captions and body share one small size (15–17px). Tight tracking and solid weight so the title reads over photographs.

## Colour

One strong title colour against a pale or dark ground. Each panel may take its own flat ground colour sampled from its photograph.

## Imagery

A series of photographs with the same crop ratio and the same framing (all portraits, all objects, all rooms), so that swapping them reads as one image changing. Five to eight in the pinned run.

## What makes it rich

Repetition with change. The fixed title makes each new photograph feel like an event, so the photographs must be good and consistent.

## Pitfalls

If the title is not legible over every panel, the idea fails: test each one. Keep the pinned run under six viewports or it feels like a trap. On a phone the title shrinks to 16–18vw and stays pinned at the top; panels become full-width. A pin longer than three screens, or one where the screens under it are nearly empty, read in blind tests as a stuck page. Every screen under the pin needs its own content, and nothing may pass over the pinned words.

## Tags

- Type classes: grotesk-tight, condensed-heavy, heavy-black, extended-heavy
- Palette tags: two-tone, photographic-neutral, single-field
- Section tags: photo-led, poster, type-led
- Motion: pinned-story