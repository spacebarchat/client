import type { APIMessage } from "@spacebarchat/spacebar-api-types/v9";
import { MessageType } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, makeAutoObservable, observable } from "mobx";

import type { IObservableArray } from "mobx";
import Snowflake from "../utils/Snowflake";
import User from "./objects/User";

export enum QueuedMessageStatus {
	SENDING = "sending",
	FAILED = "failed",
}

export type QueuedMessageData = {
	id: string;
	channel: string;
	author: User;
	content: string;
	files?: File[];
};

// export interface QueuedMessage extends QueuedMessageData {
// 	status: QueuedMessageStatus;
// 	error?: string;
// 	timestamp: Date;
// 	type: MessageType;
// }

export class QueuedMessage implements QueuedMessageData {
	id: string;
	channel: string;
	author: User;
	content: string;
	files?: File[];
	@observable progress: number;
	status: QueuedMessageStatus;
	error?: string;
	timestamp: Date;
	type: MessageType;

	constructor(data: QueuedMessageData) {
		this.id = data.id;
		this.channel = data.channel;
		this.author = data.author;
		this.content = data.content;
		this.files = data.files;
		this.progress = 0;
		this.status = QueuedMessageStatus.SENDING;
		this.timestamp = new Date();
		this.type = MessageType.Default;

		makeAutoObservable(this);
	}

	@action
	progressCallback(e: ProgressEvent) {
		this.progress = Math.round((e.loaded / e.total) * 100);
		console.log(this.progress);
	}
}

export default class MessageQueue {
	@observable private readonly messages: IObservableArray<QueuedMessage>;

	constructor() {
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
		const msg = new QueuedMessage(data);
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

	@action
	error(id: string, error: string) {
		const message = this.messages.find((x) => x.id === id)!;
		message.error = error;
		message.status = QueuedMessageStatus.FAILED;
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
