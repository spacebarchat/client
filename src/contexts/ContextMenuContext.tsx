/* eslint-disable @typescript-eslint/no-explicit-any */
import { FloatingPortal, useFloating } from "@floating-ui/react";
import React from "react";
import UserContextMenu from "../components/contextMenus/UserContextMenu";
import useContextMenu from "../hooks/useContextMenu";
import User from "../stores/objects/User";

interface MenuProps {
	user: User;
}

export type ContextMenuContextType = {
	setReferenceElement: ReturnType<typeof useFloating>["refs"]["setReference"];
	onContextMenu: (e: React.MouseEvent, props: MenuProps) => void;
	close: () => void;
	open: (user: User) => void;
};

// @ts-expect-error not specifying a default value here
export const ContextMenuContext = React.createContext<ContextMenuContextType>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ContextMenuContextProvider: React.FC<any> = ({ children }) => {
	const contextMenu = useContextMenu("user");

	const open = (user: User) => {
		contextMenu.open({
			user,
		});
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
					>
						<UserContextMenu {...(contextMenu.props as any)} />
					</div>
				)}
			</FloatingPortal>
		</ContextMenuContext.Provider>
	);
};
