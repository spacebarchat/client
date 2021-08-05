import { useState } from "react";

export function useCache(o: any) {
	const [state, setState] = useState(0);

	const collection = o.cache || o;

	collection.events.on("changed", (key: any) => {
		setState(state + 1);
	});
}
