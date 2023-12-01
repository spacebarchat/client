import type { APIUser, Snowflake } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, makeAutoObservable, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import Logger from "../utils/Logger";
import REST from "../utils/REST";
import AccountStore from "./AccountStore";
import ChannelStore from "./ChannelStore";
import ExperimentsStore from "./ExperimentsStore";
import GatewayConnectionStore from "./GatewayConnectionStore";
import GuildStore from "./GuildStore";
import MessageQueue from "./MessageQueue";
import PresenceStore from "./PresenceStore";
import PrivateChannelStore from "./PrivateChannelStore";
import RoleStore from "./RoleStore";
import ThemeStore from "./ThemeStore";
import UserStore from "./UserStore";
import Channel from "./objects/Channel";
import Guild from "./objects/Guild";

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
	@observable fpsShown: boolean = process.env.NODE_ENV === "development";

	// stores
	@observable theme: ThemeStore = new ThemeStore();
	@observable account: AccountStore | null = null;
	@observable gateway = new GatewayConnectionStore(this);
	@observable guilds = new GuildStore(this);
	@observable roles = new RoleStore(this);
	@observable channels = new ChannelStore(this);
	@observable users = new UserStore();
	@observable privateChannels = new PrivateChannelStore(this);
	@observable rest = new REST(this);
	@observable experiments = new ExperimentsStore();
	@observable presences = new PresenceStore(this);
	@observable queue = new MessageQueue(this);
	@observable activeGuild: Guild | null = null;
	@observable activeGuildId: Snowflake | undefined | "@me" = "@me";
	@observable activeChannel: Channel | null = null;
	@observable activeChannelId: string | undefined = undefined;
	@observable memberListVisible: boolean = true;

	constructor() {
		makeAutoObservable(this);

		// bind this in toggleMemberList
		this.toggleMemberList = this.toggleMemberList.bind(this);
		// bind this in windowToggleFps
		this.windowToggleFps = this.windowToggleFps.bind(this);
		// expose windowToggleFps to window
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(window as any).windowToggleFps = this.windowToggleFps;

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

	@action
	setActiveGuildId(id: Snowflake | undefined | "@me") {
		this.activeGuildId = id;

		// try to resolve the guild
		this.activeGuild = (id ? this.guilds.get(id) : null) ?? null;
	}

	@action
	setActiveChannelId(id: string | undefined) {
		this.activeChannelId = id;

		// try to resolve the channel
		this.activeChannel = (id ? this.channels.get(id) : null) ?? null;
	}

	@action
	setFpsShown(value: boolean) {
		this.fpsShown = value;
	}

	@action
	toggleMemberList() {
		this.memberListVisible = !this.memberListVisible;
	}

	@action
	windowToggleFps() {
		this.setFpsShown(!this.fpsShown);
	}
}

export const appStore = new AppStore();

export function useAppStore() {
	return appStore;
}
