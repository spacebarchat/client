import { Client } from "@puyodead1/fosscord-ts";
import { makeAutoObservable, observable } from "mobx";
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

    makeAutoObservable(this);
  }
}

export const appStore = new AppStore();

export function useAppStore() {
  return appStore;
}
