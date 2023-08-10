import React from "react";
import styled from "styled-components";
import useLogger from "../hooks/useLogger";
import { useAppStore } from "../stores/AppStore";
import Channel from "../stores/objects/Channel";
import User from "../stores/objects/User";
import Snowflake from "../utils/Snowflake";

const Container = styled.div`
	margin-top: -8px;
	padding-left: 16px;
	padding-right: 16px;
	flex-shrink: 0;
	position: relative;
`;

const InnerContainer = styled.div`
	background-color: var(--background-primary);
	margin-bottom: 24px;
	position: relative;
	width: 100%;
	border-radius: 8px;
`;

const TextInput = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	outline: none;
	word-wrap: anywhere;
	padding: 12px 16px;
`;

interface Props {
	channel?: Channel;
}

function MessageInput(props: Props) {
	const app = useAppStore();
	const logger = useLogger("MessageInput");
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const placeholderRef = React.useRef<HTMLDivElement>(null);
	const inputRef = React.useRef<HTMLDivElement>(null);
	const [content, setContent] = React.useState("");

	React.useEffect(() => {
		// ensure the content is not just a new line
		if (content === "\n") {
			setContent("");
			return;
		}

		// controls the placeholder visibility
		if (!content.length)
			placeholderRef.current!.style.setProperty("display", "block");
		else placeholderRef.current!.style.setProperty("display", "none");

		// update the input content
		if (inputRef.current) {
			// handle empty input
			if (!content.length) {
				inputRef.current.innerHTML = "";
				return;
			} else {
				const selection = window.getSelection();
				const range = document.createRange();
				range.selectNodeContents(inputRef.current);
				range.collapse(false);
				selection?.removeAllRanges();
				selection?.addRange(range);
			}
		}
	}, [content]);

	// this function makes the input element grow as the user types
	function adjustInputHeight() {
		if (!wrapperRef.current) return;

		wrapperRef.current.style.height = "44px";
		wrapperRef.current.style.height =
			wrapperRef.current.scrollHeight + "px";
	}

	function resetInput() {
		setContent("");
		adjustInputHeight();
	}

	function onChange(e: React.FormEvent<HTMLDivElement>) {
		const target = e.target as HTMLDivElement;
		const text = target.innerText;

		setContent(text);
		adjustInputHeight();
	}

	function onKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
		if (!props.channel) {
			logger.warn("No channel selected, cannot send message");
			return;
		}

		if (e.key === "Enter") {
			e.preventDefault();
			const shouldFail = app.experiments.isTreatmentEnabled(
				"message_queue",
				2,
			);
			const shouldSend = !app.experiments.isTreatmentEnabled(
				"message_queue",
				1,
			);

			if (!props.channel.canSendMessage(content) && !shouldFail) return;

			const nonce = Snowflake.generate();
			app.queue.add({
				id: nonce,
				author: app.account! as unknown as User,
				content,
				channel: props.channel.id,
			});

			if (shouldSend) {
				props.channel.sendMessage({ content, nonce }).catch((error) => {
					app.queue.error(nonce, error as string);
				});
			}

			resetInput();
		}
	}

	return (
		<Container>
			<InnerContainer>
				<div
					style={{
						overflowX: "hidden",
						overflowY: "scroll",
						maxHeight: "50vh",
						borderRadius: "8px",
					}}
				>
					<div
						style={{
							paddingLeft: "16px",
							display: "flex",
							position: "relative",
						}}
					>
						<div
							style={{
								padding: 0,
								backgroundColor: "transparent",
								resize: "none",
								border: "none",
								appearance: "none",
								fontWeight: 400,
								fontSize: "16px",
								width: "100%",
								height: "44px",
								minHeight: "44px",
								// maxHeight: "50vh",
								color: "var(--text-normal)",
								position: "relative",
							}}
							ref={wrapperRef}
						>
							<div>
								<span
									ref={placeholderRef}
									style={{
										padding: "12px 16px",
									}}
								>
									Message #{props.channel?.name}
								</span>
								<TextInput
									role="textbox"
									spellCheck="true"
									autoCorrect="off"
									contentEditable="true"
									onInput={onChange}
									onKeyDown={onKeyDown}
									ref={inputRef}
								/>
							</div>
						</div>
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
}

export default MessageInput;
