import { observer } from "mobx-react-lite";
import styled from "styled-components";
import Container from "../components/Container";
import GuildSidebar from "../components/GuildSidebar";
import { useAppStore } from "../stores/AppStore";
import LoadingPage from "./LoadingPage";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: row;
`;

const Filler1 = styled.div`
	flex: 1;
	flex-basis: 330px;
	background-color: red;
`;

const Filler2 = styled.div`
	flex: 1;
	flex-basis: 1170px;
	background-color: blue;
`;

const Filler3 = styled.div`
	flex: 1;
	flex-basis: 348px;
	background-color: orange;
`;

function RootPage() {
	const app = useAppStore();

	if (!app.isReady) {
		return <LoadingPage />;
	}

	return (
		<Wrapper>
			<GuildSidebar />
			<Filler1 />
			<Filler2 />
			<Filler3 />
		</Wrapper>
	);
}

export default observer(RootPage);
