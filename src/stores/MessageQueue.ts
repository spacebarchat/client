import type { APIAttachment, APIMessage } from "@spacebarchat/spacebar-api-types/v9";
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
	attachments?: File[];
};

export interface QueuedMessage {
	id: string;
	status: QueuedMessageStatus;
	error?: string;
	channel: string;
	author: User;
	content: string;
	timestamp: Date;
	type: MessageType;
	attachments: APIAttachment[];
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
			type: MessageType.Default,
			attachments:
				data.attachments?.map((x) => ({
					id: Snowflake.generate(),
					filename: x.name,
					size: x.size,
					url: URL.createObjectURL(x),
					proxy_url: URL.createObjectURL(x),
					height: 0,
					width: 0,
					content_type: x.type,
				})) ?? [],
		});
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
