import { FloatingContext } from "@contexts/FloatingContext";
import React from "react";

export default () => {
	const context = React.useContext(FloatingContext);

	if (context == null) {
		throw new Error("Floating components must be wrapped in <Floating />");
	}

	return context;
};
