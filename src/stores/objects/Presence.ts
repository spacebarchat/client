import type {
	APIUser,
	GatewayActivity,
	GatewayPresenceClientStatus,
	GatewayPresenceUpdateDispatchData,
	PresenceUpdateStatus,
	Snowflake,
} from "@spacebarchat/spacebar-api-types/v9";
import { AppStore } from "@stores";
import { action, makeAutoObservable, observable } from "mobx";
import User from "./User";

export default class Presence {
	private readonly app: AppStore;

	@observable public readonly user: User;
	@observable public readonly guildId?: Snowflake;
	@observable public readonly status: PresenceUpdateStatus | undefined;
	@observable public readonly activities: GatewayActivity[] | undefined;
	@observable public readonly clientStatus: GatewayPresenceClientStatus | undefined;

	constructor(app: AppStore, data: GatewayPresenceUpdateDispatchData) {
		this.app = app;

		this.user = this.app.users.get(data.user.id) ?? new User(data.user as APIUser); // TODO: is this right?
		this.guildId = data.guild_id;
		this.status = data.status;
		this.activities = data.activities;
		this.clientStatus = data.client_status;

		makeAutoObservable(this);
	}

	@action
	update(data: GatewayPresenceUpdateDispatchData) {
		Object.assign(this, data);
	}
}
