import React, { ReactElement, Suspense } from "react";
import { Router, Route } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider } from "react-redux";
import Store from "./util/Store";
import { Themes } from "./util/Themes";
import { View } from "react-native";
import BackHandler from "./components/BackHandler";
import { LogBox } from "react-native";
import Routes from "./components/Routes";

LogBox.ignoreAllLogs();

export default function App() {
	return (
		<Provider store={Store}>
			<ErrorBoundary>
				<Themes>
					<SafeAreaProvider>
						<View style={{ width: "100%", height: "100%" }} className="bg">
							<Suspense fallback={<></>}>
								<Router>
									<BackHandler>
										<Routes />
									</BackHandler>
								</Router>
							</Suspense>
						</View>
					</SafeAreaProvider>
				</Themes>
			</ErrorBoundary>
		</Provider>
	);
}
