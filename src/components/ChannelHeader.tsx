import { Routes } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ContextMenuContext } from "../contexts/ContextMenuContext";
import { useAppStore } from "../stores/AppStore";
import Container from "./Container";
import { IContextMenuItem } from "./ContextMenuItem";
import Icon from "./Icon";

const Wrapper = styled(Container)`
	display: flex;
	padding: 12px 16px;
	margin-bottom: 1px;
	background-color: var(--background-secondary);
	box-shadow: 0 1px 0 hsl(0deg 0% 0% / 0.3);
	align-items: center;
	justify-content: space-between;
	cursor: pointer;

	&:hover {
		background-color: var(--background-secondary-highlight);
	}
`;

const HeaderText = styled.header`
	font-size: 14px;
	font-weight: 600;
`;

interface Props {
	text: string;
}

function ChannelHeader({ text }: Props) {
	const app = useAppStore();
	const contextMenu = React.useContext(ContextMenuContext);
	const { guildId } = useParams<{
		guildId: string;
	}>();
	const guild = app.guilds.get(guildId!);

	const [contextMenuItems, setContextMenuItems] = React.useState<IContextMenuItem[]>([
		{
			label: "Leave Server",
			color: "var(--danger)",
			onClick: async () => {
				console.log("Leave server", guildId);
				await app.rest.delete(Routes.userGuild(guildId!));
			},
			iconProps: {
				icon: "mdiLocationExit",
				color: "var(--danger)",
			},
			hover: {
				color: "var(--text)",
				backgroundColor: "var(--danger)",
			},
			visible: guild?.ownerId !== app.account?.id,
		},
	]);

	function openMenu(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();

		if (contextMenu.visible) {
			// "toggles" the menu
			contextMenu.close();
			return;
		}

		const horizontalPadding = 5;
		const verticalPadding = 10;
		contextMenu.open({
			position: {
				x: e.currentTarget.offsetLeft + horizontalPadding, // centers the menu under the header
				y: e.currentTarget.offsetHeight + horizontalPadding, // add a slight gap between the header and the menu
			},
			items: contextMenuItems,
			style: {
				width: e.currentTarget.clientWidth - verticalPadding, // adds "margin" to the left and right of the menu
				boxSizing: "border-box",
			},
		});
	}

	return (
		<Wrapper onClick={openMenu}>
			<HeaderText>{text}</HeaderText>
			<Icon icon="mdiChevronDown" size="20px" color="var(--text)" />
		</Wrapper>
	);
}

export default ChannelHeader;
