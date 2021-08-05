import { Collection } from "fosscord.js";
import { useEffect, useState } from "react";

export function useCache<T extends Collection<any, any>>(o: T | { cache: T }): T {
	var [state, setState] = useState(0);

	// @ts-ignore
	const collection: Collection<any, any> = o.cache || o;

	const onChanged = () => {
		state++;
		setState(state);
		console.log("changed", state);
	};

	useEffect(() => {
		console.log("useEffect");
		collection.events.on("changed", onChanged);

		return () => {
			collection.events.off("changed", onChanged);
		};
	}, [o]);

	// @ts-ignore
	return collection;
}
// TODO: use type of o
