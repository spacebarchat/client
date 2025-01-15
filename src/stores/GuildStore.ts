import type { GatewayGuild } from "@spacebarchat/spacebar-api-types/v9";
import { Guild } from "@structures";
import { Logger } from "@utils";
import { action, computed, makeAutoObservable, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";

export default class GuildStore {
	private readonly logger: Logger = new Logger("GuildStore");
	private readonly app: AppStore;
	@observable initialGuildsLoaded = false;
	@observable readonly guilds: ObservableMap<string, Guild>;

	constructor(app: AppStore) {
		this.app = app;
		this.guilds = observable.map();

		makeAutoObservable(this);
	}

	@action
	setInitialGuildsLoaded() {
		this.initialGuildsLoaded = true;
		this.logger.debug("Initial guilds loaded");
	}

	@action
	add(guild: GatewayGuild) {
		this.guilds.set(guild.id, new Guild(this.app, guild));
	}

	@action
	addAll(guilds: GatewayGuild[]) {
		guilds.forEach((guild) => this.add(guild));
	}

	get(id: string) {
		return this.guilds.get(id);
	}

	@computed
	get all() {
		return Array.from(this.guilds.values());
	}

	@action
	remove(id: string) {
		this.guilds.delete(id);
	}

	@computed
	get count() {
		return this.guilds.size;
	}
}
