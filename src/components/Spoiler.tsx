import React from "react";
import styled from "styled-components";

const Container = styled.div`
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

		// target child span
		& > span {
			opacity: 1;
		}
	}
`;

const Text = styled.span`
	opacity: 0;
	transition: opacity 0.1s ease;
`;

interface Props {
	children: React.ReactNode;
}

function Spoiler({ children }: Props) {
	const [shown, setShown] = React.useState(false);

	const show = () => setShown(true);

	return (
		<Container className={shown ? "visible" : undefined}>
			<Text onClick={show}>{children}</Text>
		</Container>
	);
}

export default Spoiler;
