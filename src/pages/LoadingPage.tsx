import { observer } from "mobx-react-lite";
import PulseLoader from "react-spinners/PulseLoader";
import styled from "styled-components";
import { ReactComponent as SpacebarLogoBlue } from "../assets/images/logo/Logo-Blue.svg";
import Button from "../components/Button";
import Container from "../components/Container";
import { useAppStore } from "../stores/AppStore";

const Wrapper = styled.div`
	justify-content: center;
	align-items: center;
	display: flex;
	height: 100vh;
	flex-direction: column;
`;

const SpacebarLogo = styled(SpacebarLogoBlue)`
	height: 120px;
	margin-bottom: 32px;
`;

function LoadingPage() {
	const app = useAppStore();

	return (
		<Container>
			<Wrapper>
				<SpacebarLogo />
				<PulseLoader color="var(--text)" />
				{app.token && (
					<div
						style={{
							position: "absolute",
							bottom: "30vh",
						}}
					>
						<Button variant="danger" onClick={() => app.logout()}>
							Logout
						</Button>
					</div>
				)}
			</Wrapper>
		</Container>
	);
}

export default observer(LoadingPage);
