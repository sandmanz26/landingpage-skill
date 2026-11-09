#!/usr/bin/env node
// Style options for an admin panel or app screen (admin/method.md): 2-3 directions from
// admin/directions.json rendered side by side as real components (sidebar, modal, and a table when
// the screen lists records), labelled A/B/C with their character and the references they come from,
// plus the reply the user copies ("Pilih B"). Same shadcn/ui structure, different tokens.
//
//   node adminoptions.mjs [--kit .design/brand-kit.json] [--brief "<one line>"]
//        [--only soft-floating,dark-layered] [--components sidebar,modal,table]
//        [--recommend <id or letter> --why "<one line>"] [--content content.json]
//        [--directions admin/directions.json] [--out .design/options/admin-options.html]
//
// A brand kit (read from --kit, else .design/brand-kit.json when it exists) overrides the colours,
// radii and fonts of every direction. Also writes admin-options.json beside the page: each option's
// effective tokens and its shadcn/ui CSS variables, for the build.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from './lib/browser.mjs';
import { validateKit, ratio, SYSTEM_FONT } from './lib/brandkit.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = parseArgs(process.argv.slice(2));
const die = (msg) => {
  console.error(msg);
  process.exit(2);
};

const LEVERS = { surface: 'Permukaan', active: 'Item aktif', primary: 'Warna utama', icons: 'Ikon', type: 'Huruf', shape: 'Sudut & bentuk', density: 'Kerapatan', depth: 'Kedalaman', details: 'Detail kecil', motion: 'Gerak' };
const TOKEN_KEYS = ['scheme', 'canvas', 'surface', 'inset', 'border', 'text', 'muted', 'accent', 'primary', 'active', 'icons', 'type', 'radius', 'density', 'shadow', 'motion'];
const HEX = /^#[0-9a-f]{6}$/i;

// --- directions: every one names 3-4 of the ten levers, its references and complete tokens.
function validateDirection(d) {
  const e = [];
  const id = d.id || '(no id)';
  if (!d.id || !d.name || !d.character) e.push(`${id}: needs id, name and character`);
  if (!Array.isArray(d.levers) || d.levers.length < 3 || d.levers.length > 4) e.push(`${id}: change 3-4 levers, not ${d.levers?.length ?? 0} (admin/method.md §1)`);
  else for (const l of d.levers) if (!LEVERS[l]) e.push(`${id}: unknown lever "${l}" (one of ${Object.keys(LEVERS).join(', ')})`);
  if (!Array.isArray(d.refs) || !d.refs.length || d.refs.some((r) => !r.id)) e.push(`${id}: name the reference ids it comes from`);
  const t = d.tokens || {};
  for (const k of TOKEN_KEYS) if (t[k] === undefined) e.push(`${id}: tokens.${k} missing`);
  for (const k of ['canvas', 'surface', 'inset', 'border', 'text', 'muted', 'accent', 'primary']) if (t[k] !== undefined && !HEX.test(t[k])) e.push(`${id}: tokens.${k} must be a 6-digit hex`);
  return e;
}

const dirFile = args.directions || path.join(here, '..', 'admin', 'directions.json');
if (!fs.existsSync(dirFile)) die(`Not found: ${dirFile}`);
const all = JSON.parse(fs.readFileSync(dirFile, 'utf8')).directions || [];
const errs = all.flatMap(validateDirection);
if (errs.length) die(`Invalid directions (${dirFile}):\n  ${errs.join('\n  ')}`);
const only = String(args.only || '').split(',').map((x) => x.trim()).filter(Boolean);
const unknown = only.filter((id) => !all.some((d) => d.id === id));
if (unknown.length) die(`Unknown direction(s): ${unknown.join(', ')}. Known: ${all.map((d) => d.id).join(', ')}`);
const chosen = only.length ? only.map((id) => all.find((d) => d.id === id)) : all.slice(0, 3);
if (chosen.length < 2 || chosen.length > 3) die('Show 2-3 directions (admin/method.md §4).');

const components = String(args.components || 'sidebar,modal').split(',').map((x) => x.trim()).filter(Boolean);
for (const c of components) if (!['sidebar', 'modal', 'table'].includes(c)) die(`Unknown component "${c}": sidebar, modal, table`);
for (const c of ['sidebar', 'modal']) if (!components.includes(c)) components.unshift(c);

