import { observer } from "mobx-react-lite";
import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex: 0 0 240px;
	flex-direction: column;
	background-color: var(--background-secondary);
	height: 100%;

	@media (max-width: 1080px) {
		display: none;
	}
`;

const Wrapper = styled.aside`
	justify-content: center;
	min-width: 240px;
	max-height: 100%;
	display: flex;
`;

function MemberList() {
	return (
		<Container>
			<Wrapper>MemberList</Wrapper>
		</Container>
	);
}

export default observer(MemberList);
