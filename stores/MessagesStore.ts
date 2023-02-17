import { Snowflake } from "@puyodead1/fosscord-api-types/globals";
import { APIMessage } from "@puyodead1/fosscord-api-types/v9";
import { action, makeObservable, observable, ObservableMap } from "mobx";
import BaseStore from "./BaseStore";
import MessageStore from "./MessageStore";

export default class MessagesStore extends BaseStore {
  @observable private readonly messages = new ObservableMap<
    Snowflake,
    MessageStore
  >();

  constructor() {
    super();

    makeObservable(this);
  }

  @action
  add(message: APIMessage) {
    this.messages.set(message.id, new MessageStore(message));
  }

  @action
  addAll(messages: APIMessage[]) {
    messages.forEach((message) => this.add(message));
  }

  @action
  remove(id: Snowflake) {
    this.messages.delete(id);
  }

  @action
  update(message: APIMessage) {
    this.messages.get(message.id)?.update(message);
  }

  get(id: Snowflake) {
    return this.messages.get(id);
  }

  has(id: Snowflake) {
    return this.messages.has(id);
  }

  asList() {
    return Array.from(this.messages.values());
  }

  get size() {
    return this.messages.size;
  }
}
