import styled from "styled-components";

interface Props {
	variant?: "primary" | "secondary" | "danger" | "success" | "warning";
	outlined?: boolean;
}

export default styled.button<Props>`
	background: ${(props) => {
		if (props.outlined) return "transparent";
		switch (props.variant) {
			case "primary":
				return "var(--primary)";
			case "secondary":
				return "var(--secondary)";
			case "danger":
				return "var(--danger)";
			case "success":
				return "var(--success)";
			case "warning":
				return "var(--warning)";
			default:
				return "var(--primary)";
		}
	}};

	border: ${(props) => {
		if (!props.outlined) return "none";
		switch (props.variant) {
			case "primary":
				return "1px solid var(--primary)";
			case "secondary":
				return "1px solid var(--secondary)";
			case "danger":
				return "1px solid var(--danger)";
			case "success":
				return "1px solid var(--success)";
			case "warning":
				return "1px solid var(--warning)";
			default:
				return "1px solid var(--primary)";
		}
	}};

	color: var(--text);
	padding: 8px 16px;
	border-radius: 8px;
	font-size: 13px;
	font-weight: var(--font-weight-medium);
	cursor: pointer;
	outline: none;
	transition: background 0.2s ease-in-out;
	pointer-events: ${(props) => (props.disabled ? "none" : null)};
	opacity: ${(props) => (props.disabled ? 0.5 : 1)};

	&:hover {
		background: ${(props) => {
			switch (props.variant) {
				case "primary":
					return "var(--primary-light)";
				case "secondary":
					return "var(--secondary-light)";
				case "danger":
					return "var(--danger-light)";
				case "success":
					return "var(--success-light)";
				case "warning":
					return "var(--warning-light)";
				default:
					return "var(--primary-light)";
			}
		}};
		cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	}

	&:active {
		background: ${(props) => {
			switch (props.variant) {
				case "primary":
					return "var(--primary-dark)";
				case "secondary":
					return "var(--secondary-dark)";
				case "danger":
					return "var(--danger-dark)";
				case "success":
					return "var(--success-dark)";
				case "warning":
					return "var(--warning-dark)";
				default:
					return "var(--primary-dark)";
			}
		}};
	}
`;
