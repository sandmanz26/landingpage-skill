# Digest: Resolute AI

URL: https://www.theresolute.ai/ · description: "Building the future of healthier, longer living."
Images in this folder: desktop-fold.png, mobile-fold.png, desktop-overlay.png, mobile-overlay.png, sheet-desktop.png, sheet-mobile.png, motion-sheet.png

## Outline (document order, % of page height)
- H1 1% More Healthy Years.
- H2 1% Built With You.
- H3 7% Hyper-Personalised Health Plans Powered by Experts and AI
- H3 7% Built on Diagnostics, Not Guesswork
- H3 7% One Size Fits You, Not One Size Fits All
- H2 20% Welcome to What Your Health Can Be
- H2 28% From risk reversal, to high performance
- H3 32% optiME
- H3 32% superGUT
- H3 33% paceFORGE
- H3 33% galaxyBRAIN
- H3 32% eternAGE
- H2 38% How it Works
- H3 40% Know Your Baseline
- H3 45% Get Your Blueprint
- H3 50% Transform Your Health
- H2 55% Meet Your Smart AI Companion
- H2 65% Real Stories from ‍10,000+ Personalised Journeys
- H2 73% Not just a system - real care, from a team that knows your health is personal
- H2 81% Guides & Blogs
- H2 84% Whole-Body MRI: The Guardian of Your Healthspan
- H3 82% Why Your Blood Test Might Be Your Best Starting Point For Your Supplement Regimen
- H3 84% 10 Ways Your Blood Test Data Can Transform Your Health
- H3 85% Understanding the Polyvagal Theory to Navigate Burnout and Find Calm
- H2 87% FAQs
- H2 93% Footer
- H2 94% Start your 100-day health transformation today. Powered by your data, guided by experts.
- H3 95% GET IN TOUCH
- H3 96% Follow us

Actions: "Resolute Club" ×1 @-4% first-screen stays-visible · "Resolute Workplace" ×1 @-4% first-screen stays-visible · "Resolute Aging Test x TruDiagnostics" ×1 @-3% first-screen stays-visible · "The Supplement Clinic" ×1 @-3% first-screen stays-visible · "Browse Blog >" ×1 @-3% first-screen stays-visible · "About Us >" ×1 @-3% first-screen stays-visible · "Reveal Your Stack →" ×2 @0% first-screen stays-visible · "×" ×1 @0% first-screen stays-visible · "Get Your Blueprint" ×2 @0% first-screen stays-visible · "Doctor" ×1 @56% · "What health goals can I pursue?" ×1 @88% · "Why 100 days?" ×1 @89% · "How involved are your experts?" ×1 @90% · "What does progress really look like?" ×1 @91% · "Read All FAQs" ×1 @93%
Prices: none · proof words: none · logo images: 0 · forms: 0 · page height: 13022px
Pop-up or banner on load (closed for capture): Close promotion ×; see *-overlay.png

## Motion (measured, desktop)
- Libraries: gsap, scrollTrigger, splitText, lenis, lottie
- Full-screen sticky panels (CSS scroll device): 0
- Moving with no input: 2 elements at the top; further down: 900px (4), 1800px (4), 2700px (7), 3600px (10), 4500px (8); endless loops 58 (58 with text); pause control: no
- On scroll: up to 13 script-driven elements per step, up to 9 CSS/Web animations; durations 750-50000 ms; easings linear, cubic-bezier(0.25, 0.46, 0.45, 0.94); properties transform, opacity
- Reduced motion: 4 still move on their own, 14 with the scroll
- Leaves the page by itself when idle: no
- Not measured: frame smoothness (stutter), transitions to other pages.

## Design inventory (desktop)
- Fonts: DMSans-Light 93%, Pppangaia-Ultralight 7%; 17 sizes (70/57/44/43/31/28/23/20/19/18/17/16/15/13/12/11/10 px)
- Colours: 10 chromatic; text #040404 #ff3b30 #ffffff #222222 #000000 #161816; backgrounds #ffffff #420b20 #000000 #d66f50 #eacab1 #f3efe9 #f5f5f5 #f7f7f7
- Radii 9999px 1440px 8px 16px 12px 6px; shadows 0; gradients 11; backdrop blur 7; layout shift (CLS) 1.73

