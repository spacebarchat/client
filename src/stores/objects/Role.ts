import type { APIRole, APIRoleTags } from "@spacebarchat/spacebar-api-types/v9";
import { AppStore } from "@stores";
import { action, observable } from "mobx";

export default class Role {
	private readonly app: AppStore;

	id: string;
	@observable name: string;
	@observable color: string;
	@observable hoist: boolean;
	@observable icon?: string | null | undefined;
	@observable unicode_emoji?: string | null | undefined;
	@observable position: number;
	@observable permissions: string;
	managed: boolean;
	@observable mentionable: boolean;
	@observable tags?: APIRoleTags | undefined;

	constructor(app: AppStore, data: APIRole) {
		this.app = app;

		this.id = data.id;
		this.name = data.name;
		this.color = "#" + data.color.toString(16).padStart(6, "0");
		this.hoist = data.hoist;
		this.icon = data.icon;
		this.unicode_emoji = data.unicode_emoji;
		this.position = data.position;
		this.permissions = data.permissions;
		this.managed = data.managed;
		this.mentionable = data.mentionable;
		this.tags = data.tags;
	}

	@action
	update(role: APIRole) {
		Object.assign(this, role);
	}
}
