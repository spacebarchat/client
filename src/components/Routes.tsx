import React, { Suspense, lazy } from "react";
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

export default function () {
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
						<Route exact path="/" component={KitchenSink}></Route>
						<Route
							exact
							path="/channel/:id/messages"
							component={ChannelMessagesPage}
						></Route>
						<Route exact path="/login" component={LoginPage}></Route>
						<Route exact path="/register" component={RegisterPage}></Route>
					</Switch>
				</Router>
			</Suspense>
		</ErrorBoundary>
	);
}
