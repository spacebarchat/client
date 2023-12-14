// loosely based on https://github.com/revoltchat/frontend/blob/master/components/app/menus/UserContextMenu.tsx

import User from "../../stores/objects/User";
import { ContextMenu, ContextMenuButton, ContextMenuDivider } from "./ContextMenu";

interface MenuProps {
	user: User;
}

function UserContextMenu({ user }: MenuProps) {
	/**
	 * Copy user id to clipboard
	 */
	function copyId() {
		navigator.clipboard.writeText(user.id);
	}

	return (
		<ContextMenu>
			<ContextMenuButton icon="mdiAt" destructive>
				Mention
			</ContextMenuButton>
			<ContextMenuDivider />

			<ContextMenuButton icon="mdiIdentifier" onClick={copyId}>
				Copy user ID
			</ContextMenuButton>
		</ContextMenu>
	);
}

export default UserContextMenu;
