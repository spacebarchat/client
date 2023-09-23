import React, { memo } from "react";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import User from "../../stores/objects/User";

const Container = styled.span`
	padding: 0 2px;
	border-radius: 4px;
	background-color: hsl(var(--primary-hsl) / 0.3);

	&:hover {
		background-color: hsl(var(--primary-hsl) / 0.5);
		cursor: pointer;
	}
`;

interface MentionProps {
	id: string;
}
function UserMention({ id }: MentionProps) {
	const app = useAppStore();
	const [user, setUser] = React.useState<User | null>(null);

	React.useEffect(() => {
		const user = app.users.get(id);
		if (user) setUser(user);
	}, [id]);

	if (!user)
		return (
			<Container>
				<span>@{id}</span>
			</Container>
		);

	return (
		<Container>
			<span>@{user.username}</span>
		</Container>
	);
}

function ChannelMention({ id }: MentionProps) {
	return (
		<Container>
			<span>#{id}</span>
		</Container>
	);
}

function RoleMention({ id }: MentionProps) {
	return (
		<Container>
			<span>@{id}</span>
		</Container>
	);
}

interface Props {
	type: "role" | "user" | "channel";
	id: string;
}

function Mention({ type, id }: Props) {
	if (type === "role") return <RoleMention id={id} />;
	if (type === "user") return <UserMention id={id} />;
	if (type === "channel") return <ChannelMention id={id} />;
	return null;
}

export default memo(Mention);
