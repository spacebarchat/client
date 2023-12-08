import React from "react";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { PopoutContext } from "../../contexts/PopoutContext";
import GuildMember from "../../stores/objects/GuildMember";
import ContextMenus from "../../utils/ContextMenus";
import { IContextMenuItem } from "../ContextMenuItem";
import UserProfilePopout from "../UserProfilePopout";

const ListItem = styled.div<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: pointer;
`;

const Wrapper = styled.div`
	margin-left: 8px;
	height: 33px;
	border-radius: 4px;
	align-items: center;
	display: flex;
	padding: 0 8px;
	background-color: transparent;

	&:hover {
		background-color: var(--background-primary-alt);
	}
`;

const Text = styled.span<{ color?: string }>`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	white-space: nowrap;
	color: ${(props) => props.color ?? "var(--text-secondary)"};
`;

interface Props {
	item: GuildMember;
}

function MemberListItem({ item }: Props) {
	const popoutContext = React.useContext(PopoutContext);

	const contextMenu = React.useContext(ContextMenuContext);
	const [contextMenuItems, setContextMenuItems] = React.useState<IContextMenuItem[]>(ContextMenus.User(item.user!));

	return (
		<ListItem
			key={item.user?.id}
			onContextMenu={(e) => contextMenu.open2(e, contextMenuItems)}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				popoutContext.open({
					element: <UserProfilePopout user={item.user!} />,
					position: e.currentTarget.getBoundingClientRect(),
					placement: "right",
				});
			}}
		>
			<Wrapper>
				<Text color={item.roleColor}>{item.nick ?? item.user?.username}</Text>
			</Wrapper>
		</ListItem>
	);
}

export default MemberListItem;
