#!/usr/bin/env node
// Finds licensed photographs of the subject's world, downloads the chosen ones and keeps their
// credits, so a page without the client's own pictures still has real photographs.
//
//   node photos.mjs search "<query>" [--provider unsplash|openverse|commons|all] [--n 8]
//        [--orientation landscape|portrait|squarish] [--sheet .design/photos/sheet.png]
//   node photos.mjs get <provider:id> [--to assets/photos] [--width 1600]
//   node photos.mjs get <pasted Unsplash link> [--by "<photographer>"] [--page <photo page link>]
//        a photo the user picked on unsplash.com: an images.unsplash.com link loads without a key;
//        an unsplash.com/photos/… link needs the key (full credit); without one it asks for the image link
//   node photos.mjs generate "<what the picture shows>" [--width 1024 --height 768 --seed 1 --n 1]
//        a free AI-generated DRAFT picture (Pollinations, no key: about one picture per 45 s, a small
//        provider watermark, modest quality). Look at it before using it; it is a stand-in, marked
//        data-generated on the page and listed in the deliver report (rules/illustration.md)
//   node photos.mjs credits [--html]
//
// Search runs without any key on Openverse and Wikimedia Commons. Free keys add better pictures:
// UNSPLASH_ACCESS_KEY (unsplash.com/developers), PEXELS_API_KEY (pexels.com/api), PIXABAY_API_KEY
// (pixabay.com/api/docs). Keys live in environment variables; never commit one or paste it into a
// chat (rules/brief-interview.md → Materials has the steps). Behind a proxy the script restarts
// itself with NODE_USE_ENV_PROXY=1, without which every request fails.
// A found photograph shows the subject's world; it is never presented as the client's own people,
// place or product (rules/copyright.md, rules/illustration.md).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { launch, parseArgs } from './lib/browser.mjs';
import { parseUnsplashLink, sizedImageUrl, linkCredit } from './lib/unsplash-link.mjs';
import { mapPexels, mapPixabay, creditLine, defaultProviders, generateUrl, retryAfterSeconds } from './lib/stock.mjs';

