import {
  configLoggerType,
  logger,
  transportFunctionType,
} from "react-native-logs";

const customTransport: transportFunctionType = (props) => {
  switch (props.level.severity) {
    case 0:
      console.debug(props.level.text.toUpperCase() + " |", ...props.rawMsg);
      break;
    case 1:
      console.info(props.level.text.toUpperCase() + " |", ...props.rawMsg);
      break;
    case 2:
      console.warn(props.level.text.toUpperCase() + " |", ...props.rawMsg);
      break;
    case 3:
      console.error(props.level.text.toUpperCase() + " |", ...props.rawMsg);
      break;
  }
};

const config: configLoggerType = {
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  severity: __DEV__ ? "debug" : "error",
  // transport: __DEV__ ? customTransport : fileAsyncTransport,
  transport: customTransport,
  transportOptions: {
    color: "ansi",
    colors: {
      info: "blueBright",
      warn: "yellowBright",
      error: "redBright",
      debug: "greenBright",
    },
  },
  dateFormat: "time",
  printLevel: true,
  printDate: true,
  enabled: true,
};

const Logger = logger.createLogger<"debug" | "info" | "warn" | "error">(config);

export default Logger;
