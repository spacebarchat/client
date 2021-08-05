import { Collection } from "fosscord.js";
import { useState } from "react";

export function useCache<T extends Collection<any, any>>(o: T | { cache: T }): T {
	const [state, setState] = useState(0);

	// @ts-ignore
	const collection: Collection<any, any> = o.cache || o;

	collection.events.on("changed", (key: any) => {
		setState(state + 1);
	});

	// @ts-ignore
	return collection;
}
// TODO: use type of o
