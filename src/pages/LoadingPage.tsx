import { observer } from "mobx-react-lite";
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
  height: 120px;
  margin-bottom: 32px;
`;

function LoadingPage() {
  return (
    <Container>
      <Wrapper>
        <SpacebarLogo />
        <PulseLoader color="var(--brand-secondary)" />
      </Wrapper>
    </Container>
  );
}

export default observer(LoadingPage);
