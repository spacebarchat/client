import "react-native-gesture-handler";
import React, { useState } from "react";
import Theme from "./components/Theme";
import Routes from "./components/Routes";
import Boundary from "./components/Boundary";
import ErrorBoundary from "./components/ErrorBoundary";
// import "./Client";
import "./util/i18n";

export default function App() {
	return (
		<Theme>
			<Boundary>
				<ErrorBoundary>
					<Routes></Routes>
				</ErrorBoundary>
			</Boundary>
		</Theme>
	);
}
