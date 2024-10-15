import React from "react";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
`;

const Text = styled.h2`
	color: var(--text);
	margin-bottom: 20px;
	font-size: 20px;
	font-weight: var(--font-weight-medium);
	flex: 1;
`;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface Props {}

function SectionTitle({ children }: React.PropsWithChildren<Props>) {
	return (
		<Container>
			<Text>{children}</Text>
		</Container>
	);
}

export default SectionTitle;
