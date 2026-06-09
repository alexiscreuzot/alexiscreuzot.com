import type { Disposer } from '../lib/dispose';

const MIN_VISIBLE_MS = 1500;
const FADE_OUT_MS = 600;

export interface DismissLoaderOptions {
  /** Resolves once the booklet is fully preloaded (images decoded, layers warm). */
  ready?: Promise<void>;
  win?: Window;
  /** Called right before the fade-out starts, while the loader is still opaque. */
  onBeforeFade?: () => void;
}

export function dismissLoader(
  loader: HTMLElement,
  doc: Document,
  opts: DismissLoaderOptions = {}
): Disposer {
  const win = opts.win || window;
  let minTimer: ReturnType<typeof setTimeout> | undefined;
  let fadeTimer: ReturnType<typeof setTimeout> | undefined;
  let warmRaf: number | undefined;
  let cancelled = false;

  const minWait = new Promise<void>((resolve) => {
    minTimer = setTimeout(resolve, MIN_VISIBLE_MS);
  });
  const fontsReady = doc.fonts ? doc.fonts.ready : Promise.resolve();
  const assetsReady = opts.ready || Promise.resolve();

  Promise.all([minWait, fontsReady, assetsReady]).then(() => {
    if (cancelled) return;
    opts.onBeforeFade?.();
    // Give the compositor two frames to rasterize the freshly revealed page
    // stack behind the (still opaque) loader before fading it out.
    warmRaf = win.requestAnimationFrame(() => {
      warmRaf = win.requestAnimationFrame(() => {
        if (cancelled) return;
        loader.classList.add('is-hidden');
        fadeTimer = setTimeout(() => loader.remove(), FADE_OUT_MS);
      });
    });
  });

  return () => {
    cancelled = true;
    if (minTimer !== undefined) clearTimeout(minTimer);
    if (fadeTimer !== undefined) clearTimeout(fadeTimer);
    if (warmRaf !== undefined) win.cancelAnimationFrame(warmRaf);
  };
}
