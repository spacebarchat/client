import { Client } from "@puyodead1/fosscord-ts";
import { makeAutoObservable, observable, runInAction } from "mobx";
import ThemeStore from "./ThemeStore";

export default class AppStore {
	theme: ThemeStore;
	api: Client;
	@observable ready = false;

	constructor() {
		this.theme = new ThemeStore();

		this.api = new Client({
			rest: {
				url: "https://old.server.spacebar.chat/api",
			},
		});

		this.api.on("debug", console.debug);
		this.api.on("warn", console.warn);
		this.api.on("error", console.error);
		this.api.on("ready", this.onReady.bind(this));

		makeAutoObservable(this);
	}

	onReady() {
		runInAction(() => {
			this.ready = true;
		});
	}
}

export const appStore = new AppStore();

export function useAppStore() {
	return appStore;
}
