import { Collection } from "fosscord.js";
import { useEffect, useState } from "react";

export function useCache<T extends Collection<any, any>>(o: T | { cache: T }): T {
	const [state, setState] = useState(0);

	// @ts-ignore
	const collection: Collection<any, any> = o.cache || o;

	const onChanged = (key: any) => {
		setState(state + 1);
	};

	useEffect(() => {
		collection.events.on("changed", onChanged);

		return () => {
			collection.events.off("changed", onChanged);
		};
	}, [o]);

	// @ts-ignore
	return collection;
}
// TODO: use type of o
