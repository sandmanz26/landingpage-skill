import sys
sys.path.insert(0, sys.argv[1])
from parts import *
out = sys.argv[2]
def page(name, css, body):
    open(f"{out}/hero-{name}.html", "w").write(f"""<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Hero {name}</title>{FONTS}<style>{BASE_CSS}{css}</style></head><body>{HEADER}<main>{body}</main><section style="padding:80px 0;background:var(--sage)"><div class="wrap"><h2>Harga, dan ke mana uang kalian pergi</h2></div></section></body></html>""")
common = """.hero .sub { font-size: 1.125rem; color: var(--muted); }
.actions { display: flex; flex-wrap: wrap; gap: 12px; }
.hero-text { display: grid; gap: 22px; align-content: center; min-width: 0; }
.art { width: 100%; height: auto; display: block; }"""
# A: split, drawing right
page("a", common + """
.hero { padding-block: 48px 72px; }
.hero .wrap { display: grid; grid-template-columns: minmax(0, 1.15fr) minmax(0, 0.85fr); gap: 56px; align-items: center; }
.hero h1 { font-size: clamp(2.8rem, 5.4vw, 5.1rem); }
@media (max-width: 860px) { .hero .wrap { grid-template-columns: 1fr; gap: 32px; } .hero .art { max-width: 440px; } }""",
f"""<section class="hero"><div class="wrap"><div class="hero-text">{HERO_TEXT}</div>{hero_drawing()}</div></section>""")
# B: panorama under the text
page("b", common + """
.hero { padding-block: 44px 64px; }
.hero .wrap { display: grid; gap: 36px; }
.hero-text { max-width: 900px; }
.hero .art { border-radius: 22px; min-height: 220px; }
@media (max-width: 720px) { .hero .art { height: 260px; } }""",
f"""<section class="hero"><div class="wrap"><div class="hero-text">{HERO_TEXT}</div>{wide_drawing()}</div></section>""")
# C: the clock card foreshadows the pinned day
page("c", common + """
.hero { padding-block: 44px 72px; }
.hero .wrap { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr); column-gap: 56px; row-gap: 22px; align-items: start; }
.hero .hero-text { display: contents; }
.hero .label, .hero h1 { grid-column: 1 / -1; }
.hero h1 { font-size: clamp(3rem, 7.4vw, 6.7rem); margin-bottom: 14px; }
.hero .sub, .hero .actions, .hero .price-line, .hero .check-line { grid-column: 1; }
.hero .clock-card { grid-column: 2; grid-row: 3 / span 4; }
.clock-card { background: var(--teal); color: var(--paper); border-radius: 22px; padding: 32px 32px 0; display: grid; gap: 10px; overflow: hidden; min-width: 0; }
.clock-card .t { font: 600 clamp(3.4rem, 6.4vw, 6rem)/0.9 var(--display); letter-spacing: -0.03em; color: var(--paper); }
.clock-card .next { font: 500 0.8rem/1.4 var(--mono); color: #9fbdb7; }
.clock-card .go { color: var(--paper); font-weight: 600; text-underline-offset: 3px; }
@media (max-width: 860px) { .hero { padding-block: 28px 56px; } .hero-text { gap: 18px; } }
.clock-card p { font-size: 1.125rem; color: #d6e4e0; }
.clock-card .label { color: #b8cdc8; }
.clock-card svg { width: 100%; height: auto; display: block; margin-top: 8px; }
@media (max-width: 860px) { .hero .wrap { grid-template-columns: 1fr; } .hero .clock-card { grid-column: 1; grid-row: auto; margin-top: 10px; } }""",
f"""<section class="hero"><div class="wrap"><div class="hero-text">{HERO_TEXT}</div>
<div class="clock-card"><span class="label">Hari H · contoh rundown</span><span class="t">05.30</span><p>Tim kami sudah di venue. Kalian masih bisa tidur sebentar.</p><p class="next">berikutnya 08.00 · 09.00 · 11.00 · 13.30 · 15.00</p><a class="go" href="#hari-h">Lihat hari H jam demi jam ↓</a>
<svg viewBox="0 0 400 230" role="img" aria-label="Ilustrasi: koordinator Jalinan di venue pagi hari dengan HT dan clipboard"><rect y="196" width="400" height="34" fill="#145c59"/>{chairs(24, 214, 4, 42, "#1d6b67")}<circle cx="352" cy="52" r="30" fill="{BUTTER}" class="sun"/>{coordinator(270, 226, 1.2)}</svg></div>
</div></section>""")
print("ok")
