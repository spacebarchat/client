import HCaptchaLib from "@hcaptcha/react-hcaptcha";
import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import Container from "../components/Container";
import DOBInput from "../components/DOBInput";
import HCaptcha from "../components/HCaptcha";
import { useAppStore } from "../stores/AppStore";
import {
	IAPILoginResponseSuccess,
	IAPIRegisterRequest,
	IAPIRegisterResponseError,
} from "../utils/interfaces/api";
import { messageFromFieldError } from "../utils/messageFromFieldError";

const Wrapper = styled(Container)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: var(--secondary);
`;

const AuthBox = styled(Container)`
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
	border-radius: 12px;
	color: var(--text);
	margin: 0;
	border: none;
	aria-invalid: ${(props) => (props.error ? "true" : "false")};
	box-sizing: border-box;
	width: 100%;
`;

const LoginButton = styled(Button)`
	margin-bottom: 8px;
	width: 100%;
	min-width: 130px;
	min-height: 44px;
`;

const LoginLink = styled.button`
	margin-top: 4px;
	float: left;
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

type FormValues = {
	email: string;
	username: string;
	password: string;
	date_of_birth: string;
	captcha_key?: string;
};

function RegistrationPage() {
	const app = useAppStore();
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const [captchaSiteKey, setCaptchaSiteKey] = React.useState<string>();

	const captchaRef = React.useRef<HCaptchaLib>(null);

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm<FormValues>();

	const dobRegister = register("date_of_birth", {
		required: true,
		pattern: /^\d{4}-\d{2}-\d{2}$/,
	});

	const resetCaptcha = () => {
		captchaRef.current?.resetCaptcha();
		setValue("captcha_key", undefined);
	};

	const onSubmit = handleSubmit((data) => {
		if (errors.date_of_birth) return;

		setLoading(true);
		setCaptchaSiteKey(undefined);
		setValue("captcha_key", undefined);

		app.rest
			.post<IAPIRegisterRequest, IAPILoginResponseSuccess>(
				Routes.register(),
				{
					...data,
					consent: true,
				},
			)
			.then((r) => {
				if ("token" in r) {
					// success
					app.setToken(r.token);
					return;
				} else {
					// unknown error
					console.error(r);
					setError("email", {
						type: "manual",
						message: "Unknown Error",
					});
				}
			})
			.catch((r: IAPIRegisterResponseError) => {
				if ("captcha_key" in r) {
					// catcha required
					if (r.captcha_key[0] !== "captcha-required") {
						// some kind of captcha error
						setError("email", {
							type: "manual",
							message: `Captcha Error: ${r.captcha_key[0]}`,
						});
					} else if (r.captcha_service !== "hcaptcha") {
						// recaptcha or something else
						setError("email", {
							type: "manual",
							message: `Unsupported captcha service: ${r.captcha_service}`,
						});
					} else {
						// hcaptcha
						setCaptchaSiteKey(r.captcha_sitekey);
						captchaRef.current?.execute();
						return;
					}

					resetCaptcha();
				} else if ("message" in r) {
					// error
					if (r.errors) {
						const t = messageFromFieldError(r.errors);
						if (t) {
							setError(t.field as keyof FormValues, {
								type: "manual",
								message: t.error,
							});
						} else {
							setError("email", {
								type: "manual",
								message: r.message,
							});
						}
					} else {
						setError("email", {
							type: "manual",
							message: r.message,
						});
					}

					resetCaptcha();
				} else {
					// unknown error
					console.error(r);
					setError("email", {
						type: "manual",
						message: "Unknown Error",
					});
					resetCaptcha();
				}
			})
			.finally(() => setLoading(false));
	});

	const onCaptchaVerify = (token: string) => {
		setValue("captcha_key", token);
		onSubmit();
	};

	if (captchaSiteKey) {
		return (
			<HCaptcha
				captchaRef={captchaRef}
				sitekey={captchaSiteKey}
				onVerify={onCaptchaVerify}
			/>
		);
	}

	return (
		<Wrapper>
			<AuthBox>
				<HeaderContainer>
					<Header>Create an account</Header>
					{/* <SubHeader>We're so excited to see you again!</SubHeader> */}
				</HeaderContainer>

				<FormContainer onSubmit={onSubmit}>
					<InputContainer
						marginBottom={true}
						style={{ marginTop: 0 }}
					>
						<LabelWrapper error={!!errors.email}>
							<InputLabel>Email</InputLabel>
							{errors.email && (
								<InputErrorText>
									<>
										<Divider>-</Divider>
										{errors.email.message}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>
						<InputWrapper>
							<Input
								type="email"
								autoFocus
								{...register("email", { required: true })}
								error={!!errors.email}
								disabled={loading}
							/>
						</InputWrapper>
					</InputContainer>

					<InputContainer
						marginBottom={true}
						style={{ marginTop: 0 }}
					>
						<LabelWrapper error={!!errors.username}>
							<InputLabel>Username</InputLabel>
							{errors.username && (
								<InputErrorText>
									<>
										<Divider>-</Divider>
										{errors.username.message}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>
						<InputWrapper>
							<Input
								{...register("username", { required: true })}
								error={!!errors.username}
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

					<InputContainer marginBottom={true}>
						<LabelWrapper error={!!errors.date_of_birth}>
							<InputLabel>Date of Birth</InputLabel>
							{errors.date_of_birth && (
								<InputErrorText>
									<>
										<Divider>-</Divider>
										{errors.date_of_birth.message}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>

						<InputWrapper>
							<DOBInput
								onChange={(value) =>
									setValue("date_of_birth", value)
								}
								onErrorChange={(errors) => {
									const hasError = Object.values(errors).some(
										(error) => error,
									);
									if (hasError) {
										// set to first error
										setError("date_of_birth", {
											type: "manual",
											message: Object.values(
												errors,
											).filter((x) => x)[0],
										});
									} else clearErrors("date_of_birth");
								}}
								error={!!errors.date_of_birth}
								disabled={loading}
							/>
						</InputWrapper>
					</InputContainer>

					<LoginButton
						variant="primary"
						type="submit"
						disabled={loading}
					>
						Create Account
					</LoginButton>

					<LoginLink
						onClick={() => {
							navigate("/login", { replace: true });
						}}
						type="button"
					>
						Already have an account?
					</LoginLink>
				</FormContainer>
			</AuthBox>
		</Wrapper>
	);
}

export default RegistrationPage;
