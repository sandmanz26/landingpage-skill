// Shared helpers: load Playwright from wherever it is installed, and serve a
// local folder over a throwaway HTTP server so pages behave as they would online.
import { createRequire } from 'node:module';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const require = createRequire(import.meta.url);

export function loadPlaywright() {
  try {
    return require('playwright');
  } catch {
    console.error(
      'Playwright is not installed. Run `npm i -D playwright` in the project (or globally), ' +
        'or set NODE_PATH to a folder that has it. A Chrome/Chromium binary is also needed; ' +
        'set CHROME_PATH if Playwright cannot find one.'
    );
    process.exit(2);
  }
}

export async function launch() {
  const { chromium } = loadPlaywright();
  const opts = { args: ['--no-sandbox'] };
  if (process.env.CHROME_PATH) opts.executablePath = process.env.CHROME_PATH;
  return chromium.launch(opts);
}

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
};

// Turns a target (URL, HTML file or folder) into a URL, starting a local server
// for files. Returns { url, close }.
export async function resolveTarget(target) {
  if (/^https?:\/\//i.test(target)) return { url: target, close: async () => {} };
  const abs = path.resolve(target);
  if (!fs.existsSync(abs)) throw new Error(`Not found: ${target}`);
  const isDir = fs.statSync(abs).isDirectory();
  const file = isDir ? path.join(abs, 'index.html') : abs;
  // Serve from the project root when the page lives inside it, so relative
  // links that climb folders (../../assets/site.css) still resolve.
  const cwd = process.cwd();
  const root = file.startsWith(cwd + path.sep) ? cwd : path.dirname(file);
  const entry = path.relative(root, file).split(path.sep).join('/');
  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    let file = path.join(root, urlPath);
    if (!file.startsWith(root)) {
      res.writeHead(403).end();
      return;
    }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) {
      res.writeHead(404).end('not found');
      return;
    }
    res.writeHead(200, { 'content-type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const { port } = server.address();
  return {
    url: `http://127.0.0.1:${port}/${encodeURI(entry)}`,
    close: () => new Promise((r) => server.close(r)),
  };
}

// Parses --flag value / --flag pairs; bare words go to _.
export function parseArgs(argv) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith('--')) out[key] = true;
      else {
        out[key] = next;
        i++;
      }
    } else out._.push(a);
  }
  return out;
}

// Goes to a page and retries when the server answers with an error page (a 5xx, or a proxy's
// "upstream request failed"), so one hiccup does not become a capture of an error message.
export async function gotoStable(page, url, { timeout = 30000, tries = Number(process.env.DD_LOAD_TRIES || 3) } = {}) {
  for (let i = 0; i < tries; i++) {
    let res = null;
    try {
      res = await page.goto(url, { waitUntil: 'networkidle', timeout });
    } catch {
      res = await page.goto(url, { waitUntil: 'load', timeout }).catch(() => null);
    }
    const status = res ? res.status() : 0;
    const text = await page.evaluate(() => (document.body ? document.body.innerText.slice(0, 300) : '')).catch(() => '');
    // A rate limit (429) or a short error body is not the site: wait longer and try again.
    const failed = status >= 500 || status === 429 || (text.length < 300 && /upstream request failed|bad gateway|service unavailable|gateway time-?out|too many requests|rate limit/i.test(text));
    if (!failed) return { status, retries: i };
    await page.waitForTimeout((status === 429 || /too many requests/i.test(text) ? 15000 : 3000) * (i + 1));
  }
  return { status: 0, retries: tries, failed: true };
}

// Closes newsletter pop-ups, cookie banners and similar overlays so the content can be seen.
// Returns the labels it clicked; the caller photographs the overlay first when it matters.
export async function dismissOverlays(page) {
  await page.keyboard.press('Escape').catch(() => {});
  const clicked = [];
  for (let round = 0; round < 4; round++) {
    const handle = await page.evaluateHandle(() => {
      const close = /^(×|✕|✖|x|close|close dialog|close modal|dismiss|no,? thanks|not now|maybe later|skip|accept|accept all|allow all|agree|got it|i understand|ok|okay|tutup|nanti saja|tidak,? terima kasih|setuju|terima semua)$/i;
      const overlayish = (e) => {
        for (let x = e; x && x !== document.body; x = x.parentElement) {
          const cs = getComputedStyle(x);
          if (['fixed', 'sticky'].includes(cs.position) || x.getAttribute('role') === 'dialog' || x.getAttribute('aria-modal') === 'true') return true;
          if (/modal|popup|pop-up|overlay|cookie|consent|klaviyo|newsletter|signup-form/i.test(String(x.className) + ' ' + x.id)) return true;
        }
        return false;
      };
      for (const b of document.querySelectorAll('button, a, [role="button"]')) {
        const r = b.getBoundingClientRect();
        if (!r.width || !r.height || r.bottom < 0 || r.top > innerHeight || getComputedStyle(b).visibility === 'hidden') continue;
        if (b.__ddDismissed) continue;
        const label = ((b.getAttribute('aria-label') || '') + ' ' + (b.innerText || '')).trim().replace(/[\s→›>»]+$/u, '').trim();
        if ((close.test(label) || /^close\b/i.test(b.getAttribute('aria-label') || '')) && overlayish(b)) {
          b.__ddDismissed = true;
          return b;
        }
      }
      return null;
    });
    const el = handle.asElement();
    if (!el) break;
    const label = await el.evaluate((b) => ((b.getAttribute('aria-label') || '') + ' ' + (b.innerText || '')).trim().slice(0, 40)).catch(() => '?');
    await el.click({ timeout: 2000 }).catch(() => el.evaluate((b) => b.click()).catch(() => {}));
    clicked.push(label);
    await page.waitForTimeout(500);
  }
  return clicked;
}
