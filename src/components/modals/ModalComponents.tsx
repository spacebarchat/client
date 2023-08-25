import styled from "styled-components";

export const ModalContainer = styled.div`
	z-index: 100;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	&::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: black;
		opacity: 0.85;
	}
`;

export const ModalWrapper = styled.div`
	width: 440px;
	border-radius: 4px;
	background-color: var(--background-secondary);
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 1px rgba(0, 0, 0, 0.05);
	position: relative;
	display: flex;
	justify-content: center;
	flex-direction: column;
`;

export const ModalCloseWrapper = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
`;

export const ModalHeaderText = styled.h1`
	font-size: 24px;
	font-weight: 700;
	color: var(--text-header);
	text-align: center;
	margin: 0;
	padding: 0;
`;

export const ModalSubHeaderText = styled.div`
	font-size: 16px;
	color: var(--text-header-secondary);
	text-align: center;
	margin-top: 8px;
`;

export const ModelContentContainer = styled.div`
	display: flex;
	flex-direction: column;
	padding: 0 16px;
	margin: 16px 0;
	border-radius: 5px 5px 0 0;
`;

export const ModalActionItem = styled.button<{
	variant?: "filled" | "blank" | "outlined";
	size?: "med" | "min";
}>`
	color: var(--text);
	display: flex;
	position: relative;
	justify-content: center;
	align-items: center;
	background: none;
	border: none;
	outline: none;
	border-radius: 3px;
	font-size: 14px;
	font-weight: 500;
	padding: 2px 16px;
	cursor: pointer;
	transition: background-color 0.2s ease-in-out;

	${(props) => {
		if (props.variant === "filled") {
			return `
			background-color: var(--primary);
			
			&:hover {
				background-color: var(--primary-light);
			}
			`;
		} else if (props.variant === "blank") {
			return `
			background: transparent;
			`;
		} else if (props.variant === "outlined") {
			return `
			background: transparent;
			border: 1px solid var(--background-secondary-highlight);
			`;
		}
	}}

	${(props) => {
		if (props.size === "med") {
			return `
				width: auto;
				height: 38px;
				min-width: 96px;
				min-height: 38px;
			`;
		} else if (props.size === "min") {
			return `
			width: auto;
			display: inline;
			height: auto;
			padding: 2px 4px;
			`;
		}
	}}

	// disabled styling
	${(props) => {
		if (props.disabled) {
			return `
			opacity: 0.5;
			cursor: not-allowed;
			`;
		}
	}}
`;

export const ModalFooter = styled.div`
	border-radius: 0 0 5px 5px;
	background-color: var(--background-primary-alt);
	position: relative;
	padding: 16px;
	display: flex;
	flex-direction: row-reverse;
	justify-content: space-between;
`;
