#!/usr/bin/env node
// Designed placeholders: a picture that is still to come, drawn as a storyboard frame in the page's
// own colours, so a page without photographs looks planned instead of unfinished
// (rules/illustration.md → Designed placeholders). Each frame shows the composition of the shot
// (who or what, where it sits, where the light is) and carries the shot as its label.
//
//   node placeholder.mjs --shot portrait|team|product|food|place|hands|detail|screen
//        --label "<the shot, as in the shot list>" [--ratio 4:5] [--shape rect|round|arch]
//        [--kit .design/brand-kit.json | --ground #F5EFE3 --ink #1F2A24 --accent #2F6B4F]
//        [--seed 1] [--out assets/placeholders/<name>.svg]
//   node placeholder.mjs sheet [--kit … | colours] [--out .design/placeholders/sheet.html]
//
// On the page the element carries data-placeholder-image (inspect.mjs reports INFO
// placeholder-image, and the deliver report lists every one with the shot list).
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from './lib/browser.mjs';

export const SHOTS = ['portrait', 'team', 'product', 'food', 'place', 'hands', 'detail', 'screen'];

const hex = (h) => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(String(h || '').trim());
  if (!m) return null;
  const s = m[1].length === 3 ? [...m[1]].map((c) => c + c).join('') : m[1];
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
};
const toHex = (rgb) => `#${rgb.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;
// Mix b into a by share p (0..1).
const mix = (a, b, p) => toHex(hex(a).map((v, i) => v + (hex(b)[i] - v) * p));
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export function paletteFrom({ kit, ground, ink, accent } = {}) {
  let g = ground;
  let i = ink;
  let a = accent;
  if (kit && Array.isArray(kit.colors)) {
    const role = (r) => (kit.colors.find((c) => c.role === r) || {}).hex;
    g = g || role('ground');
    i = i || role('ink');
    a = a || role('signature') || role('support') || role('action');
  }
  g = hex(g) ? g : '#F3F1EC';
  i = hex(i) ? i : '#1E2A2B';
  a = hex(a) ? a : '#3F7F78';
  return {
    ground: g, ink: i, accent: a,
    field: mix(g, a, 0.2), // what the frame stands on
    back: mix(g, a, 0.42), // the large shape behind the subject
    mid: mix(a, i, 0.18), // the subject
    deep: mix(a, i, 0.55), // its dark side
    pale: mix(g, a, 0.07), // paper, plates, light
    shade: mix(mix(g, a, 0.2), i, 0.16), // cast shadows
  };
}

// Each scene draws into a W × H box; numbers are shares of W (x, widths) and H (y, heights).
function scene(shot, W, H, c) {
  const u = Math.min(W, H);
  const X = (v) => (v * W).toFixed(1);
  const Y = (v) => (v * H).toFixed(1);
  const U = (v) => (v * u).toFixed(1);
  const figure = (cx, base, k, body, head) =>
    `<ellipse cx="${X(cx)}" cy="${Y(base)}" rx="${U(0.3 * k)}" ry="${U(0.36 * k)}" fill="${body}"/>` +
    `<rect x="${(cx * W - 0.045 * k * u).toFixed(1)}" y="${(base * H - 0.47 * k * u).toFixed(1)}" width="${U(0.09 * k)}" height="${U(0.16 * k)}" fill="${head}"/>` +
    `<circle cx="${X(cx)}" cy="${(base * H - 0.52 * k * u).toFixed(1)}" r="${U(0.125 * k)}" fill="${head}"/>`;
  switch (shot) {
    case 'portrait':
      return (
        `<path d="M${X(0.3)} ${H} V${Y(0.5)} A${X(0.28)} ${X(0.28)} 0 0 1 ${X(0.86)} ${Y(0.5)} V${H} Z" fill="${c.back}"/>` +
        `<circle cx="${X(0.16)}" cy="${Y(0.2)}" r="${U(0.045)}" fill="${c.accent}"/>` +
        figure(0.58, 1.04, 1, c.mid, mix(c.back, c.deep, 0.35))
      );
    case 'team':
      return (
        `<rect x="0" y="${Y(0.62)}" width="${W}" height="${Y(0.38)}" fill="${c.back}"/>` +
        figure(0.24, 1.06, 0.74, c.deep, mix(c.back, c.deep, 0.5)) +
        figure(0.78, 1.06, 0.7, mix(c.mid, c.ground, 0.3), mix(c.back, c.deep, 0.2)) +
        figure(0.51, 1.08, 0.9, c.mid, mix(c.back, c.deep, 0.35)) +
        `<circle cx="${X(0.9)}" cy="${Y(0.16)}" r="${U(0.04)}" fill="${c.accent}"/>`
      );
    case 'product':
      return (
        `<circle cx="${X(0.6)}" cy="${Y(0.4)}" r="${U(0.36)}" fill="${c.back}"/>` +
        `<rect x="0" y="${Y(0.7)}" width="${W}" height="${Y(0.3)}" fill="${c.shade}"/>` +
        `<ellipse cx="${X(0.6)}" cy="${Y(0.745)}" rx="${U(0.26)}" ry="${U(0.035)}" fill="${mix(c.shade, c.ink, 0.18)}"/>` +
        `<rect x="${(0.52 * W - 0.085 * u).toFixed(1)}" y="${(0.74 * H - 0.46 * u).toFixed(1)}" width="${U(0.17)}" height="${U(0.46)}" rx="${U(0.03)}" fill="${c.mid}"/>` +
        `<rect x="${(0.52 * W - 0.085 * u).toFixed(1)}" y="${(0.74 * H - 0.3 * u).toFixed(1)}" width="${U(0.17)}" height="${U(0.13)}" fill="${c.pale}"/>` +
        `<rect x="${(0.52 * W - 0.04 * u).toFixed(1)}" y="${(0.74 * H - 0.52 * u).toFixed(1)}" width="${U(0.08)}" height="${U(0.07)}" rx="${U(0.012)}" fill="${c.deep}"/>` +
        `<rect x="${(0.52 * W + 0.13 * u).toFixed(1)}" y="${(0.74 * H - 0.17 * u).toFixed(1)}" width="${U(0.2)}" height="${U(0.17)}" rx="${U(0.02)}" fill="${c.accent}"/>`
      );
    case 'food':
      return (
        `<rect x="${X(0.62)}" y="${Y(-0.1)}" width="${U(0.34)}" height="${U(0.5)}" fill="${c.back}" transform="rotate(12 ${X(0.7)} ${Y(0.2)})"/>` +
        `<circle cx="${X(0.44)}" cy="${Y(0.52)}" r="${U(0.4)}" fill="${c.shade}"/>` +
        `<circle cx="${X(0.43)}" cy="${Y(0.5)}" r="${U(0.39)}" fill="${c.pale}"/>` +
        `<circle cx="${X(0.43)}" cy="${Y(0.5)}" r="${U(0.29)}" fill="${mix(c.pale, c.back, 0.5)}"/>` +
        `<circle cx="${(0.43 * W - 0.09 * u).toFixed(1)}" cy="${(0.5 * H - 0.05 * u).toFixed(1)}" r="${U(0.13)}" fill="${c.mid}"/>` +
        `<circle cx="${(0.43 * W + 0.11 * u).toFixed(1)}" cy="${(0.5 * H + 0.03 * u).toFixed(1)}" r="${U(0.1)}" fill="${c.accent}"/>` +
        `<circle cx="${(0.43 * W - 0.01 * u).toFixed(1)}" cy="${(0.5 * H + 0.15 * u).toFixed(1)}" r="${U(0.075)}" fill="${c.deep}"/>` +
        `<circle cx="${X(0.93)}" cy="${Y(0.86)}" r="${U(0.2)}" fill="${c.pale}"/><circle cx="${X(0.93)}" cy="${Y(0.86)}" r="${U(0.14)}" fill="${c.mid}"/>` +
        `<rect x="${X(0.06)}" y="${Y(0.12)}" width="${U(0.028)}" height="${U(0.5)}" rx="${U(0.014)}" fill="${c.deep}" transform="rotate(-8 ${X(0.06)} ${Y(0.4)})"/>`
      );
    case 'place':
      return (
        `<circle cx="${X(0.76)}" cy="${Y(0.26)}" r="${U(0.11)}" fill="${c.pale}"/>` +
        `<ellipse cx="${X(0.2)}" cy="${Y(0.8)}" rx="${X(0.5)}" ry="${Y(0.3)}" fill="${c.back}"/>` +
        `<rect x="${X(0.4)}" y="${Y(0.3)}" width="${X(0.38)}" height="${Y(0.5)}" fill="${c.mid}"/>` +
        `<rect x="${X(0.36)}" y="${Y(0.26)}" width="${X(0.46)}" height="${Y(0.06)}" fill="${c.deep}"/>` +
        `<path d="M${X(0.53)} ${Y(0.8)} V${Y(0.56)} A${X(0.06)} ${X(0.06)} 0 0 1 ${X(0.65)} ${Y(0.56)} V${Y(0.8)} Z" fill="${c.pale}"/>` +
        `<rect x="${X(0.44)}" y="${Y(0.4)}" width="${X(0.07)}" height="${Y(0.1)}" fill="${c.accent}"/>` +
        `<rect x="${X(0.67)}" y="${Y(0.4)}" width="${X(0.07)}" height="${Y(0.1)}" fill="${mix(c.mid, c.pale, 0.45)}"/>` +
        `<rect x="0" y="${Y(0.8)}" width="${W}" height="${Y(0.2)}" fill="${c.shade}"/>`
      );
    case 'hands':
      return (
        `<circle cx="${X(0.5)}" cy="${Y(0.52)}" r="${U(0.34)}" fill="${c.back}"/>` +
        `<rect x="${X(-0.12)}" y="${Y(0.6)}" width="${X(0.58)}" height="${U(0.17)}" rx="${U(0.085)}" fill="${c.mid}" transform="rotate(-16 ${X(0.2)} ${Y(0.66)})"/>` +
        `<rect x="${X(0.56)}" y="${Y(0.2)}" width="${X(0.6)}" height="${U(0.17)}" rx="${U(0.085)}" fill="${mix(c.back, c.deep, 0.42)}" transform="rotate(-16 ${X(0.8)} ${Y(0.3)})"/>` +
        `<rect x="${(0.5 * W - 0.11 * u).toFixed(1)}" y="${(0.5 * H - 0.14 * u).toFixed(1)}" width="${U(0.22)}" height="${U(0.28)}" rx="${U(0.02)}" fill="${c.pale}" transform="rotate(-16 ${X(0.5)} ${Y(0.5)})"/>` +
        `<rect x="${(0.5 * W - 0.07 * u).toFixed(1)}" y="${(0.5 * H - 0.08 * u).toFixed(1)}" width="${U(0.14)}" height="${U(0.024)}" fill="${c.accent}" transform="rotate(-16 ${X(0.5)} ${Y(0.5)})"/>` +
        `<rect x="${(0.5 * W - 0.07 * u).toFixed(1)}" y="${(0.5 * H - 0.02 * u).toFixed(1)}" width="${U(0.1)}" height="${U(0.018)}" fill="${c.shade}" transform="rotate(-16 ${X(0.5)} ${Y(0.5)})"/>`
      );
    case 'detail':
      return (
        `<circle cx="${X(0.78)}" cy="${Y(0.62)}" r="${U(0.62)}" fill="${c.back}"/>` +
        `<circle cx="${X(0.78)}" cy="${Y(0.62)}" r="${U(0.44)}" fill="${c.mid}"/>` +
        `<circle cx="${X(0.78)}" cy="${Y(0.62)}" r="${U(0.27)}" fill="${c.deep}"/>` +
        `<circle cx="${X(0.78)}" cy="${Y(0.62)}" r="${U(0.1)}" fill="${c.accent}"/>` +
        `<rect x="${X(0.08)}" y="${Y(0.14)}" width="${X(0.2)}" height="${U(0.03)}" fill="${c.deep}"/>` +
        `<rect x="${X(0.08)}" y="${(0.14 * H + 0.06 * u).toFixed(1)}" width="${X(0.13)}" height="${U(0.03)}" fill="${c.shade}"/>`
      );
    case 'screen': {
      const x = 0.14 * W;
      const y = 0.16 * H;
      const w = 0.72 * W;
      const h = 0.72 * H;
      const row = (i, share, fill) => `<rect x="${(x + 0.3 * w).toFixed(1)}" y="${(y + (0.3 + i * 0.13) * h).toFixed(1)}" width="${(share * w).toFixed(1)}" height="${(0.06 * h).toFixed(1)}" rx="${U(0.008)}" fill="${fill}"/>`;
      return (
        `<rect x="${(x + 0.03 * u).toFixed(1)}" y="${(y + 0.04 * u).toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${U(0.03)}" fill="${c.shade}"/>` +
        `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" rx="${U(0.03)}" fill="${c.pale}"/>` +
        `<path d="M${x.toFixed(1)} ${(y + 0.03 * u).toFixed(1)} a${U(0.03)} ${U(0.03)} 0 0 1 ${U(0.03)} -${U(0.03)} H${(x + 0.24 * w).toFixed(1)} V${(y + h).toFixed(1)} H${(x + 0.03 * u).toFixed(1)} a${U(0.03)} ${U(0.03)} 0 0 1 -${U(0.03)} -${U(0.03)} Z" fill="${c.back}"/>` +
        [0, 1, 2, 3].map((i) => `<rect x="${(x + 0.04 * w).toFixed(1)}" y="${(y + (0.14 + i * 0.1) * h).toFixed(1)}" width="${(0.14 * w).toFixed(1)}" height="${(0.035 * h).toFixed(1)}" rx="${U(0.006)}" fill="${i === 1 ? c.deep : mix(c.back, c.deep, 0.3)}"/>`).join('') +
        `<rect x="${(x + 0.3 * w).toFixed(1)}" y="${(y + 0.1 * h).toFixed(1)}" width="${(0.3 * w).toFixed(1)}" height="${(0.09 * h).toFixed(1)}" rx="${U(0.008)}" fill="${c.deep}"/>` +
        `<rect x="${(x + 0.82 * w).toFixed(1)}" y="${(y + 0.1 * h).toFixed(1)}" width="${(0.12 * w).toFixed(1)}" height="${(0.09 * h).toFixed(1)}" rx="${(0.045 * h).toFixed(1)}" fill="${c.accent}"/>` +
        row(0, 0.64, c.field) + row(1, 0.64, mix(c.field, c.back, 0.5)) + row(2, 0.64, c.field) + row(3, 0.4, mix(c.field, c.back, 0.5))
      );
    }
    default:
      throw new Error(`Unknown shot "${shot}". Use one of: ${SHOTS.join(', ')}`);
  }
}

