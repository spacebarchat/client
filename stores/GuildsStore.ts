import { Guild } from "@puyodead1/fosscord-types";
import { action, makeObservable, observable } from "mobx";
import { Snowflake } from "../interfaces/common";
import BaseStore from "./BaseStore";
import GuildStore from "./GuildStore";

export default class GuildsStore extends BaseStore {
  @observable guilds = observable.map<string, GuildStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  @action
  add(guild: Guild) {
    this.guilds.set(guild.id, new GuildStore(guild));
  }

  @action
  get(id: Snowflake) {
    return this.guilds.get(id);
  }

  @action
  remove(guild_id: string) {
    this.guilds.delete(guild_id);
  }
}
