// base class for messages and queued messages

import { Snowflake } from "@spacebarchat/spacebar-api-types/globals";
import { MessageType } from "@spacebarchat/spacebar-api-types/v9";
import { observable } from "mobx";
import { USER_JOIN_MESSAGES } from "../../utils/constants";
import AppStore from "../AppStore";
import { MessageLikeData } from "./Message";
import User from "./User";

export default class MessageBase {
	/**
	 * ID of the message
	 */
	id: Snowflake;
	/**
	 * Contents of the message
	 */
	@observable content: string;
	/**
	 * When this message was sent
	 */
	timestamp: Date;
	/**
	 * Type of message
	 */
	type: MessageType;
	author: User;

	constructor(
		public readonly app: AppStore,
		data: MessageLikeData,
	) {
		this.id = data.id;
		this.content = data.content;
		this.timestamp = new Date(data.timestamp);
		this.type = data.type;

		if (this.app.users.has(data.author.id)) {
			this.author = this.app.users.get(data.author.id) as User;
		} else {
			const user = new User(data.author);
			this.app.users.users.set(user.id, user);
			this.author = user;
		}
	}

	getJoinMessage() {
		if (this.type !== MessageType.UserJoin) throw new Error("Message is not a user join message");
		return USER_JOIN_MESSAGES[this.timestamp.getTime() % 13];
	}
}
