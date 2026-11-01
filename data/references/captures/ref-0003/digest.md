# Digest: Scotch | POS, Back Office & eComm for Liquor Stores

URL: https://scotchpos.com/ · description: "Run your liquor store smarter with Scotch. Fast POS, real-time inventory, and built-in eCommerce — all in one system, designed exclusively for liquor retailers."
Images in this folder: desktop-fold.png, mobile-fold.png, sheet-desktop.png, sheet-mobile.png, motion-sheet.png

## Outline (document order, % of page height)
- H1 3% The system that knows liquor like you do.
- H2 18% Liquor store owners, in their own words
- H2 31% Simplify inventory, ordering, and analytics
- H2 44% Made to fit your workflow
- H2 49% Process transactions faster with the lowest fees guaranteed

Actions: "Products" ×1 @0% first-screen stays-visible · "Login" ×1 @0% first-screen stays-visible · "Book a demo" ×3 @0% first-screen stays-visible · "See it in action" ×1 @5% first-screen · "Ordering" ×2 @13% · "Receiving" ×1 @40% · "Analytics" ×1 @40%
Prices: none · proof words: rating 2, customers 1 · logo images: 39 · forms: 0 · page height: 8087px

## Motion (measured, desktop)
- Libraries: swiper, framerMotion
- Full-screen sticky panels (CSS scroll device): 0
- Moving with no input: 0 elements at the top; further down: 900px (2), 1800px (4), 2700px (8), 3600px (9); endless loops 49 (0 with text); pause control: yes
- On scroll: up to 8 script-driven elements per step, up to 24 CSS/Web animations; durations 200-10000 ms; easings cubic-bezier(0.4, 0, 0.2, 1), linear, cubic-bezier(0, 0, 0.2, 1); properties transform, opacity
- Reduced motion: 8 still move on their own, 21 with the scroll
- Leaves the page by itself when idle: no
- Smoothness while scrolling (stutter): 56.6 fps, p95 frame 33.3 ms, 0 long frames >50 ms, 1% dropped; a plain page on the same machine: 60.3 fps, p95 16.7 ms, 0 long frames. Scripts blocked 0% of the scroll.
  Measured with software rendering (no GPU) on a slower CPU: this ranks pages by how heavy they are, it does not show what a laptop with a GPU shows. Run `smooth.mjs` on a real machine to judge stutter.
- Not measured: transitions to other pages.

## Design inventory (desktop)
- Fonts: Inter 73%, mori 27%; 8 sizes (54/42/34/18/16/15/14/13 px)
- Colours: 1 chromatic; text #ffffff #808080 #000000 #a5a5a5 #666666 #f54900; backgrounds #000000 #1a1a1a #ffffff #f54900 #141413 #292929 #3e3e3e #111111
- Radii 12px 6px 9999px 16px 8px 5px 10px; shadows 11; gradients 5; backdrop blur 0; layout shift (CLS) 0

## Inspector findings
- FAIL contrast [desktop]: 4 text colour pairs below WCAG AA e.g. #808080 on #1a1a1a = 4.41:1 (needs 4.5) <div> "Control your store" | #ffffff on #f54900 = 3.60:1 (needs 4.5) <div> "Book a demo"
- FAIL img-alt [desktop, mobile]: 2 images without an alt attribute e.g. /IntegrationAnimContent/dark%20background.png | /_next/image/?url=https%3A%2F%2Fscotchcms.wpenginepowered.com%2Fwp-content%2Fuploads%2F2025%2F04%2F0.png&w=1080&q=75
- FAIL img-broken [desktop, tablet, mobile]: 1 images failed to load e.g. https://bat.bing.com/action/0?ti=343253256&tm=gtm002&Ver=2&mid=4808840a-21d9-4f1f-bee9-9b4b35f5c409&bo=1&sid=f7786100d47d11f1aedf4755271a98f3&vid=f7789b50d47d11f18e8b9f662a12fe15&vids=1&msclkid=N&gtm_tag_source=1&pi=0&lg…
- FAIL contrast [tablet, mobile]: 3 text colour pairs below WCAG AA e.g. #ffffff on #f54900 = 3.60:1 (needs 4.5) <div> "Book a demo" | #666666 on #000000 = 3.66:1 (needs 4.5) <div> "Designed with support from top retailers"
- FAIL img-alt [tablet]: 1 images without an alt attribute e.g. /_next/image/?url=https%3A%2F%2Fscotchcms.wpenginepowered.com%2Fwp-content%2Fuploads%2F2025%2F04%2F0.png&w=1080&q=75
- FAIL tap-target [mobile]: 12 controls smaller than 24x24px on a phone e.g. 111x20 <a> "Find out more" | 109x2 <button> "Ordering"
- WARN too-many-font-sizes [desktop]: 8 different font sizes on the page (aim for 5 or fewer doing the visible work)
- WARN shadow-on-everything [desktop]: 11 boxes carry a drop shadow
- WARN body-size [tablet, mobile]: Running text at 15px (16px or more reads better) e.g. <p> "Far from just another POS, Scotch is the all-in-on"
- WARN shadow-on-everything [tablet]: 8 boxes carry a drop shadow
- WARN centred-hero-two-ctas [tablet, mobile]: Centred hero headline with two buttons, the most common generated layout
- WARN text-at-edge [mobile]: 4 text elements within 12px of the screen edge e.g. <div> "Keegan Jenks" | <div> "Owner of Bacchus"
- WARN shadow-on-everything [mobile]: 7 boxes carry a drop shadow

## Page text (first 6000 characters of 2003)

Products
Back Office
Control your store
POS & Payments
Hardware for every store
Integrations
Pricing
About
Blog
Login
Book a demo
Introducing Scotch
The system that knows liquor like you do.

Far from just another POS, Scotch is the all-in-one operating system designed exclusively for liquor retailers.

Book a demo
See it in action
Ordering
Designed with support from top retailers
Customer stories
Liquor store owners, in their own words
Sara Gesie-Peace
General Manager of Cheers
Keegan Jenks
Owner of Bacchus
Jay Patel
Owner of Simmons Liquor
Back Office
Simplify inventory, ordering, and analytics
Find out more

Optimize stock and margins

Automatically read invoices

Access real-time dashboards

20% less time spent on inventory management.
Ordering
Receiving
Analytics
Synchronize your tools
Made to fit your workflow

Real-time inventory and pricing, synced to delivery apps, ecommerce, and more. No double entry, no out-of-stock orders. Need a custom connection? There's an API for that.

Learn more
POS & Payments
Process transactions faster with the lowest fees guaranteed
Find out more

Process faster, with the lowest fees

Sign up customers instantly

Keep selling — even offline

The old way

For decades, liquor retailers have been forced to choose between 90s technology or tools built for restaurants.

We finally built the system liquor stores deserve.

The new way

Scotch is the smart,  liquor-specific operating system you’ve been waiting for.

Net changes, not manual chores 
Spend 20% less time on the stuff you hate with smart, automated workflows.
Total control, from anywhere
Run your business from anywhere with one platform for everything.
AI-powered for profitability
Boost margins with AI-driven insights that power smarter decisions.
Spend 20% less time on the stuff you hate.
POS is typically generic, outdated and clunky. But it doesn’t have to be.
Book a demo
Products
POS & Payments
Back Office
Company
Pricing
About
Blog
Careers
© Scotch 2026. All rights reserved
