import { Snowflake as SnowflakeType } from "@puyodead1/fosscord-api-types/globals";
import {
	APIMessage,
	MessageType,
	RESTPostAPIChannelMessageJSONBody,
	RESTPostAPIChannelMessageResult,
	Routes,
} from "@puyodead1/fosscord-api-types/v9";
import { action, makeObservable, observable, ObservableMap } from "mobx";
import Snowflake from "../utils/Snowflake";
import BaseStore from "./BaseStore";
import Channel from "./Channel";
import { DomainStore } from "./DomainStore";
import Message from "./Message";

export default class MessagesStore extends BaseStore {
	private readonly domain: DomainStore;
	private readonly channel: Channel;

	@observable private readonly messages = new ObservableMap<
		SnowflakeType,
		Message
	>();

	constructor(domain: DomainStore, channel: Channel) {
		super();
		this.domain = domain;
		this.channel = channel;

		makeObservable(this);
	}

	@action
	add(message: APIMessage) {
		// check if we have a message with the same nonce, if so we just update it
		if (message.nonce && this.messages.has(message.nonce.toString())) {
			this.messages.set(
				message.nonce.toString(),
				new Message(this.domain, message),
			);
			return;
		}

		this.messages.set(message.id, new Message(this.domain, message));
	}

	@action
	addAll(messages: APIMessage[]) {
		messages.forEach((message) => this.add(message));
	}

	@action
	remove(id: SnowflakeType) {
		this.messages.delete(id);
	}

	@action
	update(message: APIMessage) {
		this.messages.get(message.id)?.update(message);
	}

	@action
	async sendMessage(data: RESTPostAPIChannelMessageJSONBody) {
		data.nonce = Snowflake.generate();
		// add a "fake" message to be rendered, this will get overwritten later
		const partial = {
			...data,
			id: data.nonce,
			author: this.domain.account.user!,
			channel_id: this.channel.id,
			timestamp: new Date().toISOString(),
			edited_timestamp: null,
			flags: undefined,
			type: MessageType.Default,
			mention_everyone: false,
			mentions: [],
			mention_roles: [],
			attachments: [],
			pinned: false,
		};

		this.add(partial as APIMessage);

		return this.domain.rest
			.post<
				RESTPostAPIChannelMessageJSONBody,
				RESTPostAPIChannelMessageResult
			>(Routes.channelMessages(this.channel.id), data)
			.then((r) => this.add(r));
	}

	get(id: SnowflakeType) {
		return this.messages.get(id);
	}

	has(id: SnowflakeType) {
		return this.messages.has(id);
	}

	asList() {
		return Array.from(this.messages.values());
	}

	get size() {
		return this.messages.size;
	}
}
