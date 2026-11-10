# Data tables: the rules, why, and when not (owner 2026-11-10; research 2026-11-10)

The one home for how a data table in an admin or app screen (`modes/app-screen.md`) is designed:
lists of records people find, compare, edit and act on (orders, products, users, invoices). It is
read at the build step of any screen that lists records with three rows or more, and by
`adminoptions.mjs` for its table. Structure and behaviour come from shadcn/ui
(`rules/stack.md`: its Data Table is TanStack Table with sorting, filtering, column visibility,
row selection and pagination); the style comes from `admin/method.md`. This file decides *what the
table does and why*.

**Not for:** a comparison or pricing table on a landing page, or a short read-only table of a few
facts (GOV.UK style). There only T10 (alignment), T12 (header) and the caption apply.

**Why this file exists.** The team's audit of four table references
(`data/admin-patterns/table/jury-ux-visual.json`, 2026-11-10) found that none right-aligned numbers
and none showed what happens after rows are selected. The owner listed nine basics the same day.
Each was checked against design systems, accessibility guidance and practitioner research below.

## How to read a rule

Every rule has: **the rule**; **why**, in plain words the user can repeat when someone asks "kenapa
begini?"; **when / when not**, because design is contextual and every rule has a cost; **access**
(accessibility); **sources** (ids in the list at the end, all read 2026-11-10). Origin tags:
**[Owner 2026-11-10]** the owner's nine basics, **[Audit]** the two failures of the reference
audit, **[Research]** basics found in the sources beyond the owner's list.

Use the rules as defaults, not laws: a decision that departs from one is fine when its reason is
written in `.design/deliver.md` → "Alasan desain" (`rules/rationale.md`), citing the rule id.

**Measured by `inspect.mjs`** (severities in `rules/style-defaults.json`, tunable per team or brand;
a table counts when it is a `<table>`, `role="table"` or `role="grid"` with three data rows or more):

| Check | Severity | Rule |
| --- | --- | --- |
| `table-numbers-align`: a column of amounts or counts (80% of its cells) not right-aligned; IDs, SKUs, phones, dates and years are skipped by header and pattern | WARN | T10 |
| `table-checkbox-align`: row and header checkboxes more than 2px apart horizontally | WARN | T5 |
| `table-checkbox-target`: checkbox hit area (control + its label) under 24×24px at desktop and tablet; on a phone the `tap-target` FAIL applies | WARN | T5 |
| `table-truncation`: a value cut with an ellipsis (or line clamp) with no `title`, `aria-label`, `aria-describedby` tooltip or expand control | WARN | T8 |
| `table-bulk-actions`: at desktop, clicking the first row checkbox brings up no new or newly enabled action outside the rows (then the selection is cleared); `table-bulk-unmeasured` INFO when the click could not select | WARN | T11 |
| `table-sticky-columns`: the table scrolls sideways and its identifier or actions column is not sticky | INFO | T3 |

Not measured: sort, filters, import/export, thumbnails, pagination, states, density, saved views
(judged by the jury and the user). The bulk check sees only actions that appear or become enabled;
a toolbar that is always enabled reads as "no bulk actions" (a known false WARN, defend it in the
report). `title` passes the truncation check although it is mouse-only (see T8).

---

## The owner's basics

### T1. Import and export where the data lives [Owner 2026-11-10]

- **Rule.** When users bring records in from, or take them out to, other tools, put Export (and
  Import, if records are created in bulk) as secondary actions in the table's toolbar or page
  header, not hidden in settings. Export says what it exports: the current filtered view or all
  records, and the format. Import shows a preview with the columns mapped and the errors per row
  before anything is written, and offers a template.
- **Why.** Spreadsheets are where admin data gets checked, shared with finance, or fixed in bulk; a
  table with no way out forces copy-paste, and a blind import corrupts data with no way back.
- **When / when not.** Worth it for catalogues, orders, contacts, transactions. Not needed for a
  short list nobody reports on, or where an API sync already moves the data. Cost: import is a
  whole flow (mapping, validation, partial failure, undo); do not show the button before that flow
  exists. Evidence is thin: design systems show the placement (S6: toolbar "for global table actions
  such as … exporting"; S13: Shopify's index page has "Export" and "Import" as secondary page
  actions), but no usability study was found.
