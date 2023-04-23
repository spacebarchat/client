interface RouteSettings {
	api: string;
	cdn: string;
	gateway: string;
}

export const DefaultRouteSettings: RouteSettings = {
	api: "https://api.old.server.spacebar.chat/api",
	cdn: "https://cdn.old.server.spacebar.chat",
	gateway: "wss://gateway.old.server.spacebar.chat",
};

export const Globals: {
	//   logger: {
	//     debug: (...args: unknown[]) => void;
	//     info: (...args: unknown[]) => void;
	//     warn: (...args: unknown[]) => void;
	//     error: (...args: unknown[]) => void;
	//   };
	load: () => void;
	save: () => void;
	routeSettings: RouteSettings;
} = {
	//   logger: useLogger('Globals'),
	load: () => {
		//   Globals.logger.info('Initializing Globals');
		console.log("Initializing Globals");
		const settings = localStorage.getItem("routeSettings");

		if (!settings) {
			return;
		}

		Globals.routeSettings = JSON.parse(settings);
		//   Globals.logger.info('Loaded route settings from storage');
		console.log("Loaded route settings from storage");
	},
	save: () => {
		localStorage.setItem(
			"routeSettings",
			JSON.stringify(Globals.routeSettings),
		);
	},
	routeSettings: DefaultRouteSettings,
};
