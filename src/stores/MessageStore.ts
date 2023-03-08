import {APIMessage} from '@puyodead1/fosscord-api-types/v9';
import {action, computed, observable, ObservableMap} from 'mobx';
import BaseStore from './BaseStore';
import Message from './objects/Message';

export default class MessageStore extends BaseStore {
  @observable readonly messages = new ObservableMap<string, Message>();

  constructor() {
    super();
  }

  @action
  add(message: APIMessage) {
    this.messages.set(message.id, new Message(message));
  }

  @action
  addAll(messages: APIMessage[]) {
    messages.forEach(message => this.add(message));
  }

  get(id: string) {
    return this.messages.get(id);
  }

  @computed
  getAll() {
    return Array.from(this.messages.values());
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
