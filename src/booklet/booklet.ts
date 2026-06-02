import { createDeckController } from './deck/create-deck';
import { dismissLoader } from './dom/loader';
import { renumberSlides } from './dom/renumber-slides';
import { initExport } from './export';
import { isLocalHost } from './lib/env';
import { createWifiController } from './wifi';

export function initBooklet(): void {
  const config = window.BOOKLET;
  if (!config) return;

  if (window.lucide) window.lucide.createIcons();

  renumberSlides();
  document.body.classList.toggle('is-export', isLocalHost(window.location));

  const deck = document.getElementById('deck');
  if (!deck) return;

  const wraps = Array.from(document.querySelectorAll('.slidewrap')) as HTMLElement[];
  if (!wraps.length) return;

  const wifi = createWifiController(config);
  createDeckController({
    deck,
    wraps,
    storagePrefix: config.storagePrefix,
    onLayoutChange: wifi.updateUI,
  });

  if (isLocalHost(window.location)) initExport(config);

  const loader = document.getElementById('bookletLoader');
  if (loader) dismissLoader(loader);
}
