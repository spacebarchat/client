import { APIError, CaptchaError, MFAError } from "@puyodead1/fosscord-ts";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "../components/Button";
import Container from "../components/Container";
import { useAppStore } from "../stores/AppStore";
import { Alert, AlertTitle } from "@mui/material";

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

type Endpoints = {
	api: string;
	cdn: string;
	gateway: string;
};
type InstanceValidationData = {
	dataForDomain: string;
	errorMessage: string;
	domainExists: boolean;
	supportsHttps: boolean;
	hasCompleteWellKnown: boolean;
	resolvedEndpoints: Endpoints;
};

// Emma - Instance Validation
const instanceValidationDefaults: InstanceValidationData = {
	dataForDomain: "",
	errorMessage: "",
	domainExists: true,
	supportsHttps: true,
	hasCompleteWellKnown: true,
	resolvedEndpoints: {
		api: "",
		cdn: "",
		gateway: "",
	},
};

function LoginPage() {
	const app = useAppStore();
	const navigate = useNavigate();

	const [instanceUrl, setInstanceUrl] = React.useState<string>(
		"old.server.spacebar.chat",
	);
	const [instanceData, setInstanceData] =
		React.useState<InstanceValidationData>(instanceValidationDefaults);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setError,
	} = useForm<LoginFormValues>();

	const onSubmit = handleSubmit((data) => {
		_onUrlChange(instanceUrl).then(() => {
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
	});

	const onUrlChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		let url = e.target.value;
		await _onUrlChange(url);
	};

	async function _onUrlChange(url: string) {
		// Emma - remove useless things, domain/port is all we care about
		if (url.trim() !== url) url = url.trim();
		if (url.startsWith("https://")) url = url.replace("https://", "");
		if (url.startsWith("http://")) url = url.replace("http://", "");
		if (url.endsWith("/")) url = url.slice(0, -1);
		setInstanceUrl(url);
		instanceData.dataForDomain = url;
		console.log(`URL: ${url}`);

		// if (await _checkDomainExists(instanceData, url))
		if (await _checkDomainSupportsHttps(instanceData, url))
			if (await _checkDomainHasCompleteWellKnown(instanceData, url)) {
				console.log("All checks successful");
			}
		setInstanceData(instanceData);
	}

	// Emma - check if domain exists
	async function _checkDomainExists(_instanceData: InstanceValidationData, _instanceUrl: string) {
		let domain = _instanceUrl;
		// Emma - Extract domain from URL
		if (domain.includes("/")) {
			domain = domain.split("/")[0];
		}
		if (domain.includes(":")) {
			domain = domain.split(":")[0];
		}
		console.log(`Checking if domain ${domain} exists...`);
		const response = await fetch(
			`https://dns.google/resolve?name=${domain}`,
		);
		if ((await response.json()).Status === 0) {
			console.log("Domain exists");
			_instanceData.domainExists = true;
			return true;
		} else {
			console.log("Domain does not exist");
			_instanceData.domainExists = false;
			_instanceData.errorMessage = "Domain does not exist";
			return false;
		}
		return false; //error?
	}

	// Emma - check HTTPS support
	async function _checkDomainSupportsHttps(_instanceData: InstanceValidationData, _instanceUrl: string) {
		console.log(`Checking if domain ${_instanceUrl} supports HTTPS...`);
		let response = await fetch(`https://${_instanceUrl}/`);
		if (response.status === 200) {
			console.log("HTTPS supported");
			_instanceData.supportsHttps = true;
			return true;
		} else {
			console.log("HTTPS not supported! Checking HTTP...");
			response = await fetch(`http://${_instanceUrl}/`);
			if (response.status === 200) {
				console.log("HTTP supported");
				_instanceData.supportsHttps = false;
			} else {
				console.log("HTTP not supported!");
				_instanceData.supportsHttps = false;
				_instanceData.errorMessage = "Could not reach server, does it exist?";
			}
			return true;
		}
		return false; //error?
	}

	// Emma - check if well-known is complete
	async function _checkDomainHasCompleteWellKnown(_instanceData: InstanceValidationData, _instanceUrl: string) {
		console.log(`Checking if domain ${_instanceUrl} has complete well-known...`);
		let response = await fetch(`https://${_instanceUrl}/.well-known/spacebar/endpoints`);
		if (response.status === 200) {
			console.log("Well-known complete");
			_instanceData.hasCompleteWellKnown = true;
			return true;
		} else {
			console.log("Well-known incomplete!");
			_instanceData.hasCompleteWellKnown = false;
			_instanceData.errorMessage = "Well-known incomplete";
			return false;
		}
		return false; //error?
	}

	return (
		<Wrapper>

			<div id="instanceDataView" style={{ position: "absolute", top: 0, left: 0 }}>
				<p>Instance data:</p>
				<pre>{JSON.stringify(instanceData, null, 2)}</pre>
			</div>
			<LoginBox>
				<HeaderContainer>
					<Header>Welcome Back!</Header>
					<SubHeader>We're so excited to see you again!</SubHeader>
				</HeaderContainer>

				<FormContainer onSubmit={onSubmit}>
					<InputContainer marginBottom={true} style={{ marginTop: 0 }}>
						<LabelWrapper error={!!instanceData.errorMessage}>
							<InputLabel>Instance</InputLabel>
							{!!instanceData.errorMessage && (
								<InputErrorText>
									<>
										<Divider>-</Divider>
										{instanceData.errorMessage}
									</>
								</InputErrorText>
							)}
						</LabelWrapper>
						<InputWrapper>
							<Input
								error={!instanceData.domainExists}
								value={instanceUrl}
								onChange={onUrlChange}
								onLoad={onUrlChange}
							/>
						</InputWrapper>
					</InputContainer>
					<div
						id="instanceEndpointManualConfiguration"
						style={{
							display: !!instanceData.hasCompleteWellKnown ? "none" : "block",
						}}
					>
						{/*	add extra components later */}
						<Alert severity={"warning"}>
							<AlertTitle>
								Manual instance endpoint configuration required, could not find well-known.
							</AlertTitle>
						</Alert>
					</div>

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

					<PasswordResetLink onClick={() => {
					}} type="button">
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
