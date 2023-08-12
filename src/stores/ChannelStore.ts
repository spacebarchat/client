import type { APIChannel } from "@spacebarchat/spacebar-api-types/v9";
import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { action, computed, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";
import Channel from "./objects/Channel";

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
	addAll(channels: APIChannel[]) {
		channels.forEach((channel) => this.add(channel));
	}

	get(id: string) {
		return this.channels.get(id);
	}

	@computed
	getAll() {
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

	private sortPosition(channels: Channel[]) {
		return channels.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
	}

	@computed
	get mapped(): Channel[] {
		const channels = this.getAll();

		const result: {
			id: string;
			children: Channel[];
			category: Channel | null;
		}[] = [];

		const categories = this.sortPosition(channels.filter((x) => x.type === ChannelType.GuildCategory));
		const categorizedChannels = channels.filter((x) => x.type !== ChannelType.GuildCategory && x.parentId !== null);
		const uncategorizedChannels = this.sortPosition(
			channels.filter((x) => x.type !== ChannelType.GuildCategory && x.parentId === null),
		);

		// for each category, add an object containing the category and its children
		categories.forEach((category) => {
			result.push({
				id: category.id,
				children: this.sortPosition(categorizedChannels.filter((x) => x.parentId === category.id)),
				category: category,
			});
		});

		// add an object containing the remaining uncategorized channels
		result.push({
			id: "root",
			children: uncategorizedChannels,
			category: null,
		});

		// flatten down to a single array where the category is the first element followed by its children
		return result
			.map((x) => [x.category, ...x.children])
			.flat()
			.filter((x) => x !== null) as Channel[];
	}
}
