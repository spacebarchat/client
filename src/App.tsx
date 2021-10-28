import { ThemeContext } from "./util/Theme";
import React, { Suspense, useEffect, useState } from "react";
import { Router, Route, Switch } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider, useStore } from "react-redux";
import Store from "./util/Store";
import { AccessibilityInfo, Image, useColorScheme, useWindowDimensions, View } from "react-native";
// @ts-ignore
import FosscordTheme from "./assets/themes/fosscord.css";
import { parseCSS, Rules } from "./util/CSSToRN";
import { matchQuery, parseQuery } from "./util/MediaQuery";
import { useOrientation } from "./util/useOrientation";
import { useAccessibilityInfo } from "./util/useAccessibilityInfo";

const LoginPage = React.lazy(() => import("./pages/Login"));
const RegisterPage = React.lazy(() => import("./pages/Register"));
const ThemesEditorPage = React.lazy(() => import("./pages/Themes/Editor"));
const InstancesPage = React.lazy(() => import("./pages/Instances"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));

// settings this in react-app-env.d.ts doesn't work
declare module "react" {
	interface Attributes {
		className?: string;
	}
}

declare module "react-native" {
	interface ViewProps {
		className?: string;
	}
}

let wasHotReloaded = false;
let themeCache: Rules[] = [];

export default function App() {
	const [theme, setTheme] = useState<Rules[]>(themeCache);
	const { width, height, fontScale, scale } = useWindowDimensions();
	const orientation = useOrientation();
	const colorScheme = useColorScheme();
	const accessibilityInfo = useAccessibilityInfo();
	// TODO: suspense show spinning icon (only after a delay to prevent short flashes)

	if (!wasHotReloaded && typeof FosscordTheme !== "object") {
		fetch(Image.resolveAssetSource(FosscordTheme).uri)
			.then((x) => x.text())
			.then((x) => {
				themeCache = parseCSS(x);
				setTheme(themeCache);
			});
		wasHotReloaded = true;
	}

	let finalTheme: Rules[] = [];
	theme.forEach((x) => {
		if (x.type !== "media") return true;
		if (
			matchQuery(x.media, {
				type: "screen",
				width,
				height,
				"device-width": width,
				"device-height": height,
				orientation,
				"prefers-color-scheme": colorScheme,
				"prefers-reduced-motion": accessibilityInfo.reduceMotion,
				"prefers-reduced-transparency": accessibilityInfo.reduceTransparency,
			})
		) {
			// @ts-ignore
			finalTheme = finalTheme.concat(x.rules);
		}
	});
	finalTheme = finalTheme.concat(theme);

	return (
		<Provider store={Store}>
			<ErrorBoundary>
				<ThemeContext.Provider value={finalTheme}>
					<SafeAreaProvider>
						<View style={{ width: "100%", height: "100%" }}>
							<Suspense fallback={<></>}>
								<Router>
									<Switch>
										<Route path="/login">
											<Route path="/login" component={LoginPage}></Route>
											<Route path="/login/instances" component={InstancesPage}></Route>
										</Route>
										<Route path="/register" component={RegisterPage}></Route>
										<Route path="/instances" component={InstancesPage}></Route>
										<Route path="/themes/editor" component={ThemesEditorPage}></Route>
										<Route path="*" component={NotFoundPage}></Route>
									</Switch>
								</Router>
							</Suspense>
						</View>
					</SafeAreaProvider>
				</ThemeContext.Provider>
			</ErrorBoundary>
		</Provider>
	);
}
