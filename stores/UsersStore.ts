import { APIUser } from "discord-api-types/v9";
import { makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";
import UserStore from "./UserStore";

export default class UsersStore extends BaseStore {
  @observable users = observable.map<string, UserStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  add(user: APIUser) {
    this.users.set(user.id, new UserStore(user));
  }
}
