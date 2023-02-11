import { Guild } from "@puyodead1/fosscord-types";
import { action, makeObservable, observable } from "mobx";
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
}
