import React, { useState } from "react";
import Theme from "./components/Theme";
import Routes from "./components/Routes";
import Boundary from "./components/Boundary";
import ErrorBoundary from "./components/ErrorBoundary";
import "./util/i18n";
import { InitClient } from "./client";
import "./util/debug";
import { State } from "./util/State";
import { Text } from "native-base";

export default function App() {
	const [state, setWholeState] = useState({});

	const setState = (val: any) => setWholeState({ ...state, ...val });

	return (
		<State.Provider value={[state, setState]}>
			<Theme>
				<Boundary>
					<ErrorBoundary>
						<Routes>
							<InitClient />
						</Routes>
					</ErrorBoundary>
				</Boundary>
			</Theme>
		</State.Provider>
	);
}
