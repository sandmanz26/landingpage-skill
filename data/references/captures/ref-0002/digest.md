# Digest: Replay | Data as Growth Capital

URL: https://www.replay.ai/ · description: "Replay values your company's operating data, strips every name and identifier, and pays you to license it to frontier AI labs."
Images in this folder: desktop-fold.png, mobile-fold.png, sheet-desktop.png, sheet-mobile.png, motion-sheet.png

## Outline (document order, % of page height)
- H1 2% Fund growth by licensing the data you already have.
- H2 19% You already own your next revenue stream.
- H2 34% What companies your size get paid.
- H2 46% Four steps. 120 minutes of your time.
- H2 56% Data De-Identification
- H3 59% Your data leaves cleaner than a medical record.
- H3 59% We built the pipeline and trained the model.
- H3 59% Set the scope and only license what you grant access to.
- H2 66% Where your data gets sold
- H2 76% Any industry. One requirement.

Actions: "Value my data" ×3 @0% first-screen stays-visible · "Details" ×1 @11% first-screen stays-visible · "Reject" ×1 @11% first-screen stays-visible · "Accept" ×1 @11% first-screen stays-visible · "VALUE" ×1 @47% · "TERMS" ×1 @50% · "PROTECT" ×1 @51% · "PAYOUT" ×1 @52% · "PII Coverage" ×1 @63% · "Our Pipeline" ×1 @63% · "Data Policy" ×1 @63% · "OVERVIEW" ×1 @92% · "ABOUT" ×1 @92% · "AI BUYERS" ×1 @92% · "PRIVACY POLICY" ×1 @92% · "HOW IT WORKS" ×1 @93% · "VALUATION" ×1 @93% · "CAREERS" ×1 @93% · "DATA PRIVACY" ×1 @93% · "REFERRALS" ×1 @93%
Prices: $10K, $100K, $1M, $1,000,000 · proof words: review 1, rating 2 · logo images: 1 · forms: 0 · page height: 8022px

## Motion (measured, desktop)
- Libraries: viewTransitions
- Full-screen sticky panels (CSS scroll device): 0
- Moving with no input: 722 elements at the top; further down: 900px (164), 1800px (30), 2700px (4); endless loops 0 (0 with text); pause control: no
- On scroll: up to 176 script-driven elements per step, up to 58 CSS/Web animations; durations 200-15000 ms; easings cubic-bezier(0.65, 0, 0.35, 1), cubic-bezier(0.4, 0, 0.2, 1), cubic-bezier(0.32, 0.72, 0, 1), cubic-bezier(0, 0, 0.2, 1), linear; properties borderBottomColor, borderLeftColor, borderRightColor, borderTopColor, translate, opacity, clipPath, strokeDashoffset, borderLeftWidth, transform
- Reduced motion: 0 still move on their own, 47 with the scroll
- Leaves the page by itself when idle: no
- Smoothness while scrolling (stutter): 16 fps, p95 frame 283.3 ms, 56 long frames >50 ms, 44% dropped; a plain page on the same machine: 60.3 fps, p95 16.7 ms, 0 long frames. Scripts blocked 4% of the scroll.
  Measured with software rendering (no GPU) on a slower CPU: this ranks pages by how heavy they are, it does not show what a laptop with a GPU shows. Run `smooth.mjs` on a real machine to judge stutter.
- Not measured: transitions to other pages.

## Design inventory (desktop)
- Fonts: Geist 63%, Geist Mono 18%, stkBureauSerif 18%; 14 sizes (72/64/50/44/32/24/18/16/14/12/10/8/6/4 px)
- Colours: 7 chromatic; text #777777 #ffffff #000000 #727272 #898989 #2a2a2a; backgrounds #fcfcfc #141518 #000000 #eae058 #c2edc8 #54702f #13a8ff #499df8
- Radii 2.7px 2.1px 3.35544e+07px; shadows 4; gradients 8; backdrop blur 5; layout shift (CLS) 0.001

