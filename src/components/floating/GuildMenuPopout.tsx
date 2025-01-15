import useLogger from "@hooks/useLogger";
import styled from "styled-components";

import { modalController } from "@/controllers/modals";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "@components/contextMenus/ContextMenu";
import { useAppStore } from "@hooks/useAppStore";
import { Permissions } from "@utils";
import React, { useEffect } from "react";

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
