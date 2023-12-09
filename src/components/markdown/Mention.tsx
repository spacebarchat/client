import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PopoutContext } from "../../contexts/PopoutContext";
import { useAppStore } from "../../stores/AppStore";
import Channel from "../../stores/objects/Channel";
import Role from "../../stores/objects/Role";
import User from "../../stores/objects/User";
import { hexToRGB, rgbToHsl } from "../../utils/Utils";
import UserProfilePopout from "../UserProfilePopout";

const Container = styled.span<{ color?: string }>`
	padding: 0 2px;
	border-radius: 4px;
	background-color: hsl(${(props) => props.color ?? "var(--primary-hsl)"} / 0.3);

	&:hover {
		background-color: hsl(${(props) => props.color ?? "var(--primary-hsl)"} / 0.5);
		cursor: pointer;
	}
`;

interface MentionProps {
	id: string;
}
function UserMention({ id }: MentionProps) {
	const app = useAppStore();
	const popoutContext = React.useContext(PopoutContext);
	const [user, setUser] = React.useState<User | null>(null);
	const ref = React.useRef<HTMLDivElement>(null);

	const click = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!user || !ref.current) return;

		const rect = ref.current.getBoundingClientRect();

		popoutContext.open({
			element: <UserProfilePopout user={user} />,
			position: rect,
		});
	};

	React.useEffect(() => {
		const user = app.users.get(id);
		if (user) setUser(user);
	}, [id]);

	if (!user)
		return (
			<Container ref={ref}>
				<span>@{id}</span>
			</Container>
		);

	return (
		<Container onClick={click} ref={ref}>
			<span>@{user.username}</span>
		</Container>
	);
}

function ChannelMention({ id }: MentionProps) {
	const app = useAppStore();
	const [channel, setChannel] = React.useState<Channel | null>(null);
	const navigate = useNavigate();

	const click = () => {
		if (!channel) return;
		if (!channel.isGuildTextChannel) return;
		navigate(`/channels/${channel.guildId}/${channel.id}`);
	};

	React.useEffect(() => {
		const channel = app.channels.get(id);
		if (channel) setChannel(channel);
	}, [id]);

	if (!channel)
		return (
			<Container>
				<span>#{id}</span>
			</Container>
		);

	return (
		<Container onClick={click}>
			<span>#{channel.name}</span>
		</Container>
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

	if (!role)
		return (
			<Container>
				<span>@unknown-role</span>
			</Container>
		);

	return (
		<Container color={color}>
			<span>@{role.name}</span>
		</Container>
	);
}

function CustomMention({ id }: MentionProps) {
	return (
		<Container>
			<span>{id}</span>
		</Container>
	);
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