// --- brand kit: its colours and shape win (admin/method.md §3)
const kitPath = args.kit || (fs.existsSync('.design/brand-kit.json') ? '.design/brand-kit.json' : null);
let kit = null;
if (kitPath) {
  if (!fs.existsSync(kitPath)) die(`Not found: ${kitPath}`);
  kit = JSON.parse(fs.readFileSync(kitPath, 'utf8'));
  const kerr = validateKit(kit, 'brand-kit.json');
  if (kerr.length) die(`Invalid brand kit:\n  ${kerr.join('\n  ')}`);
}

// --- colour helpers
const toRgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const toHex = (c) => `#${c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('')}`;
const mix = (a, b, w) => toHex(toRgb(a).map((v, i) => v + (toRgb(b)[i] - v) * w));
const onColour = (bg) => (ratio('#ffffff', bg) >= ratio('#111318', bg) ? '#ffffff' : '#111318');
// Moves fg toward the strongest of black/white until it reaches the ratio on bg.
const ensure = (fg, bg, min = 4.5) => {
  if (ratio(fg, bg) >= min) return fg;
  const pole = onColour(bg);
  for (let w = 0.1; w <= 1.0001; w += 0.1) {
    const c = mix(fg, pole, w);
    if (ratio(c, bg) >= min) return c;
  }
  return pole;
};

function effective(d) {
  const t = JSON.parse(JSON.stringify(d.tokens));
  const fromKit = [];
  if (kit) {
    const by = (role) => (kit.colors.find((c) => c.role === role) || {}).hex;
    const action = by('action') || by('signature');
    t.accent = action;
    t.primary = action;
    fromKit.push('warna aksen dan tombol utama');
    if (t.scheme === 'light') {
      if (by('ink')) t.text = by('ink');
      if (by('ground')) t.canvas = mix(by('ground'), '#000000', 0.06);
      fromKit.push('warna teks dan latar');
    }
    if (kit.radii?.large !== undefined) t.radius.surface = kit.radii.large;
    if (kit.radii?.small !== undefined) t.radius.control = t.radius.item = t.radius.button = kit.radii.small;
    fromKit.push('sudut');
    t.fonts = { display: kit.fonts.display, body: kit.fonts.body };
    fromKit.push('huruf');
  }
  // Every text pair passes AA on the surface it sits on.
  t.muted = ensure(ensure(t.muted, t.surface), t.inset);
  t.onPrimary = onColour(t.primary);
  t.onAccent = onColour(t.accent);
  t.link = ensure(t.accent, t.surface);
  t.active.text = ensure(t.active.text, t.active.bg);
  t.activeIcon = t.icons.activeAccent ? ensure(t.accent, t.active.bg, 3) : t.active.text;
  t.text = ensure(t.text, t.surface, 7);
  return { t, fromKit };
}

const options = chosen.map((d, i) => ({ d, letter: 'ABC'[i], ...effective(d) }));
const rec = args.recommend ? options.find((o) => o.d.id === args.recommend || o.letter === String(args.recommend).toUpperCase()) : null;
if (args.recommend && !rec) die(`--recommend ${args.recommend} is not one of the options shown`);

// --- sample content (marked data-sample on the page; the build uses the real data)
const content = {
  app: 'Toko Rasa', plan: 'Paket Tim', user: { name: 'Rina Putri', email: 'rina@tokorasa.id' },
  nav: [{ label: 'Ringkasan', icon: 'home', key: '1' }, { label: 'Pesanan', icon: 'inbox', key: '2', badge: '12' }, { label: 'Produk', icon: 'box', key: '3' }, { label: 'Pelanggan', icon: 'users', key: '4' }],
  groups: [{ label: 'Laporan', items: [{ label: 'Penjualan', icon: 'chart' }, { label: 'Stok', icon: 'layers' }] }, { label: 'Pengaturan', items: [{ label: 'Tim', icon: 'users' }, { label: 'Pembayaran', icon: 'card' }] }],
  active: 'Pesanan',
  modal: {
    title: 'Tambah produk', subtitle: 'Isi data produk. Semua bisa diubah nanti.',
    fields: [{ label: 'Nama produk', value: 'Sambal bawang 250 g' }, { label: 'Harga', value: 'Rp 38.000', half: true }, { label: 'Stok awal', value: '40', half: true }, { label: 'Kategori', kind: 'segmented', options: ['Sambal', 'Bumbu', 'Kering'] }],
    secondary: 'Batal', primary: 'Simpan produk',
  },
  table: { title: 'Pesanan terbaru', cols: ['Pesanan', 'Pelanggan', 'Total', 'Status'], rows: [['#1042', 'Dewi A.', 'Rp 114.000', 'Dibayar'], ['#1041', 'Bima S.', 'Rp 76.000', 'Dikirim'], ['#1040', 'Sari W.', 'Rp 38.000', 'Menunggu'], ['#1039', 'Andi P.', 'Rp 152.000', 'Dibayar']] },
  ...(args.content ? JSON.parse(fs.readFileSync(args.content, 'utf8')) : {}),
};

