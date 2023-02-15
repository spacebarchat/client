import { action, makeObservable, observable, ObservableMap } from "mobx";
import { Snowflake } from "../interfaces/common";
import { ChannelOmit } from "../interfaces/Gateway";
import BaseStore from "./BaseStore";
import ChannelStore from "./ChannelStore";

export default class ChannelsStore extends BaseStore {
  @observable readonly channels = new ObservableMap<Snowflake, ChannelStore>();

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

  get(id: Snowflake) {
    return this.channels.get(id);
  }

  asList() {
    return Array.from(this.channels.values());
  }
}
