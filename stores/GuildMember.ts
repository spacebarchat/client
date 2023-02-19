import {
  APIGuildMember,
  APIUser,
  GuildMemberFlags,
} from "@puyodead1/fosscord-api-types/v9";
import { action, observable } from "mobx";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";

export default class GuildMember extends BaseStore implements APIGuildMember {
  private readonly domain: DomainStore;

  @observable user?: APIUser | undefined;
  @observable nick?: string | null | undefined;
  @observable avatar?: string | null | undefined;
  @observable roles: string[];
  @observable joined_at: string;
  @observable premium_since?: string | null | undefined;
  @observable deaf: boolean;
  @observable mute: boolean;
  @observable flags: GuildMemberFlags;
  @observable pending?: boolean | undefined;
  @observable communication_disabled_until?: string | null | undefined;

  constructor(domain: DomainStore, data: APIGuildMember) {
    super();
    this.domain = domain;

    this.user = data.user;
    this.nick = data.nick;
    this.avatar = data.avatar;
    this.roles = data.roles;
    this.joined_at = data.joined_at;
    this.premium_since = data.premium_since;
    this.deaf = data.deaf;
    this.mute = data.mute;
    this.flags = data.flags;
    this.pending = data.pending;
    this.communication_disabled_until = data.communication_disabled_until;
  }

  @action
  update(member: APIGuildMember) {
    Object.assign(this, member);
  }
}
