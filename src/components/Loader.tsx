import { invoke } from "@tauri-apps/api/primitives";
import { observer } from "mobx-react-lite";
import React from "react";
import LoadingPage from "../pages/LoadingPage";
import { useAppStore } from "../stores/AppStore";
import { isTauri } from "../utils/Utils";

interface Props {
	children: React.ReactNode;
}
function Loader(props: Props) {
	const app = useAppStore();

	if (!app.isReady) {
		return <LoadingPage />;
	}

	// close tauri splashscreen
	if (isTauri) invoke("close_splashscreen");

	return <>{props.children}</>;
}

export default observer(Loader);
