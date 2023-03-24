import { useForm } from "react-hook-form";
import styled from "styled-components";
import Button from "../components/Button";
import Container from "../components/Container";

const Wrapper = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: var(--secondary);
`;

const LoginBox = styled(Container)`
  background-color: var(--primary-alt);
  padding: 32px;
  font-size: 18px;
  color: var(--text-muted);
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
  color: var(--text-muted);
  font-weight: 400;
  font-size: 16px;
`;

const FormContainer = styled.form`
  width: 100%;
`;

const InputContainer = styled.h1<{ marginBottom: boolean }>`
  margin-bottom: ${(props) => (props.marginBottom ? "20px" : "0")};
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const LabelWrapper = styled.div<{ error?: boolean }>`
  display: flex;
  flex-direction: row;
  margin-bottom: 8px;
  color: ${(props) => (props.error ? "var(--error)" : "#b1b5bc")};
`;

const InputErrorText = styled.label`
  font-size: 14px;
  font-weight: 400;
  font-style: italic;
`;

const InputLabel = styled.label`
  font-size: 14px;
  font-weight: 700;
`;

const InputWrapper = styled.div`
  width: 100%;
  display: flex;
`;

const Input = styled.input<{ error?: boolean }>`
  outline: none;
  background: var(--secondary);
  padding: 10px;
  font-size: 16px;
  flex: 1;
  border-radius: 12px;
  color: var(--text);
  margin: 0;
  border: none;
  aria-invalid: ${(props) => (props.error ? "true" : "false")};
`;

const PasswordResetLink = styled.a`
  margin-bottom: 20px;
  margin-top: 4px;
  padding: 2px 0;
  font-size: 14px;
  display: flex;
  text-decoration: none;
`;

const LoginButton = styled(Button)`
  margin-bottom: 8px;
  width: 100%;
  min-width: 130px;
  min-height: 44px;
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

const Divider = styled.span`
  padding: 0 4px;
`;

function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const onSubmit = (data: any) => console.log(data);

  return (
    <Wrapper>
      <LoginBox>
        <HeaderContainer>
          <Header>Welcome Back!</Header>
          <SubHeader>We're so excited to see you again!</SubHeader>
        </HeaderContainer>

        <FormContainer onSubmit={handleSubmit(onSubmit)}>
          <InputContainer marginBottom={true} style={{ marginTop: 0 }}>
            <LabelWrapper error={!!errors.email}>
              <InputLabel>Email</InputLabel>
              {errors.email && (
                <InputErrorText>
                  <Divider>-</Divider>Email error here
                </InputErrorText>
              )}
            </LabelWrapper>
            <InputWrapper>
              <Input
                type="email"
                autoFocus
                {...register("email", { required: true })}
                error={!!errors.email}
              />
            </InputWrapper>
          </InputContainer>

          <InputContainer marginBottom={false}>
            <LabelWrapper error={!!errors.password}>
              <InputLabel>Password</InputLabel>
              {errors.password && (
                <InputErrorText>
                  <Divider>-</Divider>Password error here
                </InputErrorText>
              )}
            </LabelWrapper>
            <InputWrapper>
              <Input
                type="password"
                {...register("password", { required: true })}
                error={!!errors.password}
              />
            </InputWrapper>
          </InputContainer>

          <PasswordResetLink href="#">Forgot your password?</PasswordResetLink>
          <LoginButton variant="primary" type="submit">
            Log In
          </LoginButton>

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
