// loosely based on https://github.com/revoltchat/frontend/blob/master/components/app/menus/UserContextMenu.tsx

import { modalController } from "../../controllers/modals";
import { useAppStore } from "../../hooks/useAppStore";
import GuildMember from "../../stores/objects/GuildMember";
import User from "../../stores/objects/User";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "./ContextMenu";

interface MenuProps {
	user: User;
	member?: GuildMember;
}

function UserContextMenu({ user, member }: MenuProps) {
	const app = useAppStore();
	const guild = member ? app.guilds.get(member.guild.id) : undefined;
	const guildMe = guild ? guild.members.get(app.account!.id) : undefined;

	/**
	 * Copy user id to clipboard
	 */
	function copyId() {
		navigator.clipboard.writeText(user.id);
	}

	/**
	 * Open kick modal
	 */
	function kick() {
		if (!member) return;
		modalController.push({
			type: "kick_member",
			target: member,
		});
	}

	/**
	 * Open ban modal
	 */
	function ban() {
		if (!member) return;
		modalController.push({
			type: "ban_member",
			target: member,
		});
	}

	return (
		<ContextMenu>
			<ContextMenuButton disabled>Profile</ContextMenuButton>
			<ContextMenuButton disabled>Mention</ContextMenuButton>
			<ContextMenuButton disabled>Message</ContextMenuButton>
			<ContextMenuDivider />
			{member && <ContextMenuButton disabled>Change Nickname</ContextMenuButton>}
			<ContextMenuButton disabled>Add Friend</ContextMenuButton>
			<ContextMenuButton disabled>Block</ContextMenuButton>
			<ContextMenuDivider />
			{member && guildMe && (
				<>
					{guildMe.hasPermission("KICK_MEMBERS") && (
						<ContextMenuButton destructive onClick={kick}>
							Kick {member?.nick ?? user.username}
						</ContextMenuButton>
					)}
					{guildMe.hasPermission("BAN_MEMBERS") && (
						<>
							<ContextMenuButton destructive onClick={ban}>
								Ban {member?.nick ?? user.username}
							</ContextMenuButton>
							<ContextMenuDivider />
						</>
					)}
					{guildMe.hasPermission("MANAGE_ROLES") && (
						<>
							<ContextMenuButton disabled icon="mdiChevronRight">
								Roles
							</ContextMenuButton>
							<ContextMenuDivider />
						</>
					)}
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
				Copy User ID
			</ContextMenuButton>
		</ContextMenu>
	);
}

export default UserContextMenu;
