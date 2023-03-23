import styled from "styled-components";
import Container from "../components/Container";

const Wrapper = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--secondary);
`;

const LoginBox = styled(Container)`
  background-color: var(--primaryAlt);
  padding: 32px;
  font-size: 18px;
  color: var(--textMuted);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  @media (max-width: 480px) {
    width: 100%;
    height: 100%;
  }

  @media (min-width: 480px) {
    width: 480px;
    border-radius: 18px;
  }
`;

const HeaderContainer = styled.div`
  width: 100%;
`;

const Header = styled.h1`
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 24px;
  color: var(--text);
`;

const SubHeader = styled.h2`
  color: var(--textMuted);
  font-weight: 400;
  font-size: 16px;
`;

const FormContainer = styled.div`
  width: 100%;
`;

const InputContainer = styled.h1<{ marginBottom: boolean }>`
  margin-bottom: ${(props) => (props.marginBottom ? "20px" : "0")};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const InputLabel = styled.label`
  color: #b1b5bc;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const Input = styled.input`
  border: none;
  outline: none;
  background: var(--secondary);
  padding: 10px;
  font-size: 16px;
  flex: 1;
  border-radius: 12px;
  color: var(--text);
  margin: 0;
`;

const PasswordResetLink = styled.a`
  margin-bottom: 20px;
  margin-top: 4px;
  padding: 2px 0;
  font-size: 14px;
  display: flex;
  text-decoration: none;
`;

const Button = styled.button`
  background: var(--brandPrimary);
  color: var(--text);
  font-size: 16px;
  margin-bottom: 8px;
  width: 100%;
  min-width: 130px;
  min-height: 44px;
  border-radius: 8px;
  border: none;
`;

const RegisterContainer = styled.div`
  margin-top: 4px;
  text-align: initial;
`;

const RegisterLabel = styled.label`
  font-size: 14px;
`;

const RegisterLink = styled.a`
  font-size: 14px;
  text-decoration: none;

  @media (max-width: 480px) {
    display: inline-block;
  }
`;

function LoginPage() {
  return (
    <Wrapper>
      <LoginBox>
        <HeaderContainer>
          <Header>Welcome Back!</Header>
          <SubHeader>We're so excited to see you again!</SubHeader>
        </HeaderContainer>

        <FormContainer>
          <InputContainer marginBottom={true} style={{ marginTop: 0 }}>
            <InputLabel>Email</InputLabel>
            <InputWrapper>
              <Input />
            </InputWrapper>
          </InputContainer>

          <InputContainer marginBottom={false}>
            <InputLabel>Password</InputLabel>
            <InputWrapper>
              <Input />
            </InputWrapper>
          </InputContainer>

          <PasswordResetLink href="#">Forgot your password?</PasswordResetLink>
          <Button>Log In</Button>

          <RegisterContainer>
            <RegisterLabel>Don't have an account?&nbsp;</RegisterLabel>
            <RegisterLink href="#">Sign Up</RegisterLink>
          </RegisterContainer>
        </FormContainer>
      </LoginBox>
    </Wrapper>
  );
}

export default LoginPage;
