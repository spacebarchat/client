import { Snowflake } from "@spacebarchat/spacebar-api-types/globals";
import {
	APIUser,
	CDNRoutes,
	DefaultUserAvatarAssets,
	ImageFormat,
} from "@spacebarchat/spacebar-api-types/v9";
import { makeObservable, observable } from "mobx";
import REST from "../../utils/REST";

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
	@observable avatarURL: string;

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

		if (user.avatar) {
			this.avatarURL = REST.makeCDNUrl(
				CDNRoutes.userAvatar(user.id, user.avatar, ImageFormat.PNG),
			);
		} else {
			this.avatarURL = REST.makeCDNUrl(
				CDNRoutes.defaultUserAvatar(
					(Number(user.discriminator) % 5) as DefaultUserAvatarAssets,
				),
			);
		}

		makeObservable(this);
	}
}
