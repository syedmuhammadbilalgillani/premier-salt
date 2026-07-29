type LogMeta = Record<string, unknown>;

function format(level: string, message: string, meta?: LogMeta) {
  return meta ? [`[${level}] ${message}`, meta] : [`[${level}] ${message}`];
}

export const logger = {
  debug(message: string, meta?: LogMeta) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(...format("debug", message, meta));
    }
  },
  info(message: string, meta?: LogMeta) {
    console.info(...format("info", message, meta));
  },
  warn(message: string, meta?: LogMeta) {
    console.warn(...format("warn", message, meta));
  },
  error(message: string, meta?: LogMeta) {
    console.error(...format("error", message, meta));
  },
};

export default logger;
