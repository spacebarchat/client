import { extendTheme, Heading, NativeBaseProvider } from "native-base";
import React, { Fragment, Suspense, useEffect, useState } from "react";
import BasicDarkTheme from "./assets/themes/basic_dark.json";
import { Router, Route } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider } from "react-redux";
import Store from "./util/Store";
const LoginPage = React.lazy(() => import("./pages/Login"));
const InstancesPage = React.lazy(() => import("./pages/Instances"));

// TODO: move in different file
// TODO: check if theme has correct structure
function normalizeTheme<T extends any>(theme: T): T {
	const t = theme as any;
	if (!theme) return theme;
	if (!t.components) t.components = {};
	t.components.KeyboardAvoidingView = t.components.View;
	t.components.SafeAreaView = t.components.View;

	return theme;
}

export default function App() {
	const theme = extendTheme(normalizeTheme(BasicDarkTheme));
	// TODO: suspense show spinning icon (only after a delay to prevent short flashes)

	return (
		<Provider store={Store}>
			<ErrorBoundary>
				<SafeAreaProvider>
					<NativeBaseProvider theme={theme}>
						<Suspense fallback={<></>}>
							<Router>
								<Route path="/" component={LoginPage}></Route>
								<Route path="/instances/" component={InstancesPage}></Route>
							</Router>
						</Suspense>
					</NativeBaseProvider>
				</SafeAreaProvider>
			</ErrorBoundary>
		</Provider>
	);
}
