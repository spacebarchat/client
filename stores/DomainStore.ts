import { action, makeObservable, observable } from "mobx";
import { createContext } from "react";
import REST from "../utils/REST";
import AccountStore from "./AccountStore";
import BaseStore from "./BaseStore";

export class DomainStore extends BaseStore {
  @observable isI18NInitialized: boolean = false;
  @observable isDarkTheme: boolean = true;
  @observable account: AccountStore = new AccountStore();
  @observable isLoading: boolean = true;
  public rest: REST = new REST("https://staging.fosscord.com");

  constructor() {
    super();
    makeObservable(this);
  }

  @action.bound
  toggleDarkTheme() {
    this.isDarkTheme = !this.isDarkTheme;
  }

  @action
  setDarkTheme(isDarkTheme: boolean) {
    this.isDarkTheme = isDarkTheme;
  }

  @action
  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }

  @action
  setI18NInitialized() {
    this.isI18NInitialized = true;
    this.logger.debug("i18n initialized");
  }
}

export const DomainContext = createContext(new DomainStore());