## Inspector findings
- FAIL contrast [desktop, tablet]: 8 text elements below WCAG AA (measured on screen pixels) e.g. #ff3b30 on screen = 1.88:1 median, 1.11:1 in the worst tenth (needs 4.5) <strong> "LIVE NOW 🚀" | #ffffff on screen = 3.36:1 median, 2.66:1 in the worst tenth (needs 4.5) <div> "Your health doesn’t live in silos. Neither…
- FAIL hidden-content [desktop]: 1 text elements were never visible during a full scroll (a reveal that never fires?) e.g. designed for the life you’re meant to live
- FAIL layout-shift [desktop]: Layout shift 1.730 (over 0.25)
- FAIL hidden-content [tablet, mobile]: 11 text elements were never visible during a full scroll (a reveal that never fires?) e.g. designed for the life you’re meant to live | Interprets, prescribes and guides your care
- FAIL tap-target [mobile]: 11 controls smaller than 24x24px on a phone e.g. 112x21 <a> "" | 95x21 <a> "Resolute Club"
- FAIL contrast [mobile]: 10 text elements below WCAG AA (measured on screen pixels) e.g. #ff3b30 on screen = 2.21:1 median, 1.22:1 in the worst tenth (needs 4.5) <strong> "LIVE NOW 🚀" | #ff3b30 on screen = 2.22:1 median, 1.38:1 in the worst tenth (needs 4.5) <strong> "LIVE NOW 🚀"
- FAIL reduced-motion [reducedMotion]: 1 text elements stay hidden when the visitor asks for reduced motion e.g. designed for the life you’re meant to live
- WARN too-many-font-sizes [desktop]: 17 different font sizes on the page (aim for 5 or fewer doing the visible work)
- WARN small-text [desktop, tablet, mobile]: Text at 10.4px e.g. <div> "Founder, Crossfit 9one"
- WARN small-text [desktop]: Text at 11.4px e.g. <div> "Chief Medical Officer"
- WARN too-many-colours [desktop]: 10 distinct chromatic colours e.g. #ff3b30 | #420b20
- WARN console-errors [desktop, tablet, mobile]: 7 console or page errors e.g. Unexpected token '}' | Could not find a View Model linked to Artboard Artboard.
- WARN screenshots-capped [desktop]: Page is 13022px tall; only the first 14 screens were captured
- WARN small-text [tablet]: Text at 10.56px e.g. <div> "Chief Medical Officer"
- WARN too-many-colours [tablet, mobile]: 9 distinct chromatic colours e.g. #ff3b30 | #420b20
- WARN small-text [mobile]: Text at 10.0875px e.g. <div> "Chief Medical Officer"
- WARN headline-lines [mobile]: h2 runs to 4 lines e.g. <h2> "Start your 100-day health transformation today.Pow"
- WARN text-at-edge [mobile]: 103 text elements within 12px of the screen edge e.g. <span> "LIVE NOW 🚀 Supp[RX] Powered By Resolute AI - Conf" | <a> "Reveal Your Stack →"

## Page text (first 6000 characters of 12828)

