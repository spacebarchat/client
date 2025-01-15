import SectionTitle from "@components/SectionTitle";
import { observer } from "mobx-react-lite";
import styled from "styled-components";

const Content = styled.div`
	display: flex;
	flex-direction: column;
`;

function DeveloperSettingsPage() {
	return (
		<div>
			<SectionTitle>Developer Options</SectionTitle>
			<Content></Content>
		</div>
	);
}

export default observer(DeveloperSettingsPage);
