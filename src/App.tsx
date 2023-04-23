import { observer } from "mobx-react-lite";
import React from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { AuthenticationGuard } from "./components/AuthenticationGuard";
import LoadingPage from "./pages/LoadingPage";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFound";
import RegistrationPage from "./pages/RegistrationPage";

import { reaction } from "mobx";
import RootPage from "./pages/RootPage";
import { useAppStore } from "./stores/AppStore";
import { Globals } from "./utils/Globals";

function App() {
	const app = useAppStore();
	const navigate = useNavigate();

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
			console.log(value);
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
			<Route path="/login" element={<LoginPage />} />
			<Route path="/register" element={<RegistrationPage />} />
			<Route path="*" element={<NotFoundPage />} />
		</Routes>
	);
}

export default observer(App);
