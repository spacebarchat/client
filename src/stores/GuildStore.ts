import {GatewayGuild} from '@puyodead1/fosscord-api-types/v9';
import {action, computed, observable, ObservableMap} from 'mobx';
import BaseStore from './BaseStore';
import {DomainStore} from './DomainStore';
import Guild from './objects/Guild';

export default class GuildStore extends BaseStore {
  private readonly domain: DomainStore;
  @observable initialGuildsLoaded = false;
  @observable readonly guilds = new ObservableMap<string, Guild>();

  constructor(domain: DomainStore) {
    super();
    this.domain = domain;
  }

  @action
  setInitialGuildsLoaded() {
    this.initialGuildsLoaded = true;
    this.logger.debug('Initial guilds loaded');
  }

  @action
  add(guild: GatewayGuild) {
    this.guilds.set(guild.id, new Guild(this.domain, guild));
  }

  @action
  addAll(guilds: GatewayGuild[]) {
    guilds.forEach(guild => this.add(guild));
  }

  get(id: string) {
    return this.guilds.get(id);
  }

  @computed
  getAll() {
    return Array.from(this.guilds.values());
  }

  @action
  remove(id: string) {
    this.guilds.delete(id);
  }

  @computed
  get count() {
    return this.guilds.size;
  }
}
