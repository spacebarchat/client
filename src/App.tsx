import React, { Suspense, useState } from "react";
import { Router } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Themes } from "./util/Themes";
import { Platform, View, LogBox } from "react-native";
import BackHandler from "./components/BackHandler";
import Routes from "./components/Routes";
import { ThemesContext } from "./data/Themes";

declare module "react-native" {
	interface PlatformStatic {
		isDesktop?: boolean;
		isMobile?: boolean;
	}
}

LogBox.ignoreAllLogs();

Platform.isDesktop = Platform.OS === "macos" || Platform.OS === "windows";
Platform.isMobile = Platform.OS === "ios" || Platform.OS === "android";

export default function App() {
	const [theme, setTheme] = useState([]);

	return (
		<Router>
			<ThemesContext.Provider value={[theme, setTheme]}>
				<SafeAreaProvider>
					<Themes>
						<ErrorBoundary>
							<View style={{ width: "100%", height: "100%" }} className="bg">
								<Suspense fallback={<></>}>
									<BackHandler>
										<Routes />
									</BackHandler>
								</Suspense>
							</View>
						</ErrorBoundary>
					</Themes>
				</SafeAreaProvider>
			</ThemesContext.Provider>
		</Router>
	);
}
