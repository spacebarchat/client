import {
	APIGuildMember,
	GatewayGuildMemberListUpdateMember,
	GuildMemberFlags,
} from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, observable } from "mobx";
import { PermissionResolvable, Permissions } from "../../utils/Permissions";
import AppStore from "../AppStore";
import Guild from "./Guild";
import Role from "./Role";
import User from "./User";

export default class GuildMember {
	private readonly app: AppStore;
	public readonly guild: Guild;

	@observable user?: User | undefined;
	@observable nick?: string | null | undefined;
	@observable avatar?: string | null | undefined;
	@observable roles: Role[];
	@observable joined_at: string;
	@observable premium_since?: string | null | undefined;
	@observable deaf: boolean;
	@observable mute: boolean;
	@observable flags: GuildMemberFlags;
	@observable pending?: boolean | undefined;
	@observable communication_disabled_until?: string | null | undefined;

	constructor(app: AppStore, guild: Guild, data: APIGuildMember | GatewayGuildMemberListUpdateMember) {
		this.app = app;
		this.guild = guild;

		if (data.user) {
			this.user = new User(data.user);
		}
		this.nick = data.nick;
		this.avatar = data.avatar;
		this.roles = data.roles.map((role) => app.roles.get(role)).filter(Boolean) as Role[];
		this.joined_at = data.joined_at;
		this.premium_since = data.premium_since;
		this.deaf = data.deaf;
		this.mute = data.mute;
		this.flags = data.flags;
		this.pending = data.pending;
		this.communication_disabled_until = data.communication_disabled_until;
	}

	@computed
	get roleColor() {
		const highestRole = this.roles.reduce((prev, role) => {
			if (role.position > prev.position) return role;
			return prev;
		}, this.roles[0]);
		if (highestRole?.color === "#000000") return; // TODO: why the fk do we use black as the default color???
		return highestRole?.color;
	}

	@action
	update(member: APIGuildMember | GatewayGuildMemberListUpdateMember) {
		Object.assign(this, member);
	}

	@action
	async kick(reason?: string) {
		return this.guild.kickMember(this.user!.id, reason);
	}

	@action
	async ban(reason?: string, deleteMessageSeconds?: number) {
		return this.guild.banMember(this.user!.id, reason, deleteMessageSeconds);
	}

	hasPermission(permission: PermissionResolvable) {
		const permissions = Permissions.getPermission(this.app.account!.id, this.guild);
		return permissions.has(permission);
	}
}
