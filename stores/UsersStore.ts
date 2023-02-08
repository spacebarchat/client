import { APIUser } from "discord-api-types/v9";
import { observable } from "mobx";
import BaseStore from "./BaseStore";
import UserStore from "./UserStore";

export default class UsersStore extends BaseStore {
  @observable users: Map<string, UserStore> = new Map();

  constructor() {
    super();
  }

  add(user: APIUser) {
    this.users.set(user.id, new UserStore(user));
  }
}
