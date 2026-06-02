import { isMobile } from '../lib/env';
import { fitDesktop, fitGrid } from '../layout/fit';
import { storeGet, storeGetInt, storeSet } from '../lib/storage';
import {
  arrangePages,
  BACK_BLANK_FRAC,
  BACK_DRAG_RANGE,
  FLIP_BACK,
  FLIP_FWD,
  resetWraps,
  setWrapTransform,
} from './flip-layout';
import {
  createThumbnailPanel,
  syncBookBarControls,
  syncThumbnailControls,
} from './thumbnails';

export interface DeckControllerOptions {
  deck: HTMLElement;
  wraps: HTMLElement[];
  storagePrefix: string;
  onLayoutChange?: () => void;
}

export interface DeckController {
  applyLayout: () => void;
}

export function createDeckController(opts: DeckControllerOptions): DeckController {
  const { deck, wraps, storagePrefix, onLayoutChange } = opts;
  const total = wraps.length;
  const storage = window.localStorage;
  const storePageKey = storagePrefix + '.page';
  const storeViewKey = storagePrefix + '.view';

  const counterEl = document.querySelector('.m-counter');
  const progressEl = document.querySelector('.m-progress') as HTMLElement | null;
  const hintEl = document.querySelector('.m-hint') as HTMLElement | null;
  const cueEl = document.querySelector('.m-scrollcue');

  const bookFirst = document.getElementById('bookFirst');
  const bookPrev = document.getElementById('bookPrev');
  const bookNext = document.getElementById('bookNext');
  const bookLast = document.getElementById('bookLast');
  const bookCount = document.getElementById('bookCount');
  const bookThumbsToggle = document.getElementById('bookThumbsToggle');
  const bookThumbs = document.getElementById('bookThumbs');
  const segRead = document.getElementById('segRead');
  const segGrid = document.getElementById('segGrid');

  const bookBar = { bookCount, bookFirst, bookPrev, bookNext, bookLast };

  let mobileActive = false;
  let readerActive = false;
  let cur = storeGetInt(storage, storePageKey, 0, total - 1, 0);

  let flipEl: HTMLElement | null = null;
  let flipDone: ((e: TransitionEvent) => void) | null = null;

  function paged() {
    return mobileActive || readerActive;
  }

  function currentSlide() {
    return wraps[cur]?.querySelector('.slide') ?? null;
  }

  function arrange(
    animate: boolean,
    flipIndex?: number,
    flipTransition?: string,
    underIndex?: number,
    keepIndex?: number,
    atCur?: number
  ) {
    arrangePages({
      wraps,
      page: atCur ?? cur,
      animate,
      flipIndex,
      flipTransition,
      underIndex,
      keepIndex,
    });
  }

  function cancelFlip() {
    if (flipEl && flipDone) flipEl.removeEventListener('transitionend', flipDone);
    flipEl = null;
    flipDone = null;
  }

  function clearFlipFwd() {
    deck.classList.remove('is-flip-fwd');
  }

  function attachFlipDone(flip: HTMLElement, onDone: () => void) {
    const done = (e: TransitionEvent) => {
      if (e.target !== flip || e.propertyName !== 'transform') return;
      if (flipEl !== flip) return;
      cancelFlip();
      onDone();
    };
    flipEl = flip;
    flipDone = done;
    flip.addEventListener('transitionend', done);
  }

  function updateScrollCue() {
    if (!cueEl) return;
    if (!mobileActive) {
      cueEl.classList.remove('show');
      return;
    }
    const s = currentSlide() as HTMLElement | null;
    const more = !!s && s.scrollTop + s.clientHeight < s.scrollHeight - 4;
    cueEl.classList.toggle('show', more);
  }

  function updateControls() {
    syncBookBarControls(cur, total, bookBar);
    syncThumbnailControls(bookThumbs, cur);
  }

  function updateUI() {
    if (!paged()) return;
    if (counterEl) counterEl.textContent = cur + 1 + ' / ' + total;
    if (progressEl) progressEl.style.width = ((cur + 1) / total) * 100 + '%';
    document.body.classList.toggle('pg-dark', cur === total - 1);
    document.body.classList.toggle('pg-bare', cur === 0 || cur === total - 1);
    if (hintEl) hintEl.style.display = cur === 0 ? '' : 'none';
    updateControls();
    updateScrollCue();
  }

  function resetSlideScroll() {
    const s = currentSlide() as HTMLElement | null;
    if (s) s.scrollTop = 0;
  }

  function go(n: number) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === cur) {
      arrange(true);
      return;
    }
    const prev = cur;
    cancelFlip();

    if (n === prev + 1) {
      cur = n;
      storeSet(storage, storePageKey, String(cur));
      resetSlideScroll();
      updateUI();
      deck.classList.add('is-flip-fwd');
      arrange(true, prev, FLIP_FWD, undefined, undefined, prev);
      attachFlipDone(wraps[prev], () => {
        clearFlipFwd();
        arrange(false);
      });
      return;
    }

    if (n === prev - 1) {
      cur = n;
      storeSet(storage, storePageKey, String(cur));
      resetSlideScroll();
      updateUI();
      clearFlipFwd();
      arrange(true, n, FLIP_BACK, prev);
      attachFlipDone(wraps[n], () => {
        /* single-step resting layout is already correct */
      });
      return;
    }

    clearFlipFwd();
    cur = n;
    storeSet(storage, storePageKey, String(cur));
    resetSlideScroll();
    if (n > prev) {
      arrange(true, prev, FLIP_FWD);
    } else {
      arrange(true, n, FLIP_BACK, prev);
      attachFlipDone(wraps[n], () => {
        if (cur !== n) return;
        if (prev !== n + 1) arrange(false, undefined, undefined, undefined, n);
      });
    }
    updateUI();
  }

  const thumbs = bookThumbs
    ? createThumbnailPanel(
        wraps,
        { bookThumbs, bookThumbsToggle },
        { go, updateControls }
      )
    : null;

  let gOn = false;
  let gAxis: 'x' | 'y' | null = null;
  let gx0 = 0;
  let gy0 = 0;
  let gt0 = 0;
  let gvw = 0;
  let gTarget: EventTarget | null = null;

  function gStart(x: number, y: number, target?: EventTarget | null) {
    if (!paged()) return;
    gOn = true;
    gAxis = null;
    gx0 = x;
    gy0 = y;
    gt0 = Date.now();
    gTarget = target || null;
    gvw =
      readerActive && wraps[cur]
        ? wraps[cur].getBoundingClientRect().width || window.innerWidth || 1
        : window.innerWidth || 1;
  }

  function gMove(x: number, y: number) {
    if (!gOn) return false;
    const dx = x - gx0;
    const dy = y - gy0;
    if (gAxis === null) {
      if (Math.abs(dx) < 7 && Math.abs(dy) < 7) return false;
      gAxis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
    }
    if (gAxis !== 'x') return false;
    if (dx < 0 && cur < total - 1) {
      deck.classList.add('is-flip-fwd');
      const angle = Math.max(dx / gvw, -1) * 180;
      setWrapTransform(wraps[cur], angle, 40, false, 'none');
      setWrapTransform(wraps[cur + 1], 0, 20, false, 'none');
    } else if (dx > 0 && cur > 0) {
      const lin = Math.min(dx / (gvw * BACK_DRAG_RANGE), 1);
      const eased =
        lin < BACK_BLANK_FRAC
          ? (lin / BACK_BLANK_FRAC) * 0.5
          : 0.5 + ((lin - BACK_BLANK_FRAC) / (1 - BACK_BLANK_FRAC)) * 0.5;
      setWrapTransform(wraps[cur - 1], -180 + eased * 180, 40, false, 'none');
    }
    return true;
  }

  function gEnd(x: number, y: number) {
    if (!gOn) return;
    gOn = false;
    const dx = x - gx0;
    const dy = y - gy0;
    const dt = Date.now() - gt0;
    if (gAxis === 'x') {
      const far = Math.abs(dx) > gvw * 0.22;
      const flick = dt < 260 && Math.abs(dx) > 40;
      gAxis = null;
      if (dx < 0 && (far || flick)) return go(cur + 1);
      if (dx > 0 && (far || flick)) return go(cur - 1);
      clearFlipFwd();
      cancelFlip();
      arrange(true);
    } else if (gAxis === null && dt < 320 && Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      if (readerActive) {
        gAxis = null;
        return;
      }
      const target = gTarget as HTMLElement | null;
      if (target?.closest?.('button, a, input, textarea, select')) {
        gAxis = null;
        return;
      }
      const vw = window.innerWidth || 1;
      if (x > vw * 0.55) go(cur + 1);
      else if (x < vw * 0.45) go(cur - 1);
    }
    gAxis = null;
  }

  function gCancel() {
    if (!gOn) return;
    gOn = false;
    gAxis = null;
    clearFlipFwd();
    cancelFlip();
    arrange(true);
  }

  function setGrabbing(on: boolean) {
    if (readerActive) document.body.classList.toggle('is-grabbing', on);
    else document.body.classList.remove('is-grabbing');
  }

  function readerWanted() {
    return !document.body.classList.contains('prefers-grid');
  }

  function setView(grid: boolean) {
    storeSet(storage, storeViewKey, grid ? 'grid' : 'read');
    document.body.classList.toggle('prefers-grid', grid);
    if (segRead) {
      segRead.classList.toggle('is-active', !grid);
      segRead.setAttribute('aria-selected', String(!grid));
    }
    if (segGrid) {
      segGrid.classList.toggle('is-active', grid);
      segGrid.setAttribute('aria-selected', String(grid));
    }
    applyLayout();
  }

  function applyLayout() {
    const mobile = isMobile(window);
    const reader = !mobile && readerWanted();

    mobileActive = mobile;
    readerActive = reader;
    document.body.classList.toggle('is-mobile', mobile);
    document.body.classList.toggle('is-reader', reader);

    if (paged()) {
      cur = Math.max(0, Math.min(cur, total - 1));
      if (reader) fitDesktop(wraps, { width: window.innerWidth, height: window.innerHeight });
      arrange(false);
      updateUI();
    } else {
      bookThumbs?.classList.remove('is-open');
      bookThumbsToggle?.classList.remove('is-active');
      resetWraps(wraps);
      document.body.classList.remove('pg-dark', 'pg-bare');
      fitGrid(wraps, window.innerWidth);
    }
    onLayoutChange?.();
  }

  deck.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0];
      gStart(t.clientX, t.clientY, e.target);
    },
    { passive: true }
  );
  deck.addEventListener(
    'touchmove',
    (e) => {
      const t = e.touches[0];
      if (gMove(t.clientX, t.clientY)) e.preventDefault();
    },
    { passive: false }
  );
  deck.addEventListener('touchend', (e) => {
    const t = e.changedTouches[0];
    gEnd(t.clientX, t.clientY);
  });
  deck.addEventListener('touchcancel', gCancel);

  deck.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') return;
    const interactive = (e.target as HTMLElement).closest?.('button, a, input, textarea, select');
    if (!interactive) setGrabbing(true);
    gStart(e.clientX, e.clientY, e.target);
  });
  deck.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'touch') gMove(e.clientX, e.clientY);
  });
  deck.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'touch') {
      setGrabbing(false);
      gEnd(e.clientX, e.clientY);
    }
  });
  deck.addEventListener('pointercancel', (e) => {
    if (e.pointerType !== 'touch') {
      setGrabbing(false);
      gCancel();
    }
  });
  deck.addEventListener('dragstart', (e) => e.preventDefault());
  deck.addEventListener('selectstart', (e) => {
    if (paged()) e.preventDefault();
  });

  window.addEventListener('pointerup', (e) => {
    if (e.pointerType !== 'touch') setGrabbing(false);
  });
  window.addEventListener('blur', () => setGrabbing(false));
  deck.addEventListener('scroll', () => updateScrollCue(), true);
  window.addEventListener('load', () => setTimeout(updateScrollCue, 60));

  document.addEventListener('keydown', (e) => {
    if (!paged()) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') go(cur + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(cur - 1);
    else if (e.key === 'Home') {
      go(0);
      e.preventDefault();
    } else if (e.key === 'End') {
      go(total - 1);
      e.preventDefault();
    }
  });

  bookFirst?.addEventListener('click', () => go(0));
  bookPrev?.addEventListener('click', () => go(cur - 1));
  bookNext?.addEventListener('click', () => go(cur + 1));
  bookLast?.addEventListener('click', () => go(total - 1));

  bookThumbsToggle?.addEventListener('click', () => {
    if (!bookThumbs || !thumbs) return;
    thumbs.build();
    const open = bookThumbs.classList.toggle('is-open');
    bookThumbsToggle.classList.toggle('is-active', open);
    if (open) {
      updateControls();
      requestAnimationFrame(thumbs.updateFades);
    } else {
      thumbs.hideTip();
    }
  });

  segRead?.addEventListener('click', () => setView(false));
  segGrid?.addEventListener('click', () => setView(true));

  window.addEventListener('resize', applyLayout);
  window.addEventListener('orientationchange', () => setTimeout(applyLayout, 80));

  setView(storeGet(storage, storeViewKey) === 'grid');

  return { applyLayout };
}
