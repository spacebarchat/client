import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Container = styled.span`
	background-color: hsl(var(--background-tertiary-hsl));
	padding: 0 5px;
	border-radius: 4px;
	width: fit-content;
	transition: background-color 0.1s ease;

	&:hover {
		background-color: hsl(var(--background-tertiary-hsl) / 0.3);
		cursor: pointer;
	}

	&.visible {
		background-color: hsl(var(--background-tertiary-hsl) / 0.3);
		cursor: pointer;
	}

	.text {
		opacity: 0;
		transition: opacity 0.1s ease;
	}

	&.visible .text {
		opacity: 1;
	}
`;

interface Props {
	children: React.ReactNode;
}

function Spoiler({ children }: Props) {
	const [shown, setShown] = useState(false);
	const containerRef = useRef<HTMLSpanElement | null>(null);

	const show = () => setShown(true);

	useEffect(() => {
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			// when the element is not in the viewport, hide the spoiler
			if (entries[0].intersectionRatio === 0 && shown) {
				setShown(false);
			}
		};

		const observer = new IntersectionObserver(handleIntersection);

		if (containerRef.current) {
			observer.observe(containerRef.current);
		}

		return () => {
			if (containerRef.current) {
				observer.unobserve(containerRef.current);
			}
		};
	}, [shown]);

	return (
		<Container className={shown ? "visible" : ""} onClick={show} ref={containerRef}>
			<span className="text">{children}</span>
		</Container>
	);
}

export default Spoiler;
