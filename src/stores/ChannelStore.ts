import { ChannelType, type APIChannel } from "@spacebarchat/spacebar-api-types/v9";
import { Channel } from "@structures";
import { action, computed, observable, ObservableMap } from "mobx";
import AppStore from "./AppStore";

export default class ChannelStore {
	private readonly app: AppStore;
	@observable readonly channels: ObservableMap<string, Channel>;
	@observable readonly collapsedCategories: ObservableMap<string, Set<string>>; // guild -> Set<categoryId>

	constructor(app: AppStore) {
		this.app = app;
		this.channels = observable.map();
		this.collapsedCategories = observable.map();

		this.loadCollapsedState();
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

	@action
	toggleCategoryCollapse(guildId: string, categoryId: string) {
		if (!this.collapsedCategories.has(guildId)) {
			this.collapsedCategories.set(guildId, new Set());
		}

		const guildCollapsed = this.collapsedCategories.get(guildId)!;
		if (guildCollapsed.has(categoryId)) {
			guildCollapsed.delete(categoryId);
		} else {
			guildCollapsed.add(categoryId);
		}

		this.saveCollapsedStateDebounced();
	}

	@computed
	isCategoryCollapsed(guildId: string, categoryId: string): boolean {
		return this.collapsedCategories.get(guildId)?.has(categoryId) ?? false;
	}

	@computed
	getVisibleChannelsForGuild(guildId: string): Channel[] {
		const guild = this.app.guilds.get(guildId);
		if (!guild) return [];

		const allChannels = guild.channels;
		const collapsedCategories = this.collapsedCategories.get(guildId) || new Set();

		return allChannels.filter((channel, currentIndex) => {
			// Always show category channels themselves (even if collapsed)
			if (channel.type === ChannelType.GuildCategory) {
				return true;
			}

			const parentCategoryId = this.findParentCategoryId(allChannels, currentIndex);
			if (!parentCategoryId) {
				return true;
			}

			if (collapsedCategories.has(parentCategoryId)) {
				return false;
			}

			return true;
		});
	}

	private findParentCategoryId(allChannels: Channel[], channelIndex: number): string | null {
		for (let i = channelIndex - 1; i >= 0; i--) {
			const previousChannel = allChannels[i];

			if (previousChannel.type === ChannelType.GuildCategory) {
				return previousChannel.id;
			}
		}

		return null;
	}

	@action
	private loadCollapsedState() {
		try {
			const saved = localStorage.getItem("collapsedChannelCategories");
			if (saved) {
				const parsed = JSON.parse(saved);
				parsed.forEach(([guildId, categories]: [string, string[]]) => {
					this.collapsedCategories.set(guildId, new Set(categories));
				});
			}
		} catch (e) {
			console.warn("Failed to load collapsed channel categories:", e);
		}
	}

	@action
	private saveCollapsedState() {
		try {
			const serializable = Array.from(this.collapsedCategories.entries()).map(([guildId, categorySet]) => [
				guildId,
				Array.from(categorySet),
			]);
			localStorage.setItem("collapsedChannelCategories", JSON.stringify(serializable));
		} catch (e) {
			console.warn("Failed to save collapsed channel categories:", e);
		}
	}

	private saveCollapsedStateDebounced = (() => {
		let timeoutId: NodeJS.Timeout;
		return () => {
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => this.saveCollapsedState(), 500);
		};
	})();
}
