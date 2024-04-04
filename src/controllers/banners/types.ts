export type Banner = {
	key?: string;
} & {
	type: "offline";
};

export type BannerProps<T extends Banner["type"]> = Banner & { type: T } & {
	onClose: () => void;
};
