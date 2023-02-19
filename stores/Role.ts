import { APIRole, APIRoleTags } from "@puyodead1/fosscord-api-types/v9";
import { action, observable } from "mobx";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";

export default class Role extends BaseStore {
	private readonly domain: DomainStore;

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

	constructor(domain: DomainStore, data: APIRole) {
		super();
		this.domain = domain;

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
