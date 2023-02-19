import { Snowflake } from "@puyodead1/fosscord-api-types/globals";
import { APIRole } from "@puyodead1/fosscord-api-types/v9";
import { action, makeObservable, observable, ObservableMap } from "mobx";
import BaseStore from "./BaseStore";
import { DomainStore } from "./DomainStore";
import Role from "./Role";

export default class RolesStore extends BaseStore {
  private readonly domain: DomainStore;
  @observable private readonly roles = new ObservableMap<Snowflake, Role>();

  constructor(domain: DomainStore) {
    super();
    this.domain = domain;

    makeObservable(this);
  }

  @action
  add(role: APIRole) {
    this.roles.set(role.id, new Role(this.domain, role));
  }

  @action
  addAll(roles: APIRole[]) {
    roles.forEach((role) => this.add(role));
  }

  @action
  remove(id: Snowflake) {
    this.roles.delete(id);
  }

  @action
  update(role: APIRole) {
    this.roles.get(role.id)?.update(role);
  }

  get(id: Snowflake) {
    return this.roles.get(id);
  }

  has(id: Snowflake) {
    return this.roles.has(id);
  }

  asList() {
    return Array.from(this.roles.values());
  }

  get size() {
    return this.roles.size;
  }
}
