import Logger from "./Logger";
import { DefaultRouteSettings, RouteSettings } from "./constants";

const logger = new Logger("Globals");

export const Globals: {
	load: () => void;
	save: () => void;
	routeSettings: RouteSettings;
} = {
	load: () => {
		logger.info("Initializing Globals");
		const settings = localStorage.getItem("routeSettings");

		if (!settings) {
			return;
		}

		Globals.routeSettings = JSON.parse(settings);
		logger.info("Loaded route settings from storage");
	},
	save: () => {
		localStorage.setItem("routeSettings", JSON.stringify(Globals.routeSettings));
	},
	routeSettings: DefaultRouteSettings,
};
