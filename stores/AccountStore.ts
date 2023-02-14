import AsyncStorage from "@react-native-async-storage/async-storage";
import { action, makeObservable, observable, reaction } from "mobx";
import { GatewayReadyUser } from "../interfaces/Gateway";
import { CDNRoutes, DefaultUserAvatarAssets } from "../utils/Endpoints";
import REST from "../utils/REST";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";

/**
 * Handles all account related data and actions
 */
export default class AccountStore extends BaseStore {
  @observable isAuthenticated: boolean = false;
  @observable token: string | null = null;
  @observable user: (GatewayReadyUser & { avatarURL: string }) | null = null;

  constructor() {
    super();

    makeObservable(this);

    reaction(
      () => this.token,
      (token) => {
        if (token) {
          this.isAuthenticated = true;
        } else {
          this.isAuthenticated = false;
        }
      }
    );
  }

  @action
  setAuthenticated(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }

  @action
  setToken(token: string) {
    this.token = token;
    AsyncStorage.setItem("token", token, (err) => {
      if (err) this.logger.error(err);
      else this.logger.debug("Token saved to storage.");
    });
  }

  @action
  async loadToken(domain: DomainStore): Promise<void> {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem("token", (err, result) => {
        if (err) return reject(err);

        if (result) {
          this.logger.debug("Loaded token from storage.");
          this.setToken(result);
          resolve();
        } else {
          this.logger.debug("No token found in storage.");
          domain.setAppLoading(false);
          resolve();
        }
      });
    });
  }

  @action
  logout() {
    this.token = null;
    AsyncStorage.removeItem("token", (err) => {
      if (err) console.error(err);
      else console.debug("Token removed from storage.");
    });
  }

  @action
  setUser(user: GatewayReadyUser) {
    // TODO: fosscord doesnt have default user avatar cdn route yet
    this.user = {
      ...user,
      avatarURL: user.avatar
        ? REST.makeCDNUrl(CDNRoutes.userAvatar(user.id, user.avatar))
        : `https://cdn.discordapp.com${CDNRoutes.defaultUserAvatar(
            (Number(user.discriminator) % 5) as any as DefaultUserAvatarAssets
          )}`,
    };
  }
}
