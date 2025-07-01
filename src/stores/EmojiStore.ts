import type { APIEmoji } from "@spacebarchat/spacebar-api-types/v9";
import Emoji from "./objects/Emoji";
import { action, computed, makeAutoObservable, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";

export default class EmojiStore {
	private readonly app: AppStore;
	@observable private readonly emojis: ObservableMap<string, Emoji>;

	constructor(app: AppStore) {
		this.app = app;
		this.emojis = observable.map();
		makeAutoObservable(this);
	}

	@action
	add(emoji: APIEmoji) {
		if (!emoji.id) return;
		this.emojis.set(emoji.id, new Emoji(emoji));
	}

	@action
	addAll(emojis: APIEmoji[]) {
		emojis.forEach((emoji) => this.add(emoji));
	}

	get(id: string) {
		return this.emojis.get(id);
	}

	@computed
	get all() {
		return Array.from(this.emojis.values());
	}
}
