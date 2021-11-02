import React, { Suspense } from "react";
import { Router, Route, Switch } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider } from "react-redux";
import Store from "./util/Store";
import { Themes } from "./util/Themes";
import { ScrollView, useWindowDimensions, View } from "react-native";

const Introduction = React.lazy(() => import("./pages/Introduction/index"));
const LoginPage = React.lazy(() => import("./pages/Login"));
const RegisterPage = React.lazy(() => import("./pages/Register"));
const NotFoundPage = React.lazy(() => import("./pages/NotFound"));

export default function App() {
	return (
		<Provider store={Store}>
			<ErrorBoundary>
				<Themes>
					<SafeAreaProvider>
						<View style={{ width: "100%", height: "100%" }} className="bg">
							<Suspense fallback={<></>}>
								<Router>
									<Switch>
										<Route path="/introduction" component={Introduction}></Route>
										<Route path="/login" component={LoginPage}></Route>
										<Route path="/register" component={RegisterPage}></Route>
										<Route path="*" component={NotFoundPage}></Route>
									</Switch>
								</Router>
							</Suspense>
						</View>
					</SafeAreaProvider>
				</Themes>
			</ErrorBoundary>
		</Provider>
	);
}
