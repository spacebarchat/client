import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import Channel from "../../stores/objects/Channel";

import { useMemo, useState } from "react";
import { BaseEditor, Descendant, Node, createEditor } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import User from "../../stores/objects/User";
import Snowflake from "../../utils/Snowflake";

type CustomElement = { type: "paragraph"; children: CustomText[] };
type CustomText = { text: string; bold?: true };

declare module "slate" {
	interface CustomTypes {
		Editor: BaseEditor & ReactEditor & HistoryEditor;
		Element: CustomElement;
		Text: CustomText;
	}
}

const Container = styled.div`
	margin-top: -8px;
	padding-left: 16px;
	padding-right: 16px;
	flex-shrink: 0;
`;

const InnerContainer = styled.div`
	background-color: var(--background-primary);
	margin-bottom: 24px;
	width: 100%;
	border-radius: 8px;
`;

const initialEditorValue: Descendant[] = [
	{
		type: "paragraph",
		children: [
			{
				text: "",
			},
		],
	},
];

interface Props {
	channel?: Channel;
}

/**
 * Component for sending messages
 */
function MessageInput(props: Props) {
	const app = useAppStore();
	const logger = useLogger("MessageInput");
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	const [content, setContent] = useState("");

	const serialize = (value: Descendant[]) => {
		return (
			value
				// Return the string content of each paragraph in the value's children.
				.map((n) => Node.string(n))
				// Join them all with line breaks denoting paragraphs.
				.join("\n")
		);
	};

	const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			if (!props.channel) {
				logger.warn("No channel selected, cannot send message");
				return;
			}

			e.preventDefault();
			const shouldFail = app.experiments.isTreatmentEnabled("message_queue", 2);
			const shouldSend = !app.experiments.isTreatmentEnabled("message_queue", 1);

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

			setContent("");

			// reset slate editor
			const point = { path: [0, 0], offset: 0 };
			editor.selection = { anchor: point, focus: point };
			editor.history = { redos: [], undos: [] };
			editor.children = initialEditorValue;
		}
	};

	const onChange = (value: Descendant[]) => {
		const isAstChange = editor.operations.some((op) => "set_selection" !== op.type);
		if (isAstChange) {
			setContent(serialize(value));
		}
	};

	return (
		<Container>
			<InnerContainer>
				<div
					style={{
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
						<Slate editor={editor} initialValue={initialEditorValue} onChange={onChange}>
							<Editable
								onKeyDown={onKeyDown}
								value={content}
								style={{
									width: "100%",
									outline: "none",
									wordBreak: "break-word",
									padding: "12px 16px",
									overflowY: "auto",
									maxHeight: "50vh",
								}}
								placeholder={`Message ${props.channel?.name}`}
								aria-label="Message input"
							/>
						</Slate>
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
}

export default MessageInput;
