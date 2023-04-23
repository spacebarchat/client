export type OneKeyFrom<
	T,
	M = object,
	K extends keyof T = keyof T,
> = K extends any
	? M &
			Pick<Required<T>, K> &
			Partial<Record<Exclude<keyof T, K>, never>> extends infer O
		? { [P in keyof O]: O[P] }
		: never
	: never;
