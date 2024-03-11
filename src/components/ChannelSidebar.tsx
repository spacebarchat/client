import { observer } from "mobx-react-lite";
import styled from "styled-components";
import ChannelHeader from "./ChannelHeader";
import ChannelList from "./ChannelList/ChannelList";
import Container from "./Container";
import UserPanel from "./UserPanel";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
	flex: 0 0 240px;
	background-color: var(--background-secondary);

	@media (max-width: 810px) {
		display: none;
	}
`;

function ChannelSidebar() {
	return (
		<Wrapper>
			{/* TODO: replace with dm search if no guild */}
			<ChannelHeader />
			<ChannelList />
			<UserPanel />
		</Wrapper>
	);
}

export default observer(ChannelSidebar);
