import { useFloating } from "@floating-ui/react";
import { Channel, Guild, GuildMember, MessageLike, User } from "@structures";
import React from "react";

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
