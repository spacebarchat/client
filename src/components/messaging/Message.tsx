import { observer } from "mobx-react-lite";
import React, { memo } from "react";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { useAppStore } from "../../stores/AppStore";
import { MessageLike } from "../../stores/objects/Message";
import { QueuedMessageStatus } from "../../stores/objects/QueuedMessage";
import ContextMenus from "../../utils/ContextMenus";
import Avatar from "../Avatar";
import { IContextMenuItem } from "../ContextMenuItem";
import Markdown from "../markdown/MarkdownRenderer";
import MessageAttachment from "./MessageAttachment";
import MessageAuthor from "./MessageAuthor";
import MessageBase, { MessageContent, MessageContentText, MessageDetails, MessageInfo } from "./MessageBase";
import MessageEmbed from "./MessageEmbed";
import AttachmentUploadProgress from "./attachments/AttachmentUploadProgress";

interface Props {
	message: MessageLike;
	header?: boolean;
}

function Message({ message, header }: Props) {
	const app = useAppStore();
	const contextMenu = React.useContext(ContextMenuContext);
	const [contextMenuItems, setContextMenuItems] = React.useState<IContextMenuItem[]>([
		...ContextMenus.Message(app, message, app.account),
	]);

	return (
		<MessageBase header={header} onContextMenu={(e) => contextMenu.open2(e, contextMenuItems)}>
			<MessageInfo>
				{header ? (
					<Avatar key={message.author.id} user={message.author} size={40} />
				) : (
					<MessageDetails message={message} position="left" />
				)}
			</MessageInfo>
			<MessageContent>
				{header && (
					<span className="message-details">
						<MessageAuthor message={message} />
						<MessageDetails message={message} position="top" />
					</span>
				)}
				<MessageContentText
					sending={"status" in message && message.status === QueuedMessageStatus.SENDING}
					failed={"status" in message && message.status === QueuedMessageStatus.FAILED}
				>
					{message.content && <Markdown content={message.content} />}
				</MessageContentText>

				{"attachments" in message &&
					message.attachments.map((attachment, index) => (
						<MessageAttachment key={index} attachment={attachment} />
					))}
				{"embeds" in message &&
					message.embeds?.map((embed, index) => <MessageEmbed key={index} embed={embed} />)}
				{"files" in message && message.files?.length !== 0 && <AttachmentUploadProgress message={message} />}
			</MessageContent>
		</MessageBase>
	);
}

export default memo(observer(Message));
