import { NativeEventEmitter } from "react-native";
import Logger from "../utils/Logger";

export default abstract class BaseStoreEventEmitter extends NativeEventEmitter {
  logger: ReturnType<typeof Logger.extend>;

  constructor() {
    super();
    this.logger = Logger.extend(this.constructor.name);
  }
}
