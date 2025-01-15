import type { GatewayPresenceUpdateDispatchData, Snowflake } from "@spacebarchat/spacebar-api-types/v9";
import { Presence } from "@structures";
import { action, computed, makeAutoObservable, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";

export default class PresenceStore {
	private readonly app: AppStore;
	@observable presences: ObservableMap<Snowflake, Presence>;

	constructor(app: AppStore) {
		this.app = app;
		this.presences = observable.map<Snowflake, Presence>();

		makeAutoObservable(this);
	}

	@action
	add(data: GatewayPresenceUpdateDispatchData) {
		if (!this.presences.has(data.user.id)) {
			this.presences.set(data.user.id, new Presence(this.app, data));
		} else {
			this.update(data);
		}
	}

	@action
	addAll(data: GatewayPresenceUpdateDispatchData[]) {
		data.forEach((p) => this.add(p));
	}

	@computed
	get all() {
		return Array.from(this.presences.values());
	}

	@action
	remove(id: Snowflake) {
		this.presences.delete(id);
	}

	@action
	update(data: GatewayPresenceUpdateDispatchData) {
		this.presences.get(data.user.id)?.update(data);
	}

	get(id: Snowflake) {
		return this.presences.get(id);
	}

	has(id: Snowflake) {
		return this.presences.has(id);
	}

	asList() {
		return Array.from(this.presences.values());
	}

	get size() {
		return this.presences.size;
	}
}
