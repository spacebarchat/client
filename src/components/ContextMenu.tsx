import React from "react";
import Container from "./Container";
import ContextMenuItem, { IContextMenuItem } from "./ContextMenuItem";

interface Props {
	open: (props: Props) => void;
	close: () => void;
	visible: boolean;
	position: {
		x: number;
		y: number;
	};
	items: IContextMenuItem[];
	style?: React.CSSProperties;
}

function ContextMenu({ position, close, items, style }: Props) {
	// Close the context menu when the user clicks outside of it
	React.useEffect(() => {
		const listener = () => {
			close();
		};

		document.addEventListener("click", listener);
		return () => {
			document.removeEventListener("click", listener);
		};
	}, []);

	return (
		<Container
			onBlur={close}
			style={{
				...style,
				position: "absolute",
				minWidth: "10vw",
				// maxWidth: "20vw",
				borderRadius: 4,
				zIndex: 4,
				padding: "6px 8px",
				top: position.y,
				left: position.x,
			}}
		>
			{items
				.filter((a) => a.visible !== false)
				.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))
				.map((item, index) => {
					return <ContextMenuItem key={index} item={item} close={close} index={index} />;
				})}
		</Container>
	);
}

export default ContextMenu;
