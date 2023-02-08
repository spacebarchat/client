import { APIUser, UserFlags, UserPremiumType } from "discord-api-types/v9";
import { makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";

export default class UserStore extends BaseStore implements APIUser {
  id: string;
  @observable username: string;
  @observable discriminator: string;
  @observable avatar: string | null;
  bot?: boolean | undefined;
  system?: boolean | undefined;
  @observable mfa_enabled?: boolean | undefined;
  @observable banner?: string | null | undefined;
  @observable accent_color?: number | null | undefined;
  @observable locale?: string | undefined;
  @observable verified?: boolean | undefined;
  @observable email?: string | null | undefined;
  @observable flags?: UserFlags | undefined;
  @observable premium_type?: UserPremiumType | undefined;
  @observable public_flags?: UserFlags | undefined;

  constructor(data: APIUser) {
    super();
    this.id = data.id;
    this.username = data.username;
    this.discriminator = data.discriminator;
    this.avatar = data.avatar;
    this.bot = data.bot;
    this.system = data.system;
    this.mfa_enabled = data.mfa_enabled;
    this.banner = data.banner;
    this.accent_color = data.accent_color;
    this.locale = data.locale;
    this.verified = data.verified;
    this.email = data.email;
    this.flags = data.flags;
    this.premium_type = data.premium_type;
    this.public_flags = data.public_flags;

    makeObservable(this);
  }
}
