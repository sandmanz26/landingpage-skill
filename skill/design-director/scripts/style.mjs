#!/usr/bin/env node
// Reads the style of a captured reference into style.json: palette, type, shape, spacing, motion
// and plain-word tags. Saved with every reference so that, when the reference is used later,
// the skill can map its style onto the client's brand or ask the user where the two conflict.
// Numbers and names only: never assets (rules/copyright.md).
//
//   node style.mjs <capture folder with report.json [and evidence.json]>
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const dir = args._[0];
if (!dir || !fs.existsSync(path.join(dir, 'report.json'))) {
  console.error('Usage: node style.mjs <capture folder with report.json>');
  process.exit(2);
}
const report = JSON.parse(fs.readFileSync(path.join(dir, 'report.json'), 'utf8'));
const evPath = path.join(dir, 'evidence.json');
const ev = fs.existsSync(evPath) ? JSON.parse(fs.readFileSync(evPath, 'utf8')) : null;
const desk = (report.viewports.desktop || {}).inventory;
const mob = (report.viewports.mobile || {}).inventory;
if (!desk) {
  console.error(`No desktop inventory in ${dir}/report.json`);
  process.exit(1);
}

const lum = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const sizes = [...desk.fontSizes].sort((a, b) => b - a);
const body = sizes.includes(16) ? 16 : sizes.includes(18) ? 18 : sizes[Math.floor(sizes.length * 0.6)] || 16;
const display = sizes[0] || body;
const radiiPx = desk.radii.map((r) => parseFloat(r)).filter((n) => !Number.isNaN(n));
const firstBg = desk.backgroundColours.find((c) => /^#[0-9a-f]{6}$/i.test(c));
const motion = ev ? ev.motion : null;
const reduced = ev ? ev.reducedMotion : null;

const tags = [];
const tag = (cond, t) => cond && tags.push(t);
tag(desk.gradients === 0 && desk.shadows === 0, 'flat');
tag(desk.gradients >= 5, 'gradient-heavy');
tag(desk.backdropBlur >= 2, 'glass');
tag(desk.shadows >= 5, 'shadowed');
tag(desk.chromaticColours >= 6, 'many-colours');
tag(desk.chromaticColours <= 2, 'restrained-colour');
tag(firstBg && lum(firstBg) < 0.05, 'dark');
tag(radiiPx.some((r) => r >= 999), 'pill-shapes');
tag(radiiPx.length && Math.max(...radiiPx.filter((r) => r < 999), 0) <= 4, 'sharp-corners');
tag(display / body >= 5, 'expressive-type');
tag(display / body < 3, 'quiet-type');
tag(sizes.length > 8, 'many-type-sizes');
tag(desk.families.length === 1, 'one-typeface');
tag(desk.families.some((f) => /rounded/i.test(f.family)), 'rounded-type');
tag(desk.families.some((f) => /serif|caslon|garamond|times|georgia|playfair|tiempos|canela/i.test(f.family) && !/sans/i.test(f.family)), 'serif');
if (motion) {
  tag(motion.libraries.gsap || motion.libraries.scrollTrigger || motion.libraries.locomotive, 'scroll-choreography');
  tag(motion.libraries.lenis || motion.libraries.locomotive, 'smoothed-scroll');
  tag((motion.stickyPanels || []).length >= 2, 'css-scroll-device');
  tag(motion.infiniteLoopsWithText > 0 || (motion.movingWithoutInputFurtherDown || []).length > 0, 'endless-motion');
  tag(!motion.libraries.gsap && !motion.libraries.scrollTrigger && motion.scriptDrivenOnScroll <= 3 && !(motion.stickyPanels || []).length, 'calm-motion');
}
const imagery = ev && ev.outline.imagery ? ev.outline.imagery : null;
if (imagery) {
  tag(imagery.photos + imagery.videos >= 2, 'photography');
  tag(imagery.illustrations >= 2, 'illustration');
  tag(imagery.photos + imagery.videos + imagery.illustrations === 0, 'type-only');
}
tag(reduced && reduced.movingWithoutInput + reduced.movingOnScroll > 3, 'ignores-reduced-motion');
tag(ev && ev.overlaysDismissed && ev.overlaysDismissed.length > 0, 'pop-up-on-load');
tag(desk.cls > 0.25, 'layout-shift');

// Things that must never travel with the style, whatever role the reference plays.
const doNotCopy = report.findings
  .filter((f) => f.severity === 'FAIL')
  .map((f) => `${f.rule}: ${f.message}`)
  .concat(tags.includes('ignores-reduced-motion') ? ['motion without a reduced-motion path'] : [])
  .concat(tags.includes('pop-up-on-load') ? ['pop-up over the first screen on load'] : []);

const style = {
  url: report.url,
  readAt: new Date().toISOString(),
  tags,
  palette: {
    chromatic: desk.chromaticColours,
    families: desk.colourFamilies ?? null,
    text: desk.textColours.slice(0, 6),
    backgrounds: desk.backgroundColours.slice(0, 8),
    gradients: desk.gradients,
    shadows: desk.shadows,
    blur: desk.backdropBlur,
  },
  type: {
    families: desk.families,
    sizes: { desktop: sizes, mobile: mob ? mob.fontSizes : null },
    display,
    body,
    ratio: Math.round((display / body) * 10) / 10,
  },
  shape: { radii: desk.radii },
  spacing: { distinct: desk.spacing.distinct, offScale: desk.spacing.offScale },
  motion: motion
    ? {
        libraries: Object.entries(motion.libraries).filter(([, v]) => v).map(([k]) => k),
        stickyPanels: (motion.stickyPanels || []).length,
        durationsMs: motion.durationsMs,
        easings: motion.easings,
        reducedMotionRespected: reduced ? reduced.movingWithoutInput + reduced.movingOnScroll <= 3 : null,
        smoothness: ev.smoothness ? { fps: ev.smoothness.page.fps, longFrames: ev.smoothness.page.longFrames, baselineLongFrames: ev.smoothness.baseline.longFrames, renderer: ev.smoothness.page.renderer } : null,
      }
    : null,
  imagery,
  layout: { pageHeight: desk.cls !== undefined ? (report.viewports.desktop.pageHeight || null) : null, screens: report.viewports.desktop.pageHeight ? Math.round(report.viewports.desktop.pageHeight / 900) : null },
  doNotCopy,
};
fs.writeFileSync(path.join(dir, 'style.json'), JSON.stringify(style, null, 2));
console.log(`style: ${path.join(dir, 'style.json')}`);
console.log(`  ${tags.join(', ') || 'no tags'}`);
console.log(`  type ${desk.families.map((f) => f.family).join(' + ')}, ${display}/${body}px (×${style.type.ratio}); ${desk.chromaticColours} colours; radii ${desk.radii.slice(0, 3).join(' ')}`);
