# Mode: section

One section or component inside an existing design. Steps: brief → research → spec → roast → build →
reason → gate → look → deliver. Default effort is `quick`.

- **brief:** what the section must say or do, and where it sits. Show the card; one question at most.
- **research:** light. Reuse `.design/research.md` and `.design/strategy.md` if the project has them;
  otherwise find the customer question this section must answer and the proof available for it,
  from the page and the user's materials. Still write `research.md` with its Sources.
- **spec:** read the surrounding page first (its tokens, type scale, spacing, components) and match
  it. Write `.design/spec.md` with the section's claim, composition, content and the tokens it uses.
  Its composition must differ from the sections directly above and below it.
- **roast:** a short roast (`roast/method.md`) of the spec: does this section answer a real question
  at this point of the page, and is it the best answer? Respond to every point.
- **build:** tokens of the page only; no new colours, sizes or radii unless the spec says why.
- **gate, look, deliver:** as in `modes/create.md`, one look round.
