import Logger from "../utils/Logger";

export default function (name: string) {
  const logger = Logger.extend(name);

  return logger;
}
