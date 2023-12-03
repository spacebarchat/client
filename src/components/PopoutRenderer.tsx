import React from "react";
import Measure, { BoundingRect, ContentRect } from "react-measure";
import { PopoutOpenProps } from "../contexts/PopoutContext";

const OFFSET = 10;

function isRectZero(rect: BoundingRect) {
	return (
		rect.bottom === 0 &&
		rect.left === 0 &&
		rect.right === 0 &&
		rect.top === 0 &&
		rect.width === 0 &&
		rect.height === 0
	);
}

interface Props {
	open: (props: PopoutOpenProps) => void;
	close: () => void;
	position: DOMRect;
	element: React.ReactNode;
	isOpen: boolean;
	placement?: "left" | "right" | "top" | "bottom";
}

function PopoutRenderer({ position, element, placement, close }: Props) {
	const [rect, setRect] = React.useState<ContentRect>({});
	const [positionStyle, setPositionStyle] = React.useState<React.CSSProperties>({
		visibility: "hidden",
	});

	React.useEffect(() => {
		const listener = () => {
			close();
		};

		document.addEventListener("click", listener);
		return () => {
			document.removeEventListener("click", listener);
		};
	}, []);

	React.useEffect(() => {
		if (rect.bounds && !isRectZero(rect.bounds)) {
			switch (placement) {
				default:
				case "right": {
					let x = position.left + position.width + OFFSET;
					let y = position.top;
					if (x + rect.bounds.width > window.innerWidth) {
						x = position.left - rect.bounds.width - OFFSET;
					}
					if (y + rect.bounds.height > window.innerHeight) {
						y = window.innerHeight - rect.bounds.height - OFFSET;
					}
					setPositionStyle({
						visibility: "visible",
						top: y,
						left: x,
					});
					break;
				}
				case "left": {
					let x = position.left - rect.bounds.width - OFFSET;
					let y = position.top;
					if (x < 0) {
						x = position.left + position.width + OFFSET;
					}
					if (y + rect.bounds.height > window.innerHeight) {
						y = window.innerHeight - rect.bounds.height - OFFSET;
					}
					setPositionStyle({
						visibility: "visible",
						top: y,
						left: x,
					});
					break;
				}
				case "top": {
					let x = position.left - position.width / 1;
					let y = position.top - rect.bounds.height - OFFSET;
					if (x + rect.bounds.width > window.innerWidth) {
						x = window.innerWidth - rect.bounds.width - OFFSET;
					}
					if (y < 0) {
						y = position.top + position.height + OFFSET;
					}
					setPositionStyle({
						visibility: "visible",
						top: y,
						left: x,
					});
					break;
				}
				case "bottom": {
					let x = position.left - position.width / 1;
					let y = position.top + position.height + OFFSET;
					if (x + rect.bounds.width > window.innerWidth) {
						x = window.innerWidth - rect.bounds.width - OFFSET;
					}
					if (y + rect.bounds.height > window.innerHeight) {
						y = window.innerHeight - rect.bounds.height - OFFSET;
					}
					setPositionStyle({
						visibility: "visible",
						top: y,
						left: x,
					});
					break;
				}
			}
		}
	}, [rect, element]);

	const handleResize = (contentRect: ContentRect) => setRect(contentRect);

	return (
		<div
			onBlur={close}
			style={{
				position: "absolute",
				zIndex: 9999,
				...positionStyle,
			}}
		>
			<Measure bounds onResize={handleResize}>
				{({ measureRef }) => (
					<div
						style={{
							width: "fit-content",
							height: "fit-content",
						}}
						ref={measureRef}
					>
						{element}
					</div>
				)}
			</Measure>
		</div>
	);
}

export default PopoutRenderer;
