import React from "react";
import { Box } from "native-base";
import Buttons from "./Buttons";
import Checkboxes from "./Checkboxes";
import ChannelSidebar from "../channel/sidebar";

export default function () {
	return (
		<Box>
			<Buttons />
			<Checkboxes />
			{/* channel */}
			<ChannelSidebar />
		</Box>
	);
}
