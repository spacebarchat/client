import {APIChannel} from '@puyodead1/fosscord-api-types/v9';
import {action, computed, observable, ObservableMap} from 'mobx';
import BaseStore from './BaseStore';

export default class PrivateChannelStore extends BaseStore {
  @observable readonly channels = new ObservableMap<string, APIChannel>(); // TODO: object

  constructor() {
    super();
  }

  @action
  add(channel: APIChannel) {
    this.channels.set(channel.id, channel);
  }

  @action
  addAll(channels: APIChannel[]) {
    channels.forEach(channel => this.add(channel));
  }

  get(id: string) {
    return this.channels.get(id);
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
