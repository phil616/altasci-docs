import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
