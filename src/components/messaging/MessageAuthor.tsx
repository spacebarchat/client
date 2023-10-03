import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import { MessageLike } from "../../stores/objects/Message";

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
	const [color, setColor] = React.useState<string | undefined>(undefined);

	React.useEffect(() => {
		if ("guild_id" in message && message.guild_id) {
			const guild = app.guilds.get(message.guild_id);
			if (!guild) return;
			const member = guild.members.get(message.author.id);
			if (!member) return;
			const highestRole = member.roles.reduce((prev, role) => {
				if (role.position > prev.position) return role;
				return prev;
			}, member.roles[0]);
			if (highestRole?.color === "#000000") return; // TODO: why the fk do we use black as the default color???
			setColor(highestRole?.color);
		}
	}, [message]);

	return (
		<Container
			style={{
				color,
			}}
		>
			{message.author.username}
		</Container>
	);
}

export default observer(MessageAuthor);
