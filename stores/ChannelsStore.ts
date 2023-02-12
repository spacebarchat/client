import { action, makeObservable, observable } from "mobx";
import { Snowflake } from "../interfaces/common";
import { ChannelOmit } from "../interfaces/Gateway";
import BaseStore from "./BaseStore";
import ChannelStore from "./ChannelStore";

export default class ChannelsStore extends BaseStore {
  @observable channels = observable.map<string, ChannelStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  @action
  add(channel: ChannelOmit) {
    this.channels.set(channel.id, new ChannelStore(channel));
  }

  @action
  remove(id: Snowflake) {
    this.channels.delete(id);
  }
}
