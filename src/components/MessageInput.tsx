import React from "react";
import styled from "styled-components";
import Channel from "../stores/objects/Channel";

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
	word-wrap: break-word;
	padding: 12px 16px;
`;

interface Props {
	channel?: Channel;
}

function MessageInput(props: Props) {
	const wrapperRef = React.useRef<HTMLDivElement>(null);
	const placeholderRef = React.useRef<HTMLDivElement>(null);
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
	}, [content]);

	// this function makes the input element grow as the user types
	function adjustInputHeight() {
		if (!wrapperRef.current) return;

		wrapperRef.current.style.height = "44px";
		wrapperRef.current.style.height =
			wrapperRef.current.scrollHeight + "px";
	}

	function onChange(e: React.FormEvent<HTMLDivElement>) {
		const target = e.target as HTMLDivElement;
		const text = target.innerText;

		setContent(text);
		adjustInputHeight();
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
