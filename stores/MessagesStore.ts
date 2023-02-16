import { Message } from "@puyodead1/fosscord-types";
import { action, makeObservable, observable, ObservableMap } from "mobx";
import { Snowflake } from "../interfaces/common";
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
  add(message: Message) {
    this.messages.set(message.id, new MessageStore(message));
  }

  @action
  addAll(messages: Message[]) {
    messages.forEach((message) => this.add(message));
  }

  @action
  remove(message: Message) {
    this.messages.delete(message.id);
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
