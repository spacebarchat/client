/* eslint-disable @typescript-eslint/no-explicit-any */
import { FloatingPortal, useFloating } from "@floating-ui/react";
import React from "react";
import useContextMenu, { ContextMenuComponents } from "../hooks/useContextMenu";
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
	  };

export type ContextMenuContextType = {
	setReferenceElement: ReturnType<typeof useFloating>["refs"]["setReference"];
	onContextMenu: (e: React.MouseEvent, props: ContextMenuProps) => void;
	close: () => void;
	open: (props: ContextMenuProps) => void;
};

// @ts-expect-error not specifying a default value here
export const ContextMenuContext = React.createContext<ContextMenuContextType>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ContextMenuContextProvider: React.FC<any> = ({ children }) => {
	const contextMenu = useContextMenu();

	const open = (props: ContextMenuProps) => {
		contextMenu.open(props);
	};

	const Component = contextMenu.props
		? ContextMenuComponents[contextMenu.props.type]
		: () => {
				return null;
		  };

	return (
		<ContextMenuContext.Provider
			value={{
				close: contextMenu.close,
				open,
				setReferenceElement: contextMenu.refs.setReference,
				onContextMenu: contextMenu.onContextMenu,
			}}
		>
			{children}
			<FloatingPortal>
				{contextMenu.isOpen && (
					<div
						className="ContextMenu"
						ref={contextMenu.refs.setFloating}
						style={contextMenu.floatingStyles}
						{...contextMenu.getFloatingProps()}
						onClick={() => [contextMenu.close()]}
					>
						<Component {...contextMenu.props} />
					</div>
				)}
			</FloatingPortal>
		</ContextMenuContext.Provider>
	);
};
