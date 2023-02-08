import { makeObservable, observable } from "mobx";
import { APIGuild } from "../interfaces/api/Guild";
import { GatewayGuildCreateDispatchData } from "../interfaces/gateway/Gateway";
import BaseStore from "./BaseStore";
import GuildStore from "./GuildStore";

export default class GuildsStore extends BaseStore {
  @observable guilds = observable.map<string, GuildStore>();

  constructor() {
    super();

    makeObservable(this);
  }

  add(guild: GatewayGuildCreateDispatchData | APIGuild) {
    this.guilds.set(guild.id, new GuildStore(guild));
  }
}
