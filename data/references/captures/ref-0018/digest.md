# Digest: SquadEasy - Employees' favorite team-building app

URL: https://www.squadeasy.com/en/ · description: "We help companies to once again become places where team spirit flourishes, thanks to the employees themselves. Because, between us, it's best when it comes from them."
Images in this folder: desktop-fold.png, mobile-fold.png, sheet-desktop.png, sheet-mobile.png, motion-sheet.png

## Outline (document order, % of page height)
- H1 2% YOU'VE NEVER BEEN SO CLOSE TO BRINGING YOUR EMPLOYEES CLOSER TOGETHER.
- H2 18% EMPLOYEES' FAVOURITE, TEAM-BUILDING APP.
- H2 34% COHESION, YES, BUT NOT FOR NOTHING!
- H2 44% COHESION IS, A DAILY SPORT.
- H2 57% MILLION EMPLOYEES ADDICTED
- H2 61% ENGAGE THEM ALL
- H3 72% EMPLOYEES, IT'S EASY TO GET YOUR COMPANY INVOLVED.
- H2 78% SQUADEASY WITH YOUR COLOURS
- H3 86% READY TO MAKE A LASTING COMMITMENT TO YOUR TEAMS WITH SQUADEASY? IT'S SO EASY!

Actions: "Our solution" ×1 @0% first-screen stays-visible · "Case studies" ×1 @0% first-screen stays-visible · "Challenges" ×1 @0% first-screen stays-visible · "Resources" ×1 @0% first-screen stays-visible · "TALK TO US" ×1 @0% first-screen stays-visible · "REQUEST A DEMO" ×1 @6% first-screen · "Détails" ×1 @7% first-screen stays-visible · "Accepter" ×1 @7% first-screen stays-visible · "Refuser" ×1 @8% first-screen stays-visible · "FIND OUT MORE" ×3 @23% · "DISCOVER OUR CUSTOMER TESTIMONIALS" ×1 @27% · "WE GET TO KNOW EACH OTHER?" ×1 @53% · "LEARN MORE" ×2 @74% · "SOLUTION" ×1 @93% · "CHALLENGES" ×1 @93% · "CASE STUDIES" ×1 @93% · "RESOURCES" ×1 @93% · "ASK FOR A DEMO" ×1 @94% · "Gérer mes cookies" ×1 @98%
Prices: none · proof words: testimonial 1, customers 1 · logo images: 1 · forms: 0 · page height: 10721px

## Motion (measured, desktop)
- Libraries: none detected (CSS-only motion is still possible: see sticky panels)
- Full-screen sticky panels (CSS scroll device): 0
- Moving with no input: 3 elements at the top; further down: 900px (1), 1800px (4), 2700px (2), 3600px (3); endless loops 9 (3 with text); pause control: no
- On scroll: up to 9 script-driven elements per step, up to 18 CSS/Web animations; durations 300-48000 ms; easings ease, linear; properties opacity, transform, filter
- Reduced motion: 1 still move on their own, 14 with the scroll
- Leaves the page by itself when idle: no
- Smoothness while scrolling (stutter): 59.8 fps, p95 frame 16.8 ms, 0 long frames >50 ms, 0% dropped; a plain page on the same machine: 59.7 fps, p95 16.7 ms, 0 long frames. Scripts blocked 0% of the scroll.
  Measured with software rendering (no GPU) on a slower CPU: this ranks pages by how heavy they are, it does not show what a laptop with a GPU shows. Run `smooth.mjs` on a real machine to judge stutter.
- Not measured: transitions to other pages.

## Design inventory (desktop)
- Fonts: Body 42%, Black 20%, Regular 18%, arial 9%, Medium 9%, Epilogue 2%, Sharpie 0%; 12 sizes (220/110/80/62/56/50/22/18/17/16/14/12 px)
- Colours: 9 chromatic; text #000000 #ffffff #ea5da3 #139271 #6fb853 #666666; backgrounds #ffffff #000000 #e1c19e #e4ff60 #7fb6e6 #adabff #f6f6f6 #c2ebb8
- Radii 14px 10px 100px 500px 36px; shadows 2; gradients 0; backdrop blur 1; layout shift (CLS) 0.241

