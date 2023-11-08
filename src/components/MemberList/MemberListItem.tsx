import { useModals } from "@mattjennings/react-modal-stack";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import GuildMember from "../../stores/objects/GuildMember";
import { IContextMenuItem } from "../ContextMenuItem";

const ListItem = styled.div<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: pointer;
`;

const Wrapper = styled.div<{ isCategory?: boolean }>`
	margin-left: ${(props) => (props.isCategory ? "0" : "8px")};
	height: ${(props) => (props.isCategory ? "28px" : "33px")};
	border-radius: 4px;
	align-items: center;
	display: flex;
	padding: 0 8px;
	background-color: transparent;

	&:hover {
		background-color: var(--background-primary-alt);
	}
`;

const Text = styled.span<{ isCategory?: boolean }>`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	white-space: nowrap;
	color: var(--text-secondary);
`;

interface Props {
	item: string | GuildMember;
}

function MemberListItem({ item }: Props) {
	const navigate = useNavigate();

	const { openModal } = useModals();

	const contextMenu = React.useContext(ContextMenuContext);
	const [contextMenuItems, setContextMenuItems] = React.useState<IContextMenuItem[]>([]);

	return (
		<ListItem
			key={typeof item === "string" ? item : item.user?.id}
			isCategory={typeof item === "string"}
			// onClick={() => {
			// 	// prevent navigating to non-text channels
			// 	if (!channel.isTextChannel) return;

			// 	navigate(`/channels/${channel.guildId}/${channel.id}`);
			// }}
			onContextMenu={(e) => contextMenu.open2(e, contextMenuItems)}
		>
			<Wrapper isCategory={typeof item === "string"}>
				<Text isCategory={typeof item === "string"}>
					{typeof item === "string" ? item : item.nick ?? item.user?.username}
				</Text>
			</Wrapper>
		</ListItem>
	);
}

export default MemberListItem;
