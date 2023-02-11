import { Channel } from "@puyodead1/fosscord-types";
import { action, makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";
import ChannelStore from "./ChannelStore";

export default class ChannelsStore extends BaseStore {
  @observable channels = observable.map<string, ChannelStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  @action
  add(channel: Channel) {
    this.channels.set(channel.id, new ChannelStore(channel));
  }
}
