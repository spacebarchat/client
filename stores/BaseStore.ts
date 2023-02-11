import Logger from "../utils/Logger";

interface StoreProps {
  logStoreCreated?: boolean;
}

export default abstract class BaseStore {
  protected logger: ReturnType<typeof Logger.extend>;

  constructor(props?: StoreProps) {
    this.logger = Logger.extend(this.constructor.name);
    props?.logStoreCreated && this.storeCreated();
  }

  protected storeCreated() {
    this.logger.debug("Store Created");
  }
}