## Inspector findings
- FAIL tiny-text [desktop, tablet, mobile]: Text at 8px e.g. <p> "process"
- FAIL tiny-text [desktop]: Text at 6.00011px e.g. <p> "process"
- FAIL tiny-text [desktop]: Text at 4.20016px e.g. <p> "def load_dataset(source):records = source.read()re"
- FAIL contrast [desktop]: 7 text colour pairs below WCAG AA e.g. #777777 on #ffffff = 4.48:1 (needs 4.5) <a> "AI buyers" | #898989 on #fcfcfc = 3.41:1 (needs 4.5) <p> "process"
- FAIL hidden-content [desktop, mobile]: 9 text elements were never visible during a full scroll (a reveal that never fires?) e.g. $100K - $1M | $1,000,000+
- FAIL tiny-text [tablet, mobile]: Text at 6.8px e.g. <p> "RL-2026-001 // Version 1.0"
- FAIL tiny-text [tablet, mobile]: Text at 7px e.g. <p> "classification: proprietary data / licensing"
- FAIL tiny-text [tablet]: Text at 2.88891px e.g. <p> "process"
- FAIL tiny-text [tablet]: Text at 2.02228px e.g. <p> "def load_dataset(source):records = source.read()re"
- FAIL contrast [tablet]: 10 text colour pairs below WCAG AA e.g. #777777 on #ffffff = 4.48:1 (needs 4.5) <a> "AI buyers" | #898989 on #fcfcfc = 3.41:1 (needs 4.5) <p> "process"
- FAIL headline-lines [tablet]: h1 runs to 4 lines e.g. <h1> "Fund growth by licensing the data you already have"
- FAIL hidden-content [tablet]: 8 text elements were never visible during a full scroll (a reveal that never fires?) e.g. $1,000,000+ | Receive an offer
- FAIL tiny-text [mobile]: Text at 7.15802px e.g. <p> "Tech"
- FAIL tiny-text [mobile]: Text at 2.808px e.g. <p> "process"
- FAIL tiny-text [mobile]: Text at 2.301px e.g. <p> "def load_dataset(source):records = source.read()re"
- FAIL contrast [mobile]: 9 text colour pairs below WCAG AA e.g. #898989 on #fcfcfc = 3.41:1 (needs 4.5) <p> "process" | #8d8d8d on #fcfcfc = 3.24:1 (needs 4.5) <p> "RL-2026-001 // Version 1.0"
- FAIL tap-target [mobile]: 12 controls smaller than 24x24px on a phone e.g. 63x16 <a> "Overview" | 95x16 <a> "How it works"
- FAIL reduced-motion [reducedMotion]: 9 text elements stay hidden when the visitor asks for reduced motion e.g. $100K - $1M | $1,000,000+
- WARN too-many-font-sizes [desktop]: 14 different font sizes on the page (aim for 5 or fewer doing the visible work)
- WARN small-text [desktop, tablet, mobile]: Text at 10px e.g. <p> "© 2026 Replay. All rights reservedSunsets HQ Corp."
- WARN body-size [desktop, tablet, mobile]: Running text at 14px (16px or more reads better) e.g. <p> "Optional measurement helps us understand how you f"
- WARN too-many-colours [desktop, tablet]: 7 distinct chromatic colours e.g. #eae058 | #c2edc8
- WARN centred-hero-two-ctas [desktop, tablet, mobile]: Centred hero headline with two buttons, the most common generated layout
- WARN console-errors [desktop, tablet, mobile]: 1 console or page errors e.g. Failed to load resource: the server responded with a status of 404 (Not Found)
- WARN body-size [mobile]: Running text at 14.5px (16px or more reads better) e.g. <p> "Frontier AI labs need training data on how real co"
- WARN too-many-colours [mobile]: 9 distinct chromatic colours e.g. #13a8ff | #f8f2d8

## Page text (first 6000 characters of 4853)

AI buyers
Data privacy
Referrals
Careers
Value my data
Fund growth by licensing the data you already have.

Frontier AI labs need training data on how real companies run. You're sitting on years of it. We value your data, strip out every name and identifier, and get you paid.

Value my data
EMAIL
ATTACHMENTS
CSV
CUSTOMER ORDERS
EMAIL
PLANNING THREAD
SLACK
MESSAGE
EMAIL
INBOX
SCAN
BILLING STATEMENT
EMAIL
PLANNING THREAD
EMAIL
MESSAGE LIST
SLACK
THREAD
JIRA
ISSUE LIST

PROCESS

IDENTIFIED
STRUCTURED
VERIFIED
LICENSED

RL-2026-001 // VERSION 1.0

