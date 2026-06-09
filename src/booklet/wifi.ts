import type { BookletRuntimeConfig } from './types';
import { bindEvent, createDisposeBag, type Disposer } from './lib/dispose';
import { isAndroid, isIOS } from './lib/env';

export interface WifiController {
  updateUI: () => void;
  destroy: Disposer;
}

export function createWifiController(
  config: BookletRuntimeConfig,
  doc: Document,
  win: Window
): WifiController {
  const { wifi: WIFI, strings: S } = config;
  const dispose = createDisposeBag();
  const toast = doc.getElementById('wifiToast');
  const connectBtn = doc.getElementById('wifiConnect');
  const connectTxt = connectBtn?.querySelector('.wifi-connect-txt');
  const mobileHint = doc.getElementById('wifiMobileHint');

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

  let toastTimer: ReturnType<typeof setTimeout> | undefined;

  function showToast(msg: string, ms = 3800) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    if (toastTimer !== undefined) clearTimeout(toastTimer);
    toastTimer = win.setTimeout(() => toast.classList.remove('show'), ms);
  }

  function legacyCopy(text: string, onDone: () => void) {
    const ta = doc.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    doc.body.appendChild(ta);
    ta.select();
    try {
      // `execCommand` is deprecated but remains the only clipboard path on
      // older WebKit; reach it through a local type so the deprecation lint
      // doesn't flag this intentional fallback.
      (doc as unknown as { execCommand(commandId: string): boolean }).execCommand('copy');
      onDone();
    } catch {
      showToast(S.legacyCopyFallback, 5000);
    }
    ta.remove();
  }

  function copyText(text: string, onDone: () => void) {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(onDone).catch(() => legacyCopy(text, onDone));
      return;
    }
    legacyCopy(text, onDone);
  }

  function copyPassword() {
    copyText(WIFI.pass, () => showToast(S.passwordCopied));
  }

  function updateUI() {
    const mobile = doc.body.classList.contains('is-mobile');
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

  bindEvent(
    doc,
    'click',
    (e) => {
      const btn = (e.target as HTMLElement).closest('.wifi-connect');
      if (!btn || !doc.body.classList.contains('is-mobile')) return;
      e.stopPropagation();
      if (isAndroid()) win.location.href = wifiUri();
      else copyPassword();
    },
    undefined,
    dispose
  );

  updateUI();
  return {
    updateUI,
    destroy: () => {
      if (toastTimer !== undefined) clearTimeout(toastTimer);
      dispose.run();
    },
  };
}
