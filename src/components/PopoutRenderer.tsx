import React from "react";
import { PopoutOpenProps } from "../contexts/PopoutContext";

const OFFSET = 10;

interface Props {
	open: (props: PopoutOpenProps) => void;
	close: () => void;
	position: DOMRect;
	element: React.ReactNode;
	isOpen: boolean;
	placement: "left" | "right" | "top" | "bottom";
}

function PopoutRenderer({ position, element, placement, close }: Props) {
	const [positionStyle, setPositionStyle] = React.useState<React.CSSProperties | undefined>({
		display: "none",
	});

	React.useEffect(() => {
		const listener = () => {
			close();
		};

		// switch placement, calculate position and set style, ensure popout stays in viewport
		switch (placement) {
			case "left": {
				const x = position.x - OFFSET - position.width;
				const y = position.y + position.height / 2;
				setPositionStyle({
					display: "block",
					left: x,
					top: y,
					transform: "translate(-100%, -50%)",
				});
				break;
			}
			case "right": {
				const x = position.x + position.width + OFFSET;
				const y = position.y + position.height / 2;
				setPositionStyle({
					display: "block",
					left: x,
					top: y,
					transform: "translate(0%, -50%)",
				});
				break;
			}
			case "top": {
				const x = position.x + position.width / 2;
				const y = position.y - OFFSET;
				setPositionStyle({
					display: "block",
					left: x,
					top: y,
					transform: "translate(-15%, -100%)",
				});
				break;
			}
			case "bottom": {
				const x = position.x + position.width / 2;
				const y = position.y + position.height + OFFSET;
				setPositionStyle({
					display: "block",
					left: x,
					top: y,
					transform: "translate(-15%, 0%)",
				});
				break;
			}
		}

		document.addEventListener("click", listener);
		return () => {
			document.removeEventListener("click", listener);
		};
	}, [position, element, placement]);

	return (
		<div
			onBlur={close}
			style={{
				position: "absolute",
				zIndex: 9999,
				...positionStyle,
			}}
		>
			{element}
		</div>
	);
}

export default PopoutRenderer;
