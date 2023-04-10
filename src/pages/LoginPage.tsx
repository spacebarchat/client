import { APIError, CaptchaError, MFAError } from "@puyodead1/fosscord-ts";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import Container from "../components/Container";
import { useAppStore } from "../stores/AppStore";

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

const PasswordResetLink = styled.button`
	margin-bottom: 20px;
	margin-top: 4px;
	padding: 2px 0;
	font-size: 14px;
	display: flex;
	color: var(--text-link);
	background: none;
	border: none;

	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
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

const RegisterLink = styled.button`
	font-size: 14px;
	background: none;
	border: none;
	color: var(--text-link);

	@media (max-width: 480px) {
		display: inline-block;
	}

	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
`;

const Divider = styled.span`
	padding: 0 4px;
`;

type LoginFormValues = {
	login: string;
	password: string;
};

function LoginPage() {
	const app = useAppStore();
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<LoginFormValues>();

	const onSubmit = handleSubmit((data) => {
		app.api.login(data).catch((e) => {
			if (e instanceof MFAError) {
				console.log("MFA Required", e);
			} else if (e instanceof CaptchaError) {
				console.log("Captcha Required", e);
			} else if (e instanceof APIError) {
				console.log("APIError", e.message, e.code, e.fieldErrors);
				e.fieldErrors.forEach((fieldError) => {
					setError(fieldError.field as any, {
						type: "manual",
						message: fieldError.error,
					});
				});
			} else {
				console.log("General Error", e);
			}
		});
	});

	return (
		<Wrapper>
			<LoginBox>
				<HeaderContainer>
					<Header>Welcome Back!</Header>
					<SubHeader>We're so excited to see you again!</SubHeader>
				</HeaderContainer>

				<FormContainer onSubmit={onSubmit}>
					<InputContainer marginBottom={true} style={{ marginTop: 0 }}>
						<LabelWrapper error={!!errors.login}>
							<InputLabel>Email</InputLabel>
							{errors.login && (
								<InputErrorText>
									<>
										<Divider>-</Divider>
										{errors.login.message}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>
						<InputWrapper>
							<Input
								type="email"
								autoFocus
								{...register("login", { required: true })}
								error={!!errors.login}
							/>
						</InputWrapper>
					</InputContainer>

					<InputContainer marginBottom={false}>
						<LabelWrapper error={!!errors.password}>
							<InputLabel>Password</InputLabel>
							{errors.password && (
								<InputErrorText>
									<>
										<Divider>-</Divider>
										{errors.password.message}
									</>
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

					<PasswordResetLink onClick={() => {}} type="button">
						Forgot your password?
					</PasswordResetLink>
					<LoginButton variant="primary" type="submit">
						Log In
					</LoginButton>

					<RegisterContainer>
						<RegisterLabel>Don't have an account?&nbsp;</RegisterLabel>
						<RegisterLink
							onClick={() => {
								navigate("/register");
							}}
							type="button"
						>
							Sign Up
						</RegisterLink>
					</RegisterContainer>
				</FormContainer>
			</LoginBox>
		</Wrapper>
	);
}

export default LoginPage;
