export function messageFromFieldError(
	e:
		| {
				[key: string]: {
					_errors: {
						code: string;
						message: string;
					}[];
				};
		  }
		| {
				[key: string]: {
					code: string;
					message: string;
				}[];
		  },
	prevKey?: string,
): { field: string | undefined; error: string } | null {
	for (const key in e) {
		const obj = e[key];
		if (obj) {
			if (key === "_errors" && Array.isArray(obj)) {
				const r = obj[0];
				return r ? { field: prevKey, error: r.message } : null;
			}
			if (typeof obj === "object") {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				return messageFromFieldError(obj as any, key);
			}
		}
	}
	return null;
}
