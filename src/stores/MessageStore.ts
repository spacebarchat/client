import {
  action,
  computed,
  makeObservable,
  observable,
  ObservableMap,
} from 'mobx';
import {APICustomMessage} from '../interfaces/api';
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
  add(message: APICustomMessage) {
    this.messages.set(message.id, new Message(this.domain, message));
  }

  @action
  addAll(messages: APICustomMessage[]) {
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

  @action
  update(message: APICustomMessage) {
    this.messages.set(message.id, new Message(this.domain, message));
  }

  @computed
  get count() {
    return this.messages.size;
  }
}
