import HCaptchaLib from "@hcaptcha/react-hcaptcha";
import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import Container from "../components/Container";
import HCaptcha from "../components/HCaptcha";
import MFA from "../components/MFA";
import { useAppStore } from "../stores/AppStore";
import {
	IAPILoginRequest,
	IAPILoginResponse,
	IAPILoginResponseError,
	IAPILoginResponseMFARequired,
} from "../utils/interfaces/api";
import { messageFromFieldError } from "../utils/messageFromFieldError";
import REST from "../utils/REST";
import { Globals } from "../utils/Globals";

export const Wrapper = styled(Container)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: var(--background-tertiary);
`;

export const AuthBox = styled(Container)`
	background-color: var(--background-primary-alt);
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

export const HeaderContainer = styled.div`
	width: 100%;
`;

export const Header = styled.h1`
	font-weight: 600;
	margin-bottom: 8px;
	font-size: 24px;
	color: var(--text);
`;

export const SubHeader = styled.h2`
	color: var(--text-muted);
	font-weight: 400;
	font-size: 16px;
`;

export const FormContainer = styled.form`
	width: 100%;
`;

export const InputContainer = styled.h1<{ marginBottom: boolean }>`
	margin-bottom: ${(props) => (props.marginBottom ? "20px" : "0")};
	display: flex;
	flex-direction: column;
	align-items: flex-start;
`;

export const LabelWrapper = styled.div<{ error?: boolean }>`
	display: flex;
	flex-direction: row;
	margin-bottom: 8px;
	color: ${(props) => (props.error ? "var(--error)" : "#b1b5bc")};
`;

export const InputErrorText = styled.label`
	font-size: 14px;
	font-weight: 400;
	font-style: italic;
`;

export const InputLabel = styled.label`
	font-size: 14px;
	font-weight: 700;
`;

export const InputWrapper = styled.div`
	width: 100%;
	display: flex;
`;

export const Input = styled.input<{ error?: boolean }>`
	outline: none;
	background: var(--background-secondary);
	padding: 10px;
	font-size: 16px;
	flex: 1;
	border-radius: 12px;
	color: var(--text);
	margin: 0;
	border: none;
	aria-invalid: ${(props) => (props.error ? "true" : "false")};
`;

export const PasswordResetLink = styled.button`
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

export const LoginButton = styled(Button)`
	margin-bottom: 8px;
	width: 100%;
	min-width: 130px;
	min-height: 44px;
`;

export const RegisterContainer = styled.div`
	margin-top: 4px;
	text-align: initial;
`;

export const RegisterLabel = styled.label`
	font-size: 14px;
`;

export const RegisterLink = styled.button`
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

export const Divider = styled.span`
	padding: 0 4px;
`;

type FormValues = {
	login: string;
	password: string;
	instance: string;
	captcha_key?: string;
};

function LoginPage() {
	const app = useAppStore();
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const [captchaSiteKey, setCaptchaSiteKey] = React.useState<string>();
	const [mfaData, setMfaData] =
		React.useState<IAPILoginResponseMFARequired>();
	const captchaRef = React.useRef<HCaptchaLib>(null);
	const [debounce, setDebounce] = React.useState<NodeJS.Timeout | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
		setValue,
		clearErrors,
	} = useForm<FormValues>();

	const resetCaptcha = () => {
		captchaRef.current?.resetCaptcha();
		setValue("captcha_key", undefined);
	};

	const getValidURL = (url: string) => {
		try {
			return new URL(url);
		} catch (e) {
			return undefined;
		}
	};

	const onSubmit = handleSubmit((data) => {
		setLoading(true);
		setCaptchaSiteKey(undefined);
		setMfaData(undefined);

		app.rest
			.post<IAPILoginRequest, IAPILoginResponse>(Routes.login(), {
				login: data.login,
				password: data.password,
				undelete: false,
			})
			.then((r) => {
				if ("token" in r && "settings" in r) {
					// success
					app.setToken(r.token, true);
					return;
				} else if ("ticket" in r) {
					// mfa
					console.log("MFA Required", r);
					setMfaData(r);
					return;
				} else {
					// unknown error
					console.error(r);
					setError("login", {
						type: "manual",
						message: "Unknown Error",
					});
				}
			})
			.catch((r: IAPILoginResponseError) => {
				if ("captcha_key" in r) {
					// catcha required
					if (r.captcha_key[0] !== "captcha-required") {
						// some kind of captcha error
						setError("login", {
							type: "manual",
							message: `Captcha Error: ${r.captcha_key[0]}`,
						});
					} else if (r.captcha_service !== "hcaptcha") {
						// recaptcha or something else
						setError("login", {
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
							setError("login", {
								type: "manual",
								message: r.message,
							});
						}
					} else {
						setError("login", {
							type: "manual",
							message: r.message,
						});
					}

					resetCaptcha();
				} else {
					// unknown error
					console.error(r);
					setError("login", {
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

	if (mfaData) {
		return <MFA {...mfaData} />;
	}

	return (
		<Wrapper>
			<AuthBox>
				<HeaderContainer>
					<Header>Welcome Back!</Header>
					<SubHeader>We're so excited to see you again!</SubHeader>
				</HeaderContainer>

				<FormContainer onSubmit={onSubmit}>
					<InputContainer
						marginBottom={true}
						style={{ marginTop: 0 }}
					>
						<LabelWrapper error={!!errors.instance}>
							<InputLabel>Instance</InputLabel>
							{errors.instance && (
								<InputErrorText>
									<>
										<Divider>-</Divider>
										{errors.instance.message}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>
						<InputWrapper>
							<Input
								type="url"
								{...register("instance", {
									required: true,
									value: Globals.routeSettings.wellknown,
								})}
								onChange={(elem) => {
									if (debounce) clearTimeout(debounce);

									const doRequest = async () => {
										const url = getValidURL(
											elem.target.value,
										);
										if (!url) return;

										const endpoints =
											await REST.getEndpointsFromDomain(
												url,
											);
										if (!endpoints)
											return setError("instance", {
												type: "manual",
												message:
													"Instance could not be resolved",
											});

										console.debug(
											`Instance lookup has set routes to`,
											endpoints,
										);
										Globals.routeSettings = endpoints; // hmm
										Globals.save();
										clearErrors("instance");
									};

									setDebounce(setTimeout(doRequest, 500));
								}}
								error={!!errors.instance}
								disabled={loading}
							/>
						</InputWrapper>
					</InputContainer>

					<InputContainer marginBottom={false}>
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
			</AuthBox>
		</Wrapper>
	);
}

export default LoginPage;
