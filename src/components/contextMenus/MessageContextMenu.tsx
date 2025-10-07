import { modalController } from "@/controllers/modals";
import { useAppStore } from "@hooks/useAppStore";
import { Message } from "@structures";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "./ContextMenu";

interface MenuProps {
	message: Message;
}

function MessageContextMenu({ message }: MenuProps) {
	const app = useAppStore();

	function copyRaw() {
		navigator.clipboard.writeText(message.content);
	}

	async function deleteMessage(e: MouseEvent) {
		if (e.shiftKey) {
			await message.delete();
		} else {
			modalController.push({
				type: "delete_message",
				target: message as Message,
			});
		}
	}

	function copyId() {
		navigator.clipboard.writeText(message.id);
	}

	return (
		<ContextMenu>
			<ContextMenuButton icon="mdiReply" disabled>
				Reply
			</ContextMenuButton>
			<ContextMenuButton icon="mdiContentCopy" onClick={copyRaw}>
				Copy Raw Text
			</ContextMenuButton>
			<ContextMenuDivider />
			{((message instanceof Message && message.channel.hasPermission("MANAGE_MESSAGES")) ||
				message.author.id === app.account?.id) &&
				message instanceof Message && (
					<>
						<ContextMenuButton icon="mdiDelete" destructive onClick={deleteMessage}>
							Delete Message
						</ContextMenuButton>
						<ContextMenuDivider />
					</>
				)}
			<ContextMenuButton
				icon="mdiIdentifier"
				onClick={copyId}
				iconProps={{
					style: {
						filter: "invert(100%)",
						background: "black",
						borderRadius: "4px",
					},
				}}
			>
				Copy Message ID
			</ContextMenuButton>
		</ContextMenu>
	);
}

export default MessageContextMenu;
