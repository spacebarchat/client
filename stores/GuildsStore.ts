import { Guild } from "@puyodead1/fosscord-types";
import { action, makeObservable, observable } from "mobx";
import { Snowflake } from "../interfaces/common";
import BaseStore from "./BaseStore";
import GuildStore from "./GuildStore";

export default class GuildsStore extends BaseStore {
  @observable private readonly guilds = observable.map<Snowflake, GuildStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  @action
  add(guild: Guild) {
    this.guilds.set(guild.id, new GuildStore(guild));
  }

  @action
  remove(guild_id: string) {
    this.guilds.delete(guild_id);
  }

  get(id: Snowflake) {
    return this.guilds.get(id);
  }

  asList() {
    return Array.from(this.guilds.values());
  }
}