CLASSIFICATION
PROPRIETARY DATA / LICENSING

Millions

Paid to businesses like yours

Billions

Personal identifiers removed

You already own your
next revenue stream.

Raising a round costs equity. Debt has to be paid back. Getting more revenue might take quarters you don't have.

But there's one more thing you own. It costs you none of that, and it wasn't worth anything until now. It's the record of how your company actually operates. Historically, there was never anywhere to sell it. Now there is.

CODE AND COMMITS

INTERNAL DOCS

DECISION THREADS

CRM DATA

FINANCIAL RECORDS

SALES CONVERSATIONS

SUPPORT HISTORY

PRESENTATIONS

PRODUCT LOGS

ANALYTICS

HISTORICAL OPERATING DATA

WHO IT'S FOR

What companies
your size get paid.

$10K - $100K

20 - 50 EMPLOYEES

$100K - $1M

50 - 250 EMPLOYEES

$1,000,000+

250+ EMPLOYEES

How data is valued

Headcount is a proxy. How long you've been operating, what industry you're in, which apps you run on and how much data sits in each all factor into the final price.

How it's structured

You're paid up front, plus a revenue share of every license. And because your company keeps producing data, the revenue can recur.

HOW IT WORKS

Four steps.
120 minutes of your time.
VALUE

Get a valuation

Replay reviews your industry, the systems you run on, how much data sits in each, and how your team worked, to understand what it's worth.

TERMS

Receive an offer

Replay presents an offer to license your data. These are typically structured as an upfront cash payment plus a perpetual revenue share.

PROTECT

De-identify your data

We securely export your data and remove every category of identifying information, from names and emails to customer records and account numbers.

PAYOUT

Get paid

You're paid for your historical data first. New data you produce follows the same path, and continues to pay you.

THE PROCESS

Data De-Identification
PII COVERAGE
Your data leaves cleaner than a medical record.

The federal standard for de-identifying medical records (HIPAA) lists eighteen categories that have to be stripped out. We cover all eighteen, and many more. Names, emails, API keys, access tokens, customer records. Our methods cover 60+ categories, across every file type and application your business works in.

OUR PIPELINE
We built the pipeline and trained the model.

General-purpose models aren't trained to find PII in Slack threads, support tickets or commit messages. So we trained one that is. On the same benchmark, our model identifies 99% of PII where NVIDIA's GLINER model found 36%. The model is only the first layer. An ensemble of processing stages runs behind it, so nothing depends on a single pass.

DATA POLICY
Set the scope and only license what you grant access to.

Every engagement runs in its own isolated environment. No shared storage, processing, or paths between one client's data and another's. And most importantly, only de-identified data is ever licensed. Raw data is never sold or shared, and never leaves the pipeline.

PII Coverage
Our Pipeline
Data Policy

WHO BUYS IT

Where your data gets sold

Your data is only sold to frontier AI and data labs.

Your data is never sold to foreign adversaries or resold through brokers.

WHO IT'S FOR

Any industry.
One requirement.

We work with companies in every industry. What matters isn't what you do, it's whether there's a record of how you did it: the communications, the tickets, the dispatch logs, the project histories, the back-and-forth that produced the outcome.

Tech

B2C

E-commerce

Services

Legal

Hardware

CPG

Finance

Find out what your data is worth

Value my data

PROCESS

IDENTIFIED
STRUCTURED
VERIFIED
LICENSED

RL-2026-001 // VERSION 1.0

CLASSIFICATION
PROPRIETARY DATA / LICENSING

DEF LOAD_DATASET(SOURCE):
RECORDS = SOURCE.READ()
RETURN NORMALIZE(RECORDS)

DEF LOAD_DATASET(SOURCE):
RECORDS = SOURCE.READ()
RETURN NORMALIZE(RECORDS)

01 Product

OVERVIEW
HOW IT WORKS
VALUATION
DATA CLEANING

02 Company

ABOUT
CAREERS

03 Partners

AI BUYERS
DATA PRIVACY
REFERRALS

04 Legal

PRIVACY POLICY
TERMS OF USE
COOKIE SETTINGS

© 2026 REPLAY. ALL RIGHTS RESERVED
SUNSETS HQ CORP.

Optional measurement helps us understand how you found us and measure website performance. Change your choice in Cookie settings. Details

Reject
Accept
