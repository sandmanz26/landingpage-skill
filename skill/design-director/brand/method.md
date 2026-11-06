# Brand elements (DRAFT for the owner's review, 2026-11-06; not yet wired into progress.mjs)

A page has branding when someone who sees one screenshot, with the logo covered, still knows whose
it is. That comes from a small set of **brand elements**: shapes, colours, motifs and behaviours that
repeat across the page and come from the business itself. Generated pages fail here in two ways:
they have no elements at all (a neutral template with a logo), or they have many unrelated
decorations (a blob here, a gradient there) that belong to no one.

This method builds a **brand kit** for the page, even when the client has no brand yet. It runs at
the direction step (`modes/create.md` step 5), from the strategy's subject inventory, and writes
`.design/brand-kit.md`. The spec turns the kit into tokens and rules; the reason roast and the jury
check that the kit is used, consistently, all the way down the page.

## 1. Where elements come from (sources)

Never from "what looks nice" or a trend. List the sources first, in `brand-kit.md` → "## Sources":

| Source | Ask | Example (Dapur Seimbang, healthy lunch catering) |
| --- | --- | --- |
| The name | What does it say or sound like? | "Seimbang" = balance: equal parts |
| The product or service | Its form, material, container, tools | the bento box with four compartments |
| The place | Its streets, buildings, light, materials | office desks in Jakarta Selatan, lunch hour |
| The customer's moment | When and how they meet the product | 12.00, the box arriving on a desk |
| The promise | The one thing the business stands for (message house) | "a complete meal every day without thinking" |
| What exists | Logo, colours, signage, packaging, uniforms, photos | (none yet) |

## 2. The element families

Decide each family on purpose, and trace every decision to a source. A family may be "not used",
with the reason; it may never be "default".

| Family | What it is | Decide | Good when | Fails when |
| --- | --- | --- | --- | --- |
| **Shape language** | The vocabulary of outlines: corners, cuts, arches, pills, notches, waves | One or two shapes and their radius values, from the product or place | The same shape returns in buttons, frames, cards, section edges | Every component has its own radius; shapes from a UI kit |
| **Colour** | A palette with roles: ground, ink, signature, support, action | 2-3 hue families, the role of each, a share (about 60/30/10); one colour reserved for the action | Few hues repeated in fields, frames, drawings and states: harmony (owner, batch-007/008) | Many unrelated hues; the action colour used for decoration |
| **Gradient** | A change of colour across a surface | Only from a real light or material of the subject (dawn light, a ripening fruit), or none | It describes something; one direction and one pair of colours | Purple-to-blue by default; a gradient on everything |
| **Vector on element** | Drawn objects from the subject, on or around photos and components | One drawing language (stroke, fill, colours from the palette) and 3-6 objects from the subject inventory | Objects break a frame or sit on a component and say what the section says (Quite Nice leaves, Quilt rooms) | Generic icons, sparkles, random blobs |
| **Background and pattern** | What the page stands on: fields, textures, patterns | Fields of the palette per story chapter; a pattern only when it comes from a material (tile, weave, paper) | Each chapter has its ground; the change marks the story | A noise texture or grid "for depth"; the same white everywhere |
| **Typography as brand** | The display face and one typographic device | A face whose personality fits the voice; one device (italic for the promise, big numerals, a mono label) | The headline alone suggests the brand | A system or default face; five devices at once |
| **Imagery treatment** | How every picture is framed and finished | One crop, one frame shape (from the shape language), one finish | All pictures look like one shoot | Mixed crops, filters and frames |
| **Icon style** | Small symbols | Drawn in the same language as the vectors, or none | Icons read as part of the drawings | A stock icon set; emoji |
| **Line, border and label devices** | Dividers, stamps, tags, badges, underlines | One device used for one role (a stamp for prices, a tab for days) | It always means the same thing | Decorative lines with no role |
| **Signature component** | One component only this brand has | A component built from the product (the bento box that fills by day) | It carries the idea and is used 2-4 times | It appears once in the hero and never again |
| **Motion signature** | One way things move | One entrance and transition style, one easing, from the subject (a lid opening, a slide like a tray) | Every entrance and state change feels the same; reduced-motion version | Fade-up on everything; motion with no source |
| **Voice in microcopy** | How labels and buttons talk | From `copy/method.md` (voice "X, not Y") | Buttons and labels sound like the headline | Generic labels |

