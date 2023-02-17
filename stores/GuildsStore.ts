import { APIGuild, Snowflake } from "@puyodead1/fosscord-api-types/v9";
import { action, makeObservable, observable } from "mobx";
import BaseStore from "./BaseStore";
import GuildStore from "./GuildStore";

export default class GuildsStore extends BaseStore {
  @observable private readonly guilds = observable.map<Snowflake, GuildStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  @action
  add(guild: APIGuild) {
    this.guilds.set(guild.id, new GuildStore(guild));
  }

  @action
  remove(guild_id: string) {
    this.guilds.delete(guild_id);
  }

  get(id: Snowflake) {
    return this.guilds.get(id);
  }

  has(id: Snowflake) {
    return this.guilds.has(id);
  }

  asList() {
    return Array.from(this.guilds.values());
  }

  get size() {
    return this.guilds.size;
  }
}
