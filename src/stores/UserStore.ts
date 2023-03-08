import {APIUser} from '@puyodead1/fosscord-api-types/v9';
import {action, computed, observable, ObservableMap} from 'mobx';
import User from '../objects/User';
import BaseStore from './BaseStore';

export default class UserStore extends BaseStore {
  @observable readonly users = new ObservableMap<string, User>();

  constructor() {
    super();
  }

  @action
  add(user: APIUser) {
    this.users.set(user.id, new User(user));
  }

  @action
  addAll(users: APIUser[]) {
    users.forEach(user => this.add(user));
  }

  @computed
  get count() {
    return this.users.size;
  }
}
