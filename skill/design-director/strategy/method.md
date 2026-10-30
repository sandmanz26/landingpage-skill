# Strategy and storyline

Good design answers the business and the customer at the same time. The strategy says what the
business needs from the page and what the customer needs from it; the storyline puts the customer's
questions in the order they arise and answers each one, so that the action at the end feels like the
obvious next step. Everything here is built from `.design/research.md`; cite its findings by number.

Write `.design/strategy.md` in the format at the end of this file.

## 1. Business canvas

- **The action that pays:** the one thing the page must get (book, buy, sign up, ask for a quote).
- **Success measure:** what would show the page works (bookings per week, leads, sales, chats).
- **Offer:** what exactly is on the table, at what price, with what risk-reducer (trial, guarantee,
  free first visit).
- **Position:** against which alternatives, and the one difference that matters to customers.
- **Proof the business can show:** from the research. Missing proof is listed, not invented.
- **Constraints:** brand, legal and regulatory lines (health, finance), capacity, budget.

## 2. Customer profile

Who, in what situation, wanting what done, at which **awareness level**, deciding by what, afraid
of what, using which words. One profile per page; if two audiences matter, say which one the page
serves first and how the other is handled.

## 3. Message house

- **Roof:** the one promise, in the customer's words, that this business can prove.
- **Three pillars:** the reasons to believe it, each with its proof.
- **Foundation:** the answer to every major objection from the research.

## 4. Storyline

Choose the structure from the awareness level:

| Awareness | Storyline | Typical order |
| --- | --- | --- |
| Unaware of the problem | Story first | A situation they recognise → what it costs them → a different way → proof → action |
| Aware of the problem | Problem → solution | The problem in their words → how this solves it → proof → offer → action |
| Comparing solutions | Difference first | Why this is different → honest comparison → proof → offer → action |
| Aware of this product | Offer first | The offer → objections answered → guarantee → action |
| Ready to act | Action first | The action and what happens next → reassurance → details |

Then write the page as a sequence of beats. Each section answers exactly one question the customer
has **at that point**, proves the answer, and gives a reason to keep reading:

| # | The customer is asking | The answer (one sentence) | Proof | Why they read on | Section |

Rules:

- The first screen answers "what is this, is it for me, what do I do" in under five seconds.
- The top objection from the research is answered before the price.
- Proof sits next to the claim it supports, not in a separate "testimonials" block by habit.
- Every section must earn its place: no beat, no section.
- The action appears where the decision is likely made, not only at the end; the last screen
  repeats it with what happens after the click.

## 5. The idea

The subject inventory and the idea sentence come here, so the visual idea serves the message:
list 8–12 things only this client has, then write

> On this page, **[something that belongs to the subject]** becomes **[a device]**,

and check that the device carries the roof of the message house. Apply the competitor test: if a
competitor's name fits the sentence, find another item.

## Format (`.design/strategy.md`)

```markdown
# Strategy: <client> (v1)
## Business canvas
## Customer profile
Awareness level: <level> (research #<n>)
## Message house
Roof: ... · Pillars: 1 ... (proof) 2 ... 3 ... · Objections: ...
## Storyline: <structure>
| # | Customer asks | Answer | Proof | Reads on because | Section |
## Subject inventory and idea
## Open questions for the client
```
