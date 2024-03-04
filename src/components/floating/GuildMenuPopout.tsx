import styled from "styled-components";
import useLogger from "../../hooks/useLogger";

import { modalController } from "../../controllers/modals";
import { useAppStore } from "../../stores/AppStore";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "../contextMenus/ContextMenu";

const CustomContextMenu = styled(ContextMenu)`
	width: 200px;
`;

function GuildMenuPopout() {
	const { activeGuild } = useAppStore();
	const logger = useLogger("GuildMenuPopout");
	if (!activeGuild) {
		logger.error("activeGuild is undefined");
		return null;
	}

	function leaveGuild() {
		modalController.push({
			type: "leave_server",
			target: activeGuild!,
		});
	}

	function onChannelCreateClick() {
		modalController.push({
			type: "create_channel",
			guild: activeGuild!,
		});
	}

	return (
		<CustomContextMenu>
			<ContextMenuButton icon="mdiCog" disabled>
				Server Settings
			</ContextMenuButton>
			<ContextMenuButton icon="mdiPlusCircle" onClick={onChannelCreateClick}>
				Create Channel
			</ContextMenuButton>
			<ContextMenuButton icon="mdiFolderPlus" disabled>
				Create Category
			</ContextMenuButton>
			<ContextMenuDivider />
			<ContextMenuButton icon="mdiBell" disabled>
				Notification Settings
			</ContextMenuButton>
			<ContextMenuButton icon="mdiShieldLock" disabled>
				Privacy Settings
			</ContextMenuButton>
			<ContextMenuDivider />
			<ContextMenuButton icon="mdiLocationExit" destructive onClick={leaveGuild}>
				Leave Guild
			</ContextMenuButton>
		</CustomContextMenu>
	);
}

export default GuildMenuPopout;
