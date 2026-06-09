import { createDeckController } from './deck/create-deck';
import { initIcons } from './dom/icons';
import { dismissLoader } from './dom/loader';
import { preloadBookletAssets } from './dom/preload';
import { renumberSlides } from './dom/renumber-slides';
import { createExportController } from './export';
import { isExportEnabled } from './lib/export-enabled';
import type { Disposer } from './lib/dispose';
import { validateBookletConfig, type InvalidConfigReason } from './lib/validate-config';
import { createWifiController } from './wifi';

export type BookletInitFailureReason =
  | 'missing-config'
  | 'invalid-config'
  | 'missing-deck'
  | 'no-slides';

export type BookletInitResult =
  | { ok: true; destroy: Disposer }
  | { ok: false; reason: BookletInitFailureReason; detail?: InvalidConfigReason };

/**
 * Boot order:
 * 1. Validate config and prepare DOM (icons, slide numbering)
 * 2. Wire layout-driven controllers (deck → wifi via onLayoutChange)
 * 3. Optional features (export)
 * 4. UX polish (loader dismiss)
 */
export function initBooklet(doc: Document = document, win: Window = window): BookletInitResult {
  const rawConfig = win.BOOKLET;
  if (!rawConfig) return { ok: false, reason: 'missing-config' };

  const validated = validateBookletConfig(rawConfig);
  if (!validated.ok) return { ok: false, reason: 'invalid-config', detail: validated.reason };
  const config = validated.config;

  initIcons(win);
  renumberSlides(doc, doc);

  const exportActive = isExportEnabled(config, win.location);
  doc.body.classList.toggle('is-export', exportActive);

  const deckEl = doc.getElementById('deck');
  if (!deckEl) return { ok: false, reason: 'missing-deck' };

  const wraps = Array.from(doc.querySelectorAll('.slidewrap')) as HTMLElement[];
  if (!wraps.length) return { ok: false, reason: 'no-slides' };

  const disposers: Disposer[] = [];

  const wifi = createWifiController(config, doc, win);
  disposers.push(wifi.destroy);

  const deck = createDeckController({
    deck: deckEl,
    wraps,
    config,
    doc,
    win,
    onLayoutChange: wifi.updateUI,
  });
  disposers.push(deck.destroy);

  if (exportActive) {
    const exportCtrl = createExportController(config, doc, win);
    if (exportCtrl) disposers.push(exportCtrl.destroy);
  }

  const loader = doc.getElementById('bookletLoader');
  if (loader) {
    // Hold the loader until every booklet image is fetched and decoded, so
    // flipping pages never reveals an undecoded bitmap (the source of the
    // end-of-flip flash on phones). Decoding is throttled to avoid the
    // memory spike that crashes mobile Safari.
    disposers.push(
      dismissLoader(loader, doc, {
        win,
        ready: preloadBookletAssets(deckEl, doc, win),
      })
    );
  }

  return {
    ok: true,
    destroy: () => {
      while (disposers.length) disposers.pop()!();
    },
  };
}
