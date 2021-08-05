import { useState } from "react";

export default function () {
	var [state, setState] = useState(0);

	return () => {
		state++;
		setState(state);
	};
}
