import {action, computed, makeObservable, observable} from 'mobx';
import {APICustomMessage} from '../interfaces/api';
import BaseStore from './BaseStore';
import {DomainStore} from './DomainStore';
import Message from './objects/Message';

export default class MessageStore extends BaseStore {
  private readonly domain: DomainStore;

  @observable readonly messages = observable.array<Message>([]);

  constructor(domain: DomainStore) {
    super();
    this.domain = domain;

    makeObservable(this);
  }

  @action
  add(message: APICustomMessage) {
    this.messages.push(new Message(this.domain, message));
  }

  @action
  addAll(messages: APICustomMessage[]) {
    messages.forEach(message => this.add(message));
  }

  get(id: string) {
    return this.messages.find(message => message.id === id);
  }

  getAll() {
    return Array.from(this.messages.values()).sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
    );
  }

  has(id: string) {
    return this.messages.some(message => message.id === id);
  }

  @action
  remove(id: string) {
    const message = this.get(id);
    if (!message) {
      return;
    }
    this.messages.remove(message);
  }

  @action
  update(message: APICustomMessage) {
    const oldMessage = this.get(message.id);
    if (!oldMessage) {
      return;
    }
    const newMessage = new Message(this.domain, message);
    // replace
    this.messages[this.messages.indexOf(oldMessage)] = newMessage;
  }

  @computed
  get count() {
    return this.messages.length;
  }
}