LIVE NOW 🚀 Supp[RX] Powered By Resolute AI - Confused about what supplements to take? We can help.
Reveal Your Stack →
•
LIVE NOW 🚀 Supp[RX] Powered By Resolute AI - Confused about what supplements to take? We can help.
Reveal Your Stack →
•
×
Our Approach
Get Your Blueprint
Ecosystem
Resolute Club
Resolute Aging Test x TruDiagnostics
The Supplement Clinic
For Teams
Resolute Workplace
Resources
Browse Blog >
About Us >
DOWNLOAD THE APP
More Healthy Years.
Built With You.
Personalized, proactive health journeys, guided by doctors and powered by AI, designed to help you move better, think clearer, and stay healthier longer.
Hyper-Personalised Health Plans Powered by Experts and AI
Built on Diagnostics, Not Guesswork
One Size Fits You, Not One Size Fits All
designed for the life you’re meant to live
Tired of one-size-fits-all health hacks? Most of them are fragmented, scattered, and generic.
Welcome to What Your Health Can Be
Your health doesn’t live in silos. Neither do we. That’s why we built Resolute.
Resolute connects your diagnostics, behaviour, and daily choices into a science-backed health protocol - designed to extend your healthspan and elevate your life.
Clarity, Not Overwhelm
Blueprints, Not Band-Aids
Outcomes, Not Promises
Journeys designed for you. Informed by science.
From risk reversal, to high performance
optiME
Total Body Optimisation
optiME
Total Body Optimisation
A hyper-personalised journey to extend healthspan and prevent future risks. Your Portrait of Health is built from 85+ biomarkers and optional MRI scans and delivered through expert consultations, personalised protocols, and adaptive routines.
superGUT
Enhanced Digestive Health
superGUT
Enhanced Digestive Health
Eliminate inflammation, optimise absorption, and restore microbiome balance. Your Gut Health Blueprint is built from sensitivities, microbiome, and markers - driving action through our 4Rs+1B approach: Remove, Replace, Reintroduce, Repair, Balance.
paceFORGE
Dominate your Run
paceFORGE
Dominate your Run
Enhance marathon times, injury risk, and resilience. Your Run Ready Index tracks 9+ metrics from VO2 Max to HRV - guiding your performance strategy across five pillars: Nutrition, Movement, Mindset, Hydration, and Recovery.
burnN
Scientific Fat Loss
burnN
Scientific Fat Loss
Optimise body composition, improve metabolic health, and preserve lean muscle—not just drop weight. Your Adiposity Atlas maps fat phenotype across 9 traits to guide actions via lifestyle-led or GLP-1-supported pathways.
galaxyBRAIN
Cognitive Performance Boost
galaxyBRAIN
Cognitive Performance Boost
Enhance focus, memory, and mental stamina. Your Cognitive Connectone, built through biomarkers and neuro-function assessments, maps your brain profile to provide you nootropics, recovery tools, and evidence-based lifestyle protocols.
eternAGE
Live Younger, Longer
eternAGE
Live Younger, Longer
Extend healthspan, slow ageing, and unlock peak vitality. Your Longevity Dynamics Grid, based on cellular markers and risk profiles, powers personalised interventions and adaptive routines for lifelong resilience.
Improved Metabolic Function
Improved Insulin Sensitivity
Optimal Hormone Balance
Functionally Regulated Immunity
Improved Energy Levels
Optimal Gut Function
Enhanced Nutrient Absorption
Reduced Cardiovascular Risk
Enhanced Organ Function
Improved Cognition & Mood
Improved Metabolic Function
Improved Insulin Sensitivity
Optimal Hormone Balance
Functionally Regulated Immunity
Improved Energy Levels
Optimal Gut Function
Enhanced Nutrient Absorption
Reduced Cardiovascular Risk
Enhanced Organ Function
Improved Cognition & Mood
How it Works
Know Your Baseline
We capture a complete view of your health through a multi-layered body-data stack—because what you don’t measure, you can’t improve. Your data becomes the foundation for everything that follows.
INCLUDES
Human 360 - Body Data Stack
Health Status Assessment
Get Your Blueprint
Get a personalised health blueprint designed around you data, health priorities, and outcomes that matter most to you—whether it’s energy, gut health, or long-term resilience.
INCLUDES
Hyper Personalised Action Plan
Whole of Me Construct
Transform Your Health
This is where change happens. Guided by science and supported by AI, we help you implement protocols, behaviour shifts, and adaptive routines—adjusted as your body evolves.
INCLUDES
Specialist Doctor Consults
Health Coaching
24/7 Care Concierge
Resolute App for Tracking and Habit Building
Meet Your Smart AI Companion
Our Centaur Team (human experts + AI) work together to guide your health
Doctor
Health Coach
Data Scientist
Nutritionist
Care Concierge

Interprets, prescribes and guides your care

Keeps you motivated and inspires habit change

Connects symptoms, biomarkers and trends over time

Designs food, supplement and workout plans that work for you

Helps you navigate choices and escalates concerns

Flags hidden health risks and scans drug interactions

Tracks adherence, nudges the right behaviour

Runs deep learning and 'what if' simulations

Optimises macros, meal timing, and recovery

Automates bookings, follow-ups and refills instantly

What you get
Human Expert
Diagnoses, prescribes, and
guides your care
Safe, expert-approved care
decisions
Scans for health risks and
drug interactions
AI Copilot
Real Stories from
‍10,000+ Personalised Journeys
Resolute came into my life at the perfect time, just when I was ready to level up my athletic performance. Their blueprint gave me the structure I needed to dial in my lifestyle, nutrition, and supplementation. Since then, the changes have been remarkable. Everything feels aligned. My energy, focus and overall performance have significantly improved, I feel stronger and more capable now.
Mita
FOUNDER, CROSSFIT 9ONE
What I loved was how they take all that diagnostic data and actually make sense of it. There’s so much happening in your body that you can’t see, this helps tell that story. Their supplement picks are spot-on…
