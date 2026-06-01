import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alexiscreuzot.com',
  output: 'static',
  build: {
    format: 'file',
  },
});
