import { ThemePresets, type Theme } from "@contexts/Theme";
import { PresenceUpdateStatus } from "@spacebarchat/spacebar-api-types/v9";
import { computed, makeAutoObservable } from "mobx";

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

	@computed
	getStatusColor(status?: PresenceUpdateStatus) {
		switch (status) {
			case PresenceUpdateStatus.Online:
				return ThemePresets["dark"].successLight;
			case PresenceUpdateStatus.Idle:
				return ThemePresets["dark"].statusIdle;
			case PresenceUpdateStatus.DoNotDisturb:
				return ThemePresets["dark"].dangerLight;
			case PresenceUpdateStatus.Offline:
			default:
				return ThemePresets["dark"].statusOffline;
		}
	}
}
