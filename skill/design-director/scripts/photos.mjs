#!/usr/bin/env node
// Finds licensed photographs of the subject's world, downloads the chosen ones and keeps their
// credits, so a page without the client's own pictures still has real photographs.
//
//   node photos.mjs search "<query>" [--provider unsplash|openverse|commons|all] [--n 8]
//        [--orientation landscape|portrait|squarish] [--sheet .design/photos/sheet.png]
//   node photos.mjs get <provider:id> [--to assets/photos] [--width 1600]
//   node photos.mjs credits [--html]
//
// Unsplash needs a free access key (unsplash.com/developers) in UNSPLASH_ACCESS_KEY; never commit
// it. Openverse and Wikimedia Commons need none. Behind a proxy, run node with NODE_USE_ENV_PROXY=1.
// A found photograph shows the subject's world; it is never presented as the client's own people,
// place or product (rules/copyright.md, rules/illustration.md).
import fs from 'node:fs';
import path from 'node:path';
import { launch, parseArgs } from './lib/browser.mjs';

const args = parseArgs(process.argv.slice(2));
const [cmd, arg] = args._;
const DIR = path.resolve('.design/photos');
const LAST = path.join(DIR, 'last-search.json');
const CREDITS = path.join(DIR, 'credits.json');
const KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const APP = 'design-director';
const UA = { 'User-Agent': `${APP}/0.4 (landing page skill; photo search)` };
// Licences that allow commercial use on a client's site.
const COMMERCIAL = /^(cc0|pdm|public domain|cc[- ]by(?![- ]?n[cd])(-sa)?|by(-sa)?|attribution)/i;

const getJSON = async (url, headers = {}) => {
  const r = await fetch(url, { headers: { ...UA, ...headers } });
  if (!r.ok) throw new Error(`${r.status} ${r.statusText} from ${new URL(url).host}`);
  return r.json();
};
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

const providers = {
  async unsplash(q, n, orientation) {
    if (!KEY) throw new Error('Unsplash needs UNSPLASH_ACCESS_KEY (free: unsplash.com/developers → New Application → Access Key)');
    const u = new URL('https://api.unsplash.com/search/photos');
    u.search = new URLSearchParams({ query: q, per_page: String(n), ...(orientation ? { orientation } : {}), content_filter: 'high' });
    const j = await getJSON(u, { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' });
    return j.results.map((p) => ({
      ref: `unsplash:${p.id}`,
      title: p.alt_description || p.description || '',
      creator: p.user.name,
      creatorUrl: `${p.user.links.html}?utm_source=${APP}&utm_medium=referral`,
      license: 'Unsplash License',
      source: `${p.links.html}?utm_source=${APP}&utm_medium=referral`,
      thumb: p.urls.small,
      full: p.urls.raw,
      // The Unsplash API guidelines ask apps to hit this when a photo is used.
      downloadLocation: p.links.download_location,
      size: `${p.width}×${p.height}`,
    }));
  },
  async openverse(q, n, orientation) {
    const u = new URL('https://api.openverse.org/v1/images/');
    u.search = new URLSearchParams({ q, page_size: String(n), license_type: 'commercial', ...(orientation === 'landscape' ? { aspect_ratio: 'wide' } : orientation === 'portrait' ? { aspect_ratio: 'tall' } : {}) });
    const j = await getJSON(u);
    return j.results.map((p) => ({
      ref: `openverse:${p.id}`,
      title: p.title || '',
      creator: p.creator || 'unknown',
      creatorUrl: p.creator_url || '',
      license: `${String(p.license).toUpperCase()} ${p.license_version || ''}`.trim(),
      source: p.foreign_landing_url,
      thumb: p.thumbnail || p.url,
      full: p.url,
      size: p.width ? `${p.width}×${p.height}` : '',
    }));
  },
  async commons(q, n) {
    const u = new URL('https://commons.wikimedia.org/w/api.php');
    u.search = new URLSearchParams({ action: 'query', generator: 'search', gsrsearch: `${q} filetype:bitmap`, gsrnamespace: '6', gsrlimit: String(n * 2), prop: 'imageinfo', iiprop: 'url|size|extmetadata', iiurlwidth: '400', format: 'json', origin: '*' });
    const j = await getJSON(u);
    return Object.values((j.query && j.query.pages) || {})
      .map((p) => {
        const ii = (p.imageinfo || [])[0] || {};
        const m = ii.extmetadata || {};
        const lic = strip(m.LicenseShortName && m.LicenseShortName.value);
        return {
          ref: `commons:${p.pageid}`,
          title: strip(m.ObjectName && m.ObjectName.value) || p.title.replace(/^File:/, ''),
          creator: strip(m.Artist && m.Artist.value) || 'unknown',
          creatorUrl: '',
          license: lic,
          source: ii.descriptionurl,
          thumb: ii.thumburl,
          full: ii.url,
          size: ii.width ? `${ii.width}×${ii.height}` : '',
        };
      })
      .filter((x) => x.full && COMMERCIAL.test(x.license))
      .slice(0, n);
  },
};

async function contactSheet(items, out) {
  const browser = await launch();
  const page = await browser.newPage({ viewport: { width: 1240, height: 400 } });
  const cells = items.map((x, i) => `<figure><img src="${x.thumb}" referrerpolicy="no-referrer"><figcaption>${i + 1}. ${x.ref}<br>${strip(x.title).slice(0, 60)}<br><i>${x.license} · ${strip(x.creator).slice(0, 40)}</i></figcaption></figure>`).join('');
  await page.setContent(`<style>body{margin:0;font:12px sans-serif;background:#222;color:#eee}div{display:grid;grid-template-columns:repeat(4,300px);gap:8px;padding:8px}img{width:300px;height:200px;object-fit:cover;display:block;background:#444}figure{margin:0}figcaption{padding:4px 0}</style><div>${cells}</div>`, { waitUntil: 'networkidle', timeout: 45000 }).catch(() => {});
  await page.screenshot({ path: out, fullPage: true });
  await browser.close();
}

const loadCredits = () => (fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, 'utf8')) : []);

