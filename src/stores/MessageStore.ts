import { MessageType, type APIMessage } from "@spacebarchat/spacebar-api-types/v9";
import type { IObservableArray } from "mobx";
import { action, computed, makeObservable, observable } from "mobx";
import useLogger from "../hooks/useLogger";
import Logger from "../utils/Logger";
import AppStore from "./AppStore";
import Message, { MessageLike } from "./objects/Message";
import User from "./objects/User";

export interface MessageGroup {
	author: User;
	messages: MessageLike[];
}

export default class MessageStore {
	private readonly app: AppStore;
	private readonly channelId;
	private readonly logger: Logger;

	@observable private readonly messages: IObservableArray<Message>;

	constructor(app: AppStore, channelId: string) {
		this.app = app;
		this.channelId = channelId;
		// eslint-disable-next-line react-hooks/rules-of-hooks
		this.logger = useLogger("MessageStore.ts");

		this.messages = observable.array([]);

		makeObservable(this);
	}

	@action
	add(message: APIMessage) {
		this.messages.push(new Message(this.app, message));
	}

	@action
	addAll(messages: APIMessage[]) {
		messages.forEach((message) => this.add(message));
	}

	get(id: string) {
		return this.messages.find((message) => message.id === id);
	}

	has(id: string) {
		return this.messages.some((message) => message.id === id);
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
	update(message: APIMessage) {
		const oldMessage = this.get(message.id);
		if (!oldMessage) {
			return;
		}
		const newMessage = new Message(this.app, message);
		// replace
		this.messages[this.messages.indexOf(oldMessage)] = newMessage;
	}

	@computed
	get count() {
		return this.messages.length;
	}

	@computed get groups(): MessageGroup[] {
		// Sort messages by timestamp in descending order (most recent first)
		const sortedMessages: MessageLike[] = [
			...this.messages,
			...Array.from(this.app.queue.messages.values()).filter((x) => x.channel_id === this.channelId),
		]
			.slice()
			.sort((a, b) => {
				return b.timestamp.getTime() - a.timestamp.getTime();
			});

		const sortedGroups = sortedMessages
			.slice()
			.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
			.reduce((groups, message) => {
				const lastGroup = groups[groups.length - 1];
				const lastMessage = lastGroup?.messages[lastGroup.messages.length - 1];
				if (
					lastMessage &&
					lastMessage.author.id === message.author.id &&
					lastMessage.type === message.type &&
					message.type === MessageType.Default &&
					message.timestamp.getTime() - lastMessage.timestamp.getTime() <= 10 * 60 * 1000
				) {
					// add to last group
					lastGroup.messages.unshift(message);
				} else {
					// create new group
					groups.push({
						author: message.author,
						messages: [message],
					});
				}
				return groups;
			}, [] as MessageGroup[])
			.reverse();

		return sortedGroups;
	}
}
