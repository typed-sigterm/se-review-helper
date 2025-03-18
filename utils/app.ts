import { createConsola, LogLevels } from 'consola/browser';
import { version } from '~/package.json';

export { version } from '~/package.json';

export const logger = createConsola({
  defaults: {
    tag: 'SE Review Helper',
  },
  level: import.meta.env.DEV ? LogLevels.debug : LogLevels.info,
});

export const welcome = () => logger.log(`v${version}`);

export const MATCH_URLS = [
  'https://*.stackexchange.com',
  'https://stackoverflow.com',
  'https://superuser.com',
  'https://serverfault.com',
  'https://askubuntu.com',
  'https://stackapps.com',
  'https://mathoverflow.net',
].flatMap(host => [
  `${host}/review/first-answers/*`,
  `${host}/review/first-questions/*`,
  `${host}/review/late-answers/*`,
]);
