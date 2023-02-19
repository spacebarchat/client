import {
  APIGuildMember,
  APIUser,
  GuildMemberFlags,
} from "@puyodead1/fosscord-api-types/v9";
import { action, observable } from "mobx";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";
import Guild from "./Guild";
import Role from "./Role";

export default class GuildMember extends BaseStore {
  private readonly domain: DomainStore;
  private readonly guild: Guild;

  @observable user?: APIUser | undefined;
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

  constructor(domain: DomainStore, guild: Guild, data: APIGuildMember) {
    super();
    this.domain = domain;
    this.guild = guild;

    this.user = data.user;
    this.nick = data.nick;
    this.avatar = data.avatar;
    this.roles = data.roles
      .map((role) => guild.roles.get(role))
      .filter((x) => x) as Role[];
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
