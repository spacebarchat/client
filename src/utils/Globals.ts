import Logger from "./Logger";

export interface RouteSettings {
	api: string;
	cdn: string;
	gateway: string;
	wellknown: string;
}

export const DefaultRouteSettings: RouteSettings = {
	api: "https://api.old.server.spacebar.chat/api",
	cdn: "https://cdn.old.server.spacebar.chat",
	gateway: "wss://gateway.old.server.spacebar.chat",
	wellknown: "https://spacebar.chat",
};

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
		localStorage.setItem(
			"routeSettings",
			JSON.stringify(Globals.routeSettings),
		);
	},
	routeSettings: DefaultRouteSettings,
};
