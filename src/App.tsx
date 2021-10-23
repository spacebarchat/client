import { extendTheme, Heading, NativeBaseProvider } from "native-base";
import React, { Suspense } from "react";
import BasicDarkTheme from "./assets/themes/basic_dark.json";
import { Router, Route } from "./util/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";

const LoginPage = React.lazy(() => import("./pages/Login"));

// TODO: move in different file
// TODO: check if theme has correct structure
function normalizeTheme<T extends any>(theme: T): T {
	const t = theme as any;
	if (!theme) return theme;
	if (!t.components) t.components = {};
	t.components.KeyboardAvoidingView = t.components.SafeAreaView = t.components.View;

	return theme;
}

export default function App() {
	const theme = extendTheme(normalizeTheme(BasicDarkTheme));

	return (
		<NavigationContainer>
			<SafeAreaProvider>
				<NativeBaseProvider theme={theme}>
					<Suspense fallback={<Heading>Loading...</Heading>}>
						<Router>
							<Route exact path="/" component={LoginPage}></Route>
						</Router>
					</Suspense>
				</NativeBaseProvider>
			</SafeAreaProvider>
		</NavigationContainer>
	);
}