- **Access.** Buttons with a text label ("Ekspor CSV"), not an icon alone; announce a finished or
  failed export in a status message (WCAG 4.1.3, S28).
- **Sources.** S6, S13, S28.

### T2. Sort by the columns people compare [Owner 2026-11-10]

- **Rule.** Columns people order by (date, amount, status, name) sort from the header; the whole
  header cell is the button; the sorted column shows its direction; the table opens in a sensible
  default order (newest or most urgent first). Not every column needs to sort.
- **Why.** Sorting turns "find the biggest order" or "what came in today" into one click instead of
  scanning every row (S1: finding records is the first of the four table tasks).
- **When / when not.** Most systems sort from the header (S6, S10, S12); Carbon shows the sort symbol on hover or focus and keeps it on the sorted column (S7). Primer: "If a table is
  sortable, one column must be sorted by default" (S12); Pencil & Paper: default to most recent or
  most needing action (S24). Sources disagree on showing the icon on unsorted columns: Carbon shows
  it only on hover (S6), the W3C example adds a distinct icon to every sortable column so people see
  what can be sorted (S16). Pick one and keep it consistent; prefer visible icons for occasional
  users. Not needed for tables under about ten rows.
- **Access.** `aria-sort` on the sorted `<th>` only (remove it elsewhere), a `<button>` inside the
  header, an icon that differs by shape, not colour (S16, S19). Some screen readers announce nothing
  after a sort: consider a polite live region ("Diurutkan menurut Harga, naik") (S19).
- **Sources.** S1, S6, S7, S10, S12, S16, S19, S24.

### T3. Freeze the identifier and the actions on a wide table [Owner 2026-11-10]

