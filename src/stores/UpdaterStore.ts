import { listen } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api/primitives";
import { action, makeAutoObservable, observable } from "mobx";
import useLogger from "../hooks/useLogger";
import Logger from "../utils/Logger";
import AppStore from "./AppStore";

export default class UpdaterStore {
	private readonly logger: Logger = useLogger("UpdaterStore");
	@observable initialized: boolean = false;
	@observable enabled: boolean = true;
	@observable checkingForUpdates: boolean = false;
	@observable updateDownloading: boolean = false;
	@observable updateDownloaded: boolean = false;
	@observable updateAvailable: boolean = false;
	@observable timer: NodeJS.Timeout | null = null;

	constructor(private readonly app: AppStore) {
		this.logger.info("Initializing UpdaterStore");
		makeAutoObservable(this);

		const setupListeners = async () => {
			await listen("CHECKING_FOR_UPDATE", () => {
				this.logger.debug("Checking for updates");
				this.setCheckingForUpdates(true);
				this.setUpdateAvailable(false);
				this.setUpdateDownloading(false);
				this.setUpdateDownloaded(false);
			});

			await listen("UPDATE_AVAILABLE", () => {
				this.logger.debug("Update available");
				this.setCheckingForUpdates(false);
				this.setUpdateAvailable(true);
				this.setUpdateDownloading(false);
				this.setUpdateDownloaded(false);
			});

			await listen("UPDATE_NOT_AVAILABLE", () => {
				this.logger.debug("Update not available");
				this.setCheckingForUpdates(false);
				this.setUpdateAvailable(false);
				this.setUpdateDownloading(false);
				this.setUpdateDownloaded(false);
			});

			await listen("UPDATE_DOWNLOADING", () => {
				this.logger.debug("Update downloading");
				this.setCheckingForUpdates(false);
				this.setUpdateAvailable(false);
				this.setUpdateDownloading(true);
				this.setUpdateDownloaded(false);
			});

			await listen("UPDATE_DOWNLOADED", () => {
				this.logger.debug("Update downloaded");
				this.setCheckingForUpdates(false);
				this.setUpdateAvailable(false);
				this.setUpdateDownloading(false);
				this.setUpdateDownloaded(true);
			});
		};

		setupListeners();

		// @ts-expect-error - expose updater to window, don't use use this though
		window.updater = {
			setUpdateAvailable: this.setUpdateAvailable.bind(this),
			setUpdateDownloading: this.setUpdateDownloading.bind(this),
			setUpdateDownloaded: this.setUpdateDownloaded.bind(this),
			setCheckingForUpdates: this.setCheckingForUpdates.bind(this),
			checkForUpdates: this.checkForUpdates.bind(this),
			downloadUpdate: this.downloadUpdate.bind(this),
			quitAndInstall: this.quitAndInstall.bind(this),
			clearUpdateCache: this.clearCache.bind(this),
		};
	}

	@action
	setCheckingForUpdates(value: boolean) {
		this.checkingForUpdates = value;
	}

	@action
	setUpdateAvailable(value: boolean) {
		this.updateAvailable = value;
	}

	@action
	setUpdateDownloading(value: boolean) {
		this.updateDownloading = value;
	}

	@action
	setUpdateDownloaded(value: boolean) {
		this.updateDownloaded = value;
	}

	async checkForUpdates() {
		if (this.checkingForUpdates) {
			this.logger.warn("Already checking for updates, skipping check");
			return;
		}

		// if (this.app.settings.ignoreUpdates) {
		// 	this.logger.warn("Ignoring updates, skipping check");
		// 	return;
		// }
		this.logger.debug("Invoking update check");
		await invoke("check_for_updates", { ignorePrereleases: false });
	}

	async downloadUpdate() {
		if (this.updateDownloading) {
			this.logger.warn("Already downloading an update");
			return;
		}

		if (this.updateDownloaded) {
			this.logger.warn("An update is already pending installation");
			return;
		}

		this.logger.debug("Invoking update download");
		await invoke("download_update");
	}

	async quitAndInstall() {
		if (!this.updateDownloaded) {
			this.logger.warn("No update is pending installation");
			return;
		}

		this.logger.debug("Invoking update install");
		await invoke("install_update");
	}

	@action
	setEnabled(value: boolean) {
		this.enabled = value;

		if (value) {
			this.enable();
		} else {
			this.disable();
		}
	}

	@action
	async enable() {
		this.logger.debug("Enabling updater");

		if (this.initialized) {
			this.logger.debug("Updater already initialized, skipping init");
			return;
		}

		// initial update check
		await this.checkForUpdates();

		// start an update timer
		this.timer = setInterval(async () => {
			this.logger.debug("[UpdateTimer] Checking for updates");
			await this.checkForUpdates();
		}, 36e5); // 1 hour

		this.initialized = true;
	}

	@action
	disable() {
		this.logger.debug("Disabling updater");
		if (this.timer) {
			clearInterval(this.timer);
		}
	}

	async clearCache() {
		this.logger.debug("Clearing update cache");
		await invoke("clear_update_cache");
	}
}
