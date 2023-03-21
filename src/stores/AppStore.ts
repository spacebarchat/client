import { makeAutoObservable } from "mobx";
import ThemeStore from "./ThemeStore";

export default class AppStore {
  theme: ThemeStore;

  constructor() {
    this.theme = new ThemeStore();

    makeAutoObservable(this);
  }
}

export const appStore = new AppStore();

export function useAppStore() {
  return appStore;
}
