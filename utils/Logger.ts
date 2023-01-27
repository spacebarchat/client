import {
  fileAsyncTransport,
  logger,
  mapConsoleTransport,
} from "react-native-logs";

const config = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? "debug" : "error",
  transport: __DEV__ ? mapConsoleTransport : fileAsyncTransport,
  transportOptions: {
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
    },
    // FS: RNFS, // TODO: React native fs
  },
  // async: true,
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
};

const Logger = logger.createLogger<"debug" | "info" | "warn" | "error">(config);

export default Logger;
