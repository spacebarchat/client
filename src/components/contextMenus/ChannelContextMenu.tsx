// loosely based on https://github.com/revoltchat/frontend/blob/master/components/app/menus/UserContextMenu.tsx

import { modalController } from "@/controllers/modals";
import Channel from "@structures/Channel";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "./ContextMenu";

interface MenuProps {
	channel: Channel;
}

function ChannelContextMenu({ channel }: MenuProps) {
	/**
	 * Copy id to clipboard
	 */
	function copyId() {
		navigator.clipboard.writeText(channel.id);
	}

	/**
	 * Copy link to clipboard
	 */
	function copyLink() {
		navigator.clipboard.writeText(`${window.location.origin}/channels/${channel.guildId}/${channel.id}`);
	}

	/**
	 * Open invite creation modal
	 */
	function openInviteCreateModal() {
		modalController.push({
			type: "create_invite",
			target: channel,
		});
	}

	return (
		<ContextMenu>
			<ContextMenuButton icon="mdiAccountPlus" onClick={openInviteCreateModal}>
				Create Invite
			</ContextMenuButton>
			<ContextMenuButton icon="mdiLink" onClick={copyLink}>
				Copy Link
			</ContextMenuButton>
			<ContextMenuDivider />
			{channel.hasPermission("MANAGE_CHANNELS") && (
				<>
					<ContextMenuButton disabled>Edit Channel</ContextMenuButton>
					<ContextMenuButton disabled destructive>
						Delete Channel
					</ContextMenuButton>
					<ContextMenuDivider />
				</>
			)}

			<ContextMenuButton
				icon="mdiIdentifier"
				iconProps={{
					style: {
						filter: "invert(100%)",
						background: "black",
						borderRadius: "4px",
					},
				}}
				onClick={copyId}
			>
				Copy Channel ID
			</ContextMenuButton>
		</ContextMenu>
	);
}

export default ChannelContextMenu;