export function placeholderSvg({ shot, label = '', ratio = '4:3', shape = 'rect', seed = 1, colors = {} }) {
  if (!SHOTS.includes(shot)) throw new Error(`Unknown shot "${shot}". Use one of: ${SHOTS.join(', ')}`);
  const [rw, rh] = String(ratio).split(/[:/x]/).map(Number);
  if (!(rw > 0 && rh > 0)) throw new Error(`--ratio wants two numbers like 4:5, got "${ratio}"`);
  const W = 1200;
  const H = Math.round((W * rh) / rw);
  const c = paletteFrom(colors);
  const u = Math.min(W, H);
  const text = String(label).trim().replace(/\s+/g, ' ');
  const shown = text.length > 44 ? `${text.slice(0, 43)}…` : text;
  const id = `ph${Math.abs(Number(seed) || 1)}${shot}`;
  const clip =
    shape === 'arch' ? `<path d="M0 ${H} V${W / 2} A${W / 2} ${W / 2} 0 0 1 ${W} ${W / 2} V${H} Z"/>`
      : shape === 'round' ? `<rect width="${W}" height="${H}" rx="${Math.round(u * 0.06)}"/>`
        : `<rect width="${W}" height="${H}"/>`;
  // An even seed mirrors the scene, so two frames of the same shot do not look like twins.
  const mirror = Number(seed) % 2 === 0 ? ` transform="translate(${W} 0) scale(-1 1)"` : '';
  const t = Math.round(u * 0.05);
  const m = Math.round(u * 0.045);
  const tick = (x, y, dx, dy) => `<path d="M${x + dx * t} ${y} H${x} V${y + dy * t}" fill="none" stroke="${c.ink}" stroke-opacity=".38" stroke-width="${Math.max(2, Math.round(u * 0.004))}"/>`;
  const fs = Math.round(W * 0.028);
  const padX = Math.round(fs * 0.9);
  const tagW = Math.round((`FOTO${shown ? ` · ${shown}` : ''}`.length * fs * 0.645) + padX * 2);
  const tagH = Math.round(fs * 2.1);
  const bottom = H - m - tagH;
  const caption =
    `<rect x="${m}" y="${bottom}" width="${Math.min(tagW, W - m * 2)}" height="${tagH}" rx="${Math.round(tagH / 2)}" fill="${c.ground}" fill-opacity=".94"/>` +
    `<text x="${m + padX}" y="${bottom + Math.round(tagH * 0.66)}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="${fs}" letter-spacing=".04em" fill="${c.ink}"><tspan font-weight="700">FOTO</tspan>${shown ? ` · ${esc(shown)}` : ''}</text>`;
  const aria = `Placeholder foto${text ? `: ${text}` : ''}`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(aria)}" data-placeholder-image="${esc(shot)}">` +
    `<defs><clipPath id="${id}">${clip}</clipPath></defs>` +
    `<g clip-path="url(#${id})"><rect width="${W}" height="${H}" fill="${c.field}"/><g${mirror}>${scene(shot, W, H, c)}</g>` +
    (shape === 'arch' ? '' : tick(m, m, 1, 1) + tick(W - m, m, -1, 1) + tick(W - m, H - m, -1, -1)) +
    `${caption}</g></svg>\n`
  );
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === path.resolve(new URL(import.meta.url).pathname);
if (isMain) {
  const args = parseArgs(process.argv.slice(2));
  const kit = args.kit && fs.existsSync(args.kit) ? JSON.parse(fs.readFileSync(args.kit, 'utf8')) : null;
  const colors = { kit, ground: args.ground, ink: args.ink, accent: args.accent };
  try {
    if (args._[0] === 'sheet') {
      const out = path.resolve(args.out || '.design/placeholders/sheet.html');
      fs.mkdirSync(path.dirname(out), { recursive: true });
      const c = paletteFrom(colors);
      const ratios = { portrait: '4:5', team: '3:2', product: '1:1', food: '1:1', place: '3:2', hands: '4:3', detail: '4:5', screen: '16:10' };
      const cells = SHOTS.map((s, i) => `<figure><div>${placeholderSvg({ shot: s, label: `contoh ${s}`, ratio: ratios[s], shape: i % 3 === 0 ? 'arch' : 'round', seed: i + 1, colors })}</div><figcaption>${s} · ${ratios[s]}</figcaption></figure>`).join('');
      fs.writeFileSync(out, `<!doctype html><meta charset="utf-8"><title>Placeholder sheet</title><style>body{margin:0;padding:32px;background:${c.ground};color:${c.ink};font:14px/1.4 system-ui,sans-serif}main{display:grid;grid-template-columns:repeat(4,1fr);gap:28px;align-items:end}figure{margin:0}svg{display:block;width:100%;height:auto}figcaption{padding-top:8px;opacity:.7}</style><main>${cells}</main>`);
      console.log(`sheet: ${path.relative(process.cwd(), out)} (${SHOTS.length} shots in the page's colours)`);
    } else {
      if (!args.shot) {
        console.error(`Usage: node placeholder.mjs --shot ${SHOTS.join('|')} --label "<the shot>" [--ratio 4:5] [--shape rect|round|arch] [--kit .design/brand-kit.json | --ground # --ink # --accent #] [--seed 1] [--out file.svg]\n       node placeholder.mjs sheet [--out .design/placeholders/sheet.html]`);
        process.exit(2);
      }
      const svg = placeholderSvg({ shot: args.shot, label: args.label || '', ratio: args.ratio || '4:3', shape: args.shape || 'rect', seed: args.seed || 1, colors });
      if (args.out) {
        fs.mkdirSync(path.dirname(path.resolve(args.out)), { recursive: true });
        fs.writeFileSync(args.out, svg);
        console.log(`saved ${args.out} (${(svg.length / 1024).toFixed(1)} KB): use it with data-placeholder-image and put "${args.label || args.shot}" in the shot list`);
      } else process.stdout.write(svg);
    }
  } catch (e) {
    console.error(e.message);
    process.exit(2);
  }
}
