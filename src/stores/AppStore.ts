import type { APIUser } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, makeAutoObservable, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import Logger from "../utils/Logger";
import REST from "../utils/REST";
import AccountStore from "./AccountStore";
import ExperimentsStore from "./ExperimentsStore";
import GatewayConnectionStore from "./GatewayConnectionStore";
import GuildStore from "./GuildStore";
import MessageQueue from "./MessageQueue";
import PresenceStore from "./PresenceStore";
import PrivateChannelStore from "./PrivateChannelStore";
import ThemeStore from "./ThemeStore";
import UserStore from "./UserStore";

// dev thing to force toggle branding on auth pages for testing.
export const AUTH_NO_BRANDING = false;

export default class AppStore {
	private readonly logger: Logger = new Logger("AppStore");

	// whether the gateway is ready
	@observable isGatewayReady = false;
	// whether the app is still loading
	@observable isAppLoading = true;

	@observable isNetworkConnected = true;
	@observable tokenLoaded = false;
	@observable token: string | null = null;

	// stores
	@observable theme: ThemeStore = new ThemeStore();
	@observable account: AccountStore | null = null;
	@observable gateway = new GatewayConnectionStore(this);
	@observable guilds = new GuildStore(this);
	@observable users = new UserStore();
	@observable privateChannels = new PrivateChannelStore(this);
	@observable rest = new REST(this);
	@observable experiments = new ExperimentsStore();
	@observable presences = new PresenceStore(this);
	@observable queue = new MessageQueue();

	constructor() {
		makeAutoObservable(this);

		window.addEventListener("online", () => this.setNetworkConnected(true));
		window.addEventListener("offline", () => this.setNetworkConnected(false));
	}

	@action
	setGatewayReady(value: boolean) {
		this.isGatewayReady = value;
	}

	@action
	setAppLoading(value: boolean) {
		this.isAppLoading = value;
	}

	@action
	setToken(token: string, save = false) {
		this.token = token;
		this.tokenLoaded = true;
		if (save) {
			secureLocalStorage.setItem("token", token);
			this.logger.info("Token saved to storage");
		}
	}

	@action
	setUser(user: APIUser) {
		this.account = new AccountStore(user);
	}

	@action
	loadToken() {
		const token = secureLocalStorage.getItem("token") as string | null;

		this.tokenLoaded = true;

		if (token) {
			this.logger.debug("Loaded token from storage.");
			this.setToken(token);
		} else {
			this.logger.debug("No token found in storage.");
			this.setGatewayReady(true);
		}
	}

	@action
	logout() {
		this.token = null;
		this.tokenLoaded = false;
		secureLocalStorage.removeItem("token");
	}

	@action
	setNetworkConnected(value: boolean) {
		this.isNetworkConnected = value;
	}

	@computed
	/**
	 * Whether the app is done loading and ready to be displayed
	 */
	get isReady() {
		return !this.isAppLoading && this.isGatewayReady && this.isNetworkConnected;
	}
}

export const appStore = new AppStore();

export function useAppStore() {
	return appStore;
}
