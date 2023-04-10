import { computed, makeAutoObservable } from "mobx";
import type { Theme } from "../contexts/Theme";
import { ThemePresets } from "../contexts/Theme";

export default class ThemeStore {
	constructor() {
		makeAutoObservable(this);
	}

	@computed
	getVariables(): Theme {
		return {
			...ThemePresets["dark"],
			light: false,
		};
	}

	@computed
	computeVariables() {
		const variables = this.getVariables();

		return variables as unknown as Theme;
	}
}
