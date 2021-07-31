import React, { useState } from "react";
import Theme from "./components/Theme";
import Routes from "./components/Routes";
import Boundary from "./components/Boundary";
import ErrorBoundary from "./components/ErrorBoundary";
// import { Client } from "discord.js";
// const client = new Client();

export default function App() {
	return (
		<ErrorBoundary>
			<Theme>
				<Boundary>
					<Routes></Routes>
				</Boundary>
			</Theme>
		</ErrorBoundary>
	);
}
