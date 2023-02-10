import { PublicUser } from "@puyodead1/fosscord-types";
import { makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";

export default class UserStore extends BaseStore implements PublicUser {
  @observable id: string;
  @observable username: string;
  @observable discriminator: string;
  @observable avatar?: string | undefined;
  @observable accent_color?: number | undefined;
  @observable banner?: string | undefined;
  @observable theme_colors?: number[] | undefined;
  @observable pronouns?: string | undefined;
  @observable phone?: string | undefined;
  @observable premium_type: number;
  @observable bot: boolean;
  @observable bio: string;
  @observable totp_secret?: string | undefined;
  @observable totp_last_ticket?: string | undefined;
  @observable premium_since: Date;
  @observable email?: string | undefined;
  @observable public_flags: number;

  constructor(user: PublicUser) {
    super();

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

    makeObservable(this);
  }
}
