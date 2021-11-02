import React, { Suspense } from "react";
import { Router, Route, Switch } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider } from "react-redux";
import Store from "./util/Store";
import { Theme } from "./util/Theme";
import { View } from "react-native";

const Introduction = React.lazy(() => import("./pages/Introduction/index"));
const LoginPage = React.lazy(() => import("./pages/Login"));
const RegisterPage = React.lazy(() => import("./pages/Register"));
const ThemesEditorPage = React.lazy(() => import("./pages/Themes/Editor"));
const InstancesPage = React.lazy(() => import("./pages/Instances"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));

export default function App() {
	return (
		<Provider store={Store}>
			<ErrorBoundary>
				<Theme>
					<SafeAreaProvider>
						<View style={{ width: "100%", height: "100%" }}>
							<Suspense fallback={<></>}>
								<Router>
									<Switch>
										<Route path="/introduction" component={Introduction}></Route>
										<Route path="/login" component={LoginPage}></Route>
										<Route path="/register" component={RegisterPage}></Route>
										<Route path="/instances" component={InstancesPage}></Route>
										<Route path="/themes/editor" component={ThemesEditorPage}></Route>
										<Route path="*" component={NotFoundPage}></Route>
									</Switch>
								</Router>
							</Suspense>
						</View>
					</SafeAreaProvider>
				</Theme>
			</ErrorBoundary>
		</Provider>
	);
}
