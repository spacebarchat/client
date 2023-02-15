import { Message } from "@puyodead1/fosscord-types";
import { action, observable, ObservableMap } from "mobx";
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
  }

  @action
  add(message: Message) {
    this.messages.set(message.id, new MessageStore(message));
  }

  @action
  remove(message: Message) {
    this.messages.delete(message.id);
  }

  get(id: Snowflake) {
    return this.messages.get(id);
  }

  asList() {
    return Array.from(this.messages.values());
  }
}
