import Logger from '../utils/Logger';

export default abstract class BaseStore {
  protected logger: ReturnType<typeof Logger.extend>;

  constructor() {
    this.logger = Logger.extend(this.constructor.name);
    this.storeCreated();
  }

  protected storeCreated() {
    this.logger.debug('Store Created');
  }
}
