import React, { Component } from "react"; // import from react
import Main from "./src/App";
import { Window, App } from "proton-native"; // import the proton-native components

export default function () {
	return (
		<App>
			<Window style={{ backgroundColor: "red" }}>
				<Main />
			</Window>
		</App>
	);
}
