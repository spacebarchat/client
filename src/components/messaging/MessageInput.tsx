import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { useAppStore } from "../../stores/AppStore";
import Channel from "../../stores/objects/Channel";

import { RESTPostAPIChannelMessageJSONBody } from "@spacebarchat/spacebar-api-types/v9";
import { observer } from "mobx-react-lite";
import React, { useMemo } from "react";
import { BaseEditor, Descendant, Node, createEditor } from "slate";
import { HistoryEditor, withHistory } from "slate-history";
import { Editable, ReactEditor, Slate, withReact } from "slate-react";
import Guild from "../../stores/objects/Guild";
import User from "../../stores/objects/User";
import { Permissions } from "../../utils/Permissions";
import Snowflake from "../../utils/Snowflake";
import { HorizontalDivider } from "../Divider";
import Icon from "../Icon";
import IconButton from "../IconButton";
import AttachmentUploadList from "./AttachmentUploadList";

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
	z-index: 1;
`;

const InnerContainer = styled.div`
	background-color: var(--background-primary);
	margin-bottom: 24px;
	width: 100%;
	border-radius: 8px;
`;

const UploadActionWrapper = styled.div`
	display: flex;
	flex: 1;
	align-items: center;
	padding: 0 12px;
`;

const StyledEditable = styled(Editable)<{ $canSendMessages?: boolean; $canUpload?: boolean }>`
	width: 100%;
	outline: none;
	word-break: break-word;
	padding: 12px 16px 12px ${({ $canUpload }) => ($canUpload ? "0" : "16px")};
	overflow-y: auto;
	max-height: 50vh;
	cursor: ${({ $canSendMessages }) => (!$canSendMessages ? "not-allowed" : "text")};
`;

const CustomIcon = styled(Icon)`
	color: var(--text-secondary);

	&:hover {
		color: var(--text);
	}
`;

const AttachmentsList = styled.ul`
	display: flex;
	gap: 8px;
	padding: 10px;
	overflow-x: auto;
	list-style: none;
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
	channel: Channel;
	guild?: Guild;
}

/**
 * Component for sending messages
 */
function MessageInput(props: Props) {
	const app = useAppStore();
	const logger = useLogger("MessageInput");
	const editor = useMemo(() => withHistory(withReact(createEditor())), []);
	const [content, setContent] = React.useState("");
	const [canSendMessages, setCanSendMessages] = React.useState(true);
	const [canUpload, setCanUpload] = React.useState(true);
	const uploadRef = React.useRef<HTMLInputElement>(null);
	const [attachments, setAttachments] = React.useState<File[]>([]);

	React.useEffect(() => {
		const permission = Permissions.getPermission(app.account!.id, props.guild, props.channel);
		setCanSendMessages(permission.has("SEND_MESSAGES"));
		setCanUpload(permission.has("ATTACH_FILES"));
	}, [props.channel, props.guild]);

	const serialize = React.useCallback((value: Descendant[]) => {
		return (
			value
				// Return the string content of each paragraph in the value's children.
				.map((n) => Node.string(n))
				// Join them all with line breaks denoting paragraphs.
				.join("\n")
		);
	}, []);

	const onKeyDown = React.useCallback(
		(e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				if (!props.channel) {
					logger.warn("No channel selected, cannot send message");
					return;
				}

				e.preventDefault();
				const shouldFail = app.experiments.isTreatmentEnabled("message_queue", 2);
				const shouldSend = !app.experiments.isTreatmentEnabled("message_queue", 1);

				const canSend = props.channel.canSendMessage(content, attachments);
				if (!canSend && !shouldFail) return;

				const nonce = Snowflake.generate();
				const msg = app.queue.add({
					id: nonce,
					author: app.account! as unknown as User,
					content,
					channel: props.channel.id,
					files: attachments,
				});

				if (shouldSend) {
					let body: RESTPostAPIChannelMessageJSONBody | FormData;
					if (attachments.length > 0) {
						const data = new FormData();
						data.append("payload_json", JSON.stringify({ content, nonce }));
						attachments.forEach((file, index) => {
							data.append(`files[${index}]`, file);
						});
						body = data;
					} else {
						body = { content, nonce };
					}
					props.channel.sendMessage(body, msg).catch((error) => {
						if (error) app.queue.error(nonce, error as string);
					});
				}

				setContent("");
				setAttachments([]);

				// reset slate editor
				const point = { path: [0, 0], offset: 0 };
				editor.selection = { anchor: point, focus: point };
				editor.history = { redos: [], undos: [] };
				editor.children = initialEditorValue;
			}
		},
		[props.channel, content, attachments],
	);

	const onChange = React.useCallback((value: Descendant[]) => {
		const isAstChange = editor.operations.some((op) => "set_selection" !== op.type);
		if (isAstChange) {
			setContent(serialize(value));
		}
	}, []);

	const handleFileUpload = React.useCallback(() => {
		if (!props.channel) {
			logger.warn("[HandleFileUpload] Invalid Channel");
			return;
		}
		uploadRef.current?.click();
	}, [props.channel]);

	const onChangeFile = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files) return;
			const files = Array.from(e.target.files);
			const newAttachments = [...attachments, ...files];
			setAttachments(newAttachments);
		},
		[attachments],
	);

	const removeAttachment = React.useCallback(
		(index: number) => {
			const newAttachments = [...attachments];
			newAttachments.splice(index, 1);
			setAttachments(newAttachments);
		},
		[attachments],
	);

	return (
		<Container>
			<InnerContainer>
				<div
					style={{
						borderRadius: "8px",
					}}
				>
					{attachments.length > 0 && (
						<>
							<AttachmentsList>
								{attachments.map((file, index) => (
									<AttachmentUploadList
										key={index}
										file={file}
										remove={() => removeAttachment(index)}
									/>
								))}
							</AttachmentsList>
							<HorizontalDivider nomargin />
						</>
					)}
					<div
						style={{
							display: "flex",
							flex: 1,
							position: "relative",
						}}
					>
						{canUpload && (
							<UploadActionWrapper>
								<input
									type="file"
									ref={uploadRef}
									style={{ display: "none" }}
									onChange={onChangeFile}
									multiple={true}
									disabled={!canSendMessages || !canUpload}
								/>
								<IconButton onClick={handleFileUpload} disabled={!canSendMessages || !canUpload}>
									<CustomIcon icon="mdiPlusCircle" size="24px" />
								</IconButton>
							</UploadActionWrapper>
						)}
						<Slate editor={editor} initialValue={initialEditorValue} onChange={onChange}>
							<StyledEditable
								$canSendMessages={canSendMessages}
								$canUpload={canUpload}
								onKeyDown={onKeyDown}
								value={content}
								placeholder={
									canSendMessages
										? `Message ${props.channel?.name}`
										: "You do not have permission to send messages in this channel."
								}
								aria-label="Message input"
								readOnly={!canSendMessages}
							/>
						</Slate>
					</div>
				</div>
			</InnerContainer>
		</Container>
	);
}

export default observer(MessageInput);