## 3. Choose, do not pile up

1. **One hero element.** The single element people will remember: usually the signature component
   or the vector language. Name it in one line: "the four-compartment box that fills by day".
2. **Two or three supporting elements.** Usually shape language, colour roles and one device.
3. **Everything else is quiet.** Families not chosen stay neutral and consistent; they never add a
   second idea.

More than four active elements is noise; fewer than two is a template.

## 4. Rules of use

For each chosen element, write where it appears, how often, at what size, and what it never does:

```markdown
| Element | Where | How often | Never |
| Compartment shape (radius 28px, 4-cell grid) | hero box, price card, menu rows, section edges | every section | inside body text |
| Signature box that fills by day | hero, week section, order form summary | 3 times | as decoration without content |
```

The **lower half of the page** carries the elements as strongly as the hero. A page whose first
screen is branded and whose price, steps, FAQ and footer are a template is the most common failure
(owner on the three-way test, 2026-11-06: "dari WhatsApp ke bawah kaku dan template").

## 5. Every element earns a small UX effect

Cosmetic elements are welcome when they do at least a small job for the visitor (owner, 2026-11-06):
guide the eye to the action, mark a new chapter, group related things, show state, slow the reader
at the proof, make the page recognisable on return. Name the effect in the rules of use. An element
with no effect at all goes (`rubric/reason.md`).

## 6. Tests (before the spec is written, and again at the look)

1. **Cover-the-logo test.** Hide the name and logo in three screenshots (hero, middle, footer). Can a
   viewer tell they are the same brand, and not a competitor's?
2. **Blur test.** Blur a screenshot until text is unreadable. Do the shapes and colours still say
   "this brand"?
3. **Swap test.** Put a competitor's name on the page. If nothing feels wrong, the elements are generic.
4. **Down-the-page test.** Count the chosen elements in each section. A section with none is a
   template section.
5. **Source test.** Every element points to a source in §1. "It looks good" is not a source.

## 7. Reading brand elements from a reference

When the user gives a reference, or the library returns one (`library.mjs find`), read its kit with
the same families before using anything, and ask the user what to take (owner, 2026-11-06): the
whole feel (structure and mood, rebuilt with the client's own assets and code; never a copy,
`rules/copyright.md`), the style (colour, shape, type), or one element. Examples from the library:

| Reference | Hero element | Supporting | Taken from |
| --- | --- | --- | --- |
| Quite Nice (batch-007) | Food photo in an arch with drawn leaves and oats breaking the frame | Colour field per chapter; drawn glyphs inside the headline | the ingredients |
| Quilt (batch-008) | Isometric rooms in the page palette with temperature badges | Coloured frames around customer photos; coral/teal fields | the product's promise (room-by-room) |
| Swehl (batch-003) | Arches framing curved display type | Colour chapters, one ink colour | the brand's softness |
| Summer Smash Tennis (batch-004) | Balls and racquets breaking photo frames | Court palette; pills that press down | the sport |

## 8. Output: `.design/brand-kit.md`

```markdown
# Brand kit: <client>
## Sources            (§1 table)
## Elements           (§2: one row per family: decision, source, or "not used" with reason)
## Hero element       (one line)
## Rules of use       (§4 table, with the UX effect of each element, §5)
## Tests              (§6: results of the five tests, with screenshots named)
```

The spec's Decisions and Tokens take their values from this file. Open questions for the owner's
review are in HANDOFF.md.
