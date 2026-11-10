// Functions that run inside the page (passed to page.evaluate). Each one must be
// self-contained: Playwright sends only the function's source to the browser.

// Marks text that is visible in the viewport right now. Called at every scroll
// step, so text revealed on the way down counts as seen even if a script hides
// it again once it leaves the screen.
export function markSeen() {
  const els = document.body ? document.body.querySelectorAll('*') : [];
  for (const el of els) {
    if (el.__ddSeen || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > innerHeight) continue;
    let op = 1;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) op *= parseFloat(getComputedStyle(e).opacity);
    if (op >= 0.05) el.__ddSeen = true;
  }
}

// Text that was never visible during the whole scroll. Closed menus and dialogs,
// and hidden duplicates of text that is visible elsewhere, are not counted.
export function hiddenText() {
  const out = [];
  const els = document.body ? [...document.body.querySelectorAll('*')] : [];
  const own = (el) => [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
  const seenText = new Set(els.filter((el) => el.__ddSeen).map(own));
  // Slides of a carousel are hidden by design until the visitor turns to them: not a broken reveal.
  const CAROUSEL = '[aria-roledescription="slide"], [aria-roledescription="carousel"], .swiper, .swiper-slide, .splide, .slick-slide, .glide, .embla, .flickity-slider, .keen-slider, [class*="carousel"], [class*="slider"], [class*="slideshow"]';
  const clippedSideways = (el) => {
    const r = el.getBoundingClientRect();
    for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (!/(hidden|auto|scroll|clip)/.test(cs.overflowX)) continue;
      const pr = e.getBoundingClientRect();
      if (r.right <= pr.left + 1 || r.left >= pr.right - 1) return true;
    }
    return false;
  };
  let carousel = 0;
  for (const el of els) {
    if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    if (el.__ddSeen) continue;
    if (el.closest('[aria-hidden="true"], [hidden], nav, [role="menu"], [role="dialog"], [aria-modal="true"], dialog:not([open]), details:not([open]) > :not(summary)')) continue;
    const text = own(el);
    if (text.length < 2 || seenText.has(text)) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    let op = 1;
    let shown = true;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      op *= parseFloat(cs.opacity);
      if (cs.display === 'none' || cs.visibility === 'hidden') shown = false;
    }
    if (!shown) continue; // deliberately hidden (closed menus and the like)
    if (el.closest(CAROUSEL) || clippedSideways(el)) {
      carousel++;
      continue;
    }
    if (op < 0.05) out.push(text.slice(0, 60));
  }
  return { count: out.length, samples: out.slice(0, 5), carousel };
}

