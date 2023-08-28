import styled from "styled-components";
import Button from "./Button";
import Container from "./Container";

export const Wrapper = styled(Container)`
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: var(--background-tertiary);
`;

export const AuthContainer = styled(Container)`
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
	margin-bottom: 3px;
	color: var(--text);
	font-weight: var(--font-weight-bold);
	font-size: 24px;
`;

export const SubHeader = styled.h2<{ noBranding?: boolean }>`
	margin-top: 3px;
	color: var(--text-muted);
	font-weight: var(--font-weight-regular);
	font-size: ${(props) => (props.noBranding ? "20px" : "16px")};
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
	color: ${(props) => (props.error ? "var(--error)" : "var(--text)")};
`;

export const InputErrorText = styled.label`
	font-size: 14px;
	font-weight: var(--font-weight-regular);
	font-style: italic;
`;

export const InputLabel = styled.label`
	font-size: 14px;
	font-weight: var(--font-weight-bold);
`;

export const InputWrapper = styled.div`
	width: 100%;
	display: flex;
`;

// TODO: Fix border hover causing small layout shift
export const Input = styled.input<{ error?: boolean }>`
	outline: none;
	background: var(--background-secondary-alt);
	padding: 10px;
	font-size: 16px;
	flex: 1;
	border-radius: 12px;
	color: var(--text);
	margin: 0;
	border: none;
	aria-invalid: ${(props) => (props.error ? "true" : "false")};
	border: ${(props) => (props.error ? "1px solid var(--error)" : "none")};

	&:focus {
		border: 1px solid var(--primary);
	}

	// disabled styling
	&:disabled {
		background: var(--background-secondary-alt);
		color: var(--text-disabled);
		border: 1px solid var(--background-secondary-alt);
	}
`;

export const Link = styled.button`
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

export const SubmitButton = styled(Button)`
	margin-bottom: 8px;
	width: 100%;
	min-width: 130px;
	min-height: 44px;
	font-size: 14px;
`;

export const AuthSwitchPageContainer = styled.div`
	margin-top: 4px;
	text-align: initial;
`;

export const AuthSwitchPageLabel = styled.label`
	font-size: 14px;
`;

export const AuthSwitchPageLink = styled.button`
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
