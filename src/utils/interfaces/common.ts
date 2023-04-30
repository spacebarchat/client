export type OneKeyFrom<
	T,
	M = object,
	K extends keyof T = keyof T,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
> = K extends any
	? M &
			Pick<Required<T>, K> &
			Partial<Record<Exclude<keyof T, K>, never>> extends infer O
		? { [P in keyof O]: O[P] }
		: never
	: never;
