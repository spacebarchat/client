import {APIMessage} from '@spacebarchat/spacebar-api-types/v9';
import {
  action,
  computed,
  IObservableArray,
  makeAutoObservable,
  observable,
} from 'mobx';
import Snowflake from '../utils/Snowflake';
import User from './objects/User';

export enum QueuedMessageStatus {
  SENDING = 'sending',
  FAILED = 'failed',
}

export type QueuedMessageData = {
  id: string;
  channel: string;
  author: User;
  content: string;
};

export interface QueuedMessage {
  id: string;
  status: QueuedMessageStatus;
  error?: string;
  channel: string;
  author: User;
  content: string;
  timestamp: Date;
}

export default class MessageQueue {
  @observable private readonly messages: IObservableArray<QueuedMessage>;

  constructor() {
    this.messages = observable.array([]);

    makeAutoObservable(this);
  }

  @action
  add(data: QueuedMessageData) {
    this.messages.push({
      ...data,
      timestamp: new Date(),
      status: QueuedMessageStatus.SENDING,
    });
  }

  @action
  remove(id: string) {
    const message = this.messages.find(x => x.id === id)!;
    this.messages.remove(message);
  }

  @action
  send(id: string) {
    const message = this.messages.find(x => x.id === id)!;
    message.status = QueuedMessageStatus.SENDING;
  }

  @action
  error(id: string, error: string) {
    const message = this.messages.find(x => x.id === id)!;
    message.error = error;
    message.status = QueuedMessageStatus.FAILED;
  }

  @computed
  get(channel: Snowflake) {
    return this.messages.filter(message => message.channel === channel);
  }

  @action
  handleIncomingMessage(message: APIMessage) {
    if (!message.nonce) {
      return;
    }
    if (!this.get(message.channel_id).find(x => x.id === message.nonce)) {
      return;
    }

    this.remove(message.nonce.toString());
  }
}
