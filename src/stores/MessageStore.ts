import type { APIMessage } from "@spacebarchat/spacebar-api-types/v9";
import type { IObservableArray } from "mobx";
import { action, computed, makeObservable, observable } from "mobx";
import useLogger from "../hooks/useLogger";
import Logger from "../utils/Logger";
import AppStore from "./AppStore";
import Message from "./objects/Message";

export default class MessageStore {
	private readonly app: AppStore;
	private readonly logger: Logger;

	@observable private readonly messagesArr: IObservableArray<Message>;

	constructor(app: AppStore) {
		this.app = app;
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
		const groupedMessages: Message[][] = [];
		let lastAuthorId: string | undefined = undefined;
		let lastTimestamp: Date | undefined = undefined;
		let lastGroup: Message[] | undefined = undefined;
		for (const message of this.messagesArr) {
			if (
				lastAuthorId !== message.author.id ||
				!lastTimestamp ||
				message.timestamp.getTime() - lastTimestamp.getTime() > 1000 * 60 * 7
			) {
				// start a new group
				lastAuthorId = message.author.id;
				lastTimestamp = message.timestamp;
				lastGroup = [];
				groupedMessages.push(lastGroup);
			}
			if (!lastGroup) {
				// this should never happen
				this.logger.error("lastGroup is undefined");
				continue;
			}
			lastGroup.push(message);
		}

		return groupedMessages;
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
