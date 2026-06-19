'use strict';

const COLORS = {
  reset:  '\x1b[0m',
  red:    '\x1b[31m',
  yellow: '\x1b[33m',
  green:  '\x1b[32m',
  gray:   '\x1b[90m',
};

const LEVELS = {
  INFO:  `${COLORS.green}[INFO] ${COLORS.reset}`,
  WARN:  `${COLORS.yellow}[WARN] ${COLORS.reset}`,
  ERROR: `${COLORS.red}[ERROR]${COLORS.reset}`,
  DEBUG: `${COLORS.gray}[DEBUG]${COLORS.reset}`,
};

const ts = () => new Date().toISOString();

const logger = {
  info:  (...args) => console.log(`${LEVELS.INFO}  ${ts()}`, ...args),
  warn:  (...args) => console.warn(`${LEVELS.WARN}  ${ts()}`, ...args),
  error: (...args) => console.error(`${LEVELS.ERROR} ${ts()}`, ...args),
  debug: (...args) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${LEVELS.DEBUG} ${ts()}`, ...args);
    }
  },
};

module.exports = logger;
