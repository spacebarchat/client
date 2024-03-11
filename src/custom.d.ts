// declare module "*.svg" {
// 	import React = require("react");
// 	export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
// 	const src: string;
// 	export default src;
// }

interface GlobalVersionInfo {
	tauri: string;
	app: string;
	platform: {
		name: string;
		arch: string;
		version: string;
		locale: string | null;
	};
}

interface Window {
	windowToggleFps: () => void;
	globals: {
		tauriVersion: string;
		appVersion: string;
		platform: {
			name: string;
			arch: string;
			version: string;
			locale: string | null;
		};
	};
	updater: {
		setUpdateAvailable: (value: boolean) => void;
		setUpdateDownloading: (value: boolean) => void;
		setUpdateDownloaded: (value: boolean) => void;
		setCheckingForUpdates: (value: boolean) => void;
		checkForUpdates: () => Promise<void>;
		downloadUpdate: () => Promise<void>;
		quitAndInstall: () => Promise<void>;
		clearUpdateCache: () => Promise<void>;
	};
}
