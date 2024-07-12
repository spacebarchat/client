import HCaptchaLib from "@hcaptcha/react-hcaptcha";
import React from "react";
import styled from "styled-components";
import { AuthContainer, Wrapper } from "./AuthComponents";

export const HeaderContainer = styled.div`
	width: 100%;
`;

export const Header = styled.h1`
	font-weight: var(--font-weight-bold);
	margin-bottom: 8px;
	font-size: 24px;
	color: var(--text);
`;

export const SubHeader = styled.h2`
	color: var(--text-muted);
	font-weight: var(--font-weight-regular);
	font-size: 16px;
	margin-bottom: 40px;
`;

interface Props {
	sitekey: string;
	captchaRef: React.RefObject<HCaptchaLib>;
	onLoad?: () => void;
	onChalExpired?: () => void;
	onError?: (e: unknown) => void;
	onExpire?: () => void;
	onVerify?: (token: string) => void;
}

function HCaptcha(props: Props) {
	return (
		<Wrapper>
			<AuthContainer>
				<HeaderContainer>
					<Header>Welcome Back!</Header>
					<SubHeader>Beep boop. Boop beep?</SubHeader>

					<HCaptchaLib
						sitekey={props.sitekey}
						ref={props.captchaRef}
						theme="dark" // TODO: make this dynamically change based on theme
						onVerify={props.onVerify}
						onLoad={props.onLoad}
						onChalExpired={props.onChalExpired}
						onError={props.onError}
						onExpire={props.onExpire}
					/>
				</HeaderContainer>
			</AuthContainer>
		</Wrapper>
	);
}

export default HCaptcha;
