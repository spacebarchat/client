import AsyncStorage from "@react-native-async-storage/async-storage";
import { action, autorun, makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";

/**
 * Handles all account related data and actions
 */
export default class AccountStore extends BaseStore {
  @observable isAuthenticated: boolean = false;
  @observable token: string | null = null;

  constructor() {
    super();

    makeObservable(this);

    autorun(() => {
      if (this.isAuthenticated && this.token) {
        AsyncStorage.setItem("token", this.token, (err) => {
          if (err) {
            this.logger.error(err);
          } else {
            this.logger.debug("Saved token to storage");
          }
        });
      } else {
        AsyncStorage.removeItem("token", (err) => {
          if (err) {
            this.logger.error(err);
          } else {
            this.logger.debug("Removed token from storage");
          }
        });
      }
    });
  }

  @action
  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  @action
  setToken(token: string) {
    this.token = token;
    this.isAuthenticated = true;
  }

  @action
  logout() {
    this.token = null;
    this.isAuthenticated = false;
  }
}
