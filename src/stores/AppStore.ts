import type { APIUser, Snowflake } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, makeAutoObservable, observable } from "mobx";
import secureLocalStorage from "react-secure-storage";
import { modalController } from "../controllers/modals";
import Logger from "../utils/Logger";
import REST from "../utils/REST";
import { isTauri } from "../utils/Utils";
import AccountStore from "./AccountStore";
import ChannelStore from "./ChannelStore";
import ExperimentsStore from "./ExperimentsStore";
import GatewayConnectionStore from "./GatewayConnectionStore";
import GuildStore from "./GuildStore";
import MessageQueue from "./MessageQueue";
import PresenceStore from "./PresenceStore";
import PrivateChannelStore from "./PrivateChannelStore";
import ReadStateStore from "./ReadStateStore";
import RoleStore from "./RoleStore";
import ThemeStore from "./ThemeStore";
import UpdaterStore from "./UpdaterStore";
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
	@observable users = new UserStore(this);
	@observable privateChannels = new PrivateChannelStore(this);
	@observable rest = new REST(this);
	@observable experiments = new ExperimentsStore();
	@observable presences = new PresenceStore(this);
	@observable readStateStore = new ReadStateStore(this);
	@observable queue = new MessageQueue(this);
	@observable updaterStore: UpdaterStore | null = null;

	@observable activeGuild: Guild | null = null;
	@observable activeGuildId: Snowflake | undefined | "@me" = "@me";
	@observable activeChannel: Channel | null = null;
	@observable activeChannelId: string | undefined = undefined;
	@observable memberListVisible: boolean = true;

	constructor() {
		makeAutoObservable(this);

		if (isTauri) {
			this.updaterStore = new UpdaterStore(this);
		}

		// bind this in toggleMemberList
		this.toggleMemberList = this.toggleMemberList.bind(this);
		// bind this in windowToggleFps
		this.windowToggleFps = this.windowToggleFps.bind(this);
		window.windowToggleFps = this.windowToggleFps;
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
	setUser(user: APIUser) {
		this.account = new AccountStore(user);
	}

	@computed
	/**
	 * Whether the app is done loading and ready to be displayed
	 */
	get isReady() {
		return !this.isAppLoading && this.isGatewayReady;
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
	toggleMemberList() {
		this.memberListVisible = !this.memberListVisible;
	}

	@action
	windowToggleFps() {
		this.setFpsShown(!this.fpsShown);
	}

	// stuff mainly for settings, really anything that uses local storage

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
		this.isAppLoading = false;
		this.isGatewayReady = true;
		secureLocalStorage.clear();
		modalController.closeAll();
	}

	@action
	setFpsShown(value: boolean) {
		this.fpsShown = value;

		secureLocalStorage.setItem("fpsShown", value);
	}

	@action
	loadFpsShown() {
		this.fpsShown = (secureLocalStorage.getItem("fpsShown") as boolean | null) ?? false;
	}

	@action
	setUpdaterEnabled(value: boolean) {
		this.updaterStore?.setEnabled(value);

		secureLocalStorage.setItem("updaterEnabled", value);
	}

	@action
	loadUpdaterEnabled() {
		this.updaterStore?.setEnabled((secureLocalStorage.getItem("updaterEnabled") as boolean | null) ?? true);
	}

	@action
	loadSettings() {
		this.loadFpsShown();
		this.loadToken();
		this.loadUpdaterEnabled();
	}
}
