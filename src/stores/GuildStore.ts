import {GatewayGuild} from '@puyodead1/fosscord-api-types/v9';
import {action, computed, observable, ObservableMap} from 'mobx';
import BaseStore from './BaseStore';
import Guild from './objects/Guild';

export default class GuildStore extends BaseStore {
  @observable initialGuildsLoaded = false;
  @observable readonly guilds = new ObservableMap<string, Guild>();

  constructor() {
    super();
  }

  @action
  setInitialGuildsLoaded() {
    this.initialGuildsLoaded = true;
    this.logger.debug('Initial guilds loaded');
  }

  @action
  add(guild: GatewayGuild) {
    this.guilds.set(guild.id, new Guild(guild));
  }

  @action
  addAll(guilds: GatewayGuild[]) {
    guilds.forEach(guild => this.add(guild));
  }

  get(id: string) {
    return this.guilds.get(id);
  }

  @action
  remove(id: string) {
    this.guilds.delete(id);
  }

  @computed
  get guildCount() {
    return this.guilds.size;
  }
}