export function measure({ rules, viewport }) {
  const findings = [];
  const add = (severity, rule, message, sample) => findings.push({ severity, rule, message, ...(sample ? { sample } : {}) });
  const styleSeverity = (rule) => {
    const v = (rules[rule] || 'off').toLowerCase();
    return v === 'fail' ? 'FAIL' : v === 'warn' ? 'WARN' : v === 'info' ? 'INFO' : null;
  };
  const style = (rule, message, sample) => {
    const s = styleSeverity(rule);
    if (s) add(s, rule, message, sample);
  };
  const vw = innerWidth;
  const isPhone = vw < 500;

  // --- colour helpers: draw the colour on a canvas and read the pixel back, so
  // any syntax the browser understands (oklch, color(), named) becomes sRGB.
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  const cache = new Map();
  const rgba = (str) => {
    if (cache.has(str)) return cache.get(str);
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = 'rgba(0,0,0,0)';
    cx.fillStyle = str;
    cx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data;
    const v = { r, g, b, a: a / 255 };
    cache.set(str, v);
    return v;
  };
  const hex = (c) => '#' + [c.r, c.g, c.b].map((x) => x.toString(16).padStart(2, '0')).join('');
  const lum = (c) => {
    const f = (x) => {
      x /= 255;
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b);
  };
  const contrast = (a, b) => {
    const [l1, l2] = [lum(a), lum(b)].sort((x, y) => y - x);
    return (l1 + 0.05) / (l2 + 0.05);
  };
  const hsl = (c) => {
    const r = c.r / 255, g = c.g / 255, b = c.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: h * 60, s, l };
  };
  const over = (top, bottom) => {
    const a = top.a + bottom.a * (1 - top.a);
    if (a === 0) return { r: 255, g: 255, b: 255, a: 1 };
    return {
      r: Math.round((top.r * top.a + bottom.r * bottom.a * (1 - top.a)) / a),
      g: Math.round((top.g * top.a + bottom.g * bottom.a * (1 - top.a)) / a),
      b: Math.round((top.b * top.a + bottom.b * bottom.a * (1 - top.a)) / a),
      a,
    };
  };
  // Effective background behind an element; null when an image or gradient is
  // underneath (contrast cannot be judged from styles alone).
  const backdrop = (el) => {
    // A picture, video or canvas painted behind the text (not as a CSS background)
    // makes the real backdrop unknowable from styles.
    const r = el.getBoundingClientRect();
    const cx = Math.min(Math.max(r.left + r.width / 2, 0), innerWidth - 1);
    const cy = Math.min(Math.max(r.top + r.height / 2, 0), innerHeight - 1);
    const onScreen = r.bottom > 0 && r.top < innerHeight;
    if (onScreen) {
      for (const under of document.elementsFromPoint(cx, cy)) {
        if (under === el || el.contains(under)) continue;
        if (['IMG', 'VIDEO', 'CANVAS', 'PICTURE', 'IFRAME'].includes(under.tagName)) return null;
        const ucs = getComputedStyle(under);
        if (ucs.backgroundImage && ucs.backgroundImage !== 'none') return null;
        if (rgba(ucs.backgroundColor).a >= 0.99) break;
      }
    }
    const layers = [];
    let opaque = false;
    for (let e = el; e && e.nodeType === 1; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.backgroundImage && cs.backgroundImage !== 'none') return null;
      const c = rgba(cs.backgroundColor);
      if (c.a > 0) layers.push(c);
      if (c.a >= 0.99) {
        opaque = true;
        break;
      }
    }
    // Off screen, with no opaque background of its own: whatever is painted
    // behind it (a photo in a sibling layer, a video) cannot be seen from here.
    if (!opaque && !onScreen) return null;
    let base = { r: 255, g: 255, b: 255, a: 1 };
    for (let i = layers.length - 1; i >= 0; i--) base = over(layers[i], base);
    return base;
  };

  const visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const cs = getComputedStyle(el);
    return cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05;
  };
  const all = [...document.body.querySelectorAll('*')].filter(
    (el) => !['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'svg', 'path'].includes(el.tagName) && !el.closest('svg')
  );
  const vis = all.filter(visible);
  const ownText = (el) =>
    [...el.childNodes]
      .filter((n) => n.nodeType === 3)
      .map((n) => n.textContent)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  // Text inside decorative art (aria-hidden, role=img) is not read; skip it for
  // size and contrast checks.
  const textEls = vis.filter((el) => ownText(el).length > 0 && !el.closest('[aria-hidden="true"], [role="img"]'));
  const snippet = (el) => `<${el.tagName.toLowerCase()}> "${(el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50)}"`;
  const inCode = (el) => !!el.closest('pre, code, kbd, samp');

  // --- overflow
  if (document.documentElement.scrollWidth > vw + 1) {
    const culprits = vis
      .filter((el) => el.getBoundingClientRect().right > vw + 1)
      .filter((el) => {
        for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
          const ox = getComputedStyle(e).overflowX;
          if (ox !== 'visible') return false;
        }
        return true;
      })
      .slice(0, 4)
      .map(snippet);
    add('FAIL', 'overflow', `Page scrolls sideways (${document.documentElement.scrollWidth}px wide in a ${vw}px window)`, culprits);
  }

  // --- fonts: which faces carry the text, and did they actually load?
  const shareByFamily = new Map();
  let totalChars = 0;
  const sizes = new Map();
  for (const el of textEls) {
    const cs = getComputedStyle(el);
    const fam = cs.fontFamily.split(',')[0].replace(/["']/g, '').trim();
    const n = ownText(el).length;
    totalChars += n;
    shareByFamily.set(fam, (shareByFamily.get(fam) || 0) + n);
    const px = Math.round(parseFloat(cs.fontSize));
    sizes.set(px, (sizes.get(px) || 0) + n);
  }
  const generic = /^(serif|sans-serif|monospace|cursive|fantasy|system-ui|ui-sans-serif|ui-serif|ui-monospace|-apple-system|blinkmacsystemfont|inherit|initial)$/i;
  const available = (fam) => {
    if (generic.test(fam)) return true;
    const test = 'mmmmmmmmmmlli1WQ@#';
    const w = (font) => {
      cx.font = font;
      return cx.measureText(test).width;
    };
    return w(`72px "${fam}", monospace`) !== w('72px monospace') || w(`72px "${fam}", serif`) !== w('72px serif');
  };
  const families = [...shareByFamily.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([family, n]) => ({ family, share: Math.round((n / Math.max(totalChars, 1)) * 100) }));
  // System faces that may simply be missing on this machine are an intended
  // fallback; any other unavailable family is a web font that never loaded.
  const systemFace = /^(arial|helvetica( neue)?|segoe ui|roboto|georgia|times( new roman)?|verdana|tahoma|trebuchet ms|courier( new)?|sf pro.*|sf mono|ubuntu|cantarell|noto (sans|serif).*|menlo|monaco|consolas|gill sans|palatino( linotype)?|garamond|baskerville|avenir( next)?|futura|optima|hoefler text|didot|american typewriter|charter|iowan old style|liberation (sans|serif|mono)|dejavu (sans|serif|sans mono)|apple color emoji|segoe ui emoji)$/i;
  const declared = new Map();
  for (const ff of document.fonts) declared.set(ff.family.replace(/["']/g, ''), ff.status);
  for (const f of families) {
    if (f.share < 1 || available(f.family)) continue;
    if (declared.get(f.family) === 'error')
      add('FAIL', 'font-not-loaded', `The web font "${f.family}" failed to load; the browser shows a fallback (${f.share}% of the text)`);
    else if (systemFace.test(f.family))
      add('INFO', 'system-font-missing', `"${f.family}" is not installed on this machine; its fallback is shown here`);
    else
      add('FAIL', 'font-not-loaded', `"${f.family}" is named in the CSS but never loaded; the browser shows a fallback font (${f.share}% of the text)`);
  }
  const mono = /mono|code|courier|consolas|menlo/i;
  // Cuts of one family (RegolaMedium, Din-Condensed-Regular, DMSans-Light) are one typeface.
  const familyRoot = (name) => {
    let n = name.replace(/["']/g, '').trim();
    const cut = /[-_ ]?(thin|hairline|ultralight|extralight|light|book|regular|normal|medium|semibold|demibold|bold|extrabold|ultrabold|black|heavy|italic|oblique|condensed|narrow|compressed|wide|extended|variable|vf|\d{3})$/i;
    for (let i = 0; i < 4 && cut.test(n); i++) n = n.replace(cut, '');
    return (n || name).toLowerCase().replace(/[-_ ]+/g, ' ').trim();
  };
  const rootShare = new Map();
  for (const f of families) rootShare.set(familyRoot(f.family), (rootShare.get(familyRoot(f.family)) || 0) + f.share);
  const typefaces = [...rootShare.entries()].map(([family, share]) => ({ family, share })).sort((a, b) => b.share - a.share);
  const textFamilies = typefaces.filter((f) => f.share >= 2 && !mono.test(f.family));
  if (textFamilies.length > 2) add('WARN', 'font-count', `${textFamilies.length} typefaces carry the text: ${textFamilies.map((f) => f.family).join(', ')}`);
  const systemOnly = families.filter((f) => f.share >= 5).every((f) => generic.test(f.family) || /^(inter|arial|helvetica|roboto|segoe ui|helvetica neue|open sans)$/i.test(f.family));
  if (families.length && systemOnly) style('system-font-only', `Only a default typeface carries the page (${families.slice(0, 2).map((f) => f.family).join(', ')})`);
  const fontSizes = [...sizes.keys()].sort((a, b) => b - a);
  if (viewport === 'desktop' && fontSizes.filter((s) => sizes.get(s) > 20).length > 7)
    style('too-many-font-sizes', `${fontSizes.length} different font sizes on the page (aim for 5 or fewer doing the visible work)`);
  // Display sizes need a scale: a few steps used by role, not a new size per section (A-Rete, batch-005).
  const displaySizes = fontSizes.filter((sz) => sz >= 24 && sizes.get(sz) > 6);
  if (viewport === 'desktop' && displaySizes.length > 5)
    add('WARN', 'display-sizes', `${displaySizes.length} display sizes (24px and up) with no clear scale: ${displaySizes.join(', ')} px; use 3-4 steps, each with one role`);

  // --- text size, contrast
  const seenPairs = new Set();
  const contrastCandidates = [];
  let unknownBackdrops = 0;
  for (const el of textEls) {
    const cs = getComputedStyle(el);
    const px = parseFloat(cs.fontSize);
    const text = ownText(el);
    if (px < 10 && text.length > 2) add('FAIL', 'tiny-text', `Text at ${px}px`, [snippet(el)]);
    else if (px < 12 && text.length > 20 && !inCode(el)) add('WARN', 'small-text', `Text at ${px}px`, [snippet(el)]);
    const running = ['P', 'LI', 'DD', 'BLOCKQUOTE', 'TD'].includes(el.tagName) && text.length > 80;
    if (running && px < 16) add('WARN', 'body-size', `Running text at ${px}px (16px or more reads better)`, [snippet(el)]);
    if (!/[\p{L}\p{N}]/u.test(text)) continue; // separators and symbols are not read as text
    const fg = rgba(cs.color);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = px >= 24 || (px >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const bg = backdrop(el);
    // Suspects are checked again on real screen pixels by inspect.mjs: pairs that
    // fail on styles, and text whose backdrop cannot be read from styles at all.
    if (!bg) {
      if (unknownBackdrops < 30 && text.length > 2) {
        el.setAttribute('data-dd-lc', String(contrastCandidates.length));
        contrastCandidates.push({ id: contrastCandidates.length, fg: hex(fg), styleBg: null, need, text: snippet(el) });
        unknownBackdrops++;
      }
      continue;
    }
    const ink = over({ ...fg, a: fg.a * parseFloat(cs.opacity) }, bg);
    const ratio = contrast(ink, bg);
    const key = `${hex(ink)}|${hex(bg)}|${large}`;
    if (ratio < need && !seenPairs.has(key)) {
      seenPairs.add(key);
      el.setAttribute('data-dd-lc', String(contrastCandidates.length));
      contrastCandidates.push({ id: contrastCandidates.length, fg: hex(ink), styleBg: hex(bg), styleRatio: Number(ratio.toFixed(2)), need, text: snippet(el) });
    }
  }

  // --- sample content from the kit (kit/index.html) left in a page
  const samples = [...document.querySelectorAll('[data-kit-sample]')];
  if (samples.length) style('kit-sample', `${samples.length} section(s) still carry the kit's sample content: write their content from the spec and remove data-kit-sample`, samples.slice(0, 3).map((e) => e.getAttribute('data-kit') || snippet(e)));

  // --- placeholder wordmark (brand/method.md §9): reported so the deliver report lists it for replacement
  const logos = [...document.querySelectorAll('[data-placeholder-logo]')];
  if (logos.length) add('INFO', 'placeholder-logo', `${logos.length} placeholder wordmark(s): list them in the deliver report as a placeholder to replace with a designer's logo`, logos.slice(0, 3).map((e) => snippet(e)));

  // --- sample product UI (rules/brief-interview.md → Materials): a mock with sample data, listed in the deliver report
  const sampleUi = [...document.querySelectorAll('[data-sample]')];
  if (sampleUi.length) add('INFO', 'sample-ui', `${sampleUi.length} element(s) carry sample data (data-sample): list them in the deliver report as sample UI to replace with the real product`, sampleUi.slice(0, 3).map((e) => e.getAttribute('data-sample') || snippet(e)));

  // --- data tables (admin/table.md): a <table>, role=table or role=grid with 3+ data rows.
  // Severities come from rules (style-defaults.json), so a team or brand can tune them.
  {
    const TABLES = 'table, [role="table"], [role="grid"], [role="treegrid"]';
    const tableName = (t) => {
      const cap = t.querySelector('caption');
      const lab = t.getAttribute('aria-label') || (t.getAttribute('aria-labelledby') && document.getElementById(t.getAttribute('aria-labelledby').split(' ')[0])?.textContent) || (cap && cap.textContent) || '';
      return lab.trim().replace(/\s+/g, ' ').slice(0, 40) || `table ${[...document.querySelectorAll(TABLES)].indexOf(t) + 1}`;
    };
    const cellsOf = (t, r) => (t.tagName === 'TABLE' ? [...r.cells] : [...r.querySelectorAll('[role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"]')].filter((c) => c.closest('[role="row"]') === r));
    const isHead = (t, r) => (r.parentElement && r.parentElement.tagName === 'THEAD') || cellsOf(t, r).every((c) => (c.tagName === 'TH' && c.getAttribute('scope') !== 'row') || c.getAttribute('role') === 'columnheader');
    // Column index that counts colspans, so cells line up with their header.
    const indexed = (t, r) => {
      let i = 0;
      return cellsOf(t, r).map((c) => {
        const at = i;
        i += t.tagName === 'TABLE' ? c.colSpan || 1 : 1;
        return { c, i: at };
      });
    };
    const tables = [...document.querySelectorAll(TABLES)].filter((t) => {
      if (!visible(t) || (t.parentElement && t.parentElement.closest(TABLES))) return false;
      const role = t.getAttribute('role');
      return !(t.tagName === 'TABLE' && role && !/^(table|grid|treegrid)$/.test(role));
    }).map((t) => {
      const rows = (t.tagName === 'TABLE' ? [...t.rows] : [...t.querySelectorAll('[role="row"]')]).filter(visible);
      const head = rows.filter((r) => isHead(t, r)).pop() || null;
      const body = rows.filter((r) => !isHead(t, r) && cellsOf(t, r).length);
      return { t, head, body, name: tableName(t) };
    }).filter((x) => x.body.length >= 3);

    // Text box of a cell from its text nodes only (a block child spans the whole cell).
    const textBox = (el) => {
      let left = Infinity;
      let right = -Infinity;
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      while (walk.nextNode()) {
        if (!walk.currentNode.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(walk.currentNode);
        for (const q of range.getClientRects()) {
          if (!q.width) continue;
          left = Math.min(left, q.left);
          right = Math.max(right, q.right);
        }
      }
      return left === Infinity ? null : { left, right };
    };
    const contentBox = (cell) => {
      const r = cell.getBoundingClientRect();
      const cs = getComputedStyle(cell);
      return { left: r.left + parseFloat(cs.paddingLeft) + parseFloat(cs.borderLeftWidth), right: r.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth) };
    };
    // A quantity people compare (amount, count, percent), not a number used as a name (ID, phone, date, year).
    const QUANTITY = /^[-+−(]?\s*(?:rp\.?|idr|usd|eur|sgd|\$|€|£|¥)?\s*[-+−]?\d[\d.,\s]*(?:%|k|rb|ribu|jt|juta|m|kg|g|pcs|x|items?|unit)?\)?$/i;
    const NAME_NUMBER = /\b(id|no|nomor|number|kode|code|sku|phone|telp|telepon|hp|tanggal|date|tahun|year|zip|kode pos|postcode|rank|peringkat|versi|version)\b|#/i;
    const isQuantity = (s) => s.length <= 24 && QUANTITY.test(s) && !/^(\+|0\d)/.test(s);
    const hasCheckbox = (cell) => cell.querySelector('input[type="checkbox"], [role="checkbox"]');

    const misaligned = [];
    const checkboxOff = [];
    const smallBoxes = [];
    const truncated = [];
    const notSticky = [];
    for (const { t, head, body, name } of tables) {
      // 1. Numbers people compare are right-aligned, so units line up under units (T10).
      const headText = new Map((head ? indexed(t, head) : []).map(({ c, i }) => [i, (c.textContent || '').trim()]));
      const cols = new Map();
      for (const r of body) for (const { c, i } of indexed(t, r)) {
        if (!cols.has(i)) cols.set(i, []);
        cols.get(i).push(c);
      }
      for (const [i, cells] of cols) {
        if (NAME_NUMBER.test(headText.get(i) || '')) continue;
        const texts = cells.map((c) => (c.textContent || '').replace(/\s+/g, ' ').trim()).filter(Boolean);
        if (texts.length < 3 || texts.filter(isQuantity).length < texts.length * 0.8) continue;
        let decided = 0;
        let right = 0;
        for (const c of cells) {
          const tb = textBox(c);
          if (!tb) continue;
          const cb = contentBox(c);
          const gapR = cb.right - tb.right;
          const gapL = tb.left - cb.left;
          if (gapR + gapL < 6) continue; // the value fills the cell: alignment cannot be seen
          decided++;
          if (gapR <= 2) right++;
        }
        if (decided >= 2 && right < decided * 0.5) misaligned.push(`${name}: column "${headText.get(i) || i + 1}" (${right}/${decided} cells right-aligned)`);
      }

      // 2. Row checkboxes sit on one vertical line with the header checkbox, each with a 24px target (T5).
      const boxes = [];
      for (const r of [head, ...body].filter(Boolean)) {
        const cell = cellsOf(t, r).find(hasCheckbox);
        if (!cell) continue;
        const ctl = hasCheckbox(cell);
        const label = ctl.closest('label') || (ctl.id && document.querySelector(`label[for="${CSS.escape(ctl.id)}"]`));
        const shown = visible(ctl) ? ctl : label && visible(label) ? label : ctl.parentElement;
        const rr = shown.getBoundingClientRect();
        // The hit area: the control and a label wrapped around it or pointing at it.
        let hit = visible(ctl) ? ctl.getBoundingClientRect() : rr;
        if (label && visible(label)) {
          const lr = label.getBoundingClientRect();
          hit = { width: Math.max(hit.right, lr.right) - Math.min(hit.left, lr.left), height: Math.max(hit.bottom, lr.bottom) - Math.min(hit.top, lr.top), left: Math.min(hit.left, lr.left), right: Math.max(hit.right, lr.right) };
        }
        boxes.push({ x: rr.left + rr.width / 2, w: hit.width, h: hit.height, head: r === head });
      }
      if (boxes.filter((b) => !b.head).length >= 2) {
        const xs = boxes.map((b) => b.x);
        const spread = Math.max(...xs) - Math.min(...xs);
        if (spread > 2) checkboxOff.push(`${name}: checkbox centres differ by ${Math.round(spread)}px${boxes.some((b) => b.head) ? ' (header included)' : ''}`);
        const small = boxes.filter((b) => b.w < 24 || b.h < 24);
        if (small.length && !isPhone) smallBoxes.push(`${name}: ${small.length} checkbox(es) with a hit area of ${Math.round(small[0].w)}x${Math.round(small[0].h)}px`);
      }

      // 3. A value cut with an ellipsis has a way to be read in full (T8).
      for (const r of body) for (const c of cellsOf(t, r)) {
        for (const el of [c, ...c.querySelectorAll('*')]) {
          const cs = getComputedStyle(el);
          const cutX = cs.textOverflow === 'ellipsis' && cs.overflowX !== 'visible' && el.scrollWidth > el.clientWidth + 1;
          const cutY = cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && el.scrollHeight > el.clientHeight + 1;
          if (!cutX && !cutY) continue;
          let reachable = false;
          for (let e = el; e && e !== r.parentElement; e = e.parentElement) {
            if (e.matches('[title], [aria-label], [aria-describedby], [data-tooltip], [data-tip]')) reachable = true;
            if (e === r) break;
          }
          if (r.querySelector('[aria-expanded]')) reachable = true;
          if (!reachable) truncated.push(`${name}: "${(el.textContent || '').trim().slice(0, 40)}"`);
          break;
        }
      }

      // 4. A table wider than its box keeps the identifier and the actions in view (T3).
      let box = null;
      for (let e = t; e && e !== document.body; e = e.parentElement) {
        const ox = getComputedStyle(e).overflowX;
        if (/(auto|scroll)/.test(ox) && e.scrollWidth > e.clientWidth + 1) {
          box = e;
          break;
        }
      }
      if (box) {
        const sticky = (cell) => [cell, ...cell.querySelectorAll('*')].some((e) => getComputedStyle(e).position === 'sticky');
        const width = Math.max(...cols.keys()) + 1;
        const colCells = (i) => cols.get(i) || [];
        const isChecks = (i) => colCells(i).filter(hasCheckbox).length >= colCells(i).length * 0.6;
        const isActions = (i) => colCells(i).filter((c) => c.querySelector('button, [role="button"], [aria-haspopup]') && (c.textContent || '').trim().length < 30).length >= colCells(i).length * 0.6 || /^(aksi|actions?|tindakan|opsi|options)$/i.test(headText.get(i) || '');
        const idCol = [...Array(width).keys()].find((i) => !isChecks(i) && colCells(i).length);
        const actCol = [...Array(width).keys()].reverse().find(isActions);
        const parts = [];
        if (idCol !== undefined && !colCells(idCol).every(sticky)) parts.push(`identifier column "${headText.get(idCol) || idCol + 1}"`);
        if (actCol !== undefined && !colCells(actCol).every(sticky)) parts.push(`actions column "${headText.get(actCol) || actCol + 1}"`);
        if (parts.length) notSticky.push(`${name}: scrolls sideways (${box.scrollWidth} in ${box.clientWidth}px); not sticky: ${parts.join(', ')}`);
      }
    }
    if (misaligned.length) style('table-numbers-align', `${misaligned.length} numeric column(s) not right-aligned: amounts and counts are compared digit by digit, so they line up on the right (admin/table.md T10)`, misaligned.slice(0, 4));
    if (checkboxOff.length) style('table-checkbox-align', `Row checkboxes are not on one vertical line (more than 2px apart): the selection column should read as one column, header checkbox included (admin/table.md T5)`, checkboxOff.slice(0, 3));
    if (smallBoxes.length) style('table-checkbox-target', `Row checkboxes with a hit area under 24x24px: make the label or the cell the target (WCAG 2.5.8; on a phone the tap-target rule applies) (admin/table.md T5)`, smallBoxes.slice(0, 3));
    if (truncated.length) style('table-truncation', `${truncated.length} table value(s) cut with an ellipsis and no way to read them in full (no title, aria-label, aria-describedby tooltip or expand control); prefer wrapping or a detail view (admin/table.md T8)`, truncated.slice(0, 4));
    if (notSticky.length) style('table-sticky-columns', `A wide table scrolls sideways without keeping its identifier and actions columns in view (admin/table.md T3)`, notSticky.slice(0, 3));
  }

  // --- headings
  const h1s = [...document.querySelectorAll('h1')].filter(visible);
  if (h1s.length === 0) add('FAIL', 'no-h1', 'No visible h1: the page has no title');
  else if (h1s.length > 1) add('WARN', 'many-h1', `${h1s.length} h1 elements`);
  for (const h of [...document.querySelectorAll('h1, h2, h3')].filter(visible)) {
    const cs = getComputedStyle(h);
    const lh = cs.lineHeight === 'normal' ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
    const lines = Math.round(h.getBoundingClientRect().height / lh);
    if (h.tagName === 'H1' && lines > 3) add('FAIL', 'headline-lines', `h1 runs to ${lines} lines`, [snippet(h)]);
    else if (lines > 3 && parseFloat(cs.fontSize) >= 28) add('WARN', 'headline-lines', `${h.tagName.toLowerCase()} runs to ${lines} lines`, [snippet(h)]);
  }

  // --- line length
  for (const p of vis.filter((el) => el.tagName === 'P')) {
    const text = (p.textContent || '').trim();
    if (text.length < 160) continue;
    const cs = getComputedStyle(p);
    const lh = cs.lineHeight === 'normal' ? parseFloat(cs.fontSize) * 1.2 : parseFloat(cs.lineHeight);
    const lines = Math.max(1, Math.round(p.getBoundingClientRect().height / lh));
    const cpl = Math.round(text.length / lines);
    if (cpl > 95) add('WARN', 'line-length', `About ${cpl} characters per line (55-75 reads best)`, [snippet(p)]);
  }

  // --- fixed things that are not a bar cover part of every screen (an oversized fixed logo, a floating badge)
  const covers = [];
  for (const el of vis) {
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
    const r = el.getBoundingClientRect();
    const bar = r.width >= innerWidth * 0.9 && r.height <= innerHeight * 0.15;
    const panel = cs.position === 'sticky' && r.height >= innerHeight * 0.5; // a pinned section device
    // A sticky header cell or column inside a table pins to the table's own scroll box, not the screen (admin/table.md T3, T12).
    if (cs.position === 'sticky' && el.closest('th, td, [role="cell"], [role="gridcell"], [role="columnheader"], [role="rowheader"], thead, [role="rowgroup"]')) continue;
    // A closed drawer or modal sits in a full-screen wrapper that lets clicks through and paints
    // nothing (Quite Nice): not a cover. Only the part inside the screen counts.
    const paints = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || parseFloat(cs.borderTopWidth) > 0;
    if (cs.pointerEvents === 'none' && !paints) continue;
    const onScreen = Math.max(0, Math.min(r.right, innerWidth) - Math.max(r.left, 0)) * Math.max(0, Math.min(r.bottom, innerHeight) - Math.max(r.top, 0));
    if (bar || panel || onScreen < innerWidth * innerHeight * 0.03) continue;
    covers.push(`${Math.round(r.width)}x${Math.round(r.height)} (${Math.round((r.height / innerHeight) * 100)}% of the screen height) ${snippet(el)}`);
  }
  if (covers.length) add('WARN', 'fixed-cover', `${covers.length} fixed or sticky element(s) that are not a bar cover part of every screen; make it a slim bar or let it scroll away`, covers.slice(0, 3));

  // --- phone: tap targets and text against the edge
  if (isPhone) {
    const small = [];
    for (const el of vis.filter((e) => e.matches('a, button, input, select, textarea, [role="button"]'))) {
      const parent = el.parentElement;
      const inline = el.tagName === 'A' && parent && ['P', 'LI', 'SPAN'].includes(parent.tagName) && (parent.textContent || '').trim().length > (el.textContent || '').trim().length + 20;
      if (inline) continue;
      let r = el.getBoundingClientRect();
      // A checkbox or radio is hit through its label too: the target is the two together.
      const label = el.matches('input') && (el.closest('label') || (el.id && document.querySelector(`label[for="${CSS.escape(el.id)}"]`)));
      if (label && visible(label)) {
        const lr = label.getBoundingClientRect();
        r = { width: Math.max(r.right, lr.right) - Math.min(r.left, lr.left), height: Math.max(r.bottom, lr.bottom) - Math.min(r.top, lr.top) };
      }
      if (r.width < 24 || r.height < 24) small.push(`${Math.round(r.width)}x${Math.round(r.height)} ${snippet(el)}`);
    }
    if (small.length) add('FAIL', 'tap-target', `${small.length} controls smaller than 24x24px on a phone`, small.slice(0, 4));
    // The text's own box, not the element's: a full-width bar with padding keeps its words off the edge.
    const textBox = (el) => {
      let left = Infinity;
      let right = -Infinity;
      for (const n of el.childNodes) {
        if (n.nodeType !== 3 || !n.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(n);
        for (const q of range.getClientRects()) {
          if (!q.width) continue;
          left = Math.min(left, q.left);
          right = Math.max(right, q.right);
        }
      }
      return left === Infinity ? el.getBoundingClientRect() : { left, right };
    };
    // Text in a box that scrolls sideways (a wide table) runs past the edge by design.
    const inSideScroll = (el) => {
      for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
        if (/(auto|scroll)/.test(getComputedStyle(e).overflowX) && e.scrollWidth > e.clientWidth + 1) return true;
      }
      return false;
    };
    const edge = textEls.filter((el) => {
      if (inSideScroll(el)) return false;
      const r = textBox(el);
      return r.left < 12 || r.right > vw - 12;
    });
    if (edge.length) add('WARN', 'text-at-edge', `${edge.length} text elements within 12px of the screen edge`, edge.slice(0, 3).map(snippet));
  }

  // --- images
  const noAlt = [...document.querySelectorAll('img')].filter((i) => !i.hasAttribute('alt'));
  if (noAlt.length) add('FAIL', 'img-alt', `${noAlt.length} images without an alt attribute`, noAlt.slice(0, 3).map((i) => i.getAttribute('src')));
  const broken = [...document.querySelectorAll('img')].filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute('src'));
  if (broken.length) add('FAIL', 'img-broken', `${broken.length} images failed to load`, broken.slice(0, 3).map((i) => i.getAttribute('src')));

  // --- inventory of the design system actually in use
  const textColours = new Set();
  const backgroundColours = new Set();
  const chromatic = new Set();
  const hueFamilies = new Set();
  const spacing = new Map();
  const radii = new Set();
  let shadows = 0;
  let gradients = 0;
  let backdropBlur = 0;
  let transitions = 0;
  const purple = [];
  for (const el of vis) {
    const cs = getComputedStyle(el);
    const fg = rgba(cs.color);
    if (ownText(el)) textColours.add(hex(fg));
    const bg = rgba(cs.backgroundColor);
    if (bg.a > 0.05) backgroundColours.add(hex(bg));
    for (const c of [fg, bg]) {
      if (c.a < 0.05) continue;
      const h = hsl(c);
      if (h.s > 0.2 && h.l > 0.08 && h.l < 0.92) {
        chromatic.add(hex(c));
        // Tints and shades of one hue are one colour family (clustered below).
        hueFamilies.add(Math.round(h.h));
      }
    }
    for (const prop of ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight', 'rowGap', 'columnGap']) {
      const v = parseFloat(cs[prop]);
      if (v > 0) spacing.set(Math.round(v * 2) / 2, (spacing.get(Math.round(v * 2) / 2) || 0) + 1);
    }
    if (cs.borderTopLeftRadius !== '0px') radii.add(cs.borderTopLeftRadius);
    const dropShadow = cs.boxShadow !== 'none' && cs.boxShadow.split(/,(?![^(]*\))/).some((x) => !/inset/.test(x));
    if (dropShadow) shadows++;
    const gradCols = cs.backgroundImage.includes('gradient') ? cs.backgroundImage.match(/(rgba?|oklch|oklab|hsla?|color)\([^)]*\)|#[0-9a-f]{3,8}/gi) || [] : [];
    // A one-colour "gradient" is a fill trick (a highlighter mark, a stripe), not a gradient.
    if (cs.backgroundImage.includes('gradient') && new Set(gradCols.map((c) => c.replace(/\s/g, ''))).size > 1) {
      gradients++;
      const cols = gradCols;
      if (cols.some((s) => {
        const h = hsl(rgba(s));
        return h.s > 0.3 && h.h >= 235 && h.h <= 300;
      })) purple.push(snippet(el));
    }
    if (cs.backdropFilter && cs.backdropFilter !== 'none') backdropBlur++;
    if (cs.transitionDuration.split(',').some((d) => parseFloat(d) > 0)) transitions++;
  }
  const spacingValues = [...spacing.keys()];
  const offScale = spacingValues.filter((v) => v % 4 !== 0).length;

  // --- AI defaults (severity from rules)
  if (purple.length) style('purple-gradient', `${purple.length} purple or indigo gradients`, purple.slice(0, 3));
  if (gradients) style('gradient', `${gradients} gradient backgrounds`);
  if (backdropBlur) style('glass', `${backdropBlur} blurred glass panels`);
  if (chromatic.size > 6) style('too-many-colours', `${chromatic.size} distinct chromatic colours`, [...chromatic].slice(0, 8));
  const cardish = vis.filter((el) => {
    const bs = getComputedStyle(el).boxShadow;
    return bs !== 'none' && bs.split(/,(?![^(]*\))/).some((x) => !/inset/.test(x)) && el.getBoundingClientRect().width < vw * 0.6;
  });
  if (cardish.length >= 6) style('shadow-on-everything', `${cardish.length} boxes carry a drop shadow`);

  // Rows of 3-4 look-alike cards, each with a small icon, a heading and a line.
  const iconRows = [];
  for (const parent of vis) {
    const kids = [...parent.children].filter(visible);
    if (kids.length < 3 || kids.length > 4) continue;
    const rects = kids.map((k) => k.getBoundingClientRect());
    const sameRow = rects.every((r) => Math.abs(r.top - rects[0].top) < 8);
    const sameWidth = rects.every((r) => Math.abs(r.width - rects[0].width) < rects[0].width * 0.1);
    if (!sameRow || !sameWidth || rects[0].width > vw * 0.4) continue;
    const iconCards = kids.filter((k) => {
      const icon = [...k.querySelectorAll('svg, img, i, span')].find((i) => {
        const r = i.getBoundingClientRect();
        return r.width > 12 && r.width <= 72 && r.height <= 72 && (i.tagName !== 'SPAN' || /[\u{1F300}-\u{1FAFF}☀-➿]/u.test(i.textContent || ''));
      });
      return icon && k.querySelector('h2, h3, h4, h5, strong') && k.querySelector('p');
    });
    if (iconCards.length === kids.length) iconRows.push(snippet(parent));
  }
  if (iconRows.length) style('icon-card-row', `${iconRows.length} rows of identical icon cards`, iconRows.slice(0, 2));

  // Centred hero headline with two buttons side by side.
  if (h1s[0] && h1s[0].getBoundingClientRect().top < innerHeight) {
    const centred = getComputedStyle(h1s[0]).textAlign === 'center';
    // A link in a slim full-width bar (announcement, header) is not a hero button.
    const inBar = (el) => {
      for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
        const r = e.getBoundingClientRect();
        if (r.width >= innerWidth * 0.9 && r.height <= 64) return true;
      }
      return false;
    };
    // Buttons that repeat their label for a hover roll ("Get Started Get Started") count once.
    const label = (el) => {
      const t = (el.innerText || '').replace(/\s+/g, ' ').trim().toLowerCase();
      const half = t.slice(0, Math.floor(t.length / 2)).trim();
      return half && t === `${half} ${half}` ? half : t;
    };
    const seenLabels = new Set();
    const buttons = vis.filter((el) => {
      if (!el.matches('a, button') || el.closest('nav') || inBar(el)) return false;
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight || r.top < 0) return false;
      // Hero buttons sit under the headline; controls further down the first screen (a carousel's arrows) are not.
      if (r.top < h1s[0].getBoundingClientRect().top || r.top - h1s[0].getBoundingClientRect().bottom > 240) return false;
      const cs = getComputedStyle(el);
      if (!(rgba(cs.backgroundColor).a > 0.2 || parseFloat(cs.borderTopWidth) > 0)) return false;
      if (seenLabels.has(label(el))) return false;
      seenLabels.add(label(el));
      return true;
    });
    if (centred && buttons.length >= 2) style('centred-hero-two-ctas', 'Centred hero headline with two buttons, the most common generated layout');
  }
  const emoji = [...document.querySelectorAll('h1, h2, h3, h4, button, a')].filter((h) => visible(h) && /\p{Extended_Pictographic}/u.test(h.textContent || ''));
  if (emoji.length) style('emoji', `${emoji.length} headings or buttons contain emoji`, emoji.slice(0, 3).map(snippet));

  return {
    findings,
    contrastCandidates,
    inventory: {
      families,
      typefaces,
      fontSizes,
      textColours: [...textColours],
      backgroundColours: [...backgroundColours],
      chromaticColours: chromatic.size,
      // A new family starts where the next hue is more than 24° away (around the wheel).
      colourFamilies: (() => {
        const hs = [...hueFamilies].sort((a, b) => a - b);
        if (!hs.length) return 0;
        let n = 1;
        for (let i = 1; i < hs.length; i++) if (hs[i] - hs[i - 1] > 24) n++;
        if (n > 1 && hs[0] + 360 - hs[hs.length - 1] <= 24) n--;
        return n;
      })(),
      spacing: { distinct: spacingValues.length, offScale, values: spacingValues.sort((a, b) => a - b).slice(0, 40) },
      radii: [...radii].slice(0, 12),
      shadows,
      gradients,
      backdropBlur,
      transitions,
    },
  };
}

// Selecting a row in a data table should bring up what can be done with the selection: a count and
// the bulk actions (admin/table.md T11). Clicks the first row checkbox of the first data table with
// selectable rows, compares the actions on screen before and after, then clears the selection again.
// Returns { status: 'none' | 'ok' | 'no-bulk' | 'unclickable', table, count, actions }.
export async function tableSelectionProbe() {
  const TABLES = 'table, [role="table"], [role="grid"], [role="treegrid"]';
  const shown = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && parseFloat(cs.opacity) > 0.05;
  };
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
  for (const t of document.querySelectorAll(TABLES)) {
    if (!shown(t) || (t.parentElement && t.parentElement.closest(TABLES))) continue;
    const rows = (t.tagName === 'TABLE' ? [...t.rows] : [...t.querySelectorAll('[role="row"]')]).filter(shown);
    const body = rows.filter((r) => !(r.parentElement && r.parentElement.tagName === 'THEAD') && !r.querySelector('th[scope="col"], [role="columnheader"]'));
    if (body.length < 3) continue;
    const boxes = body.map((r) => r.querySelector('input[type="checkbox"], [role="checkbox"]')).filter(Boolean);
    if (boxes.length < 2) continue;
    const box = boxes[0];
    const checked = (b) => (b.matches('input') ? b.checked : b.getAttribute('aria-checked') === 'true' || b.getAttribute('data-state') === 'checked');
    const target = shown(box) ? box : box.closest('label') || (box.id && document.querySelector(`label[for="${CSS.escape(box.id)}"]`)) || box;
    // Actions outside the data rows: their label and whether they can be used now.
    const actions = () => {
      const out = new Map();
      for (const el of document.querySelectorAll('button, [role="button"], a[href], [role="menuitem"]')) {
        if (!shown(el) || body.some((r) => r.contains(el))) continue;
        const key = `${(el.getAttribute('aria-label') || el.textContent || '').replace(/\s+/g, ' ').trim()}`;
        if (key) out.set(key, !(el.disabled || el.getAttribute('aria-disabled') === 'true'));
      }
      return out;
    };
    const COUNT = /(\d+)\s*(?:of\s*\d+\s*)?(?:row\(?s?\)?|items?|baris|data)?\s*(selected|dipilih|terpilih)/i;
    const text = () => (document.body.innerText || '').match(COUNT)?.[0] || '';
    const before = actions();
    const countBefore = text();
    if (checked(box)) return { status: 'unclickable', why: 'the first row is already selected' };
    target.click();
    await sleep(400);
    if (!checked(box)) return { status: 'unclickable', why: 'clicking the first row checkbox did not select it' };
    const after = actions();
    const countAfter = text();
    target.click();
    await sleep(200);
    const appeared = [...after].filter(([k, on]) => on && !before.get(k)).map(([k]) => k);
    const count = countAfter && countAfter !== countBefore ? countAfter : '';
    const name = (t.getAttribute('aria-label') || t.querySelector('caption')?.textContent || 'table').trim().slice(0, 40);
    return { status: appeared.length ? 'ok' : 'no-bulk', table: name, count, actions: appeared.slice(0, 5) };
  }
  return { status: 'none' };
}
