import { Snowflake } from "@spacebarchat/spacebar-api-types/globals";
import { APIUser, CDNRoutes, DefaultUserAvatarAssets, ImageFormat } from "@spacebarchat/spacebar-api-types/v9";
import { makeObservable, observable } from "mobx";
import { Permissions } from "../../utils/Permissions";
import REST from "../../utils/REST";
import Channel from "./Channel";
import Guild from "./Guild";

export default class User {
	id: Snowflake;
	@observable username: string;
	@observable discriminator: string;
	@observable avatar: string | null;
	@observable bot = false;
	@observable public_flags = 0;
	@observable bio = "";
	@observable premium_since: string | null = null;
	@observable premium_type = 0;
	@observable accent_color: unknown | null;
	@observable pronouns?: string;
	@observable theme_colors?: unknown;

	constructor(user: APIUser) {
		this.id = user.id;
		this.username = user.username;
		this.discriminator = user.discriminator;
		this.avatar = user.avatar;
		if (user.bot) {
			this.bot = user.bot;
		}
		if (user.public_flags) {
			this.public_flags = user.public_flags;
		}
		if (user.bio) {
			this.bio = user.bio;
		}
		if (user.premium_since) {
			this.premium_since = user.premium_since;
		}
		if (user.premium_type) {
			this.premium_type = user.premium_type;
		}
		this.pronouns = user.pronouns;
		this.theme_colors = user.theme_colors;
		this.accent_color = user.accent_color;

		makeObservable(this);
	}

	/**
	 * Gets the users default avatar url
	 * @returns The URL to the user's default avatar.
	 */
	get defaultAvatarUrl(): string {
		return REST.makeCDNUrl(
			CDNRoutes.defaultUserAvatar((Number(this.discriminator) % 5) as DefaultUserAvatarAssets),
		);
	}

	/**
	 * Gets the users display avatar url
	 * @returns The URL to the user's avatar or the default avatar if they don't have one.
	 */
	get avatarUrl(): string {
		if (this.avatar) return REST.makeCDNUrl(CDNRoutes.userAvatar(this.id, this.avatar, ImageFormat.PNG));
		else return this.defaultAvatarUrl;
	}

	getPermission(guild: Guild, channel: Channel) {
		const member = guild.members.get(this.id);
		let recipient_ids = channel?.recipients?.map((x) => x.id);
		if (!recipient_ids?.length) recipient_ids = undefined;

		const permission = Permissions.finalPermission({
			user: {
				id: this.id,
				roles: member?.roles.map((x) => x.id) || [],
			},
			guild: {
				roles: member?.roles || [],
			},
			channel: {
				overwrites: channel.permissionOverwrites,
				owner_id: channel?.ownerId,
				recipient_ids,
			},
		});

		const obj = new Permissions(permission);

		// pass cache to permission for possible future getPermission calls
		obj.cache = { guild, member, channel, roles: member?.roles, user_id: this.id };

		return obj;
	}
}
