import { Client } from "@puyodead1/fosscord-ts";
import { makeAutoObservable, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import ThemeStore from "./ThemeStore";

export default class AppStore {
  theme: ThemeStore;
  api: Client;
  @observable ready = false;

  constructor() {
    this.theme = new ThemeStore();

    this.api = new Client({
      rest: {
        url: "https://canary.slowcord.understars.dev/api",
      },
    });

    this.api.on("debug", console.debug);
    this.api.on("warn", console.warn);
    this.api.on("error", console.error);

    makeAutoObservable(this);
  }

  public setToken(token: string) {
    secureLocalStorage.setItem("token", token);
  }
}

export const appStore = new AppStore();

export function useAppStore() {
  return appStore;
}
