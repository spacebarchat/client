import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import { useAppStore } from "../../hooks/useAppStore";
import Channel from "../../stores/objects/Channel";
import Role from "../../stores/objects/Role";
import User from "../../stores/objects/User";
import { hexToRGB, rgbToHsl } from "../../utils/Utils";
import Floating from "../floating/Floating";
import FloatingTrigger from "../floating/FloatingTrigger";

const MentionText = styled.span<{ color?: string; withHover?: boolean }>`
	padding: 0 2px;
	border-radius: 4px;
	background-color: hsl(${(props) => props.color ?? "var(--primary-hsl)"} / 0.3);
	user-select: ${(props) => (props.withHover ? "none" : "inherit")};

	${(props) =>
		props.withHover &&
		`
		&:hover {
			background-color: hsl(${props.color ?? "var(--primary-hsl)"} / 0.5);
			cursor: pointer;
		}
	`}
`;

interface MentionProps {
	id: string;
}
function UserMention({ id }: MentionProps) {
	const app = useAppStore();
	const [user, setUser] = React.useState<User | null>(null);
	const contextMenu = React.useContext(ContextMenuContext);

	React.useEffect(() => {
		const getUser = async () => {
			const resolvedUser = await app.users.resolve(id);
			setUser(resolvedUser ?? null);
		};

		getUser();
	}, [id]);

	if (!user) return <MentionText>@{id}</MentionText>;

	return (
		<Floating
			type="userPopout"
			placement="right"
			props={{
				user,
			}}
		>
			<FloatingTrigger>
				<MentionText withHover onContextMenu={(e) => contextMenu.onContextMenu(e, { type: "user", user })}>
					@{user.username}
				</MentionText>
			</FloatingTrigger>
		</Floating>
	);
}

function ChannelMention({ id }: MentionProps) {
	const app = useAppStore();
	const [channel, setChannel] = React.useState<Channel | null>(null);
	const navigate = useNavigate();
	const contextMenu = React.useContext(ContextMenuContext);

	const onClick = () => {
		if (!channel) return;
		if (!channel.isGuildTextChannel) return;
		navigate(`/channels/${channel.guildId}/${channel.id}`);
	};

	React.useEffect(() => {
		const channel = app.channels.get(id);
		if (channel) setChannel(channel);
	}, [id]);

	if (!channel) return <MentionText>#{id}</MentionText>;

	return (
		<MentionText
			withHover
			onClick={onClick}
			onContextMenu={(e) => contextMenu.onContextMenu(e, { type: "channelMention", channel })}
		>
			#{channel.name}
		</MentionText>
	);
}

function RoleMention({ id }: MentionProps) {
	const app = useAppStore();
	const [role, setRole] = React.useState<Role | null>(null);
	const [color, setColor] = React.useState<string | undefined>(undefined);

	React.useEffect(() => {
		const role = app.roles.get(id);
		if (role) setRole(role);
	}, [id]);

	React.useEffect(() => {
		if (!role?.color) return;
		if (role.color === "#000000") return; // TODO: why the fk do we use black as the default color???
		const rgb = hexToRGB(role.color);
		if (!rgb) return;

		setColor(rgbToHsl(rgb.r, rgb.g, rgb.b));
	}, [role]);

	if (!role) return <MentionText>@unknown-role</MentionText>;

	return (
		<MentionText color={color} withHover>
			@{role.name}
		</MentionText>
	);
}

function CustomMention({ id }: MentionProps) {
	return <MentionText>{id}</MentionText>;
}

interface Props {
	type: "role" | "user" | "channel" | "text";
	id: string;
}

function Mention({ type, id }: Props) {
	if (type === "role") return <RoleMention id={id} />;
	if (type === "user") return <UserMention id={id} />;
	if (type === "channel") return <ChannelMention id={id} />;
	if (type === "text") return <CustomMention id={id} />;
	return null;
}

export default memo(Mention);
