import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { PopoutContext } from "../../contexts/PopoutContext";
import { useAppStore } from "../../stores/AppStore";
import { MessageLike } from "../../stores/objects/Message";
import ContextMenus from "../../utils/ContextMenus";
import UserProfilePopout from "../UserProfilePopout";

const Container = styled.div`
	font-size: 16px;
	font-weight: var(--font-weight-medium);
	user-select: none;

	&:hover {
		text-decoration: underline;
		cursor: pointer;
	}
`;

interface Props {
	message: MessageLike;
}

function MessageAuthor({ message }: Props) {
	const app = useAppStore();
	const contextMenu = React.useContext(ContextMenuContext);
	const popoutContext = React.useContext(PopoutContext);
	const [color, setColor] = React.useState<string | undefined>(undefined);
	const ref = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		if ("guild_id" in message && message.guild_id) {
			const guild = app.guilds.get(message.guild_id);
			if (!guild) return;
			const member = guild.members.get(message.author.id);
			if (!member) return;
			setColor(member.roleColor);
		}
	}, [message]);

	const openPopout = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!ref.current) return;

		const rect = ref.current.getBoundingClientRect();
		if (!rect) return;

		popoutContext.open({
			element: <UserProfilePopout user={message.author} />,
			position: rect,
			placement: "right",
		});
	};

	return (
		<Container
			ref={ref}
			style={{
				color,
			}}
			onContextMenu={(e) => {
				e.preventDefault();
				e.stopPropagation();
				contextMenu.open2(e, [
					...ContextMenus.User(message.author),
					...(message.guild_id ? ContextMenus.Member2(app, message.author, message.guild_id) : []),
				]);
			}}
			onClick={openPopout}
		>
			{message.author.username}
		</Container>
	);
}

export default observer(MessageAuthor);
