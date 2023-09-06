import { PanInfo, motion, useAnimation } from "framer-motion";
import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	justify-content: space-between;
`;

const Left = styled.div`
	flex: 0 0 15%;
	background-color: red;
	z-index: -100;
`;

const Center = styled(motion.div)`
	background-color: green;
	z-index: 100;
	position: absolute;
	// cover screen
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	flex: 0 0 100%;
	box-shadow: -20px 0 20px rgba(0, 0, 0, 0.5), 20px 0 20px rgba(0, 0, 0, 0.5);
`;

const Right = styled.div`
	flex: 0 0 15%;
	background-color: blue;
	z-index: -100;
`;

function LeftComponent() {
	return <Left>left</Left>;
}

function RightComponent() {
	return <Right>right</Right>;
}

function CenterComponent() {
	// on drag, animate center component to the left or right

	// max the container should move - 15% either way
	const maxWidth = window.innerWidth * 0.15;
	// const x = motionValue(0);
	// const trans = useTransform(x, [0, window.innerWidth], [0, -maxWidth]);
	const [isDragging, setIsDragging] = useState(false);
	const [initialX, setInitialX] = useState(0);

	const elementControls = useAnimation();

	const handleDragStart = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		setIsDragging(true);
		setInitialX(info.point.x); // Store the initial X position
	};

	const handleDrag = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		if (isDragging) {
			const distanceDragged = info.point.x - initialX; // Use initialX as the starting point

			// Update the element's X position based on the distance dragged
			elementControls.start({ x: distanceDragged });
		}
	};

	const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
		// Determine if the element should snap left or right based on position
		const snapLeftThreshold = -100; // Adjust as needed
		const snapRightThreshold = 100; // Adjust as needed

		// Determine the velocity of the drag
		const velocityThreshold = 600; // Adjust as needed

		const distanceDragged = info.point.x - initialX;

		if (Math.abs(info.velocity.x) <= velocityThreshold) {
			// Snap back to the center for low velocity
			elementControls.start({
				x: 0,
				transition: { type: "spring", stiffness: 300, damping: 20 },
			});
		} else if (info.velocity.x > velocityThreshold) {
			elementControls.start({ x: maxWidth }); // Snap right for high velocity
		} else if (info.velocity.x < -velocityThreshold) {
			elementControls.start({ x: -maxWidth }); // Snap left for high velocity
		} else if (distanceDragged < -snapLeftThreshold) {
			elementControls.start({ x: -maxWidth }); // Snap left if dragged a certain distance to the left
		} else if (distanceDragged > snapRightThreshold) {
			elementControls.start({ x: maxWidth }); // Snap right if dragged a certain distance to the right
		}
	};

	return (
		<Center
			drag="x"
			dragConstraints={{ left: -maxWidth, right: maxWidth }} // Adjust as needed
			onDragStart={handleDragStart}
			onDrag={handleDrag}
			onDragEnd={handleDragEnd}
			animate={elementControls}
		>
			center
		</Center>
	);
}

export default function SwipeTest() {
	const centerRef = React.useRef<HTMLDivElement | null>(null);

	return (
		<Container>
			<LeftComponent />
			<CenterComponent />
			<RightComponent />
		</Container>
	);
}
