import React from "react";
import { Box } from "native-base";
import Buttons from "./Buttons";
import Checkboxes from "./Checkboxes";
import Sidebar from "../channel/Sidebar";

export default function () {
	return (
		<Box>
			<Buttons />
			<Checkboxes />
			{/* channel */}
			<Sidebar />
		</Box>
	);
}
