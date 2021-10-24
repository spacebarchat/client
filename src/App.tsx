import { extendTheme, NativeBaseProvider } from "native-base";
import React, { Suspense } from "react";
import BasicDarkTheme from "./assets/themes/basic_dark.json";
import { Router, Route } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider } from "react-redux";
import Store from "./util/Store";
import { normalizeTheme } from "./util/Theme";

const LoginPage = React.lazy(() => import("./pages/Login"));
const ThemesEditorPage = React.lazy(() => import("./pages/Themes/Editor"));
const InstancesPage = React.lazy(() => import("./pages/Instances"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));

export default function App() {
	const theme = extendTheme(normalizeTheme(BasicDarkTheme));
	// TODO: suspense show spinning icon (only after a delay to prevent short flashes)

	return (
		<Provider store={Store}>
			<ErrorBoundary>
				<SafeAreaProvider>
					<NativeBaseProvider
						// TODO: set strictMode to warn
						config={{ strictMode: "off" }}
						theme={theme}
					>
						<Suspense fallback={<></>}>
							<Router>
								<Route path="/login" component={LoginPage}></Route>
								<Route path="/themes/editor" component={ThemesEditorPage}></Route>
								<Route path="/instances/" component={InstancesPage}></Route>
								<Route component={NotFoundPage}></Route>
							</Router>
						</Suspense>
					</NativeBaseProvider>
				</SafeAreaProvider>
			</ErrorBoundary>
		</Provider>
	);
}
