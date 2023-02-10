import { action, makeObservable, observable } from "mobx";
import { GatewayReadyUser } from "../interfaces/Gateway";
import BaseStore from "./BaseStore";

/**
 * Handles all account related data and actions
 */
export default class AccountStore extends BaseStore {
  @observable isAuthenticated: boolean = false;
  @observable token: string | null = null;
  @observable user: GatewayReadyUser | null = null;

  constructor() {
    super();

    makeObservable(this);

    // autorun(() => {
    //   if (this.isAuthenticated && this.token) {
    //     AsyncStorage.setItem("token", this.token, (err) => {
    //       if (err) {
    //         this.logger.error(err);
    //       } else {
    //         this.logger.debug("Saved token to storage");
    //       }
    //     });
    //   } else {
    //     AsyncStorage.removeItem("token", (err) => {
    //       if (err) {
    //         this.logger.error(err);
    //       } else {
    //         this.logger.debug("Removed token from storage");
    //       }
    //     });
    //   }
    // });
  }

  @action
  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  @action
  setToken(token: string) {
    this.token = token;
    this.setAuthenticated(true);
    // AsyncStorage.setItem("token", token, (err) => {
    //   if (err) this.logger.error(err);
    //   else this.logger.debug("Token saved to storage.");
    // });
  }

  @action
  loadToken() {
    // AsyncStorage.getItem("token", (err, result) => {
    //   if (err) {
    //     this.logger.error(err);
    //   } else {
    //     if (result) {
    //       this.logger.debug("Loaded token from storage.");
    //       this.token = result;
    //       this.setAuthenticated(true);
    //     } else {
    //       this.logger.debug("No token found in storage.");
    //     }
    //   }
    // });
  }

  @action
  logout() {
    this.token = null;
    this.setAuthenticated(false);
    // AsyncStorage.removeItem("token", (err) => {
    //   if (err) this.logger.error(err);
    //   else this.logger.debug("Token saved to storage.");
    // });
  }

  @action
  setUser(user: GatewayReadyUser) {
    this.user = user;
  }
}
