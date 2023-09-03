import type { APIMessage } from "@spacebarchat/spacebar-api-types/v9";
import type { IObservableArray } from "mobx";
import { action, computed, makeObservable, observable } from "mobx";
import useLogger from "../hooks/useLogger";
import Logger from "../utils/Logger";
import AppStore from "./AppStore";
import Message from "./objects/Message";
import QueuedMessage from "./objects/QueuedMessage";

export default class MessageStore {
	private readonly app: AppStore;
	private readonly channelId;
	private readonly logger: Logger;

	@observable private readonly messagesArr: IObservableArray<Message>;

	constructor(app: AppStore, channelId: string) {
		this.app = app;
		this.channelId = channelId;
		this.logger = useLogger("MessageStore.ts");

		this.messagesArr = observable.array([]);

		makeObservable(this);
	}

	@action
	add(message: APIMessage) {
		this.messagesArr.push(new Message(this.app, message));
	}

	@action
	addAll(messages: APIMessage[]) {
		messages.forEach((message) => this.add(message));
	}

	get(id: string) {
		return this.messagesArr.find((message) => message.id === id);
	}

	@computed
	get grouped() {
		const messages = [...this.messagesArr, ...this.app.queue.get(this.channelId)];
		const sortedGroups = messages
			.slice()
			.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
			.reduce((groups, message) => {
				const lastGroup = groups[groups.length - 1];
				const lastMessage = lastGroup?.[lastGroup.length - 1];
				if (
					lastMessage &&
					lastMessage.author.id === message.author.id &&
					message.timestamp.getTime() - lastMessage.timestamp.getTime() <= 7 * 60 * 1000
				) {
					// add to last group
					lastGroup.push(message);
				} else {
					// create new group
					groups.push([message]);
				}
				return groups;
			}, [] as (Message | QueuedMessage)[][])
			.map((group) => group.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()))
			.reverse();

		return sortedGroups;
	}

	has(id: string) {
		return this.messagesArr.some((message) => message.id === id);
	}

	@action
	remove(id: string) {
		const message = this.get(id);
		if (!message) {
			return;
		}
		this.messagesArr.remove(message);
	}

	@action
	update(message: APIMessage) {
		const oldMessage = this.get(message.id);
		if (!oldMessage) {
			return;
		}
		const newMessage = new Message(this.app, message);
		// replace
		this.messagesArr[this.messagesArr.indexOf(oldMessage)] = newMessage;
	}

	@computed
	get count() {
		return this.messagesArr.length;
	}
}
