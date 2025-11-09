const isDevelopment = import.meta.env.DEV;

class Logger {
  info(...args) {
    if (isDevelopment) {
      console.log('[INFO]', ...args);
    }
  }

  error(...args) {
    console.error('[ERROR]', ...args);
  }

  warn(...args) {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  }

  debug(...args) {
    if (isDevelopment) {
      console.debug('[DEBUG]', ...args);
    }
  }

  log(...args) {
    if (isDevelopment) {
      console.log(...args);
    }
  }
}

export const logger = new Logger();