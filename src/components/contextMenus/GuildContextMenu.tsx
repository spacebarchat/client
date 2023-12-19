// loosely based on https://github.com/revoltchat/frontend/blob/master/components/app/menus/UserContextMenu.tsx

import { modalController } from "../../controllers/modals";
import { useAppStore } from "../../stores/AppStore";
import Guild from "../../stores/objects/Guild";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "./ContextMenu";

interface MenuProps {
	guild: Guild;
}

function GuildContextMenu({ guild }: MenuProps) {
	const app = useAppStore();
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

	return (
		<ContextMenu>
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
