# Digest: Quilt – How It Works

URL: https://www.quilt.com/how-it-works · description: "Quilt is not your average heat pump. Experience room-by-room control, occupancy detection, and other smart features to save money and maximize home…"
Images in this folder: desktop-fold.png, mobile-fold.png, sheet-desktop.png, sheet-mobile.png, motion-sheet.png

## Outline (document order, % of page height)
- H2 89% Get started today
- H2 93% Subscribe to learn about our latest product news and availability.

Actions: "Skip to content" ×1 @0% first-screen · "Find an installer" ×3 @0% first-screen stays-visible · "Become a partner" ×2 @7% first-screen · "Submit" ×1 @96%
Prices: none · proof words: none · logo images: 2 · forms: 1 · page height: 10247px

## Motion (measured, desktop)
- Libraries: gsap, scrollTrigger, lottie
- Full-screen sticky panels (CSS scroll device): 0
- Moving with no input: 0 elements at the top; further down: none; endless loops 0 (0 with text); pause control: no
- On scroll: up to 6 script-driven elements per step, up to 1 CSS/Web animations; durations 300-300 ms; easings cubic-bezier(0.4, 0, 0.2, 1); properties backgroundColor
- Reduced motion: 0 still move on their own, 305 with the scroll
- Leaves the page by itself when idle: no
- Smoothness while scrolling (stutter): 41.2 fps, p95 frame 50.1 ms, 17 long frames >50 ms, 11% dropped; a plain page on the same machine: 60 fps, p95 16.8 ms, 0 long frames. Scripts blocked 8% of the scroll.
  Measured with software rendering (no GPU) on a slower CPU: this ranks pages by how heavy they are, it does not show what a laptop with a GPU shows. Run `smooth.mjs` on a real machine to judge stutter.
- Not measured: transitions to other pages.

## Design inventory (desktop)
- Fonts: Quilt Sans 86%, Quilt Serif 14%; 9 sizes (60/42/20/17/16/15/14/13/12 px)
- Colours: 1 chromatic; text #000000 #ffffff #c3c3c3 #6a6a6a; backgrounds #ffffff #000000 #ff7b5e #2a2a2a
- Radii 9999px 8px; shadows 0; gradients 0; backdrop blur 0; layout shift (CLS) 0.027

## Inspector findings
- FAIL no-h1 [desktop, tablet, mobile]: No visible h1: the page has no title
- FAIL contrast [desktop, tablet]: 1 text elements below WCAG AA (measured on screen pixels) e.g. #6a6a6a on screen = 3.88:1 median, 3.12:1 in the worst tenth (needs 4.5) <p> "By submitting, you agree to future communications "
- FAIL tap-target [mobile]: 19 controls smaller than 24x24px on a phone e.g. 1x24 <a> "Skip to content" | 96x22 <a> "How It Works"
- FAIL contrast [mobile]: 2 text elements below WCAG AA (measured on screen pixels) e.g. #ffffff on screen = 3.87:1 median, 2.87:1 in the worst tenth (needs 4.5) <span> "Our intelligent, room-by-room control means you’re" | #6a6a6a on screen = 3.88:1 median, 3.52:1 in the worst tenth (needs 4.5) <p> "By subm…
- WARN too-many-font-sizes [desktop]: 9 different font sizes on the page (aim for 5 or fewer doing the visible work)
- WARN body-size [desktop]: Running text at 12.9936px (16px or more reads better) e.g. <p> "By submitting, you agree to future communications "
- WARN console-errors [desktop, tablet, mobile]: 1 console or page errors e.g. requestStorageAccess: Permission denied.
- WARN body-size [tablet]: Running text at 12.3955px (16px or more reads better) e.g. <p> "By submitting, you agree to future communications "
- WARN body-size [mobile]: Running text at 12.0591px (16px or more reads better) e.g. <p> "By submitting, you agree to future communications "
- WARN text-at-edge [mobile]: 2 text elements within 12px of the screen edge e.g. <a> "Skip to content" | <p> "By submitting, you agree to future communications "

## Page text (first 6000 characters of 1116)

Skip to content
How It Works
Tech Specs
HVAC Professionals
Contact Us
Find an installer
Enjoy room-by-room control throughout your home

Our intelligent, room-by-room control means you’re not wasting energy heating or cooling empty rooms — saving you money all year long.

Find an installer
 
Become a partner
Set the perfect temperature in every room, using either the Dial or the App
Get started today

Check availability in your area and connect with our Quilt Certified Partners who share your vision for a more comfortable, more efficient home.

Find an installer
 
Become a partner
Subscribe to learn about our latest product news and availability.
Email 
ZIP or postal code 
Submit

By submitting, you agree to future communications from Quilt and that you have read and agree to Quilt’s Terms of Service and Privacy Notice.

PRODUCT
How It Works
Tech Specs
HVAC Professionals
Find an Installer
COMPANY
Our Story
Careers
News
Heat Pumps
Merch
NEED HELP?
FAQ
Contact Us
Support
© 2026 Quilt Systems, Inc.
Terms of Service
Privacy Notice
Cookies
Do Not Sell or Share My Personal Information

CA License #1122015
