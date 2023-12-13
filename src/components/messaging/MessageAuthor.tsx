import { observer } from "mobx-react-lite";
import React from "react";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import { MessageLike } from "../../stores/objects/Message";
import Floating from "../floating/Floating";
import FloatingContent from "../floating/FloatingContent";
import FloatingTrigger from "../floating/FloatingTrigger";
import UserProfilePopout from "../floating/UserProfilePopout";

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

	return (
		<Floating placement="right-start">
			<FloatingTrigger>
				<Container
					ref={ref}
					style={{
						color,
					}}
				>
					{message.author.username}
				</Container>
			</FloatingTrigger>
			<FloatingContent>
				<UserProfilePopout user={message.author} />
			</FloatingContent>
		</Floating>
	);
}

export default observer(MessageAuthor);
