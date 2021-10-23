import { extendTheme, Heading, NativeBaseProvider } from "native-base";
import React, { Suspense } from "react";
import WindowsTheme from "./assets/themes/windows.json";
import FosscordDarkTheme from "./assets/themes/fosscord_dark.json";
import { Router, Route } from "./util/Router";
import Login from "./pages/Login";
import { Text } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

const LoginPage = React.lazy(() => import("./pages/Login"));

export default function App() {
	const theme = extendTheme(FosscordDarkTheme);

	return (
		<SafeAreaProvider>
			<NativeBaseProvider theme={theme}>
				<SafeAreaView style={{ height: "100%" }}>
					<Suspense fallback={<Heading>Loading...</Heading>}>
						<Router>
							<Route exact path="/" component={LoginPage}></Route>
						</Router>
					</Suspense>
				</SafeAreaView>
			</NativeBaseProvider>
		</SafeAreaProvider>
	);
}
