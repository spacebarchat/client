import type { GatewayGuild } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";
import Guild from "./objects/Guild";

export default class GuildStore {
	private readonly app: AppStore;
	@observable initialGuildsLoaded = false;
	@observable readonly guilds = new ObservableMap<string, Guild>();

	constructor(app: AppStore) {
		this.app = app;
	}

	@action
	setInitialGuildsLoaded() {
		this.initialGuildsLoaded = true;
		console.debug("Initial guilds loaded");
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
	getAll() {
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
