import { useAppStore } from "@hooks/useAppStore";
import LoadingPage from "@pages/LoadingPage";
import { invoke } from "@tauri-apps/api/core";
import { isTauri } from "@utils";
import { observer } from "mobx-react-lite";
import React from "react";

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
