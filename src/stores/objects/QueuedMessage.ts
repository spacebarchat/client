import { MessageType } from "@spacebarchat/spacebar-api-types/v9";
import { action, makeAutoObservable, observable } from "mobx";
import { QueuedMessageData, QueuedMessageStatus } from "../MessageQueue";
import User from "./User";

export default class QueuedMessage {
	id: string;
	channel: string;
	author: User;
	content: string;
	files?: File[];
	@observable progress = 0;
	status: QueuedMessageStatus;
	error?: string;
	timestamp: Date;
	type: MessageType;
	abortCallback?: () => void;

	constructor(data: QueuedMessageData) {
		this.id = data.id;
		this.channel = data.channel;
		this.author = data.author;
		this.content = data.content;
		this.files = data.files;
		this.status = QueuedMessageStatus.SENDING;
		this.timestamp = new Date();
		this.type = MessageType.Default;

		makeAutoObservable(this);
	}

	@action
	updateProgress(e: ProgressEvent) {
		this.progress = Math.round((e.loaded / e.total) * 100);
	}

	setAbortCallback(cb: () => void) {
		this.abortCallback = cb;
	}

	abort() {
		if (this.abortCallback) {
			this.abortCallback();
		}
	}
}
