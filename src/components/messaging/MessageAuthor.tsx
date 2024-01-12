import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { useAppStore } from "../../stores/AppStore";
import GuildMember from "../../stores/objects/GuildMember";
import { MessageLike } from "../../stores/objects/Message";
import Floating from "../floating/Floating";
import FloatingTrigger from "../floating/FloatingTrigger";

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
	const contextMenu = useContext(ContextMenuContext);
	const [color, setColor] = React.useState<string | undefined>(undefined);
	const [eventData, setEventData] = React.useState<React.MouseEvent<HTMLDivElement, MouseEvent> | undefined>();
	const [member, setMember] = React.useState<GuildMember | undefined>(undefined);

	React.useEffect(() => {
		if (!eventData) return;
		contextMenu.onContextMenu(eventData, { type: "user", user: message.author, member });
	}, [eventData, member]);

	const onContextMenu = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault();
		e.stopPropagation();

		setEventData(e);
		app.guilds.get(message.guild_id!)?.members.resolve(message.author.id).then(setMember);
	};

	React.useEffect(() => {
		if ("guild_id" in message && message.guild_id) {
			const guild = app.guilds.get(message.guild_id!);
			if (!guild) return;
			const member = guild.members.get(message.author.id);
			if (!member) return;
			setColor(member.roleColor);
		}
	}, [message]);

	return (
		<Floating
			placement="right-start"
			type="userPopout"
			props={{
				user: message.author,
			}}
		>
			<FloatingTrigger>
				<Container
					style={{
						color,
					}}
					ref={contextMenu.setReferenceElement}
					onContextMenu={onContextMenu}
				>
					{message.author.username}
				</Container>
			</FloatingTrigger>
		</Floating>
	);
}

export default observer(MessageAuthor);
