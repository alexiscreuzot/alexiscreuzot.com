import type { BookletRuntimeConfig } from './types';

declare global {
  interface Window {
    BOOKLET: BookletRuntimeConfig;
    lucide?: { createIcons: () => void };
    updateWifiUI?: () => void;
    htmlToImage?: { toPng: (node: Element, opts: Record<string, unknown>) => Promise<string> };
    JSZip?: new () => {
      file: (name: string, data: string, opts: { base64: boolean }) => void;
      generateAsync: (opts: { type: string }) => Promise<Blob>;
    };
  }
}

const EXPORT_LIBS = [
  'https://unpkg.com/html-to-image@1.11.13/dist/html-to-image.js',
  'https://unpkg.com/jszip@3.10.1/dist/jszip.min.js',
];

function isLocalHost(): boolean {
  const h = location.hostname;
  return (
    location.protocol === 'file:' ||
    h === 'localhost' ||
    h === '127.0.0.1' ||
    h === '0.0.0.0' ||
    h === '::1' ||
    /\.local$/.test(h) ||
    /^192\.168\./.test(h) ||
    /^10\./.test(h)
  );
}

export function initBooklet(): void {
  const BOOKLET = window.BOOKLET;
  if (!BOOKLET) return;

  if (window.lucide) window.lucide.createIcons();

  const IS_LOCAL = isLocalHost();
  document.body.classList.toggle('is-export', IS_LOCAL);

  (function renumberSlides() {
    const slides = document.querySelectorAll('.slide');
    slides.forEach((s, i) => {
      const pad = (i + 1 < 10 ? '0' : '') + (i + 1);
      const slug = (s.getAttribute('data-name') || 'slide').replace(/^\d+-/, '');
      s.setAttribute('data-name', pad + '-' + slug);
      const foot = s.querySelector('.pagefoot span:last-child');
      if (foot) foot.textContent = pad;
      const wrap = s.closest('.slidewrap');
      if (wrap) {
        let plate = wrap.querySelector('.plate');
        if (!plate) {
          plate = document.createElement('div');
          plate.className = 'plate';
          wrap.appendChild(plate);
        }
        plate.textContent = 'Page ' + pad;
      }
    });
  })();

  function isMobile(): boolean {
    const coarse =
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) ||
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0;
    const narrow = window.matchMedia && window.matchMedia('(max-width: 820px)').matches;
    return !!(narrow || (coarse && Math.min(window.innerWidth, window.innerHeight) < 820));
  }

  const deck = document.getElementById('deck');
  if (!deck) return;

  const wraps = Array.prototype.slice.call(document.querySelectorAll('.slidewrap')) as HTMLElement[];
  const total = wraps.length;

  const STORE_VIEW = BOOKLET.storagePrefix + '.view';
  const STORE_PAGE = BOOKLET.storagePrefix + '.page';
  function storeGet(k: string) {
    try {
      return window.localStorage.getItem(k);
    } catch {
      return null;
    }
  }
  function storeSet(k: string, v: string) {
    try {
      window.localStorage.setItem(k, v);
    } catch {
      /* ignore */
    }
  }

  const counterEl = document.querySelector('.m-counter');
  const progressEl = document.querySelector('.m-progress') as HTMLElement | null;
  const hintEl = document.querySelector('.m-hint') as HTMLElement | null;
  const cueEl = document.querySelector('.m-scrollcue');

  const SPRING = 'transform .6s cubic-bezier(.36,0,.3,1)';
  const FLIP_FWD = SPRING;
  const FLIP_BACK = 'transform .45s cubic-bezier(.22,.61,.36,1)';

  let mobileActive = false;
  let readerActive = false;
  let cur = (function () {
    const saved = parseInt(storeGet(STORE_PAGE) || '', 10);
    return isFinite(saved) && saved >= 0 && saved < total ? saved : 0;
  })();

  function paged() {
    return mobileActive || readerActive;
  }

  function fitDesktop() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    let avail = Math.min(vw - 120, vh - 96 - 120 - 16);
    avail = Math.max(300, Math.min(avail, 760));
    const scale = avail / 1080;
    const disp = Math.round(1080 * scale);
    wraps.forEach((w) => w.style.setProperty('--disp', disp + 'px'));
    document.querySelectorAll('.slide').forEach((s) => {
      (s as HTMLElement).style.setProperty('--scale', String(scale));
    });
  }

  function fitGrid() {
    const vw = window.innerWidth;
    const twoUp = vw >= 1180;
    let avail;
    if (twoUp) {
      const container = Math.min(vw - 48, 1220);
      avail = Math.min((container - 48) / 2, 540);
    } else {
      avail = Math.min(vw - 48, 640);
    }
    const scale = avail / 1080;
    const disp = Math.round(1080 * scale);
    wraps.forEach((w) => w.style.setProperty('--disp', disp + 'px'));
    document.querySelectorAll('.slide').forEach((s) => {
      (s as HTMLElement).style.setProperty('--scale', String(scale));
    });
  }

  function setWrap(w: HTMLElement, angle: number, z: number, hidden: boolean, transition?: string) {
    w.style.transition = transition || 'none';
    w.style.transform = 'rotateY(' + angle + 'deg)';
    w.style.zIndex = String(z);
    w.classList.toggle('pg-hidden', !!hidden);
  }

  function arrange(
    animate: boolean,
    flipIndex?: number,
    flipTransition?: string,
    underIndex?: number,
    keepIndex?: number
  ) {
    const t = animate ? SPRING : 'none';
    const flipping = animate && flipIndex !== undefined;
    wraps.forEach((w, i) => {
      // Leave a freshly-settled page's layer completely untouched. Re-writing
      // the transform/transition on a front-facing, backface-hidden 3D layer
      // makes WebKit (iOS PWA) flash its transparent backface for one frame,
      // exposing the page beneath it.
      if (keepIndex !== undefined && i === keepIndex) return;
      const isFlip = flipping && i === flipIndex;
      const tt = isFlip ? flipTransition || FLIP_FWD : flipping ? 'none' : t;

      // While a page swings open backward, keep the page we're leaving in the
      // reading area beneath it so the gap never exposes an in-between page.
      if (underIndex !== undefined && i === underIndex && i !== flipIndex) {
        setWrap(w, 0, 20, false, tt);
        return;
      }

      if (i < cur) setWrap(w, -180, 40, false, tt);
      else if (i === cur) setWrap(w, 0, 30, false, tt);
      else if (i === cur + 1) setWrap(w, underIndex === undefined ? 0 : -180, 20, underIndex !== undefined, tt);
      else setWrap(w, 0, 1, true, tt);
    });
  }

  function currentSlide() {
    return wraps[cur] ? wraps[cur].querySelector('.slide') : null;
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

  const bookFirst = document.getElementById('bookFirst');
  const bookPrev = document.getElementById('bookPrev');
  const bookNext = document.getElementById('bookNext');
  const bookLast = document.getElementById('bookLast');
  const bookCount = document.getElementById('bookCount');
  const bookThumbsToggle = document.getElementById('bookThumbsToggle');
  const bookThumbs = document.getElementById('bookThumbs');
  let thumbsBuilt = false;

  function updateControls() {
    if (bookCount) bookCount.textContent = cur + 1 + ' / ' + total;
    if (bookFirst) bookFirst.classList.toggle('is-disabled', cur === 0);
    if (bookPrev) bookPrev.classList.toggle('is-disabled', cur === 0);
    if (bookNext) bookNext.classList.toggle('is-disabled', cur === total - 1);
    if (bookLast) bookLast.classList.toggle('is-disabled', cur === total - 1);
    if (bookThumbs) {
      const marks = bookThumbs.querySelectorAll('.thumb');
      marks.forEach((t, i) => t.classList.toggle('is-current', i === cur));
      const active = marks[cur];
      if (active && bookThumbs.classList.contains('is-open')) {
        active.scrollIntoView({ block: 'nearest', inline: 'center' });
      }
    }
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

  function go(n: number) {
    n = Math.max(0, Math.min(total - 1, n));
    if (n === cur) {
      arrange(true);
      return;
    }
    const prev = cur;
    cur = n;
    storeSet(STORE_PAGE, String(cur));
    const s = currentSlide() as HTMLElement | null;
    if (s) s.scrollTop = 0;
    if (n > prev) {
      arrange(true, prev, FLIP_FWD);
    } else {
      arrange(true, n, FLIP_BACK, prev);
      const flip = wraps[n];
      const done = () => {
        flip.removeEventListener('transitionend', done);
        if (cur !== n) return;
        // For a single-step turn the post-flip layout is already the resting
        // state, so we touch nothing. For a multi-page jump we still need to
        // hide the page we left and ready the new neighbour beneath — but we
        // must keep the just-settled page's layer untouched (see arrange's
        // keepIndex note) to avoid the end-of-flip backface flash on iOS.
        if (prev !== n + 1) arrange(false, undefined, undefined, undefined, n);
      };
      flip.addEventListener('transitionend', done);
    }
    updateUI();
  }

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
      setWrap(wraps[cur], Math.max(dx / gvw, -1) * 180, 30, false, 'none');
    } else if (dx > 0 && cur > 0) {
      const t = Math.min(dx / gvw, 1);
      setWrap(wraps[cur - 1], -180 + t * 180, 40, false, 'none');
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
      arrange(true);
    } else if (gAxis === null && dt < 320 && Math.abs(dx) < 8 && Math.abs(dy) < 8) {
      if (readerActive) {
        gAxis = null;
        return;
      }
      const target = gTarget as HTMLElement | null;
      if (target?.closest?.('button, a, input, textarea, select, [data-wifi-copy]')) {
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
    if (gOn) {
      gOn = false;
      gAxis = null;
      arrange(true);
    }
  }

  function setGrabbing(on: boolean) {
    if (readerActive) document.body.classList.toggle('is-grabbing', !!on);
    else document.body.classList.remove('is-grabbing');
  }

  deck.addEventListener(
    'touchstart',
    (e) => {
      const t = e.touches[0];
      gStart(t.clientX, t.clientY);
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
    const interactive =
      e.target &&
      (e.target as HTMLElement).closest?.(
        'button, a, input, textarea, select, [data-wifi-copy]'
      );
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

  let tipEl: HTMLElement | null = null;
  function showThumbTip(thumb: HTMLElement) {
    const text = thumb.getAttribute('data-tip');
    if (!text) return;
    if (!tipEl) {
      tipEl = document.createElement('div');
      tipEl.className = 'book-tip';
      document.body.appendChild(tipEl);
    }
    tipEl.textContent = text;
    tipEl.style.width = 'auto';
    const range = document.createRange();
    range.selectNodeContents(tipEl);
    let lineW = 0;
    for (const rect of Array.from(range.getClientRects())) lineW = Math.max(lineW, rect.width);
    tipEl.style.width = Math.ceil(lineW) + 1 + 'px';
    const r = thumb.getBoundingClientRect();
    tipEl.style.right = window.innerWidth - (r.left - 12) + 'px';
    tipEl.style.left = 'auto';
    tipEl.style.top = r.top + r.height / 2 + 'px';
    tipEl.classList.add('show');
  }
  function hideThumbTip() {
    tipEl?.classList.remove('show');
  }

  const FADE = 28;
  function updateThumbFades() {
    if (!bookThumbs) return;
    const max = bookThumbs.scrollHeight - bookThumbs.clientHeight;
    const top = max > 1 && bookThumbs.scrollTop > 1 ? FADE : 0;
    const bottom = max > 1 && bookThumbs.scrollTop < max - 1 ? FADE : 0;
    bookThumbs.style.setProperty('--fade-top', top + 'px');
    bookThumbs.style.setProperty('--fade-bottom', bottom + 'px');
  }

  function buildThumbs() {
    if (thumbsBuilt || !bookThumbs) return;
    thumbsBuilt = true;
    wraps.forEach((w, i) => {
      const slide = w.querySelector('.slide');
      const titleEl = slide?.querySelector('.title, .display');
      const title = (titleEl?.textContent || '').replace(/\s+/g, ' ').trim();
      const tip = title || 'Page ' + (i + 1);
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'thumb';
      btn.setAttribute('aria-label', 'Go to page ' + (i + 1) + (title ? ' — ' + title : ''));
      btn.setAttribute('data-tip', tip);
      if (slide) {
        const clip = document.createElement('span');
        clip.className = 'thumb-clip';
        const mini = slide.cloneNode(true) as HTMLElement;
        mini.removeAttribute('id');
        clip.appendChild(mini);
        btn.appendChild(clip);
      }
      const num = document.createElement('span');
      num.className = 'tnum';
      num.textContent = String(i + 1);
      btn.appendChild(num);
      btn.addEventListener('click', () => {
        go(i);
        hideThumbTip();
        bookThumbs.classList.remove('is-open');
        bookThumbsToggle?.classList.remove('is-active');
      });
      btn.addEventListener('mouseenter', () => showThumbTip(btn));
      btn.addEventListener('focus', () => showThumbTip(btn));
      btn.addEventListener('mouseleave', hideThumbTip);
      btn.addEventListener('blur', hideThumbTip);
      bookThumbs.appendChild(btn);
    });
    bookThumbs.addEventListener('scroll', () => {
      updateThumbFades();
      hideThumbTip();
    }, { passive: true });
  }

  bookFirst?.addEventListener('click', () => go(0));
  bookPrev?.addEventListener('click', () => go(cur - 1));
  bookNext?.addEventListener('click', () => go(cur + 1));
  bookLast?.addEventListener('click', () => go(total - 1));
  bookThumbsToggle?.addEventListener('click', () => {
    if (!thumbsBuilt) buildThumbs();
    const open = bookThumbs?.classList.toggle('is-open');
    bookThumbsToggle.classList.toggle('is-active', !!open);
    if (open) {
      updateControls();
      requestAnimationFrame(updateThumbFades);
    } else {
      hideThumbTip();
    }
  });

  const segRead = document.getElementById('segRead');
  const segGrid = document.getElementById('segGrid');

  function setView(grid: boolean) {
    storeSet(STORE_VIEW, grid ? 'grid' : 'read');
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

  segRead?.addEventListener('click', () => setView(false));
  segGrid?.addEventListener('click', () => setView(true));

  function readerWanted() {
    return !document.body.classList.contains('prefers-grid');
  }

  function applyLayout() {
    const mobile = isMobile();
    const reader = !mobile && readerWanted();

    mobileActive = mobile;
    readerActive = reader;
    document.body.classList.toggle('is-mobile', mobile);
    document.body.classList.toggle('is-reader', reader);

    if (paged()) {
      cur = Math.max(0, Math.min(cur, total - 1));
      if (reader) fitDesktop();
      arrange(false);
      updateUI();
    } else {
      bookThumbs?.classList.remove('is-open');
      bookThumbsToggle?.classList.remove('is-active');
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
      document.body.classList.remove('pg-dark', 'pg-bare');
      fitGrid();
    }
    window.updateWifiUI?.();
  }

  setView(storeGet(STORE_VIEW) === 'grid');
  window.addEventListener('resize', applyLayout);
  window.addEventListener('orientationchange', () => setTimeout(applyLayout, 80));

  initWifi(BOOKLET);
  if (IS_LOCAL) initExport(BOOKLET, EXPORT_LIBS);

  // Minimum 1.5s loader
  const loader = document.getElementById('bookletLoader');
  if (loader) {
    const minWait = new Promise(resolve => setTimeout(resolve, 1500));
    const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve();
    Promise.all([minWait, fontsReady]).then(() => {
      loader.classList.add('is-hidden');
      setTimeout(() => loader.remove(), 600);
    });
  }
}

function initWifi(BOOKLET: BookletRuntimeConfig): void {
  const WIFI = BOOKLET.wifi;
  const S = BOOKLET.strings;
  const toast = document.getElementById('wifiToast');
  const connectBtn = document.getElementById('wifiConnect');
  const connectTxt = connectBtn?.querySelector('.wifi-connect-txt');
  const mobileHint = document.getElementById('wifiMobileHint');

  function escapeWifiField(s: string) {
    return String(s).replace(/([\\;,"])/g, '\\$1');
  }
  function wifiUri() {
    return (
      'WIFI:T:' +
      WIFI.type +
      ';S:' +
      escapeWifiField(WIFI.ssid) +
      ';P:' +
      escapeWifiField(WIFI.pass) +
      ';H:false;;'
    );
  }
  function isIOS() {
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  }
  function isAndroid() {
    return /Android/i.test(navigator.userAgent);
  }
  let toastTimer: ReturnType<typeof setTimeout>;
  function showToast(msg: string, ms = 3800) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
  }
  let chipTimer: ReturnType<typeof setTimeout>;
  function flashChip(chip: HTMLElement | null) {
    if (!chip) return;
    chip.classList.add('copied');
    clearTimeout(chipTimer);
    chipTimer = setTimeout(() => chip.classList.remove('copied'), 1200);
  }
  function legacyCopy(text: string, onDone: () => void) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      onDone();
    } catch {
      showToast(S.legacyCopyFallback, 5000);
    }
    ta.remove();
  }
  function copyText(text: string, onDone: () => void, chip?: HTMLElement | null) {
    const done = () => {
      if (chip) flashChip(chip);
      onDone();
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => legacyCopy(text, done));
      return;
    }
    legacyCopy(text, done);
  }
  function copyPassword(chip?: HTMLElement | null) {
    copyText(WIFI.pass, () => showToast(S.passwordCopied), chip);
  }

  function updateWifiUI() {
    const mobile = document.body.classList.contains('is-mobile');
    if (!mobile) {
      if (connectTxt) connectTxt.textContent = S.connect;
      if (mobileHint) mobileHint.textContent = '';
      return;
    }
    if (isAndroid()) {
      if (connectTxt) connectTxt.textContent = S.joinNetwork;
      if (mobileHint) mobileHint.innerHTML = S.androidHint;
    } else if (isIOS()) {
      if (connectTxt) connectTxt.textContent = S.copyPassword;
      if (mobileHint) mobileHint.innerHTML = S.iosHint;
    } else {
      if (connectTxt) connectTxt.textContent = S.copyPassword;
      if (mobileHint) mobileHint.innerHTML = S.defaultHint;
    }
  }

  function isPaged() {
    return (
      document.body.classList.contains('is-mobile') ||
      document.body.classList.contains('is-reader')
    );
  }

  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const chip = target.closest('[data-wifi-copy]') as HTMLElement | null;
    if (chip && isPaged()) {
      const kind = chip.getAttribute('data-wifi-copy');
      if (kind === 'ssid') {
        copyText(WIFI.ssid, () => showToast(S.networkCopied), chip);
      } else {
        copyPassword(chip);
      }
      return;
    }
    const btn = target.closest('.wifi-connect');
    if (!btn || !document.body.classList.contains('is-mobile')) return;
    if (isAndroid()) window.location.href = wifiUri();
    else copyPassword(btn as HTMLElement);
  });

  window.updateWifiUI = updateWifiUI;
  updateWifiUI();
}

function initExport(BOOKLET: BookletRuntimeConfig, exportLibs: string[]): void {
  let exportLibsPromise: Promise<void[]> | null = null;

  function loadScript(src: string) {
    return new Promise<void>((resolve, reject) => {
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error('Failed to load ' + src));
      document.head.appendChild(s);
    });
  }
  function loadExportLibs() {
    if (!exportLibsPromise) exportLibsPromise = Promise.all(exportLibs.map(loadScript));
    return exportLibsPromise;
  }
  function filenameFor(slide: Element) {
    return (slide.getAttribute('data-name') || 'slide') + '.png';
  }
  function renderSlide(slide: Element) {
    return window.htmlToImage!.toPng(slide, {
      width: 1080,
      height: 1080,
      pixelRatio: 2,
      cacheBust: true,
      style: { transform: 'none', margin: '0', boxShadow: 'none' },
    });
  }
  function downloadDataUrl(dataUrl: string, name: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  const downloadAllBtn = document.getElementById('downloadAll');
  downloadAllBtn?.addEventListener('click', async function (this: HTMLButtonElement) {
    const btn = this;
    btn.disabled = true;
    const label = btn.querySelector('span');
    const original = label?.textContent || '';
    try {
      if (label) label.textContent = 'Loading…';
      await loadExportLibs();
      await document.fonts.ready;
      const zip = new window.JSZip!();
      const slides = Array.prototype.slice.call(document.querySelectorAll('.slide'));
      for (let i = 0; i < slides.length; i++) {
        if (label) label.textContent = 'Rendering ' + (i + 1) + '/' + slides.length;
        await renderSlide(slides[i]);
        const dataUrl = await renderSlide(slides[i]);
        zip.file(filenameFor(slides[i]), dataUrl.split(',')[1], { base64: true });
      }
      if (label) label.textContent = 'Zipping…';
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      downloadDataUrl(url, BOOKLET.storagePrefix + '-slides.zip');
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      console.error(e);
      alert('Export failed — make sure you opened this over a local server.');
    } finally {
      btn.disabled = false;
      if (label) label.textContent = original;
    }
  });
}
