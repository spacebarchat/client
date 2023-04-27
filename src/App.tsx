import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { AuthenticationGuard } from "./components/guards/AuthenticationGuard";
import LoadingPage from "./pages/LoadingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";
import RegistrationPage from "./pages/RegistrationPage";

import { reaction } from "mobx";
import { UnauthenticatedGuard } from "./components/guards/UnauthenticatedGuard";
import RootPage from "./pages/RootPage";
import { useAppStore } from "./stores/AppStore";
import { Globals } from "./utils/Globals";

function App() {
	const app = useAppStore();

	React.useEffect(() => {
		Globals.load();
		app.loadToken();

		console.debug("Loading complete");
		app.setAppLoading(false);
	}, []);

	// Handles gateway connection/disconnection on token change
	reaction(
		() => app.token,
		(value) => {
			if (value) {
				app.rest.setToken(value);
				if (app.gateway.readyState === WebSocket.CLOSED) {
					app.setGatewayReady(false);
					app.gateway.connect(Globals.routeSettings.gateway);
				} else {
					console.debug(
						"Gateway connect called but socket is not closed",
					);
				}
			} else {
				if (app.gateway.readyState === WebSocket.OPEN) {
					app.gateway.disconnect(
						1000,
						"user is no longer authenticated",
					);
				}
			}
		},
	);

	if (app.isAppLoading) {
		return <LoadingPage />;
	}

	return (
		<Routes>
			<Route
				index
				path="/"
				element={<AuthenticationGuard component={RootPage} />}
			/>
			<Route
				index
				path="/app"
				element={<AuthenticationGuard component={RootPage} />}
			/>
			<Route
				path="/login"
				element={<UnauthenticatedGuard component={LoginPage} />}
			/>
			<Route
				path="/register"
				element={<UnauthenticatedGuard component={RegistrationPage} />}
			/>
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

export default observer(App);
