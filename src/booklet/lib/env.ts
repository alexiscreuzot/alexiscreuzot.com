export function isLocalHost(location: Location): boolean {
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

export function isMobile(window: Window): boolean {
  const coarse =
    (window.matchMedia?.('(pointer: coarse)').matches) ||
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0;
  const narrow = window.matchMedia?.('(max-width: 820px)').matches;
  return !!(narrow || (coarse && Math.min(window.innerWidth, window.innerHeight) < 820));
}

export function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

export function isAndroid(): boolean {
  return /Android/i.test(navigator.userAgent);
}