// Node's fetch ignores HTTPS_PROXY unless NODE_USE_ENV_PROXY=1 is set at start: behind a proxy
// every search came back "fetch failed" and runs ended up with no photographs at all.
if ((process.env.HTTPS_PROXY || process.env.https_proxy) && !process.env.NODE_USE_ENV_PROXY) {
  const r = spawnSync(process.execPath, [...process.execArgv, ...process.argv.slice(1)], { stdio: 'inherit', env: { ...process.env, NODE_USE_ENV_PROXY: '1', NODE_NO_WARNINGS: '1' } });
  process.exit(r.status ?? 1);
}

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
  async pexels(q, n, orientation) {
    if (!process.env.PEXELS_API_KEY) throw new Error('Pexels needs PEXELS_API_KEY (free: pexels.com/api → Your API Key)');
    const u = new URL('https://api.pexels.com/v1/search');
    u.search = new URLSearchParams({ query: q, per_page: String(n), ...(orientation ? { orientation: orientation === 'squarish' ? 'square' : orientation } : {}) });
    return mapPexels(await getJSON(u, { Authorization: process.env.PEXELS_API_KEY }));
  },
  async pixabay(q, n, orientation) {
    if (!process.env.PIXABAY_API_KEY) throw new Error('Pixabay needs PIXABAY_API_KEY (free: pixabay.com/api/docs, shown after sign-in)');
    const u = new URL('https://pixabay.com/api/');
    u.search = new URLSearchParams({ key: process.env.PIXABAY_API_KEY, q, image_type: 'photo', safesearch: 'true', per_page: String(Math.max(3, n)), ...(orientation === 'landscape' ? { orientation: 'horizontal' } : orientation === 'portrait' ? { orientation: 'vertical' } : {}) });
    return mapPixabay(await getJSON(u)).slice(0, n);
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

// A photo the user picked on unsplash.com and pasted (rules/brief-interview.md → Materials, path a).
async function getLink(link) {
  const L = parseUnsplashLink(link);
  if (!L) {
    console.error(`${link} is not an Unsplash photo link: paste an images.unsplash.com/… or unsplash.com/photos/… link.`);
    process.exit(2);
  }
  if (L.kind === 'plus') {
    console.error('plus.unsplash.com is Unsplash+ (a paid licence): pick a free photo instead.');
    process.exit(2);
  }
  let imageUrl = L.kind === 'image' ? L.imageUrl : '';
  let pageUrl = args.page || (L.kind === 'page' ? L.pageUrl : '');
  let creator = args.by || '';
  let creatorUrl = '';
  let title = '';
  let ref = L.kind === 'image' ? `unsplash-img:${L.key}` : `unsplash:${L.id}`;
  if (L.kind === 'page' && KEY) {
    const p = await getJSON(`https://api.unsplash.com/photos/${L.id}`, { Authorization: `Client-ID ${KEY}`, 'Accept-Version': 'v1' });
    imageUrl = String(p.urls.raw).split('?')[0];
    creator = creator || p.user.name;
    creatorUrl = `${p.user.links.html}?utm_source=${APP}&utm_medium=referral`;
    pageUrl = `${p.links.html}?utm_source=${APP}&utm_medium=referral`;
    title = p.alt_description || p.description || '';
    await fetch(p.links.download_location, { headers: { ...UA, Authorization: `Client-ID ${KEY}` } }).catch(() => {});
  } else if (L.kind === 'page') {
    // Without a key the photo page is not read: scraping unsplash.com is against its terms (and bot-blocked).
    console.error('An unsplash.com/photos/… link needs UNSPLASH_ACCESS_KEY for its credit. Without a key: open the photo, right-click it → "Copy image address", and paste that images.unsplash.com link with --by "<photographer>" --page <this link>.');
    process.exit(1);
  }
  const to = path.resolve(args.to || 'assets/photos');
  fs.mkdirSync(to, { recursive: true });
  const r = await fetch(sizedImageUrl(imageUrl, args.width), { headers: UA }).catch((e) => ({ ok: false, status: e.message }));
  const type = (r.ok && r.headers.get('content-type')) || '';
  if (!r.ok || !/^image\//.test(type)) {
    console.error(`Download failed: ${r.status} ${type}`.trim());
    process.exit(1);
  }
  const ext = /png/.test(type) ? 'png' : /webp/.test(type) ? 'webp' : 'jpg';
  const file = path.join(to, `${ref.replace(':', '-')}.${ext}`);
  fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
  const rec = linkCredit({ ref, file: path.relative(process.cwd(), file), imageUrl, pageUrl, creator, creatorUrl, title: strip(title) });
  fs.mkdirSync(DIR, { recursive: true });
  const credits = loadCredits().filter((c) => c.ref !== ref);
  credits.push(rec);
  fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
  console.log(`saved ${rec.file} (${Math.round(fs.statSync(file).size / 1024)} KB); credit: ${rec.credit}${rec.note ? `\n${rec.note}` : ''}`);
}

const loadCredits = () => (fs.existsSync(CREDITS) ? JSON.parse(fs.readFileSync(CREDITS, 'utf8')) : []);

if (cmd === 'search') {
  if (!arg) {
    console.error('Usage: node photos.mjs search "<query>" [--provider unsplash|pexels|pixabay|openverse|commons|all] [--n 8]');
    process.exit(2);
  }
  const n = Number(args.n || 8);
  const which = args.provider && args.provider !== 'all' ? [args.provider] : defaultProviders(process.env);
  if (which.length === 2 && (!args.provider || args.provider === 'all')) console.log('(no key set: searching Openverse and Wikimedia Commons only; a free UNSPLASH_ACCESS_KEY, PEXELS_API_KEY or PIXABAY_API_KEY adds better pictures)');
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
} else if (cmd === 'get' && /^https?:\/\//i.test(arg || '')) {
  await getLink(arg);
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
  credits.push({ ref: item.ref, file: path.relative(process.cwd(), file), title: strip(item.title), creator: strip(item.creator), creatorUrl: item.creatorUrl, license: item.license, source: item.source, credit: creditLine(item) });
  fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
  console.log(`saved ${path.relative(process.cwd(), file)} (${Math.round(fs.statSync(file).size / 1024)} KB); credit recorded`);
} else if (cmd === 'generate') {
  if (!arg) {
    console.error('Usage: node photos.mjs generate "<what the picture shows>" [--width 1024 --height 768 --seed 1 --n 1] [--to assets/photos]');
    process.exit(2);
  }
  const to = path.resolve(args.to || 'assets/photos');
  fs.mkdirSync(to, { recursive: true });
  fs.mkdirSync(DIR, { recursive: true });
  const n = Math.min(4, Math.max(1, Number(args.n || 1)));
  const seed0 = Number(args.seed || 1);
  let saved = 0;
  for (let i = 0; i < n; i++) {
    const seed = seed0 + i;
    const url = generateUrl(arg, { width: Number(args.width || 1024), height: Number(args.height || 768), seed });
    let r = null;
    for (let attempt = 0; attempt < 4; attempt++) {
      r = await fetch(url, { headers: UA }).catch((e) => ({ ok: false, status: 0, statusText: e.message, headers: new Map(), text: async () => '' }));
      if (r.ok) break;
      const wait = retryAfterSeconds(r.status, r.headers.get('retry-after'), await r.text().catch(() => ''));
      if (!wait) break;
      console.log(`free limit: waiting ${wait}s (about one picture per 45 s without a key)`);
      await new Promise((res) => setTimeout(res, wait * 1000));
    }
    const type = (r.ok && r.headers.get('content-type')) || '';
    if (!r.ok || !/^image\//.test(type)) {
      console.error(`Generation failed: ${r.status} ${r.statusText || ''} ${type}`.trim());
      continue;
    }
    const model = r.headers.get('x-model-used') || 'unknown';
    const id = crypto.createHash('sha1').update(`${arg}|${seed}`).digest('hex').slice(0, 10);
    const ref = `generated:${id}`;
    const file = path.join(to, `generated-${id}.${/png/.test(type) ? 'png' : 'jpg'}`);
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer()));
    const credits = loadCredits().filter((c) => c.ref !== ref);
    credits.push({ ref, file: path.relative(process.cwd(), file), generated: true, provider: 'Pollinations (no key)', model, prompt: arg, seed, source: 'https://pollinations.ai', credit: `AI-generated draft picture (Pollinations, model ${model})`, note: 'Draft stand-in: it carries the provider watermark and its licence for commercial use was not verified. Mark it data-generated on the page, list it in the deliver report, replace it before launch.' });
    fs.writeFileSync(CREDITS, JSON.stringify(credits, null, 2));
    console.log(`saved ${path.relative(process.cwd(), file)} (${Math.round(fs.statSync(file).size / 1024)} KB, model ${model}, seed ${seed}): LOOK at it before using it; wrong subject or artefacts → another seed, a plainer prompt, or a placeholder`);
    saved++;
  }
  if (!saved) process.exit(1);
} else if (cmd === 'credits') {
  const credits = loadCredits();
  if (!credits.length) {
    console.log('No photographs recorded.');
    process.exit(0);
  }
  if (args.html) console.log(credits.map((c) => `<a href="${c.source}">${c.credit}</a>`).join(' · '));
  else for (const c of credits) console.log(`${c.credit} · ${c.source} · ${c.file}`);
} else {
  console.error('Usage: node photos.mjs search "<query>" | get <provider:id or Unsplash link> | generate "<what the picture shows>" | credits [--html]');
  process.exit(2);
}
