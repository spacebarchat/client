import styled from "styled-components";
import Container from "./Container";

const Wrapper = styled(Container)`
	display: flex;
	flex: 0 0 240px;
	background-color: var(--background-secondary);

	@media (max-width: 1080px) {
		display: none;
	}
`;

function ChannelList() {
	return <Wrapper>ChannelList</Wrapper>;
}

export default ChannelList;
