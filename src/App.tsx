import { ThemeContext } from "./util/Theme";
import { preDeclarations } from "./util/CSSToRN";
import React, { Suspense, useEffect, useState } from "react";
import { Router, Route, Switch } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider, useStore } from "react-redux";
import Store from "./util/Store";
import { AccessibilityInfo, Image, Text, useColorScheme, useWindowDimensions, View } from "react-native";
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

const CSS_VARIABLE = /var\(([\w-]+)\)/;
let wasHotReloaded = false;
let themeCache: Rules[] = [];

export default function App() {
	const [theme, setTheme] = useState<Rules[]>(themeCache);
	const [finalTheme, setFinalTheme] = useState<Rules[]>(theme);
	const { width, height, fontScale, scale } = useWindowDimensions();
	const orientation = useOrientation();
	const colorScheme = useColorScheme();
	const accessibilityInfo = useAccessibilityInfo();
	// TODO: suspense show spinning icon (only after a delay to prevent short flashes)

	if (!wasHotReloaded && typeof FosscordTheme !== "object") {
		fetch(Image.resolveAssetSource(FosscordTheme).uri)
			.then((x) => x.text())
			.then((x) => {
				const start = Date.now();
				themeCache = parseCSS(x);
				console.log("theme parsing took " + (Date.now() - start) + "ms");
				setTheme(themeCache);
			});
		wasHotReloaded = true;
	}

	useEffect(() => {
		let temp: Rules[] = [];
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
				temp = temp.concat(x.rules);
			} else {
			}
		});
		temp = temp.concat(theme.filter((x) => x.type !== "media"));

		// update css variables that are in media queries
		temp = temp
			.sort((a, b) => {
				if (a.selectors?.find((s) => s.find((b) => b.tag === ":root"))) return -1;
				if (b.selectors?.find((s) => s.find((b) => b.tag === ":root"))) return 1;
				return 0;
			})
			.map((r) => {
				let rule = { ...r, declarations: { ...r.declarations } };
				Object.entries(rule.declarations || {})?.forEach(([key, value]) => {
					if (key.startsWith("--")) {
						preDeclarations[key] = value;
					} else if (typeof value === "string" && value.includes("var(")) {
						const match = value.match(CSS_VARIABLE);
						if (!match) return;
						rule.declarations[key] = value.replace(CSS_VARIABLE, preDeclarations[match[1]]);
					}
				});
				return rule;
			});

		console.log(temp);
		setFinalTheme(temp);
	}, [theme, orientation, colorScheme, AccessibilityInfo, width, height]);

	return (
		<Provider store={Store}>
			<SafeAreaProvider>
				<ErrorBoundary>
					<ThemeContext.Provider value={finalTheme}>
						<View style={{ width: "100%", height: "100%" }}>
							<Suspense fallback={<></>}>
								<Router>
									<Switch>
										<Route path="/login" component={LoginPage}></Route>
										<Route path="/register" component={RegisterPage}></Route>
										<Route path="/instances" component={InstancesPage}></Route>
										<Route path="/themes/editor" component={ThemesEditorPage}></Route>
										<Route path="*" component={NotFoundPage}></Route>
									</Switch>
								</Router>
							</Suspense>
						</View>
					</ThemeContext.Provider>
				</ErrorBoundary>
			</SafeAreaProvider>
		</Provider>
	);
}
