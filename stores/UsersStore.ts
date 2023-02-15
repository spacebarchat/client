import { PublicUser } from "@puyodead1/fosscord-types";
import { action, makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";
import UserStore from "./UserStore";

export default class UsersStore extends BaseStore {
  @observable private readonly users = observable.map<string, UserStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  @action
  add(user: PublicUser) {
    this.users.set(user.id, new UserStore(user));
  }

  @action
  remove(id: string) {
    this.users.delete(id);
  }

  get(id: string) {
    return this.users.get(id);
  }

  asList() {
    return Array.from(this.users.values());
  }

  get size() {
    return this.users.size;
  }
}
