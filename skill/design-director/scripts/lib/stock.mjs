// Maps the answers of the keyed stock-photo APIs to the record photos.mjs uses, so the mapping can
// be tested without a key (selftest). Pexels: api.pexels.com/v1/search, header "Authorization: <key>".
// Pixabay: pixabay.com/api/?key=…; its terms forbid permanent hotlinking, so pictures are downloaded.
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

export function mapPexels(json) {
  return ((json && json.photos) || []).map((p) => ({
    ref: `pexels:${p.id}`,
    title: strip(p.alt),
    creator: strip(p.photographer) || 'unknown',
    creatorUrl: p.photographer_url || '',
    license: 'Pexels License',
    source: p.url,
    thumb: (p.src && (p.src.medium || p.src.small)) || '',
    full: (p.src && (p.src.large2x || p.src.original)) || '',
    size: p.width ? `${p.width}×${p.height}` : '',
  })).filter((x) => x.full);
}

export function mapPixabay(json) {
  return ((json && json.hits) || []).map((p) => ({
    ref: `pixabay:${p.id}`,
    title: strip(p.tags),
    creator: strip(p.user) || 'unknown',
    creatorUrl: p.user_id ? `https://pixabay.com/users/${encodeURIComponent(p.user)}-${p.user_id}/` : '',
    license: 'Pixabay Content License',
    source: p.pageURL,
    thumb: p.webformatURL || p.previewURL || '',
    full: p.largeImageURL || p.webformatURL || '',
    size: p.imageWidth ? `${p.imageWidth}×${p.imageHeight}` : '',
  })).filter((x) => x.full);
}

// The credit line per provider (shown in the footer by `photos.mjs credits --html`).
export function creditLine(item) {
  const who = strip(item.creator);
  if (item.ref.startsWith('unsplash:')) return `Photo by ${who} on Unsplash`;
  if (item.ref.startsWith('pexels:')) return `Photo by ${who} on Pexels`;
  if (item.ref.startsWith('pixabay:')) return `Image by ${who} from Pixabay`;
  return `${strip(item.title) || 'Photo'} by ${who}, ${item.license}`;
}

// Which search providers run when none is named: keyed ones first (better pictures), then the open ones.
export function defaultProviders(env) {
  const keyed = [];
  if (env.UNSPLASH_ACCESS_KEY) keyed.push('unsplash');
  if (env.PEXELS_API_KEY) keyed.push('pexels');
  if (env.PIXABAY_API_KEY) keyed.push('pixabay');
  return [...keyed, 'openverse', 'commons'];
}

// A keyless Pollinations picture: the address, and how long to wait when the free limit answers.
export function generateUrl(prompt, { width = 1024, height = 768, seed = 1 } = {}) {
  const u = new URL(`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`);
  u.search = new URLSearchParams({ width: String(width), height: String(height), seed: String(seed) });
  return u.toString();
}
export function retryAfterSeconds(status, headerValue, body) {
  if (status !== 402 && status !== 429) return 0;
  const h = Number(headerValue);
  if (h > 0) return Math.min(120, Math.ceil(h));
  const m = /retry after (\d+)\s*s/i.exec(String(body || ''));
  return m ? Math.min(120, Number(m[1]) + 1) : 46;
}
