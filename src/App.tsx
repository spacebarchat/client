import React, { ReactElement, Suspense } from "react";
import { Router, Route, Routes } from "./components/Router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Provider } from "react-redux";
import Store from "./util/Store";
import { Themes } from "./util/Themes";
import { View } from "react-native";
import BackHandler from "./components/BackHandler";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs();

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
									<BackHandler>
										<Routes>
											<Route path="/introduction" element={<Introduction />}></Route>
											<Route path="/login" element={<LoginPage />}></Route>
											<Route path="/register" element={<RegisterPage />}></Route>
											<Route path="*" element={<NotFoundPage />}></Route>
										</Routes>
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
