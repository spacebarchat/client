import type { APIMessage } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, makeAutoObservable, observable, type IObservableArray } from "mobx";

import { QueuedMessage, QueuedMessageStatus, type QueuedMessageData } from "@structures";
import Snowflake from "@utils/Snowflake";
import AppStore from "./AppStore";

export default class MessageQueue {
	@observable readonly messages: IObservableArray<QueuedMessage>;

	constructor(private readonly app: AppStore) {
		this.messages = observable.array([]);

		makeAutoObservable(this);
	}

	@action
	add(data: QueuedMessageData) {
		const msg = new QueuedMessage(this.app, data);
		this.messages.push(msg);
		return msg;
	}

	@action
	remove(id: string) {
		const message = this.messages.find((x) => x.id === id)!;
		this.messages.remove(message);
	}

	@action
	send(id: string) {
		const message = this.messages.find((x) => x.id === id)!;
		message.status = QueuedMessageStatus.SENDING;
	}

	@computed
	get(channel: Snowflake) {
		return this.messages.filter((message) => message.channel_id === channel);
	}

	@action
	handleIncomingMessage(message: APIMessage) {
		if (!message.nonce) {
			return;
		}
		if (!this.get(message.channel_id).find((x) => x.id === message.nonce)) {
			return;
		}

		this.remove(message.nonce.toString());
	}
}
