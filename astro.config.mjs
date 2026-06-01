import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://alexiscreuzot.com',
  devToolbar: { enabled: false },
  output: 'static',
  build: {
    format: 'preserve',
  },
});
