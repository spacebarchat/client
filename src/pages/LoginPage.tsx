import HCaptchaLib from "@hcaptcha/react-hcaptcha";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { APIError, CaptchaError, MFAError } from "spacebar-ts";
import { useAppStore } from "../stores/AppStore";
import {
	Divider,
	FormContainer,
	Header,
	HeaderContainer,
	Input,
	InputContainer,
	InputErrorText,
	InputLabel,
	InputWrapper,
	LabelWrapper,
	LoginBox,
	LoginButton,
	PasswordResetLink,
	RegisterContainer,
	RegisterLabel,
	RegisterLink,
	SubHeader,
	Wrapper,
} from "./LoginPage.components";

type LoginFormValues = {
	login: string;
	password: string;
	captcha_key?: string;
};

function LoginPage() {
	const app = useAppStore();
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const [captchaSiteKey, setCaptchaSiteKey] = React.useState<string>();
	const captchaRef = React.useRef<HCaptchaLib>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
	} = useForm<LoginFormValues>();

	const onSubmit = handleSubmit((data) => {
		setLoading(true);
		app.api
			.login(data)
			.catch((e) => {
				if (e instanceof MFAError) {
					console.log("MFA Required", e);
				} else if (e instanceof CaptchaError) {
					// TODO: other captcha services
					setCaptchaSiteKey(e.captcha_sitekey);
					captchaRef.current?.execute();
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
			})
			.finally(() => setLoading(false));
	});

	const onCaptchaVerify = (token: string) => {
		setValue("captcha_key", token);
		onSubmit();
	};

	return (
		<Wrapper>
			<LoginBox>
				<HeaderContainer>
					<Header>Welcome Back!</Header>
					<SubHeader>We're so excited to see you again!</SubHeader>
				</HeaderContainer>

				<FormContainer onSubmit={onSubmit}>
					<InputContainer
						marginBottom={true}
						style={{ marginTop: 0 }}
					>
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
								disabled={loading}
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
								disabled={loading}
							/>
						</InputWrapper>
					</InputContainer>

					<PasswordResetLink
						onClick={() => {
							window.open(
								"https://youtu.be/dQw4w9WgXcQ",
								"_blank",
							);
						}}
						type="button"
					>
						Forgot your password?
					</PasswordResetLink>
					{captchaSiteKey && (
						<HCaptchaLib
							sitekey={captchaSiteKey}
							onVerify={onCaptchaVerify}
							ref={captchaRef}
							onChalExpired={() => {
								console.log("Captcha challenge Expired");
								// TODO: red outline?
							}}
							onError={(e) => {
								console.log("Captcha Error", e);
								// TODO: red outline?
							}}
							onExpire={() => {
								console.log("Captcha Expired");
								// TODO: red outline?
							}}
						/>
					)}
					<LoginButton
						variant="primary"
						type="submit"
						disabled={loading}
					>
						Log In
					</LoginButton>

					<RegisterContainer>
						<RegisterLabel>
							Don't have an account?&nbsp;
						</RegisterLabel>
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
