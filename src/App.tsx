import { extendTheme, NativeBaseProvider, View } from "native-base";
import React, { Suspense } from "react";
import FosscordTheme from "./assets/themes/fosscord_theme.json";
import { Router, Route, Switch } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider } from "react-redux";
import Store from "./util/Store";
import { normalizeTheme } from "./util/Theme";

const LoginPage = React.lazy(() => import("./pages/Login"));
const RegisterPage = React.lazy(() => import("./pages/Register"));
const ThemesEditorPage = React.lazy(() => import("./pages/Themes/Editor"));
const InstancesPage = React.lazy(() => import("./pages/Instances"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));

// settings this in react-app-env.d.ts doesn't work
declare module "react" {
	interface Attributes {
		styleName?: string;
	}
}

export default function App() {
	const theme = extendTheme(normalizeTheme(FosscordTheme));
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
					</NativeBaseProvider>
				</SafeAreaProvider>
			</ErrorBoundary>
		</Provider>
	);
}