const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  inbox: '<path d="M3 13h5l1.5 3h5L16 13h5"/><path d="M5 5h14l2 8v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6z"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5z"/><path d="M3 7.5 12 12l9-4.5M12 12v9"/>',
  users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c1.8.7 3 2.5 3.5 5.2"/>',
  chart: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  card: '<rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/>',
  search: '<circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/>',
  bell: '<path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/>',
  updown: '<path d="m8 9 4-4 4 4M8 15l4 4 4-4"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
};
const icon = (name, o, cls = 'ic') => `<svg class="${cls}" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="${o.t.icons.stroke}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ICONS.box}</svg>`;
const initials = (s) => s.split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

function navItem(it, o, withKey) {
  const on = it.label === content.active;
  return `<li><a href="#" class="sb-item"${on ? ' aria-current="page"' : ''}>${icon(it.icon, o)}<span class="sb-label">${esc(it.label)}</span>${it.badge ? `<span class="sb-badge">${esc(it.badge)}</span>` : withKey && it.key ? `<kbd>⌘${esc(it.key)}</kbd>` : ''}</a></li>`;
}

function sidebar(o) {
  const t = o.t;
  const rail = t.rail ? `<div class="sb-rail" aria-hidden="true"><span class="sb-logo">${esc(initials(content.app))}</span>${['home', 'inbox', 'box', 'chart', 'bell'].map((n) => `<span class="rail-ic${n === 'inbox' ? ' on' : ''}">${icon(n, o)}</span>`).join('')}<span class="rail-ic rail-end">${icon('gear', o)}</span></div>` : '';
  return `<nav class="sb${t.rail ? ' has-rail' : ''}" aria-label="Menu contoh ${o.letter}">${rail}<div class="sb-panel">
  <div class="sb-ws">${t.rail ? '' : `<span class="sb-logo">${esc(initials(content.app))}</span>`}<span class="sb-who"><b>${esc(content.app)}</b><small>${esc(content.plan)}</small></span>${icon('updown', o, 'ic sb-chev')}</div>
  <label class="sb-search">${icon('search', o)}<input type="search" placeholder="Cari menu" aria-label="Cari menu (opsi ${o.letter})"><kbd>⌘K</kbd></label>
  <ul class="sb-list">${content.nav.map((it) => navItem(it, o, true)).join('')}</ul>
  ${content.groups.map((g) => `<p class="sb-group">${esc(g.label)}</p><ul class="sb-list">${g.items.map((it) => navItem(it, o, false)).join('')}</ul>`).join('\n  ')}
  <div class="sb-acc"><span class="sb-avatar" aria-hidden="true">${esc(initials(content.user.name))}</span><span class="sb-who"><b>${esc(content.user.name)}</b><small>${esc(content.user.email)}</small></span>${icon('updown', o, 'ic sb-chev')}</div>
</div></nav>`;
}

