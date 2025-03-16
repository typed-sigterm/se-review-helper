import { defineConfig } from 'wxt';
import { version } from './package.json' with { type: 'json' };

export default defineConfig({
  extensionApi: 'chrome',
  modules: [
    '@wxt-dev/auto-icons',
  ],

  manifestVersion: 3,
  manifest: {
    name: 'SE Review Helper',
    default_locale: 'en',
    description: 'Detect audits in Stack Exchange review queues.',
    version,
    web_accessible_resources: [{
      resources: ['iconify.js'],
      matches: ['<all_urls>'],
    }],
  },
});
