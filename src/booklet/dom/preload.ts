/**
 * Preloads every image used by the booklet (both <img> elements and CSS
 * background-image urls) and waits until they are fully decoded, so that
 * flipping pages never hits an undecoded bitmap (which flashes white on
 * mobile WebKit). Capped by a timeout so a broken asset can't hold the
 * loader hostage forever.
 */

const PRELOAD_TIMEOUT_MS = 12000;

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
    const img = doc.createElement('img');
    const done = () => resolve();
    // decode() waits for both fetch and decode; fall back to load events
    // for browsers/edge cases where it rejects (e.g. detached documents).
    img.onload = () => {
      if (typeof img.decode === 'function') img.decode().then(done, done);
      else done();
    };
    img.onerror = done;
    img.src = url;
  });
}

export function preloadBookletAssets(
  root: ParentNode,
  doc: Document,
  win: Window,
  timeoutMs = PRELOAD_TIMEOUT_MS
): Promise<void> {
  const urls = collectImageUrls(root);
  if (!urls.length) return Promise.resolve();

  const all = Promise.all(urls.map((u) => decodeImage(u, doc))).then(() => undefined);
  const cap = new Promise<void>((resolve) => {
    win.setTimeout(resolve, timeoutMs);
  });
  return Promise.race([all, cap]);
}
