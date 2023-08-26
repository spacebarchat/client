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
		// sort messages from the same author and within 7 minutes of each other into groups sorted by time, oldest messages at the end of the list and newest at the start, each groups messages should be sorted from oldest to newest
		const sortedGroups = this.messagesArr
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
			}, [] as Message[][])
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
