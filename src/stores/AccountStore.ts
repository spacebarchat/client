import {
	APIUser,
	UserFlags,
	UserPremiumType,
} from "@spacebarchat/spacebar-api-types/v9";
import { observable } from "mobx";

export default class AccountStore {
	id: string;
	@observable username: string;
	@observable discriminator: string;
	@observable avatar: string | null;
	@observable avatarDecoration?: unknown;
	@observable email: string | null = null;
	@observable verified: boolean = false;
	@observable bot: boolean = false;
	@observable system: boolean = false;
	@observable mfaEnabled: boolean = false;
	@observable premiumType?:
		| UserPremiumType.NitroClassic
		| UserPremiumType.Nitro
		| UserPremiumType.NitroBasic;
	@observable flags?: UserFlags;
	@observable publicFlags?: UserFlags;
	//   phone: string | null;
	//   nsfwAllowed: boolean | null;

	constructor(user: APIUser) {
		this.id = user.id;
		this.username = user.username;
		this.discriminator = user.discriminator;
		this.avatar = user.avatar;
		// this.avatarDecoration = user.avatar_decoration;
		if (user.email) {
			this.email = user.email;
		}
		if (user.verified) {
			this.verified = user.verified;
		}
		if (user.bot) {
			this.bot = user.bot;
		}
		if (user.system) {
			this.system = user.system;
		}
		if (user.mfa_enabled) {
			this.mfaEnabled = user.mfa_enabled;
		}
		if (user.premium_type) {
			this.premiumType = user.premium_type;
		}
		if (user.flags) {
			this.flags = user.flags;
		}
		if (user.public_flags) {
			this.publicFlags = user.public_flags;
		}
		// this.phone = user.phone;
		// this.nsfwAllowed = user.nsfw_allowed;
	}
}
