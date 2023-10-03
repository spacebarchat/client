import type { Snowflake } from "@spacebarchat/spacebar-api-types/globals";
import type { APIGuildMember } from "@spacebarchat/spacebar-api-types/v9";
import { action, makeObservable, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";
import Guild from "./objects/Guild";
import GuildMember from "./objects/GuildMember";

export default class GuildMemberStore {
	private readonly app: AppStore;
	private readonly guild: Guild;

	@observable private readonly members = new ObservableMap<Snowflake, GuildMember>();

	constructor(app: AppStore, guild: Guild) {
		this.app = app;
		this.guild = guild;

		makeObservable(this);
	}

	@action
	add(member: APIGuildMember) {
		if (!member.user) {
			throw new Error("Member does not have a user");
		}
		if (this.members.has(member.user.id)) {
			return;
		}
		const m = new GuildMember(this.app, this.guild, member);
		this.members.set(member.user.id, m);
		return m;
	}

	@action
	addAll(members: APIGuildMember[]) {
		members.forEach((member) => this.add(member));
	}

	@action
	remove(id: Snowflake) {
		this.members.delete(id);
	}

	@action
	update(member: APIGuildMember) {
		if (!member.user) {
			throw new Error("Member does not have a user");
		}
		this.members.get(member.user.id)?.update(member);
	}

	get(id: Snowflake) {
		return this.members.get(id);
	}

	has(id: Snowflake) {
		return this.members.has(id);
	}

	asList() {
		return Array.from(this.members.values());
	}

	get size() {
		return this.members.size;
	}
}
