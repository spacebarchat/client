import React, { Suspense, lazy, ReactNode } from "react";
import { Router, Switch, Route } from "../util/Router";
import { Box, Button } from "native-base";
import ErrorBoundary from "./ErrorBoundary";
import TestPage from "../pages/Test";
import ChannelMessagesPage from "../pages/channel/messages";
import LoginPage from "../pages/auth/login";
import RegisterPage from "../pages/auth/register";
import KitchenSink from "../pages/DesignEditor/KitchenSink";
// import { Icon } from "native-base";

// const TestPage = lazy(() => import("../pages/Test"));
const KitchenSinkPage = lazy(() => import("../pages/DesignEditor/KitchenSink"));

export default function ({ children }: { children?: ReactNode }) {
	return (
		<ErrorBoundary>
			<Suspense
				fallback={
					<Box width="100%" height="100%">
						Loading...
						{/* <Icon name="spinner"></Icon> */}
					</Box>
				}
			>
				<Router>
					<Switch>
						<Route exact path="/" component={ChannelMessagesPage}></Route>
						<Route exact path="/channels/:guild/:channel" component={ChannelMessagesPage}></Route>
						<Route exact path="/login" component={LoginPage}></Route>
						<Route exact path="/register" component={RegisterPage}></Route>
					</Switch>
					{children}
				</Router>
			</Suspense>
		</ErrorBoundary>
	);
}
