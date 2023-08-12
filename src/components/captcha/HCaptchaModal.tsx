import HCaptchaLib from "@hcaptcha/react-hcaptcha";
import React from "react";
import styled from "styled-components";

interface Props {
	open: boolean;
	siteKey: string;
	onVerify: (token: string) => void;
}

const Wrapper = styled.form`
	position: absolute;
	top: 0;
`;

function HCaptchaModal({ open, siteKey, onVerify }: Props) {
	const ref = React.useRef<HCaptchaLib>(null);

	const onLoad = () => {
		ref.current?.execute();
	};

	return open ? (
		<Wrapper>
			<HCaptchaLib sitekey={siteKey} onLoad={onLoad} onVerify={onVerify} ref={ref} />
		</Wrapper>
	) : null;
}

export default HCaptchaModal;
