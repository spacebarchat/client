import type { APIMessage } from "@spacebarchat/spacebar-api-types/v9";
import type { IObservableArray } from "mobx";
import { action, computed, makeObservable, observable } from "mobx";
import AppStore from "./AppStore";
import Message from "./objects/Message";

export default class MessageStore {
	private readonly app: AppStore;

	@observable private readonly messagesArr: IObservableArray<Message>;

	constructor(app: AppStore) {
		this.app = app;

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
	get messages() {
		return this.messagesArr
			.slice()
			.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
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