function modal(o) {
  const m = content.modal;
  const id = `md-${o.letter.toLowerCase()}`;
  const field = (f, i) => {
    const fid = `${id}-f${i}`;
    if (f.kind === 'segmented') return `<div class="fld"><span class="fld-l" id="${fid}">${esc(f.label)}</span><div class="seg" role="group" aria-labelledby="${fid}">${f.options.map((x, j) => `<button type="button" aria-pressed="${j === 0}">${esc(x)}</button>`).join('')}</div></div>`;
    return `<div class="fld${f.half ? ' half' : ''}"><label class="fld-l" for="${fid}">${esc(f.label)}</label><input id="${fid}" value="${esc(f.value || '')}"></div>`;
  };
  return `<div class="md" role="dialog" aria-modal="false" aria-labelledby="${id}-t">
  <div class="md-head"><div><p class="md-title" id="${id}-t">${esc(m.title)}</p><p class="md-sub">${esc(m.subtitle)}</p></div><button type="button" class="md-x" aria-label="Tutup (contoh)">${icon('x', o)}</button></div>
  <div class="md-body">${m.fields.map(field).join('')}</div>
  <div class="md-foot"><button type="button" class="btn-sec">${esc(m.secondary)}</button><button type="button" class="btn-pri">${esc(m.primary)}</button></div>
</div>`;
}

