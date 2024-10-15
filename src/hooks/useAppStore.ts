import AppStore from "@stores/AppStore";

export const appStore = new AppStore();

export function useAppStore() {
	return appStore;
}
