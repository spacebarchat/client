import { CDNRoutes, ImageFormat } from "@spacebarchat/spacebar-api-types/v9";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import REST from "../utils/REST";
import Container from "./Container";

const Wrapper = styled(Container)`
	margin-top: 9px;
	padding: 0;
	width: 48px;
	height: 48px;
	border-radius: 50%;
	background-color: var(--secondary);
	display: flex;
	align-items: center;
	justify-content: center;
`;

interface Props {
	guildId: string;
}

function GuildItem(props: Props) {
	const app = useAppStore();
	const guild = app.guilds.get(props.guildId);
	if (!guild) return null;

	return (
		<Wrapper>
			{guild.icon ? (
				<img
					src={REST.makeCDNUrl(
						CDNRoutes.guildIcon(
							props.guildId,
							guild?.icon,
							ImageFormat.PNG,
						),
					)}
					width={48}
					height={48}
				/>
			) : (
				<span>{guild?.acronym}</span>
			)}
		</Wrapper>
	);
}

export default GuildItem;
