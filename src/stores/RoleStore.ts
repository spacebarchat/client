import type { Snowflake } from "@spacebarchat/spacebar-api-types/globals";
import type { APIRole } from "@spacebarchat/spacebar-api-types/v9";
import { action, makeObservable, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";
import Role from "./objects/Role";

export default class RoleStore {
	private readonly app: AppStore;
	@observable private readonly roles = new ObservableMap<Snowflake, Role>();

	constructor(app: AppStore) {
		this.app = app;

		makeObservable(this);
	}

	@action
	add(role: APIRole) {
		this.roles.set(role.id, new Role(this.app, role));
	}

	@action
	addAll(roles: APIRole[]) {
		roles.forEach((role) => this.add(role));
	}

	getAll() {
		return Array.from(this.roles.values());
	}

	@action
	remove(id: Snowflake) {
		this.roles.delete(id);
	}

	@action
	update(role: APIRole) {
		this.roles.get(role.id)?.update(role);
	}

	get(id: Snowflake) {
		return this.roles.get(id);
	}

	has(id: Snowflake) {
		return this.roles.has(id);
	}

	asList() {
		return Array.from(this.roles.values());
	}

	get size() {
		return this.roles.size;
	}
}
