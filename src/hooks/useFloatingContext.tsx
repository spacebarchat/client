import React from "react";
import { FloatingContext } from "../contexts/FloatingContext";

export default () => {
	const context = React.useContext(FloatingContext);

	if (context == null) {
		throw new Error("Floating components must be wrapped in <Floating />");
	}

	return context;
};
