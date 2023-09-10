import type { APIMessage } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, makeAutoObservable, observable } from "mobx";

import type { IObservableArray } from "mobx";
import Snowflake from "../utils/Snowflake";
import AppStore from "./AppStore";
import type { QueuedMessageData } from "./objects/QueuedMessage";
import QueuedMessage, { QueuedMessageStatus } from "./objects/QueuedMessage";

export default class MessageQueue {
	@observable private readonly messages: IObservableArray<QueuedMessage>;

	constructor(private readonly app: AppStore) {
		this.messages = observable.array([]);

		makeAutoObservable(this);
	}

	@action
	add(data: QueuedMessageData) {
		// this.messages.push({
		// 	...data,
		// 	timestamp: new Date(),
		// 	status: QueuedMessageStatus.SENDING,
		// 	type: MessageType.Default,
		// });
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
		return this.messages.filter((message) => message.channel === channel);
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
