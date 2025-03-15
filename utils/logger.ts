import { createConsola, LogLevels } from 'consola/browser';

export const logger = createConsola({
  defaults: {
    tag: 'SE Review Helper',
  },
  level: import.meta.env.DEV ? LogLevels.debug : LogLevels.info,
});

export function welcome() {
  logger.log(`v${version}`);
}
