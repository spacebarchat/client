// loosely based on https://github.com/revoltchat/frontend/blob/master/components/app/menus/UserContextMenu.tsx

import Channel from "../../stores/objects/Channel";
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

	return (
		<ContextMenu>
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
