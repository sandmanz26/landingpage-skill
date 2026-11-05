"""Drawing system v2 (after jury r1): the whole box always visible, lauk compartment the largest,
and a different lauk/sayur/buah per weekday. viewBox 0 0 400 400.
Compartments: karbo (16,16,150x232) · lauk (180,16,204x232) · sayur (16,262,220x122) · buah (250,262,134x122)."""
import random

def g(x, y, inner):
    return f'<g transform="translate({x} {y})">{inner}</g>'

def rice(seed):
    r = random.Random(seed); out = ['<path d="M8 214 Q10 120 75 96 Q140 120 142 214 Z" fill="#7A2633"/>']
    for i in range(60):
        x = 14 + r.random() * 122; y = 30 + r.random() * 186
        if y < 110 and abs(x - 75) > (y - 20) * 0.9: continue
        rot = r.randint(0, 179); c = ("#C46B77", "#E9A3AD", "#6E2230")[i % 3]
        out.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="9" ry="4.2" transform="rotate({rot} {x:.0f} {y:.0f})" fill="{c}"/>')
    return "".join(out)

# ---- lauk (local box 204x232) ----
def leaf(x, y, rot, c="#2F6B22", s=1):
    return f'<path d="M0 0 q12 -14 26 0 q-12 14 -26 0 Z" transform="translate({x} {y}) rotate({rot}) scale({s})" fill="{c}"/>'
SAMBAL = '<circle cx="168" cy="196" r="20" fill="#C8321E"/><circle cx="162" cy="190" r="6" fill="#E8613F"/>'
LAUK = {
 "ayam": ('<rect x="112" y="34" width="70" height="24" rx="12" transform="rotate(38 112 34)" fill="#FFF1CF"/>'
          '<circle cx="170" cy="80" r="13" fill="#FFF1CF"/><circle cx="158" cy="94" r="13" fill="#FFF1CF"/>'
          '<ellipse cx="88" cy="128" rx="62" ry="74" transform="rotate(38 88 128)" fill="#A9531A"/>'
          '<ellipse cx="74" cy="114" rx="30" ry="40" transform="rotate(38 74 114)" fill="#D07A2A"/>'
          '<ellipse cx="66" cy="102" rx="10" ry="16" transform="rotate(38 66 102)" fill="#F0B05A"/>'
          + leaf(30, 200, -20) + leaf(56, 210, 10, "#3E7D2A") + SAMBAL),
 "ikan": ('<ellipse cx="92" cy="112" rx="80" ry="46" fill="#C98A3A"/>'
          '<path d="M164 112 L198 76 L198 148 Z" fill="#C98A3A"/>'
          '<path d="M58 84 q16 -8 32 0 M58 140 q16 8 32 0 M96 80 q16 -8 32 0 M96 144 q16 8 32 0" stroke="#8A5214" stroke-width="5" fill="none" stroke-linecap="round"/>'
          '<path d="M30 92 q-8 20 0 40" stroke="#8A5214" stroke-width="5" fill="none" stroke-linecap="round"/>'
          '<circle cx="34" cy="104" r="6" fill="#17241C"/>'
          '<path d="M24 200 a26 26 0 0 1 52 0 Z" fill="#9BCB4A"/><path d="M32 200 a18 18 0 0 1 36 0 Z" fill="#D7EE9A"/>' + SAMBAL),
 "tahu": ('<rect x="18" y="28" width="86" height="80" rx="14" fill="#FFF1CF"/><rect x="18" y="28" width="86" height="18" rx="9" fill="#F3D99A"/>'
          '<rect x="86" y="96" width="102" height="84" rx="14" fill="#8E5A1E"/>'
          + "".join(f'<ellipse cx="{x}" cy="{y}" rx="6" ry="4" fill="#E2B56A"/>' for x, y in [(104,114),(130,126),(158,112),(112,150),(146,156),(172,140),(126,168)])
          + '<path d="M18 186 q40 -16 70 6" stroke="#5A3410" stroke-width="10" fill="none" stroke-linecap="round"/>' + SAMBAL),
 "suwir": ("".join(f'<rect x="{x}" y="{y}" width="{w}" height="10" rx="5" transform="rotate({a} {x} {y})" fill="{c}"/>'
          for x, y, w, a, c in [(30,60,60,-20,"#C98A3A"),(70,50,70,15,"#A9531A"),(40,96,80,8,"#D9A055"),(110,90,60,-30,"#C98A3A"),(24,130,70,-10,"#A9531A"),(90,128,80,20,"#D9A055"),(50,160,60,5,"#C98A3A"),(120,160,50,-15,"#A9531A")])
          + leaf(40, 194, -15) + leaf(70, 204, 20, "#3E7D2A") + leaf(100, 196, -5) + SAMBAL),
}
LAUK["bakar"] = LAUK["ikan"].replace("#C98A3A", "#8F4E19").replace("#8A5214", "#3E2208")

