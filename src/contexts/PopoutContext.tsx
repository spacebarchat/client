import React from "react";

export interface PopoutOpenProps {
	position: DOMRect;
	element: React.ReactNode;
	placement?: "left" | "right" | "top" | "bottom";
}

const useValue = () => {
	const [position, setPosition] = React.useState({ x: 0, y: 0 });
	const [element, setElement] = React.useState<React.ReactNode>();
	const [isOpen, setIsOpen] = React.useState(false);
	const [placement, setPlacement] = React.useState<"left" | "right" | "top" | "bottom">();

	const close = () => {
		setIsOpen(false);
		setElement(undefined);
	};

	const open = (props: PopoutOpenProps) => {
		// clicking again on the same trigger should close it
		if (isOpen && JSON.stringify(position) === JSON.stringify(props.position)) {
			close();
			return;
		}
		setPosition(props.position);
		setElement(props.element);
		setIsOpen(true);
		setPlacement(props.placement ?? "right");
	};

	return {
		open,
		close,
		position,
		element,
		isOpen,
		setIsOpen,
		placement,
	};
};

export const PopoutContext = React.createContext({} as ReturnType<typeof useValue>);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PopoutContextProvider: React.FC<any> = (props) => {
	return <PopoutContext.Provider value={useValue()}>{props.children}</PopoutContext.Provider>;
};
