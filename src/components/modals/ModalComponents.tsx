import { type StackedModalProps } from "@mattjennings/react-modal-stack";
import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

/**
 * Main container for all modals, handles the background overlay and positioning
 */
export const ModalBase = styled(motion.div)`
	z-index: 100;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	// &::before {
	// 	content: "";
	// 	position: absolute;
	// 	top: 0;
	// 	left: 0;
	// 	right: 0;
	// 	bottom: 0;
	// 	background-color: black;
	// 	opacity: 0.85;
	// }
`;

/**
 * Wrapper for modal content, handles the sizing and positioning
 */
export const ModalWrapper = styled(motion.div)<{ full?: boolean }>`
	width: ${(props) => (props.full ? "100%" : "440px")};
	height: ${(props) => (props.full ? "100%" : "auto")};
	border-radius: 4px;
	background-color: var(--background-secondary);
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 1px 3px 1px rgba(0, 0, 0, 0.05);
	position: relative;
	display: flex;
	justify-content: ${(props) => (props.full ? undefined : "center")};
	flex-direction: ${(props) => (props.full ? "row" : "column")};
`;

/**
 * Wrapper for modal close button
 */
export const ModalCloseWrapper = styled.div`
	position: absolute;
	top: 10px;
	right: 10px;
`;

export const ModalHeaderText = styled.h1`
	font-size: 24px;
	font-weight: var(--font-weight-bold);
	color: var(--text-header);
	text-align: center;
	margin: 0;
	padding: 0;
`;

export const ModalSubHeaderText = styled.div`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
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
	variant?: "filled" | "blank" | "outlined" | "link";
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
	font-weight: var(--font-weight-medium);
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
		} else if (props.variant === "link") {
			return `
			background: transparent;
			
			&:hover {
				text-decoration: underline;
			}
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

export const ModalFullSidebar = styled.div`
	display: flex;
	justify-content: flex-end;
	flex: 1 0 11.35%;
	z-index: 1;
	background-color: var(--background-secondary);
`;
export const ModalFullContent = styled.div`
	position: relative;
	display: flex;
	flex: 1 1 42.3%;
	align-items: flex-start;
	background-color: var(--background-primary);
`;

interface ModalProps extends StackedModalProps {
	children: React.ReactNode;
	full?: boolean;
}

export function Modal(props: ModalProps) {
	return (
		<AnimatePresence>
			{props.open && (
				<ModalBase
					variants={{
						show: {
							opacity: 1,
							scale: 1,
						},
						hide: {
							opacity: 0,
							scale: 0,
						},
					}}
					initial="hide"
					animate="show"
					exit="hide"
					{...props}
				>
					<ModalWrapper full={props.full}>{props.children}</ModalWrapper>
				</ModalBase>
			)}
		</AnimatePresence>
	);
}
