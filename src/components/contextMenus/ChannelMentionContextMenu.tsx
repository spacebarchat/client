// loosely based on https://github.com/revoltchat/frontend/blob/master/components/app/menus/UserContextMenu.tsx

import Channel from "../../stores/objects/Channel";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "./ContextMenu";

interface MenuProps {
	channel: Channel;
}

function ChannelMentionContextMenu({ channel }: MenuProps) {
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

	return (
		<ContextMenu>
			<ContextMenuButton icon="mdiLink" onClick={copyLink}>
				Copy Link
			</ContextMenuButton>
			<ContextMenuDivider />
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

export default ChannelMentionContextMenu;
