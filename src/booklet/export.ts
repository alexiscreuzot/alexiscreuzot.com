import type { BookletRuntimeConfig } from './types';
import { bindEvent, createDisposeBag, type Disposer } from './lib/dispose';

export interface ExportController {
  destroy: Disposer;
}

function loadScript(doc: Document, src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = doc.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    doc.head.appendChild(s);
  });
}

function filenameFor(slide: Element): string {
  return (slide.getAttribute('data-name') || 'slide') + '.png';
}

function renderSlide(slide: Element, win: Window): Promise<string> {
  return win.htmlToImage!.toPng(slide, {
    width: 1080,
    height: 1080,
    pixelRatio: 2,
    cacheBust: true,
    style: { transform: 'none', margin: '0', boxShadow: 'none' },
  });
}

function downloadBlob(doc: Document, url: string, name: string): void {
  const a = doc.createElement('a');
  a.href = url;
  a.download = name;
  doc.body.appendChild(a);
  a.click();
  a.remove();
}

export function createExportController(
  config: BookletRuntimeConfig,
  doc: Document,
  win: Window
): ExportController | null {
  const downloadAllBtn = doc.getElementById('downloadAll');
  if (!downloadAllBtn) return null;

  const dispose = createDisposeBag();
  let exportLibsPromise: Promise<void[]> | null = null;

  function loadExportLibs() {
    if (!exportLibsPromise) {
      exportLibsPromise = Promise.all(config.exportLibs.map((src) => loadScript(doc, src)));
    }
    return exportLibsPromise;
  }

  const onDownload = async function (this: HTMLButtonElement) {
    const btn = this;
    btn.disabled = true;
    const label = btn.querySelector('span');
    const original = label?.textContent || '';
    try {
      if (label) label.textContent = 'Loading…';
      await loadExportLibs();
      await doc.fonts.ready;
      const zip = new win.JSZip!();
      const slides = Array.from(doc.querySelectorAll('.slide'));
      for (let i = 0; i < slides.length; i++) {
        if (label) label.textContent = 'Rendering ' + (i + 1) + '/' + slides.length;
        const dataUrl = await renderSlide(slides[i], win);
        zip.file(filenameFor(slides[i]), dataUrl.split(',')[1], { base64: true });
      }
      if (label) label.textContent = 'Zipping…';
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      downloadBlob(doc, url, config.storagePrefix + '-slides.zip');
      win.setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) {
      console.error(e);
      win.alert('Export failed — make sure you opened this over a local server.');
    } finally {
      btn.disabled = false;
      if (label) label.textContent = original;
    }
  };

  bindEvent(downloadAllBtn, 'click', onDownload, undefined, dispose);

  return { destroy: () => dispose.run() };
}
