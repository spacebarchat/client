import styled from "styled-components";
import useLogger from "../../hooks/useLogger";

import React, { useEffect } from "react";
import { modalController } from "../../controllers/modals";
import { useAppStore } from "../../stores/AppStore";
import { Permissions } from "../../utils/Permissions";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "../contextMenus/ContextMenu";

const CustomContextMenu = styled(ContextMenu)`
	width: 200px;
`;

function GuildMenuPopout() {
	const { activeGuild, account } = useAppStore();
	const logger = useLogger("GuildMenuPopout");

	const [hasCreateChannelPermission, setHasCreateChannelPermission] = React.useState(false);

	useEffect(() => {
		if (!activeGuild) return;

		const permission = Permissions.getPermission(account!.id, activeGuild, undefined);
		const hasPermission = permission.has("MANAGE_CHANNELS");
		setHasCreateChannelPermission(hasPermission);
	}, [activeGuild]);

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
			{hasCreateChannelPermission && (
				<>
					<ContextMenuButton icon="mdiPlusCircle" onClick={onChannelCreateClick}>
						Create Channel
					</ContextMenuButton>
					<ContextMenuButton icon="mdiFolderPlus" disabled>
						Create Category
					</ContextMenuButton>
				</>
			)}
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
