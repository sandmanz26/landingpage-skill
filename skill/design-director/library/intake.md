# Taking in references

How a reference sent by the team (a link and a note, in the Excel template or in chat) becomes a
library entry. The human note is valuable and fallible: it is one juror's view, checked against the
page itself and against the other jurors before it shapes the skill.

1. **Record the note verbatim**, with who wrote it and when. Never rewrite the original.
2. **Parse it** into: what to take (part, device, quality), what to avoid, why it works (aesthetic,
   business, customer), and what it suits. Mark what the note leaves out: a note about looks only
   says nothing yet about the business or the customer.
3. **Find out the business** behind the site (research, short): what it sells, to whom, and the
   action the page wants. A visual choice can only be judged against that.
4. **Capture** the site (layout, fonts, colours, motion) when network access allows; until then the
   entry stays `pending-capture` and no visual claim is confirmed.
5. **Jury** (`rubric/jury.md`): the AI jurors judge the captured screens. Their views are added
   beside the human note.
6. **Reconcile**: for each claim in the note, mark *confirmed* (the capture and the jurors agree),
   *contested* (a juror disagrees, with evidence) or *unverifiable* (not visible in the capture).
   Wrong terms are corrected in the parsed fields (for example "wireframe" for a real product UI),
   while the original note stays as written.
7. **Questions back** to the contributor: anything unclear, unfinished or contested.
8. **Store** the entry; it enters the skill only through the next epoch and its eval.

Entries for a batch go to `data/references/batch-<n>.json` with a readable review beside it.
