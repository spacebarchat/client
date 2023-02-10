import { PublicUser } from "@puyodead1/fosscord-types";
import { makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";
import UserStore from "./UserStore";

export default class UsersStore extends BaseStore {
  @observable users = observable.map<string, UserStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  add(user: PublicUser) {
    this.users.set(user.id, new UserStore(user));
  }
}
