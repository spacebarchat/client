import type { APIReadState } from "@spacebarchat/spacebar-api-types/v9";
import { ObservableMap, action, computed, observable } from "mobx";
import AppStore from "./AppStore";
import ReadState from "./objects/ReadState";

export default class ReadStateStore {
	private readonly app: AppStore;
	@observable readonly readstates = new ObservableMap<string, ReadState>();

	constructor(app: AppStore) {
		this.app = app;
	}

	@action
	add(readstate: APIReadState) {
		this.readstates.set(readstate.id, new ReadState(this.app, readstate));
	}

	@action
	update(readstate: APIReadState) {
		const existing = this.readstates.get(readstate.id);
		if (existing) {
			existing.update(readstate);
		} else {
			this.add(readstate);
		}
	}

	@action
	addAll(readstates: APIReadState[]) {
		readstates.forEach((readstate) => this.add(readstate));
	}

	/**
	 * Get a channels readstate
	 * @param id channel id
	 * @returns
	 */
	get(id: string) {
		return this.readstates.get(id);
	}

	@computed
	get all() {
		return Array.from(this.readstates.values());
	}

	@action
	remove(id: string) {
		this.readstates.delete(id);
	}

	@computed
	get count() {
		return this.readstates.size;
	}

	has(id: string) {
		return this.readstates.has(id);
	}
}
