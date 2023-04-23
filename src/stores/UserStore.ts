import type { APIUser } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, observable, ObservableMap } from "mobx";
import User from "./objects/User";

export default class UserStore {
	@observable readonly users = new ObservableMap<string, User>();

	@action
	add(user: APIUser) {
		this.users.set(user.id, new User(user));
	}

	@action
	addAll(users: APIUser[]) {
		users.forEach((user) => this.add(user));
	}

	@action
	get(id: string) {
		return this.users.get(id);
	}

	@computed
	getAll() {
		return Array.from(this.users.values());
	}

	@computed
	get count() {
		return this.users.size;
	}

	has(id: string) {
		return this.users.has(id);
	}
}
