import {APIChannel} from '@spacebarchat/spacebar-api-types/v9';
import {action, computed, observable, ObservableMap} from 'mobx';
import BaseStore from './BaseStore';
import {DomainStore} from './DomainStore';
import Channel from './objects/Channel';

export default class PrivateChannelStore extends BaseStore {
  private readonly domain: DomainStore;
  @observable readonly channels = new ObservableMap<string, Channel>();

  constructor(domain: DomainStore) {
    super();
    this.domain = domain;
  }

  @action
  add(channel: APIChannel) {
    this.channels.set(channel.id, new Channel(this.domain, channel));
  }

  @action
  addAll(channels: APIChannel[]) {
    channels.forEach(channel => this.add(channel));
  }

  get(id: string) {
    return this.channels.get(id);
  }

  @computed
  getAll() {
    return Array.from(this.channels.values());
  }

  @action
  remove(id: string) {
    this.channels.delete(id);
  }

  @computed
  get count() {
    return this.channels.size;
  }
}
