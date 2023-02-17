import { APIUser } from "@puyodead1/fosscord-api-types/v9";
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
  add(user: APIUser) {
    this.users.set(user.id, new UserStore(user));
  }

  @action
  remove(id: string) {
    this.users.delete(id);
  }

  get(id: string) {
    return this.users.get(id);
  }

  has(id: string) {
    return this.users.has(id);
  }

  asList() {
    return Array.from(this.users.values());
  }

  get size() {
    return this.users.size;
  }
}
