import type { BookletRuntimeConfig } from './types';

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = src;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load ' + src));
    document.head.appendChild(s);
  });
}

function filenameFor(slide: Element): string {
  return (slide.getAttribute('data-name') || 'slide') + '.png';
}

function renderSlide(slide: Element): Promise<string> {
  return window.htmlToImage!.toPng(slide, {
    width: 1080,
    height: 1080,
    pixelRatio: 2,
    cacheBust: true,
    style: { transform: 'none', margin: '0', boxShadow: 'none' },
  });
}

function downloadBlob(url: string, name: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function initExport(config: BookletRuntimeConfig): void {
  let exportLibsPromise: Promise<void[]> | null = null;

  function loadExportLibs() {
    if (!exportLibsPromise) {
      exportLibsPromise = Promise.all(config.exportLibs.map(loadScript));
    }
    return exportLibsPromise;
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
      const slides = Array.from(document.querySelectorAll('.slide'));
      for (let i = 0; i < slides.length; i++) {
        if (label) label.textContent = 'Rendering ' + (i + 1) + '/' + slides.length;
        const dataUrl = await renderSlide(slides[i]);
        zip.file(filenameFor(slides[i]), dataUrl.split(',')[1], { base64: true });
      }
      if (label) label.textContent = 'Zipping…';
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      downloadBlob(url, config.storagePrefix + '-slides.zip');
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
