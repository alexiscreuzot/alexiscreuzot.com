/**
 * Preloads every image used by the booklet (both <img> elements and CSS
 * background-image urls) and waits until they are fully decoded, so that
 * flipping pages never hits an undecoded bitmap (which flashes white on
 * mobile WebKit). Capped by a timeout so a broken asset can't hold the
 * loader hostage forever.
 */

const PRELOAD_TIMEOUT_MS = 12000;
// Decode a couple of images at a time: parallel-decoding the whole book
// spikes memory hard enough to crash Safari on iPhones.
const DECODE_CONCURRENCY = 2;

const URL_RE = /url\((['"]?)(.*?)\1\)/g;

function extractBackgroundUrls(style: string): string[] {
  const urls: string[] = [];
  let m: RegExpExecArray | null;
  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(style))) {
    if (m[2] && !m[2].startsWith('data:')) urls.push(m[2]);
  }
  return urls;
}

export function collectImageUrls(root: ParentNode): string[] {
  const urls = new Set<string>();

  root.querySelectorAll('img').forEach((img) => {
    const src = img.getAttribute('src');
    if (src && !src.startsWith('data:')) urls.add(src);
  });

  root.querySelectorAll('[style*="background"]').forEach((el) => {
    const style = el.getAttribute('style') || '';
    extractBackgroundUrls(style).forEach((u) => urls.add(u));
  });

  return Array.from(urls);
}

function decodeImage(url: string, doc: Document): Promise<void> {
  return new Promise<void>((resolve) => {
    let img: HTMLImageElement | null = doc.createElement('img');
    const done = () => {
      // Drop the reference so the decoded bitmap can be released; the bytes
      // stay in the HTTP/image cache, which is what makes later paints fast.
      if (img) img.src = '';
      img = null;
      resolve();
    };
    // decode() waits for both fetch and decode; fall back to load events
    // for browsers/edge cases where it rejects (e.g. detached documents).
    img.onload = () => {
      if (img && typeof img.decode === 'function') img.decode().then(done, done);
      else done();
    };
    img.onerror = done;
    img.src = url;
  });
}

async function decodeQueue(urls: string[], doc: Document, concurrency: number): Promise<void> {
  let next = 0;
  const worker = async () => {
    while (next < urls.length) {
      const url = urls[next++];
      await decodeImage(url, doc);
    }
  };
  const workers = Array.from({ length: Math.min(concurrency, urls.length) }, worker);
  await Promise.all(workers);
}

export function preloadBookletAssets(
  root: ParentNode,
  doc: Document,
  win: Window,
  timeoutMs = PRELOAD_TIMEOUT_MS
): Promise<void> {
  const urls = collectImageUrls(root);
  if (!urls.length) return Promise.resolve();

  const all = decodeQueue(urls, doc, DECODE_CONCURRENCY);
  const cap = new Promise<void>((resolve) => {
    win.setTimeout(resolve, timeoutMs);
  });
  return Promise.race([all, cap]);
}
