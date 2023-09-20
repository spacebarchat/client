import { observer } from "mobx-react-lite";
import { memo } from "react";
import { MessageLike } from "../../stores/objects/Message";
import { QueuedMessageStatus } from "../../stores/objects/QueuedMessage";
import Avatar from "../Avatar";
import Markdown from "../markdown/MarkdownRenderer";
import MessageAttachment from "./MessageAttachment";
import MessageAuthor from "./MessageAuthor";
import MessageBase, { MessageContent, MessageDetails, MessageInfo } from "./MessageBase";
import AttachmentUploadProgress from "./attachments/AttachmentUploadProgress";

interface Props {
	message: MessageLike;
	header?: boolean;
}

function Message({ message, header }: Props) {
	return (
		<MessageBase
			header={header}
			sending={"status" in message && message.status === QueuedMessageStatus.SENDING}
			failed={"status" in message && message.status === QueuedMessageStatus.FAILED}
		>
			<MessageInfo click={typeof header !== "undefined"}>
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
				{message.content && <Markdown content={message.content} />}
				{"attachments" in message &&
					message.attachments.map((attachment, index) => (
						<MessageAttachment key={index} attachment={attachment} />
					))}
				{/* {message.embeds?.map((embed, index) => (
                            <MessageEmbed key={index} embed={embed} />
                        ))} */}
				{"files" in message && message.files?.length !== 0 && <AttachmentUploadProgress message={message} />}
			</MessageContent>
		</MessageBase>
	);
}

export default memo(observer(Message));
