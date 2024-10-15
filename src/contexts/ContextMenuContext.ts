/* eslint-disable @typescript-eslint/no-explicit-any */
import { useFloating } from "@floating-ui/react";
import React from "react";
import Channel from "../stores/objects/Channel";
import Guild from "../stores/objects/Guild";
import GuildMember from "../stores/objects/GuildMember";
import { MessageLike } from "../stores/objects/Message";
import User from "../stores/objects/User";

export type ContextMenuProps =
	| {
			type: "user";
			user: User;
			member?: GuildMember;
	  }
	| {
			type: "message";
			message: MessageLike;
	  }
	| {
			type: "channel";
			channel: Channel;
	  }
	| {
			type: "channelMention";
			channel: Channel;
	  }
	| {
			type: "guild";
			guild: Guild;
	  };

export type ContextMenuContextType = {
	setReferenceElement: ReturnType<typeof useFloating>["refs"]["setReference"];
	onContextMenu: (e: React.MouseEvent, props: ContextMenuProps) => void;
	close: () => void;
	open: (props: ContextMenuProps) => void;
};

// @ts-expect-error not specifying a default value here
export const ContextMenuContext = React.createContext<ContextMenuContextType>();
