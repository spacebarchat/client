import { isTouchscreenDevice } from "@utils";
import React, { useEffect } from "react";
import styled from "styled-components";
import ContentEditableInput from "../ContentEditableInput";

const Container = styled.div`
	flex: 1;
	display: flex;
`;

interface Props {
	id: string;
	value: string;
	onChange: (value: string) => void;
	onKeyDown?: (e: React.KeyboardEvent) => void;
	placeholder?: string;
	disabled?: boolean;
	maxLength?: number;
}

function MessageTextArea({ id, value, onChange, onKeyDown, placeholder, disabled, maxLength }: Props) {
	const ref = React.useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (isTouchscreenDevice) return;
		if (ref.current) ref.current.focus();
	}, [value]);

	const inputSelected = () => ["TEXTAREA", "INPUT", "DIV"].includes(document.activeElement?.nodeName ?? "");

	useEffect(() => {
		if (!ref.current) return;

		if (isTouchscreenDevice) return;
		if (!inputSelected()) {
			ref.current.focus();
		}

		function keyDown(e: KeyboardEvent) {
			if ((e.ctrlKey && e.key !== "v") || e.altKey || e.metaKey) return;
			if (e.key.length !== 1) return;
			if (ref && !inputSelected()) {
				ref.current!.focus();
			}
		}

		document.body.addEventListener("keydown", keyDown);
		return () => document.body.removeEventListener("keydown", keyDown);
	}, [ref, value]);

	return (
		<Container>
			<ContentEditableInput
				id={id}
				value={value}
				onChange={onChange}
				onKeyDown={onKeyDown}
				placeholder={placeholder}
				disabled={disabled}
				maxLength={maxLength}
			/>
		</Container>
	);
}

export default MessageTextArea;
