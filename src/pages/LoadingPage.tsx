import PulseLoader from "react-spinners/PulseLoader";
import styled from "styled-components";
import { ReactComponent as SpacebarLogoBlue } from "../assets/images/logo/Logo-Blue.svg";
import Container from "../components/Container";

const Wrapper = styled.div`
	justify-content: center;
	align-items: center;
	display: flex;
	height: 100vh;
	flex-direction: column;
`;

const SpacebarLogo = styled(SpacebarLogoBlue)`
	width: 80vw;
	height: min-content;
	margin-bottom: 32px;

	@media (min-width: 768px) {
		width: 40vw;
	}
`;

function LoadingPage() {
	return (
		<Container>
			<Wrapper>
				<SpacebarLogo />
				<PulseLoader color="var(--text)" />
			</Wrapper>
		</Container>
	);
}

export default LoadingPage;
