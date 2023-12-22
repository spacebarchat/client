// adapted from https://github.com/revoltchat/revite/blob/master/src/controllers/modals/types.ts

import { APIAttachment, APIEmbedImage, APIEmbedThumbnail } from "@spacebarchat/spacebar-api-types/v9";
import Channel from "../../stores/objects/Channel";
import Guild from "../../stores/objects/Guild";
import GuildMember from "../../stores/objects/GuildMember";
import Message from "../../stores/objects/Message";

export type Modal = {
	key?: string;
} & (
	| {
			type: "add_server" | "create_server" | "join_server" | "settings";
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
	| {
			type: "delete_message";
			target: Message;
	  }
	| {
			type: "leave_server";
			target: Guild;
	  }
	| {
			type: "image_viewer";
			attachment: APIAttachment | APIEmbedImage | APIEmbedThumbnail;
			width?: number;
			height?: number;
	  }
);

export type ModalProps<T extends Modal["type"]> = Modal & { type: T } & {
	onClose: () => void;
	signal?: "close" | "confirm";
};
