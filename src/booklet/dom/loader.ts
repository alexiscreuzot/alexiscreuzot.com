const MIN_VISIBLE_MS = 1500;
const FADE_OUT_MS = 600;

export function dismissLoader(loader: HTMLElement): void {
  const minWait = new Promise<void>((resolve) => setTimeout(resolve, MIN_VISIBLE_MS));
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
  Promise.all([minWait, fontsReady]).then(() => {
    loader.classList.add('is-hidden');
    setTimeout(() => loader.remove(), FADE_OUT_MS);
  });
}
