// loosely based on https://github.com/revoltchat/frontend/blob/master/components/app/menus/UserContextMenu.tsx

import { ChannelType } from "@spacebarchat/spacebar-api-types/v9";
import { modalController } from "../../controllers/modals";
import { useAppStore } from "../../hooks/useAppStore";
import useLogger from "../../hooks/useLogger";
import Guild from "../../stores/objects/Guild";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "./ContextMenu";

interface MenuProps {
	guild: Guild;
}

function GuildContextMenu({ guild }: MenuProps) {
	const app = useAppStore();
	const logger = useLogger("GuildContextMenu");
	const isNotOwner = guild.ownerId !== app.account!.id;
	/**
	 * Copy id to clipboard
	 */
	function copyId() {
		navigator.clipboard.writeText(guild.id);
	}

	/**
	 * Leave guild
	 */
	function leaveGuild() {
		modalController.push({
			type: "leave_server",
			target: guild,
		});
	}

	/**
	 * Open invite creation modal
	 */
	function openInviteCreateModal() {
		const channel = guild.channels.find((x) => x.type === ChannelType.GuildText && x.hasPermission("VIEW_CHANNEL"));
		if (!channel) {
			logger.error("Failed to find suitable channel for invite creation");
			return;
		}
		modalController.push({
			type: "create_invite",
			target: channel,
		});
	}

	return (
		<ContextMenu>
			<ContextMenuButton onClick={openInviteCreateModal}>Create Invite</ContextMenuButton>
			<ContextMenuDivider />
			{isNotOwner && (
				<>
					<ContextMenuButton destructive onClick={leaveGuild}>
						Leave Guild
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
				Copy Guild ID
			</ContextMenuButton>
		</ContextMenu>
	);
}

export default GuildContextMenu;
