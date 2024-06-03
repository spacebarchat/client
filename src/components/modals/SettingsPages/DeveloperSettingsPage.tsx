import { observer } from "mobx-react-lite";
import styled from "styled-components";
import SectionTitle from "../../SectionTitle";

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
