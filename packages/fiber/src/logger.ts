export const logger = import.meta.env.PROD
  ? {
      log: () => {},
      error: () => {},
      time: () => {},
      timeEnd: () => {},
    }
  : {
      log: console.log,
      error: console.error,
      time: console.time,
      timeEnd: console.timeEnd,
    };
