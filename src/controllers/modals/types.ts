// adapted from https://github.com/revoltchat/revite/blob/master/src/controllers/modals/types.ts

import Channel from "../../stores/objects/Channel";
import GuildMember from "../../stores/objects/GuildMember";

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
	| {
			type: "kick_member";
			target: GuildMember;
	  }
	| {
			type: "ban_member";
			target: GuildMember;
	  }
);

export type ModalProps<T extends Modal["type"]> = Modal & { type: T } & {
	onClose: () => void;
	signal?: "close" | "confirm";
};
