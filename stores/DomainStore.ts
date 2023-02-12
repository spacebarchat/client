import { action, makeObservable, observable } from "mobx";
import { createContext } from "react";
import REST from "../utils/REST";
import AccountStore from "./AccountStore";
import BaseStore from "./BaseStore";
import GatewayStore from "./GatewayStore";
import GuildsStore from "./GuildsStore";
import UsersStore from "./UsersStore";

export class DomainStore extends BaseStore {
  @observable isI18NInitialized: boolean = false;
  @observable isDarkTheme: boolean = true;
  @observable account: AccountStore = new AccountStore();
  @observable user: UsersStore = new UsersStore();
  @observable guild: GuildsStore = new GuildsStore();
  @observable gateway: GatewayStore = new GatewayStore(this);
  @observable isAppLoading: boolean = true;
  public readonly devSkipAuth = false;
  public rest: REST = new REST("https://canary.slowcord.understars.dev");

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
  setAppLoading(isAppLoading: boolean) {
    this.isAppLoading = isAppLoading;
  }

  @action
  setI18NInitialized() {
    this.isI18NInitialized = true;
    this.logger.debug("i18n initialized");
  }

  get isAppReady() {
    return !this.isAppLoading && this.isI18NInitialized;
  }
}

export const DomainContext = createContext(new DomainStore());
