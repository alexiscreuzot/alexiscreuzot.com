import type { Disposer } from '../lib/dispose';

const MIN_VISIBLE_MS = 1500;
const FADE_OUT_MS = 600;

export function dismissLoader(loader: HTMLElement, doc: Document): Disposer {
  let minTimer: ReturnType<typeof setTimeout> | undefined;
  let fadeTimer: ReturnType<typeof setTimeout> | undefined;
  let cancelled = false;

  const minWait = new Promise<void>((resolve) => {
    minTimer = setTimeout(resolve, MIN_VISIBLE_MS);
  });
  const fontsReady = doc.fonts ? doc.fonts.ready : Promise.resolve();

  Promise.all([minWait, fontsReady]).then(() => {
    if (cancelled) return;
    loader.classList.add('is-hidden');
    fadeTimer = setTimeout(() => loader.remove(), FADE_OUT_MS);
  });

  return () => {
    cancelled = true;
    if (minTimer !== undefined) clearTimeout(minTimer);
    if (fadeTimer !== undefined) clearTimeout(fadeTimer);
  };
}
