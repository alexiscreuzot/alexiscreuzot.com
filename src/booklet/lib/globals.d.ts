import type { BookletRuntimeConfig } from '../types';

declare global {
  interface Window {
    BOOKLET: BookletRuntimeConfig;
    lucide?: { createIcons: () => void };
    htmlToImage?: { toPng: (node: Element, opts: Record<string, unknown>) => Promise<string> };
    JSZip?: new () => {
      file: (name: string, data: string, opts: { base64: boolean }) => void;
      generateAsync: (opts: { type: string }) => Promise<Blob>;
    };
  }
}

export {};