# ---- sayur (local box 220x122) ----
SAYUR = {
 "buncis": ("".join(f'<rect x="{x}" y="{y}" width="78" height="13" rx="6.5" transform="rotate({a} {x} {y})" fill="#2F6B22"/>' for x, y, a in [(16,36,-12),(30,62,8),(20,88,-4),(110,30,10),(118,70,-8)])
            + "".join(f'<circle cx="{x}" cy="{y}" r="11" fill="#F28C28"/><circle cx="{x}" cy="{y}" r="4" fill="#FBC27E"/>' for x, y in [(104,58),(180,40),(190,90),(150,96),(96,100)])),
 "bayam": ('<ellipse cx="110" cy="64" rx="96" ry="46" fill="#E4F2CF"/>' + leaf(40, 60, -10, "#2F6B22", 1.6) + leaf(100, 46, 25, "#3E7D2A", 1.5) + leaf(130, 80, -30, "#2F6B22", 1.4)
           + "".join(f'<circle cx="{x}" cy="{y}" r="6" fill="#F6C343"/>' for x, y in [(70,84),(84,90),(160,52),(172,60),(150,90)])),
 "capcay": ("".join(f'<circle cx="{x}" cy="{y}" r="11" fill="#F28C28"/>' for x, y in [(36,40),(150,86),(196,40)])
            + "".join(f'<circle cx="{x}" cy="{y}" r="16" fill="#FFF8EA"/><circle cx="{x+8}" cy="{y-6}" r="10" fill="#FFF8EA"/>' for x, y in [(80,74),(170,46)])
            + leaf(20, 86, -10, "#2F6B22", 1.4) + leaf(110, 40, 15, "#2F6B22", 1.3) + leaf(120, 100, -20, "#3E7D2A", 1.2)),
 "urap": ("".join(f'<rect x="{x}" y="{y}" width="46" height="7" rx="3.5" transform="rotate({a} {x} {y})" fill="{c}"/>' for x, y, a, c in [(20,40,-15,"#2F6B22"),(50,70,20,"#3E7D2A"),(90,34,5,"#2F6B22"),(120,76,-25,"#3E7D2A"),(150,40,12,"#2F6B22"),(30,96,4,"#3E7D2A"),(150,96,-6,"#2F6B22")])
          + "".join(f'<circle cx="{x}" cy="{y}" r="4.5" fill="#FFF8EA"/>' for x, y in [(40,60),(66,46),(84,90),(110,60),(140,58),(170,74),(196,52),(120,100),(60,104)])),
 "kangkung": ("".join(f'<path d="M{x} 110 q10 -50 {d} -92" stroke="#3E7D2A" stroke-width="6" fill="none" stroke-linecap="round"/>' for x, d in [(30,30),(70,20),(110,36),(150,24),(190,10)])
              + "".join(leaf(x, y, a, "#2F6B22", 1.3) for x, y, a in [(40,40,-60),(84,30,-80),(130,46,-50),(166,30,-70),(196,60,-100)])
              + '<circle cx="60" cy="96" r="6" fill="#C8321E"/><circle cx="150" cy="100" r="6" fill="#C8321E"/>'),
}

