import {
  APIUser,
  UserFlags,
  UserPremiumType,
} from "@puyodead1/fosscord-api-types/v9";
import { action, makeObservable, observable } from "mobx";
import { CDNRoutes, DefaultUserAvatarAssets } from "../utils/Endpoints";
import REST from "../utils/REST";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";

export default class User extends BaseStore implements APIUser {
  private readonly domain: DomainStore;

  id: string;
  @observable username: string;
  @observable discriminator: string;
  @observable avatar: string | null;
  bot?: boolean | undefined;
  @observable bio?: string | undefined;
  system?: boolean | undefined;
  @observable mfa_enabled?: boolean | undefined;
  @observable banner?: string | null | undefined;
  @observable theme_colors?: number | undefined;
  @observable pronouns?: string | undefined;
  @observable accent_color?: number | null | undefined;
  @observable locale?: string | undefined;
  @observable verified?: boolean | undefined;
  @observable email?: string | null | undefined;
  @observable flags?: UserFlags | undefined;
  @observable premium_type?: UserPremiumType | undefined;
  @observable premium_since?: string | undefined;
  @observable public_flags?: UserFlags | undefined;
  @observable avatarURL: string;

  constructor(domain: DomainStore, user: APIUser) {
    super();
    this.domain = domain;

    this.id = user.id;
    this.username = user.username;
    this.discriminator = user.discriminator;
    this.avatar = user.avatar;
    this.accent_color = user.accent_color;
    this.banner = user.banner;
    this.theme_colors = user.theme_colors;
    this.pronouns = user.pronouns;
    this.premium_type = user.premium_type;
    this.bot = user.bot;
    this.bio = user.bio;
    this.premium_since = user.premium_since;
    this.public_flags = user.public_flags;

    if (user.avatar)
      this.avatarURL = REST.makeCDNUrl(
        CDNRoutes.userAvatar(user.id, user.avatar)
      );
    else
      this.avatarURL = REST.makeCDNUrl(
        CDNRoutes.defaultUserAvatar(
          (Number(user.discriminator) % 6) as any as DefaultUserAvatarAssets
        )
      );

    makeObservable(this);
  }

  @action
  update(user: APIUser) {
    Object.assign(this, user);

    if (user.avatar)
      this.avatarURL = REST.makeCDNUrl(
        CDNRoutes.userAvatar(user.id, user.avatar)
      );
    else
      this.avatarURL = REST.makeCDNUrl(
        CDNRoutes.defaultUserAvatar(
          (Number(user.discriminator) % 6) as any as DefaultUserAvatarAssets
        )
      );
  }
}
