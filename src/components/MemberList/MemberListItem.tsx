import React from "react";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { PopoutContext } from "../../contexts/PopoutContext";
import { useAppStore } from "../../stores/AppStore";
import GuildMember from "../../stores/objects/GuildMember";
import ContextMenus from "../../utils/ContextMenus";
import Avatar from "../Avatar";
import { IContextMenuItem } from "../ContextMenuItem";
import UserProfilePopout from "../UserProfilePopout";

const ListItem = styled.div<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: pointer;
`;

const Container = styled.div`
	max-width: 224px;
	background-color: transparent;
	box-sizing: border-box;
	padding: 1px 0;
	border-radius: 4px;
`;

const Wrapper = styled.div`
	display: flex;
	align-items: center;
	border-radius: 4px;
	height: 42px;
	padding: 0 8px;

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

const TextWrapper = styled.div`
	min-width: 0;
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const AvatarWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12px;
`;

interface Props {
	item: GuildMember;
}

function MemberListItem({ item }: Props) {
	const app = useAppStore();
	const popoutContext = React.useContext(PopoutContext);

	const contextMenu = React.useContext(ContextMenuContext);
	const [contextMenuItems, setContextMenuItems] = React.useState<IContextMenuItem[]>([
		...ContextMenus.User(item.user!),
		...ContextMenus.Member(app.account!, item, item.guild!),
	]);

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
			<Container>
				<Wrapper>
					<AvatarWrapper>
						<Avatar user={item.user!} size={32} />
					</AvatarWrapper>
					<TextWrapper>
						<Text color={item.roleColor}>{item.nick ?? item.user?.username}</Text>
					</TextWrapper>
				</Wrapper>
			</Container>
		</ListItem>
	);
}

export default MemberListItem;
