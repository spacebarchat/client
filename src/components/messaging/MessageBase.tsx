import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: row;
	position: relative;
	padding: 2px 12px;

	&:hover {
		background-color: var(--background-primary-highlight);
	}
`;
function MessageBase({ children }: { children: React.ReactNode }) {
	return <Container>{children}</Container>;
}

export default MessageBase;
