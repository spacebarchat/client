import {Snowflake} from '@puyodead1/fosscord-api-types/globals';
import {APIUser} from '@puyodead1/fosscord-api-types/v9';
import {makeObservable, observable} from 'mobx';
import {CDNRoutes} from '../../utils/Endpoints';
import REST from '../../utils/REST';
import BaseStore from '../BaseStore';

export default class User extends BaseStore {
  id: Snowflake;
  @observable username: string;
  @observable discriminator: string;
  @observable avatar: string | null;
  @observable bot: boolean = false;
  @observable public_flags: number = 0;
  @observable bio: string = '';
  @observable premium_since: string | null = null;
  @observable premium_type: number = 0;
  @observable accent_color: unknown | null;
  @observable pronouns?: string;
  @observable theme_colors?: unknown;
  @observable avatarURL: string;

  constructor(user: APIUser) {
    super();

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
        CDNRoutes.userAvatar(user.id, user.avatar),
      );
    } else {
      this.avatarURL = REST.makeCDNUrl(
        CDNRoutes.defaultUserAvatar(user.discriminator),
      );
    }

    makeObservable(this);
  }
}
