import { action, makeObservable, observable } from "mobx";
import { createContext } from "react";
import REST from "../utils/REST";
import AccountStore from "./AccountStore";
import BaseStore from "./BaseStore";

export class DomainStore extends BaseStore {
  @observable theme: string = "default";
  @observable account: AccountStore = new AccountStore();
  @observable isLoading: boolean = true;
  public rest: REST = new REST("https://shitcord.lol"); // TODO:

  constructor() {
    super();
    makeObservable(this);
  }

  @action
  setTheme(theme: string) {
    this.theme = theme;
  }

  @action
  setLoading(isLoading: boolean) {
    this.isLoading = isLoading;
  }
}

export const DomainContext = createContext(new DomainStore());
