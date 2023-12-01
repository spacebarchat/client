import { APIUser, MessageType } from "@spacebarchat/spacebar-api-types/v9";
import { action, makeObservable, observable } from "mobx";
import AppStore from "../AppStore";
import MessageBase from "./MessageBase";

export enum QueuedMessageStatus {
	SENDING = "sending",
	FAILED = "failed",
}

export type QueuedMessageData = {
	id: string;
	channel_id: string;
	guild_id?: string;
	content: string;
	files?: File[];
	timestamp: string;
	type: MessageType;
	author: APIUser;
};

export default class QueuedMessage extends MessageBase {
	channel_id: string;
	guild_id?: string;
	files?: File[];
	@observable progress = 0;
	@observable status: QueuedMessageStatus;
	@observable error?: string;
	abortCallback?: () => void;

	constructor(app: AppStore, data: QueuedMessageData) {
		super(app, data);
		this.id = data.id;
		this.channel_id = data.channel_id;
		this.guild_id = data.guild_id;
		this.files = data.files;
		this.status = QueuedMessageStatus.SENDING;

		makeObservable(this);
	}

	@action
	updateProgress(e: ProgressEvent) {
		this.progress = Math.round((e.loaded / e.total) * 100);
	}

	@action
	setAbortCallback(cb: () => void) {
		this.abortCallback = cb;
	}

	abort() {
		if (this.abortCallback) {
			this.abortCallback();
		}
	}

	@action
	/**
	 * Mark this message as failed.
	 */
	fail(error: string) {
		this.error = error;
		this.status = QueuedMessageStatus.FAILED;
	}

	delete() {
		//
	}
}
