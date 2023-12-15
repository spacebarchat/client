// Adapted from https://github.com/revoltchat/components/blob/master/src/components/design/atoms/inputs/Button.tsx

import styled, { css } from "styled-components";

export interface Props {
	readonly compact?: boolean | "icon";
	palette?: "primary" | "secondary" | "success" | "warning" | "danger" | "accent" | "link";
	readonly disabled?: boolean;
}

export default styled.button<Props>`
	color: var(--text);
	padding: 8px 16px;
	border-radius: 8px;
	font-size: 12px;
	font-weight: var(--font-weight-medium);
	outline: none;
	border: none;
	transition: background 0.2s ease-in-out;
	cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	opacity: ${(props) => (props.disabled ? 0.5 : 1)}
	font-weight: var(--font-weight-bold);

	${(props) => {
		if (!props.palette) props.palette = "primary";
		switch (props.palette) {
			case "primary":
			case "secondary":
			case "success":
			case "warning":
			case "danger":
			case "accent":
				return css`
					background: var(--${props.palette});

					&:hover {
						filter: brightness(1.2);
					}

					&:active {
						filter: brightness(0.8);
					}

					&:disabled {
						filter: brightness(0.7);
					}
				`;
			case "link":
				return css`
					background: transparent;

					&:hover {
						text-decoration: underline;
					}

					&:active {
						filter: brightness(0.8);
					}

					&:disabled {
						filter: brightness(0.7);
					}
				`;
		}
	}}
`;
