export type Disposer = () => void;

export interface DisposeBag {
  add: (fn: Disposer) => void;
  run: () => void;
}

export function createDisposeBag(): DisposeBag {
  const fns: Disposer[] = [];
  return {
    add(fn) {
      fns.push(fn);
    },
    run() {
      while (fns.length) fns.pop()!();
    },
  };
}

export function bindEvent(
  target: EventTarget,
  type: string,
  listener: EventListenerOrEventListenerObject,
  options?: boolean | AddEventListenerOptions,
  bag?: DisposeBag
): Disposer {
  target.addEventListener(type, listener, options);
  const off = () => target.removeEventListener(type, listener, options);
  bag?.add(off);
  return off;
}
