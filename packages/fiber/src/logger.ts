export const logger = import.meta.env.ENABLE_LOGGING
  ? {
      log: console.log,
      error: console.error,
      time: console.time,
      timeEnd: console.timeEnd,
    }
  : {
      log: () => {},
      error: () => {},
      time: () => {},
      timeEnd: () => {},
    };
