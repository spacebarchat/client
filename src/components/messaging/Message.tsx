import Avatar from "@components/Avatar";
import InviteEmbed from "@components/InviteEmbed";
import Markdown from "@components/markdown/MarkdownRenderer";
import { ContextMenuContext } from "@contexts/ContextMenuContext";
import { useAppStore } from "@hooks/useAppStore";
import { MessageLike, QueuedMessageStatus } from "@structures";
import { observer } from "mobx-react-lite";
import { memo, useContext } from "react";
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
	const contextMenuContext = useContext(ContextMenuContext);

	const guild = message.guild_id ? app.guilds.get(message.guild_id) : undefined;
	const isEveryoneMentioned = "mention_everyone" in message && message.mention_everyone;
	const isUserMentioned = "mentions" in message && message.mentions.some((mention) => mention.id === app.account!.id);
	const isRoleMentioned =
		guild &&
		"mention_roles" in message &&
		message.mention_roles.some((r1) => guild.members.me?.roles.some((r2) => r1 === r2.id));

	return (
		<MessageBase
			header={header}
			mention={isEveryoneMentioned || isUserMentioned || isRoleMentioned}
			onContextMenu={(e) =>
				contextMenuContext.onContextMenu(e, {
					type: "message",
					message: message,
				})
			}
		>
			<MessageInfo>
				{header ? (
					<Avatar key={message.author.id} user={message.author} size={32} />
				) : (
					<MessageDetails message={message} position="left" />
				)}
			</MessageInfo>
			<MessageContent>
				{header && (
					<span className="message-details">
						<MessageAuthor message={message} guild={guild} />
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
				{"invites" in message &&
					message.invites.map((code, index) => (
						<InviteEmbed key={index} code={code} isSelf={message.author.id === app.account!.id} />
					))}
			</MessageContent>
		</MessageBase>
	);
}

export default memo(observer(Message));
