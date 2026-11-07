// Photo links the user pastes from unsplash.com (rules/brief-interview.md → Materials, path a):
// what the link is, where its image comes from, and the credit it allows. Used by photos.mjs.
//
//   images.unsplash.com/photo-…       the image itself: loads without a key; photographer unknown
//   unsplash.com/photos/<slug>-<id>    the photo's page: the id gives full credit with a key (API);
//                                      without one the user pastes the image link instead (no scraping)
//   plus.unsplash.com/…                Unsplash+ (paid licence): refused

const PAGE_DIR = /^(photos|photo|fotos|foto)$/i;
const ID = /^[A-Za-z0-9_-]{6,}$/;

// → { kind: 'image', key, imageUrl } | { kind: 'page', id, pageUrl } | { kind: 'plus' } | null
export function parseUnsplashLink(raw) {
  let u;
  try {
    u = new URL(String(raw).trim());
  } catch {
    return null;
  }
  const host = u.hostname.toLowerCase();
  if (host === 'plus.unsplash.com') return { kind: 'plus' };
  if (host === 'images.unsplash.com') {
    const key = u.pathname.replace(/^\/+|\/+$/g, '');
    if (!key || key.includes('/')) return null;
    return { kind: 'image', key, imageUrl: `https://images.unsplash.com/${key}` };
  }
  if (host !== 'unsplash.com' && host !== 'www.unsplash.com') return null;
  const parts = u.pathname.split('/').filter(Boolean);
  const at = parts.findIndex((p) => PAGE_DIR.test(p));
  if (at < 0 || !parts[at + 1]) return null;
  const seg = parts[at + 1];
  // New pages are "<words>-<11-character id>"; old ones are the id alone.
  const id = seg.length > 11 && seg[seg.length - 12] === '-' ? seg.slice(-11) : seg;
  if (!ID.test(id)) return null;
  return { kind: 'page', id, pageUrl: `https://unsplash.com/photos/${id}` };
}

// The sized download address of an images.unsplash.com image.
export const sizedImageUrl = (imageUrl, width = 1600) => `${imageUrl}?w=${Number(width) || 1600}&q=80&fm=jpg&fit=max`;

// The credits.json record for a pasted link. Without a photographer it says so, with how to fix it.
export function linkCredit({ ref, file, imageUrl, pageUrl = '', creator = '', creatorUrl = '', title = '' }) {
  const known = !!String(creator).trim();
  const rec = {
    ref,
    file,
    title,
    creator: known ? creator.trim() : 'unknown',
    creatorUrl,
    license: 'Unsplash License',
    source: pageUrl || imageUrl,
    image: imageUrl,
    via: 'pasted link',
    creatorKnown: known,
    credit: known ? `Photo by ${creator.trim()} on Unsplash` : 'Photo on Unsplash (photographer unknown)',
  };
  if (!known)
    rec.note = 'Photographer unknown: the link holds only the image. Open the photo on unsplash.com, then run get again with --by "<name>" --page <photo page link>, or ask the user for the page link.';
  return rec;
}
