import { createConsola, LogLevels } from 'consola/browser';

export { version } from '~/package.json';

export const logger = createConsola({
  defaults: {
    tag: 'SE Review Helper',
  },
  level: import.meta.env.DEV ? LogLevels.debug : LogLevels.info,
});

export const welcome = () => logger.log(`v${version}`);
