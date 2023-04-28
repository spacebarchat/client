import styled from "styled-components";
import Container from "./Container";

const Wrapper = styled(Container)`
	display: flex;
	flex: 1 1 100%;
	background-color: var(--background-primary);
`;

function Chat() {
	return <Wrapper>Chat</Wrapper>;
}

export default Chat;
