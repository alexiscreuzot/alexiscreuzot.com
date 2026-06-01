import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alexiscreuzot.com',
  output: 'static',
  build: {
    format: 'file',
  },
  redirects: {
    '/horizonte33': '/horizonte33/index.html',
    '/zen-in-rennes': '/zen-in-rennes/index.html',
  },
});
