import { bindEvent, createDisposeBag, type Disposer } from '../lib/dispose';

const FADE = 28;

export interface ThumbnailRefs {
  bookThumbs: HTMLElement;
  bookThumbsToggle: HTMLElement | null;
}

export interface ThumbnailActions {
  go: (index: number) => void;
  updateControls: () => void;
}

export interface ThumbnailPanel {
  build: () => void;
  updateFades: () => void;
  hideTip: () => void;
  destroy: Disposer;
}

export function createThumbnailPanel(
  wraps: HTMLElement[],
  refs: ThumbnailRefs,
  actions: ThumbnailActions,
  doc: Document,
  win: Window
): ThumbnailPanel {
  const { bookThumbs, bookThumbsToggle } = refs;
  const dispose = createDisposeBag();
  let built = false;
  let tipEl: HTMLElement | null = null;

  function showTip(thumb: HTMLElement) {
    const text = thumb.getAttribute('data-tip');
    if (!text) return;
    if (!tipEl) {
      tipEl = doc.createElement('div');
      tipEl.className = 'book-tip';
      doc.body.appendChild(tipEl);
      dispose.add(() => tipEl?.remove());
    }
    tipEl.textContent = text;
    tipEl.style.width = 'auto';
    const range = doc.createRange();
    range.selectNodeContents(tipEl);
    let lineW = 0;
    for (const rect of Array.from(range.getClientRects())) lineW = Math.max(lineW, rect.width);
    tipEl.style.width = Math.ceil(lineW) + 1 + 'px';
    const r = thumb.getBoundingClientRect();
    tipEl.style.right = win.innerWidth - (r.left - 12) + 'px';
    tipEl.style.left = 'auto';
    tipEl.style.top = r.top + r.height / 2 + 'px';
    tipEl.classList.add('show');
  }

  function hideTip() {
    tipEl?.classList.remove('show');
  }

  function updateFades() {
    const max = bookThumbs.scrollHeight - bookThumbs.clientHeight;
    const top = max > 1 && bookThumbs.scrollTop > 1 ? FADE : 0;
    const bottom = max > 1 && bookThumbs.scrollTop < max - 1 ? FADE : 0;
    bookThumbs.style.setProperty('--fade-top', top + 'px');
    bookThumbs.style.setProperty('--fade-bottom', bottom + 'px');
  }

  const onScroll = () => {
    updateFades();
    hideTip();
  };

  function build() {
    if (built) return;
    built = true;
    wraps.forEach((w, i) => {
      const slide = w.querySelector('.slide');
      const titleEl = slide?.querySelector('.title, .display');
      const title = (titleEl?.textContent || '').replace(/\s+/g, ' ').trim();
      const tip = title || 'Page ' + (i + 1);
      const btn = doc.createElement('button');
      btn.type = 'button';
      btn.className = 'thumb';
      btn.setAttribute('aria-label', 'Go to page ' + (i + 1) + (title ? ' — ' + title : ''));
      btn.setAttribute('data-tip', tip);
      if (slide) {
        const clip = doc.createElement('span');
        clip.className = 'thumb-clip';
        const mini = slide.cloneNode(true) as HTMLElement;
        mini.removeAttribute('id');
        clip.appendChild(mini);
        btn.appendChild(clip);
      }
      const num = doc.createElement('span');
      num.className = 'tnum';
      num.textContent = String(i + 1);
      btn.appendChild(num);

      const onClick = () => {
        actions.go(i);
        hideTip();
        bookThumbs.classList.remove('is-open');
        bookThumbsToggle?.classList.remove('is-active');
      };
      bindEvent(btn, 'click', onClick, undefined, dispose);
      bindEvent(btn, 'mouseenter', () => showTip(btn), undefined, dispose);
      bindEvent(btn, 'focus', () => showTip(btn), undefined, dispose);
      bindEvent(btn, 'mouseleave', hideTip, undefined, dispose);
      bindEvent(btn, 'blur', hideTip, undefined, dispose);
      bookThumbs.appendChild(btn);
    });
    bindEvent(bookThumbs, 'scroll', onScroll, { passive: true }, dispose);
  }

  return {
    build,
    updateFades,
    hideTip,
    destroy: () => dispose.run(),
  };
}

export function syncThumbnailControls(bookThumbs: HTMLElement | null, cur: number): void {
  if (!bookThumbs) return;
  const marks = bookThumbs.querySelectorAll('.thumb');
  marks.forEach((t, i) => t.classList.toggle('is-current', i === cur));
  const active = marks[cur];
  if (active && bookThumbs.classList.contains('is-open')) {
    active.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
}

export function syncBookBarControls(
  cur: number,
  total: number,
  els: {
    bookCount: HTMLElement | null;
    bookFirst: HTMLElement | null;
    bookPrev: HTMLElement | null;
    bookNext: HTMLElement | null;
    bookLast: HTMLElement | null;
  }
): void {
  const { bookCount, bookFirst, bookPrev, bookNext, bookLast } = els;
  if (bookCount) bookCount.textContent = cur + 1 + ' / ' + total;
  if (bookFirst) bookFirst.classList.toggle('is-disabled', cur === 0);
  if (bookPrev) bookPrev.classList.toggle('is-disabled', cur === 0);
  if (bookNext) bookNext.classList.toggle('is-disabled', cur === total - 1);
  if (bookLast) bookLast.classList.toggle('is-disabled', cur === total - 1);
}
