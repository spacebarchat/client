import { makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";

/**
 * Handles all account related data and actions
 */
export default class AccountStore extends BaseStore {
  @observable isAuthenticated: boolean = false;

  constructor() {
    super();

    makeObservable(this);
  }
}
