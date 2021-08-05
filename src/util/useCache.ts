import { Collection } from "fosscord.js";
import { useEffect, useState } from "react";

export function useCache<T extends Collection<any, any>>(o: { cache: T }): T {
	var [state, setState] = useState(0);

	// @ts-ignore
	const collection: Collection<any, any> = o?.cache || o;

	const onChanged = () => {
		state++;
		setState(state);
		console.log("rerender cache", state);
	};

	useEffect(() => {
		collection?.events.on("changed", onChanged);

		return () => {
			collection?.events.off("changed", onChanged);
		};
	}, [o]);
	// @ts-ignore
	if (!collection) return o;

	// @ts-ignore
	return collection;
}
// TODO: use type of o