function table(o) {
  const tb = content.table;
  return `<div class="tbl"><p class="tbl-title">${esc(tb.title)}</p><div class="tbl-scroll"><table><thead><tr>${tb.cols.map((c) => `<th scope="col">${esc(c)}</th>`).join('')}</tr></thead>
  <tbody>${tb.rows.map((r) => `<tr>${r.map((c, i) => `<td>${i === r.length - 1 ? `<span class="chip">${esc(c)}</span>` : esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
}

const fontStack = (f) => (f ? `'${f}', ui-sans-serif, system-ui, sans-serif` : 'ui-sans-serif, system-ui, sans-serif');
function vars(o) {
  const t = o.t;
  const glass = t.glass;
  const surf = glass ? `rgba(${toRgb(t.surface).join(',')},${glass.alpha})` : t.surface;
  return [
    ['--canvas', t.canvas], ['--surface', surf], ['--inset', t.inset], ['--border', t.border], ['--text', t.text], ['--muted', t.muted],
    ['--accent', t.accent], ['--on-accent', t.onAccent], ['--link', t.link], ['--primary', t.primary], ['--on-primary', t.onPrimary],
    ['--active-bg', t.active.bg], ['--active-text', t.active.text], ['--active-icon', t.activeIcon], ['--rail', t.rail || t.surface],
    ['--r-surface', `${t.radius.surface}px`], ['--r-control', `${t.radius.control}px`], ['--r-item', `${t.radius.item}px`], ['--r-button', `${t.radius.button}px`],
    ['--row', `${t.density.row}px`], ['--pad', `${t.density.pad}px`], ['--gap', `${t.density.gap}px`], ['--shadow', t.shadow],
    ['--title-w', t.type.titleWeight], ['--title-size', `${t.type.titleSize}px`], ['--body', `${t.type.body}px`], ['--track', t.type.tracking],
    ['--font', fontStack(t.fonts?.body)], ['--font-display', fontStack(t.fonts?.display)],
    ['--blur', glass ? `${glass.blur}px` : '0px'], ['--glow', glass ? `radial-gradient(60% 55% at 50% 60%, ${glass.glow}55, transparent 70%)` : 'none'],
  ].map(([k, v]) => `${k}:${v}`).join(';');
}
const optClass = (o) => `opt opt-${o.t.active.style} ${o.t.scheme}${o.t.glass ? ' glass' : ''}${o.t.type.groupLabel === 'caps' ? ' caps' : ''}`;

// shadcn/ui theme variables for the build (admin/method.md §5).
const shadcn = (t) => ({
  '--background': t.canvas, '--foreground': t.text, '--card': t.surface, '--card-foreground': t.text, '--popover': t.surface, '--popover-foreground': t.text,
  '--primary': t.primary, '--primary-foreground': t.onPrimary, '--secondary': t.inset, '--secondary-foreground': t.text, '--muted': t.inset, '--muted-foreground': t.muted,
  '--accent': t.active.bg, '--accent-foreground': t.active.text, '--border': t.border, '--input': t.border, '--ring': t.accent, '--radius': `${t.radius.control === 999 ? 16 : t.radius.control}px`,
  '--sidebar': t.rail ? t.surface : t.surface, '--sidebar-foreground': t.text, '--sidebar-primary': t.accent, '--sidebar-primary-foreground': t.onAccent,
  '--sidebar-accent': t.active.bg, '--sidebar-accent-foreground': t.active.text, '--sidebar-border': t.border, '--sidebar-ring': t.accent,
  '--surface-radius': `${t.radius.surface}px`, '--button-radius': `${t.radius.button}px`, '--shadow-floating': t.shadow, ...(t.glass ? { '--glass-alpha': String(t.glass.alpha), '--glass-blur': `${t.glass.blur}px` } : {}),
});

const kitFonts = kit ? [...new Set([kit.fonts.display, kit.fonts.body])].filter((f) => !SYSTEM_FONT.test(f)) : [];
const ROWS = { sidebar: ['Sidebar', 'Diperluas: pencarian, menu berkelompok, item aktif, akun di bawah.', sidebar], modal: ['Dialog (modal)', 'Judul, subjudul, form pendek, tombol utama lebar dan tombol kedua kecil.', modal], table: ['Tabel', 'Daftar data dengan status; isi contoh.', table] };

const html = `<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Pilih gaya panel admin</title>
${kitFonts.length ? `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${kitFonts.map((f) => `family=${encodeURIComponent(f)}:wght@400;600;700`).join('&')}&display=swap">` : ''}
<style>
*{box-sizing:border-box}
body{margin:0;background:#f6f6f4;color:#1b1d22;font:16px/1.55 ui-sans-serif,system-ui,sans-serif}
.page{max-width:1480px;margin:0 auto;padding:28px 16px 64px;display:grid;gap:28px}
h1{font-size:30px;line-height:1.15;margin:0 0 8px} h2{font-size:21px;margin:0} .lead{margin:0;max-width:62em;color:#41444d}
.cols{display:grid;gap:16px;grid-template-columns:repeat(${options.length},minmax(0,1fr))}
@media (max-width:1100px){.cols{grid-template-columns:minmax(0,1fr)}}
.card{background:#fff;border:1px solid #dcdcd8;border-radius:12px;padding:16px;display:grid;gap:8px;align-content:start}
.card .tag{display:inline-flex;align-items:center;gap:8px;font-weight:700;font-size:18px;margin:0}
.card .tag b{display:inline-grid;place-items:center;width:32px;height:32px;border-radius:8px;background:#1b1d22;color:#fff}
.card p{margin:0;font-size:15px} .card .small{font-size:14px;color:#4a4d56}
.rec{font-size:13px;font-weight:700;background:#fff3c4;color:#5a4300;padding:2px 8px;border-radius:99px}
.levers{display:flex;flex-wrap:wrap;gap:6px;list-style:none;margin:0;padding:0} .levers li{font-size:13px;border:1px solid #cfcfca;border-radius:99px;padding:2px 10px;color:#33363d}
.sw{display:flex;gap:4px} .sw i{width:22px;height:22px;border-radius:6px;border:1px solid #0002;display:block}
.row-head{display:flex;flex-wrap:wrap;gap:4px 16px;align-items:baseline}
.row-head p{margin:0;color:#4a4d56;font-size:15px}
.cell{border-radius:12px;overflow:hidden;border:1px solid #dcdcd8;background:#fff;min-width:0}
.cell-label{margin:0;padding:8px 12px;font-weight:700;font-size:14px;border-bottom:1px solid #dcdcd8}
/* --- option scope: every component reads the same tokens */
.opt{font-family:var(--font);font-size:var(--body);line-height:1.45;color:var(--text);background:var(--canvas);background-image:var(--glow);letter-spacing:var(--track);padding:28px 16px;display:flex;justify-content:center;align-items:flex-start;min-height:100%}
.opt kbd{font:600 12px/1 ui-monospace,monospace;color:var(--muted);background:var(--inset);border:1px solid var(--border);border-radius:6px;padding:4px 6px;margin-left:auto}
.opt .ic{flex:none}
.sb{display:flex;width:100%;max-width:300px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-surface);box-shadow:var(--shadow);overflow:hidden;-webkit-backdrop-filter:blur(var(--blur));backdrop-filter:blur(var(--blur))}
.sb.has-rail{max-width:330px}
.sb-rail{display:flex;flex-direction:column;align-items:center;gap:10px;padding:14px 8px;background:var(--rail);border-right:1px solid var(--border);color:var(--muted)}
.rail-ic{display:grid;place-items:center;width:36px;height:36px;border-radius:var(--r-item)} .rail-ic.on{background:var(--active-bg);color:var(--active-icon)} .rail-end{margin-top:auto}
.sb-panel{flex:1;min-width:0;padding:var(--pad);display:flex;flex-direction:column;gap:6px;min-height:560px}
.sb-ws,.sb-acc{display:flex;align-items:center;gap:10px;min-height:44px}
.sb-acc{margin-top:auto;padding-top:12px;border-top:1px solid var(--border)}
.sb-logo,.sb-avatar{display:grid;place-items:center;width:34px;height:34px;flex:none;border-radius:calc(var(--r-item) + 2px);background:var(--accent);color:var(--on-accent);font-weight:700;font-size:13px}
.sb-avatar{border-radius:99px;background:var(--inset);color:var(--text)}
.sb-who{display:grid;min-width:0;line-height:1.3} .sb-who b{font-family:var(--font-display);font-weight:var(--title-w)} .sb-who small{font-size:13px;color:var(--muted);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.sb-chev{margin-left:auto;color:var(--muted)}
.sb-search{display:flex;align-items:center;gap:8px;min-height:38px;padding:0 6px 0 10px;margin:6px 0 4px;background:var(--inset);border:1px solid var(--border);border-radius:var(--r-control);color:var(--muted)}
.sb-search input{flex:1;min-width:0;border:0;background:transparent;color:var(--text);font:inherit;outline:none;padding:8px 0}
.sb-search input::placeholder{color:var(--muted);opacity:1}
.sb-list{list-style:none;margin:0;padding:0;display:grid;gap:var(--gap)}
.sb-item{display:flex;align-items:center;gap:10px;min-height:var(--row);padding:0 10px;border-radius:var(--r-item);color:var(--text);text-decoration:none;transition:background-color 150ms ease}
.sb-item .ic{color:var(--muted)} .sb-item:hover{background:var(--inset)}
.sb-item[aria-current]{background:var(--active-bg);color:var(--active-text);font-weight:600}
.sb-item[aria-current] .ic{color:var(--active-icon)}
.opt-layer-bar .sb-item[aria-current]{box-shadow:inset 3px 0 0 var(--accent)}
.opt-glass-pill .sb-item[aria-current]{box-shadow:inset 0 0 0 1px var(--border)}
.sb-badge{margin-left:auto;font-size:12px;font-weight:700;line-height:1;padding:4px 7px;border-radius:99px;background:var(--accent);color:var(--on-accent)}
.sb-group{margin:14px 10px 2px;font-size:13px;font-weight:600;color:var(--muted)}
.caps .sb-group{text-transform:uppercase;letter-spacing:.07em;font-size:12px}
.md{width:100%;max-width:460px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-surface);box-shadow:var(--shadow);overflow:hidden;-webkit-backdrop-filter:blur(var(--blur));backdrop-filter:blur(var(--blur))}
.md-head{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;padding:calc(var(--pad) + 4px);border-bottom:1px solid var(--border)}
.md-title{margin:0;font-family:var(--font-display);font-size:var(--title-size);font-weight:var(--title-w);line-height:1.25}
.md-sub{margin:4px 0 0;color:var(--muted)}
.md-x{display:grid;place-items:center;width:36px;height:36px;flex:none;border:1px solid var(--border);background:transparent;color:var(--text);border-radius:var(--r-control);cursor:pointer}
.md-body{padding:calc(var(--pad) + 4px);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:14px 12px}
.fld{grid-column:1/-1;display:grid;gap:6px;min-width:0} .fld.half{grid-column:auto}
@media (max-width:420px){.fld.half{grid-column:1/-1}}
.fld-l{font-weight:600}
.fld input{width:100%;min-height:40px;padding:8px 12px;font:inherit;color:var(--text);background:var(--inset);border:1px solid var(--border);border-radius:var(--r-control)}
.seg{display:flex;gap:4px;padding:4px;background:var(--inset);border:1px solid var(--border);border-radius:var(--r-control)}
.seg button{flex:1;min-height:34px;font:inherit;color:var(--muted);background:transparent;border:0;border-radius:calc(var(--r-control) - 3px);cursor:pointer}
.seg button[aria-pressed="true"]{background:var(--surface);color:var(--text);font-weight:600;box-shadow:0 1px 2px #0002}
.glass .seg button[aria-pressed="true"]{background:var(--active-bg)}
.md-foot{display:flex;gap:10px;padding:calc(var(--pad) + 2px) calc(var(--pad) + 4px);border-top:1px solid var(--border)}
.btn-sec,.btn-pri{min-height:44px;padding:0 18px;font:600 15px/1 var(--font);border-radius:var(--r-button);cursor:pointer}
.btn-sec{background:transparent;color:var(--text);border:1px solid var(--border)}
.btn-pri{flex:1;background:var(--primary);color:var(--on-primary);border:1px solid var(--primary)}
.tbl{width:100%;max-width:520px;background:var(--surface);border:1px solid var(--border);border-radius:var(--r-surface);box-shadow:var(--shadow);overflow:hidden;-webkit-backdrop-filter:blur(var(--blur));backdrop-filter:blur(var(--blur))}
.tbl-title{margin:0;padding:var(--pad);font-family:var(--font-display);font-weight:var(--title-w);font-size:17px;border-bottom:1px solid var(--border)}
.tbl-scroll{overflow-x:auto} table{width:100%;border-collapse:collapse;font-variant-numeric:tabular-nums}
th,td{text-align:left;padding:10px 12px;border-bottom:1px solid var(--border);white-space:nowrap} th{font-weight:600;color:var(--muted)} tr:last-child td{border-bottom:0}
@media (max-width:520px){th,td{white-space:normal;padding:8px 10px}}
.chip{display:inline-block;padding:2px 10px;border-radius:99px;background:var(--active-bg);color:var(--active-text);font-size:13px;font-weight:600}
.opt :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){.opt *{transition:none!important}}
/* --- the reply */
.pick{background:#fff;border:1px solid #dcdcd8;border-radius:12px;padding:18px;display:grid;gap:12px}
.pick fieldset{border:0;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px} .pick legend{font-weight:700;margin-bottom:8px}
.pick input[type=radio]{width:24px;height:24px;margin:0;accent-color:#1b1d22}
.pick label.choice{display:flex;align-items:center;gap:8px;border:1px solid #cfcfca;border-radius:8px;padding:8px 12px;min-height:44px;cursor:pointer}
.pick textarea,.pick input[type=text]{font:inherit;width:100%;border:1px solid #cfcfca;border-radius:8px;padding:8px 10px;background:#fbfbfa;color:#1b1d22}
.pick textarea{min-height:64px;font-family:ui-monospace,monospace}
.btn{justify-self:start;font:700 15px/1 system-ui,sans-serif;padding:13px 18px;min-height:44px;border:0;border-radius:8px;background:#1b1d22;color:#fff;cursor:pointer}
:focus-visible{outline:3px solid #2b59c3;outline-offset:2px}
</style></head>
<body><main class="page">
<header>
  <h1>Pilih gaya panel admin</h1>
  <p class="lead">${args.brief ? `${esc(args.brief)}. ` : ''}Strukturnya sama di semua opsi (komponen shadcn/ui); yang berubah hanya gaya, 3–4 tuas per opsi. Isi menu dan form adalah contoh. ${kit ? `Warna, sudut dan huruf memakai brand kit <b>${esc(kit.name)}</b>.` : 'Warna aksen masih sementara; nanti diganti warna brand.'}</p>
</header>
<section aria-labelledby="opsi"><h2 id="opsi" style="margin-bottom:12px">Opsi</h2><div class="cols">
${options.map((o) => `<article class="card" data-option="${o.letter}" data-direction="${esc(o.d.id)}">
  <p class="tag"><b>${o.letter}</b>${esc(o.d.name)}${rec === o ? ' <span class="rec">Rekomendasi</span>' : ''}</p>
  <p>${esc(o.d.character)}</p>
  <p class="small"><b>Cocok untuk:</b> ${esc(o.d.fits)}. <b>Hindari bila:</b> ${esc(o.d.avoid)}.</p>
  <ul class="levers" aria-label="Tuas yang diubah">${o.d.levers.map((l) => `<li>${esc(LEVERS[l])}</li>`).join('')}</ul>
  <div class="sw" aria-hidden="true">${[o.t.canvas, o.t.surface, o.t.text, o.t.accent, o.t.primary].map((c) => `<i style="background:${c}"></i>`).join('')}</div>
  <p class="small"><b>Dari referensi:</b> ${o.d.refs.map((r) => esc(r.id)).join(', ')}${o.fromKit.length ? `. <b>Dari brand kit:</b> ${esc(o.fromKit.join(', '))}` : ''}.</p>
  <p class="small"><b>Gerak:</b> ${esc(o.t.motion)}</p>
</article>`).join('\n')}
</div>${rec && args.why ? `<p class="lead" style="margin-top:12px"><b>Rekomendasi ${rec.letter}:</b> ${esc(args.why)}</p>` : ''}</section>
${components.map((c) => `<section aria-labelledby="row-${c}"><div class="row-head"><h2 id="row-${c}">${ROWS[c][0]}</h2><p>${ROWS[c][1]}</p></div><div class="cols" style="margin-top:12px">
${options.map((o) => `<div class="cell"><p class="cell-label">${o.letter} · ${esc(o.d.name)}</p><div class="${optClass(o)}" style="${esc(vars(o))}" data-sample>${ROWS[c][2](o)}</div></div>`).join('\n')}
</div></section>`).join('\n')}
<section class="pick" aria-labelledby="balas">
  <h2 id="balas">Balasan Anda</h2>
  <fieldset><legend>Gaya yang dipakai</legend>
  ${options.map((o) => `<label class="choice"><input type="radio" name="pick" value="${o.letter}"${(rec ? rec === o : o.letter === 'A') ? ' checked' : ''}> ${o.letter} · ${esc(o.d.name)}</label>`).join('')}
  <label class="choice"><input type="radio" name="pick" value="AI"> Percayakan ke AI</label></fieldset>
  <label for="note" style="display:grid;gap:6px">Catatan (opsional), misalnya “modal dari A”<input type="text" id="note"></label>
  <textarea id="reply" readonly aria-label="Teks balasan untuk disalin"></textarea>
  <button class="btn" id="copy" type="button">Salin balasan</button><span id="msg" aria-live="polite"></span>
</section>
</main>
<script>
  function build() {
    var p = document.querySelector('input[name=pick]:checked').value, n = document.getElementById('note').value.trim();
    document.getElementById('reply').value = (p === 'AI' ? 'Percayakan ke AI' : 'Pilih ' + p) + (n ? '. Catatan: ' + n : '');
  }
  document.querySelectorAll('input[name=pick], #note').forEach(function (e) { e.addEventListener('input', build); e.addEventListener('change', build); });
  document.querySelectorAll('.seg').forEach(function (g) { g.addEventListener('click', function (ev) { var b = ev.target.closest('button'); if (!b) return; g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); }); }); });
  document.querySelectorAll('.sb-item').forEach(function (a) { a.addEventListener('click', function (ev) { ev.preventDefault(); }); });
  build();
  document.getElementById('copy').addEventListener('click', function () {
    var r = document.getElementById('reply'), m = document.getElementById('msg');
    (navigator.clipboard ? navigator.clipboard.writeText(r.value) : Promise.reject()).then(function () { m.textContent = 'Tersalin.'; }).catch(function () { r.select(); m.textContent = 'Teks sudah dipilih: salin manual.'; });
  });
</script>
</body></html>
`;

const out = path.resolve(args.out || '.design/options/admin-options.html');
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, html);
const json = { made: new Date().toISOString(), brief: args.brief || null, kit: kit ? kit.name : null, components, recommend: rec ? rec.letter : null,
  options: options.map((o) => ({ letter: o.letter, id: o.d.id, name: o.d.name, levers: o.d.levers, refs: o.d.refs.map((r) => r.id), fromKit: o.fromKit, tokens: o.t, shadcn: shadcn(o.t) })) };
fs.writeFileSync(out.replace(/\.html$/, '.json'), JSON.stringify(json, null, 2));
console.log(`admin options: ${path.relative(process.cwd(), out)} (${options.map((o) => `${o.letter} ${o.d.id}`).join(', ')}; ${components.join(', ')}${kit ? `; brand kit ${kit.name}` : ''})`);
console.log('Show it; the user replies "Pilih <letter>" (or "Percayakan ke AI"). Then: progress.mjs log "admin-style: <letter> <id> (user: <their words>)" --step direction --by user');
