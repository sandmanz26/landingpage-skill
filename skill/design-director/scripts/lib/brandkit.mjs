// The shape of .design/brand-kit.json (brand/method.md §10), shared by brandboard.mjs, adminoptions.mjs and progress.mjs
// so the rule lives in one place.
export const REQUIRED = ['name', 'colors', 'fonts', 'radii', 'motion', 'hero', 'supporting', 'wordmark'];

// Returns a list of problems; empty when the kit is valid.
export function validateKit(kit, label = 'kit') {
  const errs = [];
  if (!kit || typeof kit !== 'object') return [`${label}: not an object`];
  for (const k of REQUIRED) if (kit[k] === undefined) errs.push(`${label}: missing "${k}"`);
  if (Array.isArray(kit.colors)) {
    if (kit.colors.some((c) => !/^#[0-9a-f]{6}$/i.test(c.hex || '') || !c.role)) errs.push(`${label}: every colour needs a 6-digit hex and a role`);
    for (const r of ['ink', 'action']) if (!kit.colors.some((c) => c.role === r)) errs.push(`${label}: no colour with the role "${r}"`);
  } else if (kit.colors) errs.push(`${label}: "colors" must be a list`);
  if (kit.fonts && (!kit.fonts.display || !kit.fonts.body)) errs.push(`${label}: fonts need display and body`);
  if (kit.motion && (!kit.motion.easing || !kit.motion.durations)) errs.push(`${label}: motion needs easing and durations`);
  if (kit.hero && !kit.hero.name) errs.push(`${label}: the hero element needs a name`);
  if (kit.supporting && (!Array.isArray(kit.supporting) || kit.supporting.length < 2 || kit.supporting.length > 3)) errs.push(`${label}: 2-3 supporting elements`);
  return errs;
}

// Colour maths (WCAG relative luminance and contrast ratio) for 6-digit hex colours.
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
export const lum = (h) => rgb(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)).reduce((a, c, i) => a + c * [0.2126, 0.7152, 0.0722][i], 0);
export const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

// Faces found on most machines; any other kit font is loaded from Google Fonts.
export const SYSTEM_FONT = /^(arial|helvetica|georgia|times new roman|verdana|tahoma|trebuchet ms|courier new|palatino|garamond|dejavu (sans|serif)|liberation (sans|serif)|noto (sans|serif)|system-ui|serif|sans-serif|monospace)$/i;
