import type { APIChannel } from "@spacebarchat/spacebar-api-types/v9";
import { Channel } from "@structures";
import { action, computed, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";

export default class ChannelStore {
	private readonly app: AppStore;
	@observable readonly channels = new ObservableMap<string, Channel>();

	constructor(app: AppStore) {
		this.app = app;
	}

	@action
	add(channel: APIChannel) {
		this.channels.set(channel.id, new Channel(this.app, channel));
	}

	@action
	update(channel: APIChannel) {
		const existing = this.channels.get(channel.id);
		if (existing) {
			existing.update(channel);
		} else {
			this.add(channel);
		}
	}

	@action
	addAll(channels: APIChannel[]) {
		channels.forEach((channel) => this.add(channel));
	}

	get(id: string) {
		return this.channels.get(id);
	}

	@computed
	get all() {
		return Array.from(this.channels.values());
	}

	@action
	remove(id: string) {
		this.channels.delete(id);
	}

	@computed
	get count() {
		return this.channels.size;
	}

	sortPosition(channels: Channel[]) {
		return channels.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
	}

	has(id: string) {
		return this.channels.has(id);
	}
}
