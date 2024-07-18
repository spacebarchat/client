import { FloatingPortal } from "@floating-ui/react";
import React from "react";
import useContextMenu, { ContextMenuComponents } from "../hooks/useContextMenu";
import { ContextMenuContext, ContextMenuProps } from "./ContextMenuContext";

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
