import type { BookletRuntimeConfig } from './types';
import { isAndroid, isIOS } from './lib/env';

export interface WifiController {
  updateUI: () => void;
}

export function createWifiController(config: BookletRuntimeConfig): WifiController {
  const { wifi: WIFI, strings: S } = config;
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

  let toastTimer: ReturnType<typeof setTimeout>;

  function showToast(msg: string, ms = 3800) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), ms);
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

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('.wifi-connect');
    if (!btn || !document.body.classList.contains('is-mobile')) return;
    e.stopPropagation();
    if (isAndroid()) window.location.href = wifiUri();
    else copyPassword();
  });

  updateUI();
  return { updateUI };
}
