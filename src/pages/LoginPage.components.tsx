import styled from "styled-components";
import Button from "../components/Button";
import Container from "../components/Container";

export const Wrapper = styled(Container)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: var(--secondary);
`;

export const LoginBox = styled(Container)`
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
