import styled from "styled-components";

interface Props {
	// variant?: "primary" | "secondary" | "danger" | "success" | "warning";
	outlined?: boolean;
	color?: string;
}

export default styled.button<Props>`
	display: flex;
	align-items: center;
	justify-content: center;
	position: relative;
	margin: 0;
	padding: 0;
	width: 32px;
	height: 32px;
	border-radius: 4px;
	cursor: pointer;
	outline: none;
	opacity: ${(props) => (props.disabled ? 0.5 : 1)};
	background-color: transparent;

	color: ${(props) => {
		if (props.outlined) return "transparent";
		// switch (props.variant) {
		// 	case "primary":
		// 		return "var(--primary)";
		// 	case "secondary":
		// 		return "var(--secondary)";
		// 	case "danger":
		// 		return "var(--danger)";
		// 	case "success":
		// 		return "var(--success)";
		// 	case "warning":
		// 		return "var(--warning)";
		// 	default:
		// 		return "var(--primary)";
		// }
		return props.color;
	}};

	border: ${(props) => {
		if (!props.outlined) return "none";
		// switch (props.variant) {
		// 	case "primary":
		// 		return "1px solid var(--primary)";
		// 	case "secondary":
		// 		return "1px solid var(--secondary)";
		// 	case "danger":
		// 		return "1px solid var(--danger)";
		// 	case "success":
		// 		return "1px solid var(--success)";
		// 	case "warning":
		// 		return "1px solid var(--warning)";
		// 	default:
		// 		return "1px solid var(--primary)";
		// }
		return props.color;
	}};

	&:hover {
		background-color: var(--background-primary-alt);
		cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
	}
`;
