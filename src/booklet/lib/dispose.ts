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

export function bindEvent<E extends Event = Event>(
  target: EventTarget,
  type: string,
  listener: (event: E) => void,
  options?: boolean | AddEventListenerOptions,
  bag?: DisposeBag
): Disposer {
  const handler = listener as EventListener;
  target.addEventListener(type, handler, options);
  const off = () => target.removeEventListener(type, handler, options);
  bag?.add(off);
  return off;
}
