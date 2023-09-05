import styled from "styled-components";
import Icon from "../Icon";

const Wrapper = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
`;

const Text = styled.span`
	padding: 10px;
	color: var(--warning);
`;

function OfflineBanner() {
	return (
		<Wrapper>
			<Text>You are offline</Text>
			<Icon icon="mdiWifiStrengthOff" color="var(--warning)" size="24px" />
		</Wrapper>
	);
}

export default OfflineBanner;
