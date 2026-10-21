import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  devToolbar: { enabled: false },
  integrations: [{
    name: 'altasci-build-sha',
    hooks: {
      'astro:build:start': ({ logger }) => {
        const buildSha = process.env.ALTASCI_DOC_BUILD_SHA?.trim();
        if (buildSha) logger.info(`Build SHA: ${buildSha}`);
      },
    },
  }],
  markdown: { shikiConfig: { themes: { light: 'github-light', dark: 'github-dark' } } },
});
