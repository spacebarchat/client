import { APIChannel, Snowflake } from "@puyodead1/fosscord-api-types/v9";
import { action, makeObservable, observable, ObservableMap } from "mobx";
import BaseStore from "./BaseStore";
import ChannelStore from "./ChannelStore";

export default class ChannelsStore extends BaseStore {
  @observable readonly channels = new ObservableMap<Snowflake, ChannelStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  @action
  add(channel: APIChannel) {
    this.channels.set(channel.id, new ChannelStore(channel));
    return this.channels.get(channel.id);
  }

  @action
  remove(id: Snowflake) {
    this.channels.delete(id);
  }

  get(id: Snowflake) {
    return this.channels.get(id);
  }

  has(id: Snowflake) {
    return this.channels.has(id);
  }

  asList() {
    return Array.from(this.channels.values()).sort(
      (a, b) => a.position - b.position
    );
  }

  getGuildChannels(guild_id: Snowflake) {
    return this.asList().filter((channel) => channel.guild_id === guild_id);
  }

  get size() {
    return this.channels.size;
  }
}
