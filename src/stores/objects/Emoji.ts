import { REST } from "@/utils";
import { CDNRoutes, ImageFormat, type APIEmoji, type APIUser } from "@spacebarchat/spacebar-api-types/v9";
import { makeAutoObservable, observable } from "mobx";

export default class Emoji {
	@observable id: string;
	@observable name: string;
	@observable roles?: string[];
	@observable user?: APIUser;
	@observable require_colons?: boolean;
	@observable managed?: boolean;
	@observable animated?: boolean;
	@observable available?: boolean;

	constructor(data: APIEmoji) {
		this.id = data.id!;
		this.name = data.name!;
		this.roles = data.roles;
		this.user = data.user;
		this.require_colons = data.require_colons;
		this.managed = data.managed;
		this.animated = data.animated;
		this.available = data.available;

		makeAutoObservable(this);
	}

	get imageUrl() {
		return REST.makeCDNUrl(CDNRoutes.emoji(this.id, ImageFormat.PNG));
	}
}
