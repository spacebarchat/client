import {APIMessage} from '@puyodead1/fosscord-api-types/v9';
import {
  action,
  computed,
  makeObservable,
  observable,
  ObservableMap,
} from 'mobx';
import BaseStore from './BaseStore';
import {DomainStore} from './DomainStore';
import Message from './objects/Message';

export default class MessageStore extends BaseStore {
  private readonly domain: DomainStore;

  @observable readonly messages = new ObservableMap<string, Message>();

  constructor(domain: DomainStore) {
    super();
    this.domain = domain;

    makeObservable(this);
  }

  @action
  add(message: APIMessage) {
    this.messages.set(message.id, new Message(this.domain, message));
  }

  @action
  addAll(messages: APIMessage[]) {
    messages.forEach(message => this.add(message));
  }

  get(id: string) {
    return this.messages.get(id);
  }

  getAll() {
    return Array.from(this.messages.values());
  }

  has(id: string) {
    return this.messages.has(id);
  }

  @action
  remove(id: string) {
    this.messages.delete(id);
  }

  @computed
  get count() {
    return this.messages.size;
  }
}