# ---- buah (local box 134x122) ----
def wedge(flesh, rind, seeds="#17241C", n=5, inner=None):
    s = f'<path d="M14 100 a53 53 0 0 1 106 0 Z" fill="{rind}"/><path d="M22 100 a45 45 0 0 1 90 0 Z" fill="{flesh}"/>'
    if inner: s += f'<path d="M50 100 a17 17 0 0 1 34 0 Z" fill="{inner}"/>'
    s += "".join(f'<ellipse cx="{67 + 26 * __import__("math").cos(a)}" cy="{100 - 26 * __import__("math").sin(a)}" rx="3" ry="4.5" fill="{seeds}"/>' for a in [0.5 + i * (2.1 / max(n - 1, 1)) for i in range(n)]) if seeds else ""
    return s
BUAH = {
 "pepaya": wedge("#F49A3A", "#6FAE45", "#17241C", 6, "#F7B76A"),
 "semangka": wedge("#E8445A", "#2F6B22", "#17241C", 6),
 "melon": wedge("#D9EFA6", "#9BC45A", None),
 "nanas": "".join(f'<rect x="{x}" y="{y}" width="32" height="32" rx="7" fill="#F7D046"/><rect x="{x+10}" y="{y+10}" width="12" height="12" rx="3" fill="#FBE59A"/>' for x, y in [(20,30),(58,24),(92,40),(30,68),(70,66)]),
 "naga": wedge("#B8234F", "#F7A9C1", "#17241C", 7),
}

DAYS = [  # [SAMPLE] menu from copy.md
    ("sen", "Senin", "ayam", "buncis", "pepaya", "Ayam panggang bumbu kuning", "Tumis buncis wortel", "Pepaya"),
    ("sel", "Selasa", "ikan", "bayam", "semangka", "Pepes ikan", "Sayur bening bayam", "Semangka"),
    ("rab", "Rabu", "tahu", "capcay", "melon", "Tahu tempe bacem", "Capcay", "Melon"),
    ("kam", "Kamis", "suwir", "urap", "nanas", "Ayam suwir kemangi", "Urap sayur", "Nanas"),
    ("jum", "Jumat", "bakar", "kangkung", "naga", "Ikan bakar kecap", "Tumis kangkung", "Buah naga"),
]

def box(cls, label, seed, days=("sen",), hidden=False, active="sen"):
    aria = 'aria-hidden="true" focusable="false"' if hidden else f'role="img" aria-label="{label}"'
    sel = [d for d in DAYS if d[0] in days]
    def per(kind):
        out = []
        for d in sel:
            key = {"lauk": d[2], "sayur": d[3], "buah": d[4]}[kind]
            art = {"lauk": LAUK, "sayur": SAYUR, "buah": BUAH}[kind][key]
            out.append(f'<g class="food dish dish-{d[0]}">{art}</g>')
        return "".join(out)
    return (f'<svg class="box {cls}" data-day="{active}" viewBox="0 0 400 400" {aria}>'
            '<rect width="400" height="400" rx="40" fill="var(--ink)"/>'
            f'<g class="part part-karbo"><rect x="16" y="16" width="150" height="232" rx="22" fill="var(--karbo)"/>{g(16, 16, "<g class=food>" + rice(seed) + "</g>")}</g>'
            f'<g class="part part-lauk"><rect x="180" y="16" width="204" height="232" rx="22" fill="var(--lauk)"/>{g(180, 16, per("lauk"))}</g>'
            f'<g class="part part-sayur"><rect x="16" y="262" width="220" height="122" rx="22" fill="var(--sayur)"/>{g(16, 262, per("sayur"))}</g>'
            f'<g class="part part-buah"><rect x="250" y="262" width="134" height="122" rx="22" fill="var(--buah)"/>{g(250, 262, per("buah"))}</g>'
            '</svg>')