## Inspector findings
- FAIL font-not-loaded [desktop, tablet, mobile]: "Epilogue" is named in the CSS but never loaded; the browser shows a fallback font (2% of the text)
- FAIL headline-lines [desktop, tablet]: h1 runs to 5 lines e.g. <h1> "You've never been so close to bringing your employ"
- FAIL contrast [desktop]: 3 text elements below WCAG AA (measured on screen pixels) e.g. #ea5da3 on screen = 1.87:1 median, 1.87:1 in the worst tenth (needs 3) <mark> "your employees" | #808080 on screen = 3.95:1 median, 3.08:1 in the worst tenth (needs 4.5) <div> "The strength of teams"
- FAIL contrast [tablet, mobile]: 2 text elements below WCAG AA (measured on screen pixels) e.g. #ea5da3 on screen = 1.87:1 median, 1.87:1 in the worst tenth (needs 3) <mark> "your employees" | #6fb853 on screen = 2.43:1 median, 1.68:1 in the worst tenth (needs 4.5) <a> "notre politique de confidentialité"
- FAIL headline-lines [mobile]: h1 runs to 7 lines e.g. <h1> "You've never been so close to bringing your employ"
- FAIL tap-target [mobile]: 3 controls smaller than 24x24px on a phone e.g. 30x20 <a> "CGU" | 47x20 <a> "Privacy"
- FAIL layout-shift [mobile]: Layout shift 0.305 (over 0.25)
- FAIL reduced-motion [reducedMotion]: 2 text elements stay hidden when the visitor asks for reduced motion e.g. 1.2 | 70
- WARN font-count [desktop, tablet, mobile]: 6 typefaces carry the text: body, black, regular, arial, medium, epilogue
- WARN too-many-font-sizes [desktop]: 12 different font sizes on the page (aim for 5 or fewer doing the visible work)
- WARN body-size [desktop, tablet, mobile]: Running text at 12px (16px or more reads better) e.g. <p> "Ce site web stocke des cookies sur votre ordinateu"
- WARN headline-lines [desktop, tablet]: h3 runs to 4 lines e.g. <h3> "EMPLOYEES, IT'S EASY TO GET YOUR COMPANY INVOLVED."
- WARN fixed-cover [desktop]: 3 fixed or sticky element(s) that are not a bar cover part of every screen; make it a slim bar or let it scroll away e.g. 1074x83 (9% of the screen height) <header> "Our solution Sport and mobility +7.4% average prod" | 1440x900 (100% of the screen height) <section> "You've never been so close to bringing your employ"
- WARN too-many-colours [desktop, tablet, mobile]: 9 distinct chromatic colours e.g. #6fb853 | #e1c19e
- WARN layout-shift [desktop]: Layout shift 0.241 (over 0.1)
- WARN headline-lines [tablet]: h3 runs to 5 lines e.g. <h3> "Ready to make a lasting commitment to your teams w"
- WARN fixed-cover [tablet, mobile]: 2 fixed or sticky element(s) that are not a bar cover part of every screen; make it a slim bar or let it scroll away e.g. 768x1024 (100% of the screen height) <section> "You've never been so close to bringing your employ" | 240x296 (29% of the screen height) <div> "Ce site web stocke des cookies sur votre ordinateu"
- WARN layout-shift [tablet]: Layout shift 0.179 (over 0.1)
- WARN headline-lines [mobile]: h2 runs to 4 lines e.g. <h2> "Employees' favourite,team-building app."
- WARN headline-lines [mobile]: h3 runs to 6 lines e.g. <h3> "EMPLOYEES, IT'S EASY TO GET YOUR COMPANY INVOLVED."
- WARN headline-lines [mobile]: h3 runs to 8 lines e.g. <h3> "Ready to make a lasting commitment to your teams w"

## Page text (first 6000 characters of 3717)

Our solution
Case studies
Challenges
Resources
TALK TO US
YOU'VE NEVER
BEEN SO
CLOSE TO BRINGING
YOUR EMPLOYEES
CLOSER TOGETHER.

