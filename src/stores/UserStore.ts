import { Routes, type APIUser, type Snowflake } from "@spacebarchat/spacebar-api-types/v9";
import { ObservableMap, action, computed, observable } from "mobx";
import useLogger from "../hooks/useLogger";
import AppStore from "./AppStore";
import User from "./objects/User";

export default class UserStore {
	private readonly logger = useLogger("UserStore");
	@observable readonly users = new ObservableMap<string, User>();

	constructor(private readonly app: AppStore) {}

	@action
	add(user: APIUser): User {
		const newUser = new User(user);
		this.users.set(user.id, newUser);
		return newUser;
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
	get all() {
		return Array.from(this.users.values());
	}

	@computed
	get count() {
		return this.users.size;
	}

	has(id: string) {
		return this.users.has(id);
	}

	@action
	async resolve(id: Snowflake, force: boolean = false): Promise<User | undefined> {
		if (this.has(id) && !force) return this.get(id);
		const user = await this.app.rest.get<APIUser>(Routes.user(id));
		if (!user) return undefined;
		return this.add(user);
	}
}
