// adapted from https://github.com/revoltchat/revite/blob/master/src/controllers/modals/types.ts

import Channel from "../../stores/objects/Channel";

export type Modal = {
	key?: string;
} & (
	| {
			type: "add_server" | "create_server" | "join_server";
	  }
	| {
			type: "error";
			title: string;
			description?: string;
			error: string;
			recoverable?: boolean;
	  }
	| {
			type: "clipboard";
			text: string;
	  }
	| {
			type: "create_invite";
			target: Channel;
	  }
);

export type ModalProps<T extends Modal["type"]> = Modal & { type: T } & {
	onClose: () => void;
	signal?: "close" | "confirm";
};
