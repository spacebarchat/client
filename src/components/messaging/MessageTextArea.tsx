// import { TextareaAutosize, TextareaAutosizeProps } from "@mui/material";
import { isTouchscreenDevice } from "@utils";
import React from "react";
import styled from "styled-components";
import { TextareaAutosize, TextareaAutosizeProps } from "./TextareaAutosize";

const Container = styled.div`
	flex: 1;
	display: flex;
`;

const TextArea = styled(TextareaAutosize)`
	resize: none;
	border: none;
	outline: none;
	background-color: transparent;
	color: var(--text);
	// border-radius: 10px;
	overflow-wrap: break-word;
	word-break: break-word;
	white-space: break-spaces;
	font-size: 16px;
	font-family: var(--font-family);
	flex: 1;
	padding: 13px 10px;

	&:disabled {
		cursor: not-allowed;
		color: var(--text-disabled);
	}
`;

function MessageTextArea(props: TextareaAutosizeProps) {
	const ref = React.useRef<HTMLTextAreaElement | null>(null);

	React.useEffect(() => {
		if (isTouchscreenDevice) return;
		if (ref.current) ref.current.focus();
	}, [props.value]);

	const inputSelected = () => ["TEXTAREA", "INPUT"].includes(document.activeElement?.nodeName ?? "");

	React.useEffect(() => {
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
	}, [ref, props.value]);

	return (
		<Container>
			<TextArea
				ref={ref}
				{...props}
				maxRows={
					// 50vh
					Math.floor((window.innerHeight * 0.5) / 20)
				}
			/>
		</Container>
	);
}

export default MessageTextArea;