- **Rule.** When the table is wider than its box and scrolls sideways, keep the identifier column
  (the record's human-readable name, T17) sticky on the left and the row-actions column sticky on
  the right; keep the header row sticky too (T12).
- **Why.** Without the name in view, a user who scrolled to the "Status" column no longer knows
  which product the row is; without the actions in view they must scroll back to act.
- **When / when not.** Strong agreement for the header and the first column: NN/g "Freeze header rows
  and header columns (if the table is larger than the screen)" (S1), on mobile "the leftmost column
  … should be locked" (S4); also S23, S25. The sticky **actions** column is common practice
  (MUI pins `actions` right in its example, S27; Pencil & Paper mentions the rightmost column for
  totals, S24) but no study was found: treat it as a convention, not evidence. Cost: every frozen
  column takes width from the scrolling part. Roselli: if the frozen column "is not sufficiently
  narrower than the container/viewport width, then this will be terrible" (S20). On a phone freeze
  one column at most (the identifier), or move actions into the row's detail view. Not needed when
  the table fits; first cut columns (T15) before freezing.
- **Access.** The scroll box gets `tabindex="0"` and a name from the caption so keyboard users can
  scroll it (S21, S22); data tables are exempt from WCAG 1.4.10 reflow when they scroll in their own
  box (S29). Give sticky cells a solid background so text does not layer (S20).
- **Sources.** S1, S4, S20, S21, S22, S23, S24, S25, S27, S29.

### T4. Checkboxes, multi-select and bulk actions [Owner 2026-11-10]

- **Rule.** When people apply the same action to many records (archive, change status, delete,
  export), give each row a checkbox and the header a select-all with three states (none, some,
  all). The actions for the selection appear as described in T11.
- **Why.** Doing one action twenty times row by row is slow and error-prone; selection makes it one
  step (S1: "Batch actions usually involve a mechanism for selecting records … a space-efficient
  presentation of multiple options"; S6).
- **When / when not.** Not for read-only tables or where actions are always single-record (an
  "Approve" that needs reading each request). Make clear whether select-all means this page or every
  matching record (Primer names the scope: "Select all 10 rows", S12). Pencil & Paper shows
  checkboxes on hover to save clutter (S24); that hides the feature: keep them visible on work
  lists. Single choice uses radios, not checkboxes (S6).
- **Access.** Every checkbox has a name that says which row ("Pilih Kopi Arabika", not "Pilih")
  (S10, S12); the header checkbox uses `indeterminate` for "some"; selection must not rely on
  row colour alone (S10).
- **Sources.** S1, S6, S10, S12, S24.

### T5. Checkboxes on one line, with a real target [Owner 2026-11-10]

- **Rule.** The selection checkboxes sit in their own first column, every row's checkbox and the
  header's on the same vertical line (within 2px), vertically centred in the row, with a hit area of
  at least 24×24px (the label or the whole cell is the target).
- **Why.** A crooked checkbox column reads as a broken table and slows the eye going down it; a
  14px box in a dense list is easy to miss and easy to hit on the wrong row.
- **When / when not.** Always, when there are checkboxes. WCAG 2.5.8 (AA) asks 24×24px *or* enough
  spacing (a 24px circle around each target does not touch another) (S18), so a small box in tall
  rows can pass WCAG; the owner's rule is stricter on purpose, because the label-as-target costs
  nothing. Carbon gives each action "its own distinct click target" (S6); the W3C sortable example
  enlarges targets for "people with visual and movement impairments" (S16).
- **Access.** As above; on a phone the inspector's `tap-target` FAIL applies.
- **Sources.** S6, S16, S18.

### T6. Filters that fit the data type [Owner 2026-11-10]

- **Rule.** Choose the filter control from the column's data: a set of values → checkboxes or a
  multi-select (radios for exactly one); dates → a range with presets ("7 hari terakhir");
  amounts → a min/max range; free text → search. Show active filters as removable chips with a
  count and one "Hapus semua filter" (clear all), and show the filtered row count.
- **Why.** The right control makes a filter one move instead of typing guesses; visible active
  filters stop people from thinking records are missing (NN/g: "users should be able to easily
  understand that they are looking at filtered data", S1).
- **When / when not.** Carbon: "Consider the data your users are looking at"; single-select behaves
  like radios, multiselect like checkboxes; "Multiple categories should never be put within a menu or
  dropdown"; batch filters with an Apply button when data returns slowly, instant filters for one
  category (S8). Do not filter by a value the table does not show (the audit's tb-004). A table under
  about twenty rows needs search at most.
- **Access.** Labelled controls; announce the new result count in a status message (S28); never a
  colour-only active state.
- **Sources.** S1, S8, S26.

### T7. Small thumbnails for rows with photos [Owner 2026-11-10]

- **Rule.** When people recognise a record by its picture (products, listings, menu items), show a
  small fixed thumbnail (about 40px, square, cropped to cover) at the start of the identifier cell.
- **Why.** A picture is found faster than a name in a long list of similar products, and it catches
  a wrong photo before customers see it.
- **When / when not.** Shopify's resource index shows 40×40px thumbnails in the product cell (S13);
  Pencil & Paper lists images among the visual cues a table can add (S24). No usability study was
  found: it is a convention from commerce admins. Not for records with no meaningful picture (users,
  invoices: initials or nothing), and drop it on dense tables where height matters more. Cost: image
  loading in long tables (lazy-load, fixed size so rows do not jump).
- **Access.** When the name sits next to the picture, the picture is decorative: `alt=""` so the name
  is not read twice (W3C, S30). Shopify's example names the image anyway (S13); either is defensible,
  the empty alt is the W3C advice. Not colour or picture alone for state.
- **Sources.** S13, S24, S30.

### T8. Long values: wrap first, truncate with a way to read the rest [Owner 2026-11-10]

- **Rule.** Prefer wrapping to two lines or a wider column. Truncate (ellipsis) only values the team
  does not control (user-written names, notes, URLs), and always give a way to read the whole value
  that works with keyboard and touch: the row's detail view (T16), an expand control, or a tooltip
  on a focusable element. A `title` attribute alone is the minimum, not the fix.
- **Why.** A cut value can say something untrue ("Kopi Arabika Gayo Wine…" may be two products), and
  people cannot act on what they cannot read.
- **When / when not.** Primer: "The most accessible static element is one that is not truncated";
  "Tooltips are rarely appropriate in truncation use cases"; a hover tooltip "is not available to
  keyboard-only and speech recognition users" (S14). NN/g: tooltips work only with a mouse or
  keyboard, "not normally available on touchscreens", and must not hold vital information (S2).
  Carbon truncates long *column titles* after two lines with the full text in a tooltip (S6), and
  warns against cramped containers that force truncation (S6). WCAG 1.4.13: content shown on hover
  or focus must be dismissible, hoverable and persistent (S17); the browser's `title` tooltip is
  outside that criterion but cannot be reached by keyboard or touch. Truncation is fine for very
  wide free text when the detail view is one click away.
- **Access.** As above; do not truncate links or buttons (S14).
- **Sources.** S2, S6, S14, S17.

### T9. Pagination with a page size, or load more [Owner 2026-11-10]

- **Rule.** Work lists use pagination at the bottom with the range and total ("1–25 dari 1.240"),
  previous/next, and a page size with two or three clearly different options (for example 25, 50,
  100), remembered for the next visit. Not infinite scroll.
- **Why.** Pages give landmarks ("it was on page 3"), a reachable end of the list, and a known
  number of rows to act on; infinite scroll loses the place on return and hides the total.
- **When / when not.** NN/g does not recommend infinite scrolling when users "find something
  specific", "compare items", or need the footer; it suits feeds browsed with no goal (S3). Carbon
  offers "advanced pagination" with items per page (S6), Material's table has a rows-per-page select
  (S9), Shopify paginates beyond 100 rows (S13), Coyle: infinite scroll "is usually disastrous for
  prioritization apps" (S26). **Where research disagrees with the owner:** Nielsen calls a page-size
  menu with "View 10, 20, 30, 40" "often overkill" and prefers a good default plus "View all" (up to
  about 100) or two sizes far apart, and insists the choice is remembered (S5). So: a page size only
  where people process many rows (bulk work), with options far apart; otherwise a good default and
  "Tampilkan semua" for short lists. A "Load more" button is a fair middle for phones (S3).
- **Access.** Pagination is a `nav` with a name; the current page has `aria-current="page"`; after a
  page change move focus to the table or its caption, and announce the range (S28).
- **Sources.** S3, S5, S6, S9, S13, S26, S28.

## The audit failures

### T10. Right-align numbers people compare; headers follow their column [Audit]

- **Rule.** Amounts, counts, percentages and quantities are right-aligned with the same number of
  decimals and tabular figures (`font-variant-numeric: tabular-nums`); the header aligns with its
  column. Numbers that are names (order no., SKU, phone, postcode, year) and dates stay left.
  Text is left-aligned; avoid centring.
- **Why.** Right alignment puts units under units and thousands under thousands, so the eye sees
  which value is bigger without reading each digit; a left-aligned price column hides that
  "Rp 1.240.000" is ten times "Rp 124.000".
- **When / when not.** GOV.UK: "When comparing columns of numbers, align the numbers to the right"
  (S11); Primer: right-aligned "for numbers … to make it easier to visually scan and compare" (S12);
  Material marks numeric cells and headers (S9); shadcn/ui's example right-aligns the amount (S31);
  Pencil & Paper and Smashing add the exceptions for qualitative numbers and dates (S24, S25). In a
  right-to-left language the rule mirrors.
- **Access.** No change to semantics; keep contrast of muted numbers at 4.5:1.
- **Measured:** `table-numbers-align`. **Sources.** S9, S11, S12, S24, S25, S31.

### T11. Selecting rows brings up a bulk-action bar with the count [Audit]

- **Rule.** As soon as one row is selected, show a bar (at the top of the table, or fixed at the
  bottom of the screen on long tables) with the count ("3 dipilih"), the actions for the selection as
  verb + noun ("Hapus produk"), and a way to clear the selection. Destructive bulk actions confirm
  with the count. While the bar is shown, row actions that conflict may be disabled.
- **Why.** Selection without a visible next step is half a feature: people tick boxes and then look
  for what to do; the count stops them acting on more records than they think.
- **When / when not.** Carbon: "Once an item from the table is selected, the batch action bar appears
  at the top of the table … When batch mode is active, single action icons … should be disabled";
  exit by Cancel or deselecting all (S6). Pencil & Paper: actions shown only once rows are selected,
  or a toolbar fixed to the bottom (S24). Shopify's example labels its actions verb + noun ("Export puzzles", S13). An always-visible
  toolbar is acceptable when its buttons are disabled until something is selected and the count is
  shown. Not needed without T4.
- **Access.** Put the bar where focus can reach it next (before the table in reading order), name it
  ("Aksi untuk produk terpilih"), announce the count in a polite live region (S28).
- **Measured:** `table-bulk-actions` (desktop). **Sources.** S6, S13, S24, S28.

## Beyond the owner's list [Research]

### T12. Sticky header row on long tables

- **Rule.** A table taller than the screen keeps its header row in view, in the same style it has
  when not stuck.
- **Why.** Without it, column 6 of row 40 is just a number with no name.
- **When / when not.** NN/g (S1, S4), Smashing (S25: "Sticky headers ought to retain their existing
  styles"), Coyle (S26). Not needed for short tables. **Access.** `position: sticky` on `th` or
  `thead` keeps real table semantics; avoid a second "header table" or div rebuilds (S20).
- **Sources.** S1, S4, S20, S25, S26.

### T13. Empty, loading, error and no-results states

- **Rule.** Design every state: first-use empty (what goes here + the action to add one),
  no results after filtering (say which filters, offer "Hapus filter"), loading (a skeleton of rows
  at the final height, not a spinner over a blank page), error (what failed, retry), and no
  permission.
- **Why.** An empty table is ambiguous: no data, still loading, broken, or filtered out? Each needs a
  different next step. The audit's tb-001 did this well with "No contact" in empty cells.
- **When / when not.** NN/g: "Totally empty states cause confusion about how and whether the system
  is working" (S23). Carbon and Primer use skeletons for loading (S6, S12); the Agriculture design
  system uses an empty state instead of an empty table "because the experience … is simpler",
  and screen reader users need not navigate a table to learn it is empty (S32). Already a priority
  in `modes/app-screen.md`; this rule says what each state contains.
- **Access.** Announce results and errors in a status message (S28).
- **Sources.** S6, S23, S12, S28, S32.

### T14. Density that fits the job, optionally user-set

- **Rule.** Pick the row height from the work: about 40–56px for daily lists, more for two-line
  rows. Offer a density switch (compact / default / comfortable) only for heavy users; keep the
  header, toolbar and pagination at the same height as the rows.
- **Why.** Tight rows show more at once but cause reading errors; airy rows read well but force
  scrolling.
- **When / when not.** Carbon has five row sizes and matches toolbar and pagination to them (S6);
  Primer has condensed/normal/spacious (S12); Coyle: smaller rows affect scannability, so many tables
  let users control density (S26); Smashing: rows 40–56px with 16px side padding (S25). Admin
  direction `soft-floating` warns against very dense tables (`admin/method.md`).
- **Sources.** S6, S12, S25, S26.

### T15. Fewer columns by default; let people hide and reorder

- **Rule.** Show the columns most users need on load, related columns side by side; offer a
  "Kolom" menu to show/hide (and reorder) with a visible "N hidden" state and a reset.
- **Why.** Every extra column pushes the important ones off screen; people compare adjacent columns
  best.
- **When / when not.** NN/g: hiding and reordering "must be easy … and accessible for those that
  don't use drag and drop", with a visible state for hidden columns (S1); Pencil & Paper: provide a
  reset (S24); shadcn/ui ships column visibility (S31). Not for short fixed tables.
- **Access.** Reorder by a menu or buttons, not drag alone (S1).
- **Sources.** S1, S24, S31.

### T16. Row actions: visible, labelled per row; details in a side panel

- **Rule.** One or two row actions stay visible in the last column; more go into a "⋯" menu with a
  name per row ("Aksi untuk Kopi Arabika"). Open a record's details or edit form in a side panel or
  its own page, not a modal over the table.
- **Why.** Hover-only actions are invisible until found and do not exist on touch; modals hide the
  rows people want to compare while editing.
- **When / when not.** Carbon: with fewer than three options keep them inline; menus persist by
  default, hover-only is an option, and touch devices always show them (S6); Primer: actions in the
  last column, at most one pulled out of the menu (S12); Atlassian: label "Edit component 3", not
  "Edit" (S10); NN/g: modals cover the records users refer to while editing, a non-modal panel keeps
  them (S1). The audit's tb-001 lost points for hover-only actions.
- **Access.** Unique accessible names per row action (S10); keyboard reachable.
- **Sources.** S1, S6, S10, S12.

### T17. A human-readable identifier first; a caption; real table semantics

- **Rule.** The first data column is the record's readable name (with the ID beside it if needed),
  linked to its details. The table has a caption or an `aria-label`; `th` with `scope`; a `<table>`
  unless most cells are interactive (then `role="grid"` with arrow-key navigation).
- **Why.** People scan the first column to find a record; an auto ID is "mystery meat" (S1). The
  caption tells screen reader users which table they are in.
- **When / when not.** NN/g (S1); GOV.UK caption and `scope` (S11); Atlassian caption or label, not
  both (S10); Inclusive Components: caption over summary, a heading inside it (S21); Higley and the
  W3C: tables can sort, filter and hold buttons and still be tables; a grid is for spreadsheet-like
  work (S15, S33).
- **Sources.** S1, S10, S11, S15, S21, S33.

### T18. Row separation: lines by default, zebra for long wide rows

- **Rule.** Light 1px row lines by default; zebra stripes when rows are long and wide and people
  read across; no heavy vertical borders.
- **Why.** Both help the eye stay on its row; stripes compete with hover, selected and disabled
  greys.
- **When / when not.** NN/g: borders, zebra striping and hover highlight all help keep place (S1);
  Carbon offers zebra as a modifier and keeps hover on (S6); Pencil & Paper: stripes make states hard
  to tell apart (S24); Coyle: stripes can be read as meaningful in short tables (S26).
- **Access.** Never mark selection or state by row colour alone (S10).
- **Sources.** S1, S6, S10, S24, S26.

### T19. Remember the user's view; saved views for heavy users

- **Rule.** Remember sort, filters, page size, hidden columns and density per user; for heavy users
  offer named saved views ("Stok menipis"). Always offer "reset to default".
- **Why.** Re-building the same view every morning is the most repeated waste in admin work.
- **When / when not.** Nielsen: respect the stated preference as the next default (S5); Pencil &
  Paper: preserve the setup across sessions with a reset (S24); Coyle: save column presets (S26).
  Most users never customise, so the default view matters more than the options (S5).
- **Sources.** S5, S24, S26.

## Where the research disagrees with the owner's basics

- **T9 page size:** Nielsen calls a many-option page-size menu overkill (S5); design systems still
  ship one (S6, S9). Rule kept, narrowed: options far apart, remembered, for bulk-work lists.
- **T8 tooltip:** the weakest basic. Primer: tooltips "rarely appropriate" for truncation (S14);
  NN/g: not on touch (S2). Rule changed to "wrap first; truncate with a keyboard and touch path".
- **T3 sticky actions column:** the first column and header are well supported (S1, S4); the actions
  column is a library convention without a study (S27), and frozen columns cost width on phones
  (S20). Rule kept for wide tables, one frozen column on a phone.
- **T7 thumbnails and T1 import/export:** placement conventions from commerce admins (S13), no
  research found; kept as "when it fits", not "always".
- **T4 visible checkboxes:** Pencil & Paper shows them on hover (S24); NN/g and Carbon treat hidden
  affordances as a discoverability cost (S1, S6). Rule keeps them visible on work lists.
- **T2 unsorted-icon visibility:** Carbon (hover only, S6) and the W3C example (always, S16) differ.

## Sources (all opened and read 2026-11-10)

| Id | Source | Link |
| --- | --- | --- |
| S1 | Page Laubheimer, "Data Tables: Four Major User Tasks", Nielsen Norman Group, 2022-04-03 | https://www.nngroup.com/articles/data-tables/ |
| S2 | Alita Kendrick, "Tooltip Guidelines", NN/g, 2019-01-27 | https://www.nngroup.com/articles/tooltip-guidelines/ |
| S3 | Tim Neusesser, "Infinite Scrolling: When to Use It, When to Avoid It", NN/g, 2022-09-04 | https://www.nngroup.com/articles/infinite-scrolling-tips/ |
| S4 | Amy Schade, "Mobile Tables: Comparisons and Other Data Tables", NN/g, 2017-09-17 | https://www.nngroup.com/articles/mobile-tables/ |
| S5 | Jakob Nielsen, "Users' Pagination Preferences and 'View All'", NN/g, 2013-04-28 | https://www.nngroup.com/articles/item-list-view-all/ |
| S6 | IBM Carbon, Data table: usage (updated 2026-09-30) | https://carbondesignsystem.com/components/data-table/usage/ |
| S7 | IBM Carbon, Data table: accessibility | https://carbondesignsystem.com/components/data-table/accessibility/ |
| S8 | IBM Carbon, Filtering pattern | https://carbondesignsystem.com/patterns/filtering/ |
| S9 | Material Components for the web, Data table (numeric cells, row selection, rows per page) | https://github.com/material-components/material-components-web/blob/master/packages/mdc-data-table/README.md |
| S10 | Atlassian Design System, Dynamic table: usage | https://atlassian.design/components/dynamic-table/usage |
| S11 | GOV.UK Design System, Table | https://design-system.service.gov.uk/components/table/ |
| S12 | GitHub Primer, DataTable | https://primer.style/product/components/data-table/ |
| S13 | Shopify (Polaris web components), Index / resource index pattern | https://shopify.dev/docs/api/app-home/patterns/templates/resource-index |
| S14 | GitHub Primer, Accessibility: Truncation | https://primer.style/accessibility/patterns/truncation/ |
| S15 | W3C WAI-ARIA APG, Table pattern; Grid pattern | https://www.w3.org/WAI/ARIA/apg/patterns/table/ · https://www.w3.org/WAI/ARIA/apg/patterns/grid/ |
| S16 | W3C WAI-ARIA APG, Sortable Table example | https://www.w3.org/WAI/ARIA/apg/patterns/table/examples/sortable-table/ |
| S17 | W3C, Understanding SC 1.4.13 Content on Hover or Focus | https://www.w3.org/WAI/WCAG21/Understanding/content-on-hover-or-focus.html |
| S18 | W3C, Understanding SC 2.5.8 Target Size (Minimum) | https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html |
| S19 | Adrian Roselli, "Sortable Table Columns" (2021, updated 2026-10-14) | https://adrianroselli.com/2021/04/sortable-table-columns.html |
| S20 | Adrian Roselli, "Fixed Table Headers" (2020, updated 2026-10-06) | https://adrianroselli.com/2020/01/fixed-table-headers.html |
| S21 | Heydon Pickering, "Data Tables", Inclusive Components, 2018-03-31 | https://inclusive-components.design/data-tables/ |
| S22 | Adrian Roselli, "Under-Engineered Responsive Tables" (2020, updated 2026-10-05) | https://adrianroselli.com/2020/11/under-engineered-responsive-tables.html |
| S23 | Kate Kaplan, "Designing Empty States in Complex Applications: 3 Guidelines", NN/g, 2021-09-19 | https://www.nngroup.com/articles/empty-state-interface-design/ |
| S24 | Fanny Vassilatos and Ceara Crawshaw, "Data Table Design UX Patterns & Best Practices", Pencil & Paper (undated) | https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables |
| S25 | Yuliia Nikitina, "Exploring Universal And Cognitive-Friendly UX Design Through Pivot Tables And Grids", Smashing Magazine, 2023-06 | https://www.smashingmagazine.com/2023/06/universal-cognitive-friendly-ux-design-tables-grids/ |
| S26 | Andrew Coyle, "Design better data tables" (web version; first on Medium) | https://www.andrewcoyle.com/blog/design-better-data-tables |
| S27 | MUI X Data Grid, Column pinning | https://mui.com/x/react-data-grid/column-pinning/ |
| S28 | W3C, Understanding SC 4.1.3 Status Messages | https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html |
| S29 | W3C, Understanding SC 1.4.10 Reflow (data tables exception) | https://www.w3.org/WAI/WCAG21/Understanding/reflow.html |
| S30 | W3C WAI Images Tutorial, Decorative images | https://www.w3.org/WAI/tutorials/images/decorative/ |
| S31 | shadcn/ui, Data Table | https://ui.shadcn.com/docs/components/data-table |
| S32 | Australian Government Agriculture Design System, CRUD data tables pattern | https://design-system.agriculture.gov.au/patterns/crud-data-tables |
| S33 | Sarah Higley, "Grids Part 1: To grid or not to grid" | https://sarahmhigley.com/writing/grids-part1/ |

Not reachable from the research machine: Material 3 / m2.material.io guideline pages (rendered by
script; the component README was read instead), Salesforce Lightning (the v1 class reference was
opened but holds no guidance, so it is not cited), SAP Fiori (HTTP 403), Shopify's old Polaris
index-table page (redirects to shopify.dev), Baymard (rendered by script), the Medium copy of
Coyle's article (403). NN/g's "Comparison Tables" was opened but is not cited (it is about product
comparison, outside this file's scope).