REQUEST A DEMO
REQUEST A DEMO
EMPLOYEES' FAVOURITE,
TEAM-BUILDING APP.
0 %
of users feel better in their company.
+ 0 %
productivity gains per user.
FIND OUT MORE
MORE THAN 
0
 LOYAL CUSTOMERS WORLDWIDE.

That's what makes them close-knit teams.

DISCOVER OUR CUSTOMER TESTIMONIALS
COHESION,
YES, BUT NOT FOR NOTHING!
+ 0
million euros donated to causes every year.
0
tons of CO2 avoided.
FIND OUT MORE
COHESION IS,
A DAILY SPORT.
0 %
users challenge themselves on a daily basis thanks to our app.
FIND OUT MORE
WE ARE
SQUADEASY.

Our mission? To help companies once again become places where team spirit flourishes, thanks to the employees themselves. Because between us, there's no better way than if it comes from them.

WE GET TO KNOW EACH OTHER?
0
MILLION 
 EMPLOYEES ADDICTED
ENGAGE THEM ALL
A SOCIAL APP
MEASURE YOUR IMPACT
MOVE FOR YOUR HEALTH
THE STRENGTH OF TEAMS
SUPPORT A CAUSE
A SOCIAL APP
MEASURE YOUR IMPACT
MOVE FOR YOUR HEALTH
THE STRENGTH OF TEAMS
SUPPORT A CAUSE
A SOCIAL APP
MEASURE YOUR IMPACT
A step counter and CO2 calculator let you see your impact in real time. All good things for the team.
Our multimodal tracker, integrated into the SquadEasy app, gets every floor of your company moving. Whether your colleagues prefer to walk, cycle or even rollerblade, every move earns points.
Your employees choose their challenges and they create their team as they see fit. There's no hierarchy here.
Giving meaning to collective actions is the best way to motivate your employees and ensure their long-term commitment. It's the perfect way to combine business with pleasure.
Let’s get SquadEasy ?  The social wall, comments, chat and various boosts make it a community space for your employees.
A step counter and CO2 calculator let you see your impact in real time. All good things for the team.
Our multimodal tracker, integrated into the SquadEasy app, gets every floor of your company moving. Whether your colleagues prefer to walk, cycle or even rollerblade, every move earns points.
Your employees choose their challenges and they create their team as they see fit. There's no hierarchy here.
Giving meaning to collective actions is the best way to motivate your employees and ensure their long-term commitment. It's the perfect way to combine business with pleasure.
Let’s get SquadEasy ?  The social wall, comments, chat and various boosts make it a community space for your employees.
A step counter and CO2 calculator let you see your impact in real time. All good things for the team.
APP STORE
4/5
GOOGLE PLAY
4/5
THE MOST INNOVATIVE SOLUTION FOR HR
VIVATECH 2023
SOLUTION SPORT LA PLUS INNOVANTE
GAGNANT CONCOURS MONDIAL
PUBLICIS90
EMPLOYEES, IT'S EASY TO GET YOUR COMPANY INVOLVED.

Become an ambassador for your HR team and get SquadEasy adopted by your company. Challenge accepted?

LEARN MORE
SQUADEASY WITH YOUR COLOURS

Customise the application with your brand's colours.

READY TO MAKE A LASTING COMMITMENT TO YOUR TEAMS WITH SQUADEASY? IT'S SO EASY!
LEARN MORE
SOLUTION
Sport & Mobility
Cohesion
CSR
CHALLENGES
Pink October
Mobility
QWL
Movember
Singularity
Security
All The Challenges
CASE STUDIES
Société Générale
ACF
Edenred
CCIFI
All Case Studies
RESOURCES
About Us
Blog
ASK FOR A DEMO

DOWNLOAD THE APP

ADRESSES

SquadEasy France
157 boulevard Mac Donald
75019 Paris, France
@ 2026, SquadEasy. Tous droits réservés.
CGU
Privacy
Gérer mes cookies

Ce site web stocke des cookies sur votre ordinateur. Pour obtenir plus d'informations sur les cookies que nous utilisons, consultez notre politique de confidentialité.

Détails
Accepter
Refuser
