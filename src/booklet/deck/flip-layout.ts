export const FLIP_SPRING = 'transform .6s cubic-bezier(.36,0,.3,1)';
export const FLIP_FWD = FLIP_SPRING;
export const FLIP_BACK = 'transform .45s cubic-bezier(.22,.61,.36,1)';

// Inside a preserve-3d context z-index is ignored — only real 3D depth
// decides stacking. Two coplanar pages (same rotateY, same translateZ) tie,
// and iOS' PWA compositor flickers the loser through for a frame right as a
// backward flip settles. Pushing the covered page a hair back in Z breaks
// the tie so the settled page is unambiguously in front.
export const UNDER_DEPTH = 2;
export const BACK_DRAG_RANGE = 0.6;
export const BACK_BLANK_FRAC = 0.1;

export function setWrapTransform(
  wrap: HTMLElement,
  angle: number,
  z: number,
  hidden: boolean,
  transition?: string,
  depth = 0
): void {
  wrap.style.transition = transition || 'none';
  wrap.style.transform = 'rotateY(' + angle + 'deg) translateZ(' + -depth + 'px)';
  wrap.style.zIndex = String(z);
  wrap.classList.toggle('pg-hidden', hidden);
}

export interface ArrangeOptions {
  wraps: HTMLElement[];
  page: number;
  animate: boolean;
  flipIndex?: number;
  flipTransition?: string;
  underIndex?: number;
  keepIndex?: number;
}

export function arrangePages(opts: ArrangeOptions): void {
  const { wraps, page, animate, flipIndex, flipTransition, underIndex, keepIndex } = opts;
  const t = animate ? FLIP_SPRING : 'none';
  const flipping = animate && flipIndex !== undefined;

  wraps.forEach((w, i) => {
    // Leave a freshly-settled page's layer completely untouched. Re-writing
    // the transform/transition on a front-facing, backface-hidden 3D layer
    // makes WebKit (iOS PWA) flash its transparent backface for one frame,
    // exposing the page beneath it.
    if (keepIndex !== undefined && i === keepIndex) return;
    const isFlip = flipping && i === flipIndex;
    const tt = isFlip ? flipTransition || FLIP_FWD : flipping ? 'none' : t;

    if (isFlip) {
      if (flipTransition === FLIP_BACK) setWrapTransform(w, 0, 30, false, tt);
      else setWrapTransform(w, -180, 40, false, tt);
      return;
    }

    // While a page swings open backward, keep the page we're leaving in the
    // reading area beneath it so the gap never exposes an in-between page.
    if (underIndex !== undefined && i === underIndex && i !== flipIndex) {
      setWrapTransform(w, 0, 20, false, tt, UNDER_DEPTH);
      return;
    }

    if (i < page) setWrapTransform(w, -180, 40, false, tt);
    else if (i === page) setWrapTransform(w, 0, 30, false, tt);
    else if (i === page + 1)
      setWrapTransform(w, underIndex === undefined ? 0 : -180, 20, underIndex !== undefined, tt);
    else setWrapTransform(w, 0, 1, true, tt);
  });
}

export function resetWraps(wraps: HTMLElement[]): void {
  wraps.forEach((w) => {
    w.style.transition = 'none';
    w.style.transform = '';
    w.style.zIndex = '';
    w.classList.remove('pg-hidden');
  });
  void document.body.offsetHeight;
  wraps.forEach((w) => {
    w.style.transition = '';
  });
}
