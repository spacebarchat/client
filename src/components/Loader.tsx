import { observer } from "mobx-react-lite";
import React from "react";
import LoadingPage from "../pages/LoadingPage";
import { useAppStore } from "../stores/AppStore";

interface Props {
	children: React.ReactNode;
}
function Loader(props: Props) {
	const app = useAppStore();

	if (!app.isReady) {
		return <LoadingPage />;
	}

	return <>{props.children}</>;
}

export default observer(Loader);
