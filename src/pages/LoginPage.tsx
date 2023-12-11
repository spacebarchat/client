import HCaptchaLib from "@hcaptcha/react-hcaptcha";
import { useModals } from "@mattjennings/react-modal-stack";
import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ReactComponent as SpacebarLogoBlue } from "../assets/images/logo/Logo-Blue.svg";
import {
	AuthContainer,
	AuthSwitchPageContainer,
	AuthSwitchPageLabel,
	AuthSwitchPageLink,
	FormContainer,
	Header,
	Input,
	InputContainer,
	InputErrorText,
	InputLabel,
	InputWrapper,
	LabelWrapper,
	SubHeader,
	SubmitButton,
	Wrapper,
} from "../components/AuthComponents";
import { TextDivider } from "../components/Divider";
import HCaptcha, { HeaderContainer } from "../components/HCaptcha";
import ForgotPasswordModal from "../components/modals/ForgotPasswordModal";
import useLogger from "../hooks/useLogger";
import { AUTH_NO_BRANDING, useAppStore } from "../stores/AppStore";
import { Globals } from "../utils/Globals";
import REST from "../utils/REST";
import { RouteSettings } from "../utils/constants";
import {
	IAPILoginRequest,
	IAPILoginResponse,
	IAPILoginResponseError,
	IAPILoginResponseMFARequired,
} from "../utils/interfaces/api";
import { messageFromFieldError } from "../utils/messageFromFieldError";
import MFA from "./subpages/MFA";

type FormValues = {
	login: string;
	password: string;
	instance: string;
	captcha_key?: string;
};

function LoginPage() {
	const app = useAppStore();
	const logger = useLogger("LoginPage");
	const navigate = useNavigate();
	const [loading, setLoading] = React.useState(false);
	const [captchaSiteKey, setCaptchaSiteKey] = React.useState<string>();
	const [mfaData, setMfaData] = React.useState<IAPILoginResponseMFARequired>();
	const captchaRef = React.useRef<HCaptchaLib>(null);
	const [debounce, setDebounce] = React.useState<NodeJS.Timeout | null>(null);
	const [isCheckingInstance, setCheckingInstance] = React.useState(false);
	const { openModal } = useModals();

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
				captcha_key: data.captcha_key,
				undelete: false,
			})
			.then((r) => {
				if ("token" in r && "settings" in r) {
					// success
					app.setToken(r.token, true);
					return;
				} else if ("ticket" in r) {
					// mfa
					logger.info("MFA Required", r);
					setMfaData(r);
					return;
				} else {
					// unknown error
					logger.error(r);
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
					logger.error(r);
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

	const handleInstanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		clearErrors("instance");
		setCheckingInstance(false);

		// set as validating
		if (debounce) clearTimeout(debounce);

		const doRequest = async () => {
			const url = getValidURL(e.target.value);
			if (!url) return;
			setCheckingInstance(true);

			let endpoints: RouteSettings;
			try {
				endpoints = await REST.getEndpointsFromDomain(url);
			} catch (e) {
				setCheckingInstance(false);
				return setError("instance", {
					type: "manual",
					message: (e instanceof Error && e.message) || "Instance could not be resolved",
				});
			}

			logger.debug(`Instance lookup has set routes to`, endpoints);
			Globals.routeSettings = endpoints; // hmm
			Globals.save();
			setCheckingInstance(false);
		};

		setDebounce(setTimeout(doRequest, 500));
	};

	const forgotPassword = () => {
		openModal(ForgotPasswordModal);
	};

	if (captchaSiteKey) {
		return <HCaptcha captchaRef={captchaRef} sitekey={captchaSiteKey} onVerify={onCaptchaVerify} />;
	}

	if (mfaData) {
		return (
			<MFA
				{...mfaData}
				close={() => {
					setMfaData(undefined);
					resetCaptcha();
				}}
			/>
		);
	}

	return (
		<Wrapper>
			<AuthContainer>
				<HeaderContainer>
					{AUTH_NO_BRANDING ? (
						<>
							<Header>Login to Spacebar</Header>
						</>
					) : (
						<>
							<SpacebarLogoBlue height={48} width="auto" />
							<SubHeader noBranding>Log into Spacebar</SubHeader>
						</>
					)}
				</HeaderContainer>

				<FormContainer onSubmit={onSubmit}>
					<InputContainer marginBottom={true} style={{ marginTop: 0 }}>
						<LabelWrapper error={!!errors.instance}>
							<InputLabel>Instance</InputLabel>
							{isCheckingInstance != false && (
								<InputErrorText>
									<>
										<TextDivider>-</TextDivider>
										Checking
									</>
								</InputErrorText>
							)}
							{errors.instance && (
								<InputErrorText>
									<>
										<TextDivider>-</TextDivider>
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
								placeholder="Instance Root URL"
								onChange={handleInstanceChange}
								error={!!errors.instance}
								disabled={loading}
							/>
						</InputWrapper>
					</InputContainer>

					<InputContainer marginBottom>
						<LabelWrapper error={!!errors.login}>
							<InputLabel>Email</InputLabel>
							{errors.login && (
								<InputErrorText>
									<>
										<TextDivider>-</TextDivider>
										{errors.login.message}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>
						<InputWrapper>
							<Input
								type="email"
								placeholder="Email"
								autoFocus
								{...register("login", { required: true })}
								error={!!errors.login}
								disabled={loading}
							/>
						</InputWrapper>
					</InputContainer>

					<InputContainer marginBottom>
						<LabelWrapper error={!!errors.password}>
							<InputLabel>Password</InputLabel>
							{errors.password && (
								<InputErrorText>
									<>
										<TextDivider>-</TextDivider>
										{errors.password.message}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>
						<InputWrapper>
							<Input
								type="password"
								placeholder="Password"
								{...register("password", { required: true })}
								error={!!errors.password}
								disabled={loading}
							/>
						</InputWrapper>
					</InputContainer>

					{/* TODO:  I need to figure this out, clicking this should submit the form or even a different function with only email being required */}
					{/* <PasswordResetLink onClick={forgotPassword} type="button">
						Forgot your password?
					</PasswordResetLink> */}

					<SubmitButton palette="primary" type="submit" disabled={loading}>
						Login
					</SubmitButton>

					<AuthSwitchPageContainer>
						<AuthSwitchPageLabel>New to Spacebar?&nbsp;</AuthSwitchPageLabel>
						<AuthSwitchPageLink
							onClick={() => {
								navigate("/register");
							}}
							type="button"
						>
							Register
						</AuthSwitchPageLink>
					</AuthSwitchPageContainer>
				</FormContainer>
			</AuthContainer>
		</Wrapper>
	);
}

export default LoginPage;