if (cmd === 'search') {
  if (!arg) {
    console.error('Usage: node photos.mjs search "<query>" [--provider unsplash|openverse|commons|all] [--n 8]');
    process.exit(2);
  }
  const n = Number(args.n || 8);
  const which = args.provider && args.provider !== 'all' ? [args.provider] : KEY ? ['unsplash', 'openverse', 'commons'] : ['openverse', 'commons'];
  if (!KEY && (!args.provider || args.provider === 'all')) console.log('(Unsplash skipped: set UNSPLASH_ACCESS_KEY to include it)');
  const all = [];
  for (const p of which) {
    if (!providers[p]) {
      console.error(`Unknown provider ${p}`);
      process.exit(2);
    }
    try {
      const got = await providers[p](arg, n, args.orientation);
      all.push(...got);
      console.log(`${p}: ${got.length} results`);
    } catch (e) {
      console.log(`${p}: ${e.message}`);
    }
  }
  fs.mkdirSync(DIR, { recursive: true });
  fs.writeFileSync(LAST, JSON.stringify({ query: arg, at: new Date().toISOString(), results: all }, null, 2));
  all.forEach((x, i) => console.log(`${String(i + 1).padStart(2)}. ${x.ref}  ${x.size}  ${x.license}  ${strip(x.creator).slice(0, 30)}  ${strip(x.title).slice(0, 70)}`));
  if (args.sheet && all.length) {
    await contactSheet(all, path.resolve(args.sheet));
    console.log(`sheet: ${args.sheet} (look before choosing)`);
  }
  if (!all.length) process.exit(1);
} else if (cmd === 'get') {
  const last = fs.existsSync(LAST) ? JSON.parse(fs.readFileSync(LAST, 'utf8')) : { results: [] };
  const item = last.results.find((x) => x.ref === arg);
  if (!item) {
    console.error(`${arg} is not in the last search (${LAST}); search first.`);
    process.exit(2);
  }
  const to = path.resolve(args.to || 'assets/photos');
  fs.mkdirSync(to, { recursive: true });
  let url = item.full;
  if (item.ref.startsWith('unsplash:')) {
    url = `${item.full}&w=${Number(args.width || 1600)}&q=80&fm=jpg&fit=max`;
    await fetch(item.downloadLocation, { headers: { ...UA, Authorization: `Client-ID ${KEY}` } }).catch(() => {});
  }
  const r = await fetch(url, { headers: UA });
  if (!r.ok) {
    console.error(`Download failed: ${r.status}`);
    process.exit(1);
  }
  const type = r.headers.get('content-type') || '';
  const ext = /png/.test(type) ? 'png' : /webp/.test(type) ? 'webp' : 'jpg';
  const file = path.join(to, `${item.ref.replace(':', '-')}.${ext}`);
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  const credits = loadCredits().filter((c) => c.ref !== item.ref);
  credits.push({ ref: item.ref, file: path.relative(process.cwd(), file), title: strip(item.title), creator: strip(item.creator), creatorUrl: item.creatorUrl, license: item.license, source: item.source, credit: item.ref.startsWith('unsplash:') ? `Photo by ${strip(item.creator)} on Unsplash` : `${strip(item.title) || 'Photo'} by ${strip(item.creator)}, ${item.license}` });
  fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
  console.log(`saved ${path.relative(process.cwd(), file)} (${Math.round(fs.statSync(file).size / 1024)} KB); credit recorded`);
} else if (cmd === 'credits') {
  const credits = loadCredits();
  if (!credits.length) {
    console.log('No photographs recorded.');
    process.exit(0);
  }
  if (args.html) console.log(credits.map((c) => `<a href="${c.source}">${c.credit}</a>`).join(' · '));
  else for (const c of credits) console.log(`${c.credit} · ${c.source} · ${c.file}`);
} else {
  console.error('Usage: node photos.mjs search "<query>" | get <provider:id> | credits [--html]');
  process.exit(2);
}
