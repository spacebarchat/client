import { APIGuild } from "discord-api-types/v9";
import { observable } from "mobx";
import BaseStore from "./BaseStore";
import GuildStore from "./GuildStore";

export default class GuildsStore extends BaseStore {
  @observable guilds: Map<string, GuildStore> = new Map();

  constructor() {
    super();
  }

  add(guild: APIGuild) {
    this.guilds.set(guild.id, new GuildStore(guild));
  }
}
