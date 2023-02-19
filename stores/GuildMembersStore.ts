import { Snowflake } from "@puyodead1/fosscord-api-types/globals";
import { APIGuildMember } from "@puyodead1/fosscord-api-types/v9";
import { action, makeObservable, observable, ObservableMap } from "mobx";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";
import GuildMember from "./GuildMember";

export default class GuildMembersStore extends BaseStore {
  private readonly domain: DomainStore;

  @observable private readonly members = new ObservableMap<
    Snowflake,
    GuildMember
  >();

  constructor(domain: DomainStore) {
    super();
    this.domain = domain;

    makeObservable(this);
  }

  @action
  add(member: APIGuildMember) {
    if (!member.user) throw new Error("Member does not have a user");
    this.members.set(member.user.id, new GuildMember(this.domain, member));
  }

  @action
  addAll(members: APIGuildMember[]) {
    members.forEach((member) => this.add(member));
  }

  @action
  remove(id: Snowflake) {
    this.members.delete(id);
  }

  @action
  update(member: APIGuildMember) {
    if (!member.user) throw new Error("Member does not have a user");
    this.members.get(member.user.id)?.update(member);
  }

  get(id: Snowflake) {
    return this.members.get(id);
  }

  has(id: Snowflake) {
    return this.members.has(id);
  }

  asList() {
    return Array.from(this.members.values());
  }

  get size() {
    return this.members.size;
  }
}