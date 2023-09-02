import { APIAttachment, APIEmbed, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { IContextMenuItem } from "../ContextMenuItem";
import MessageAttachment from "./MessageAttachment";

const DESCRIPTION_MAX_CHARS = 345;

interface EmbedProps {
	embed: APIEmbed;
	contextMenuItems: IContextMenuItem[];
}

const EmbedContainer = styled.div`
	padding: 10px;
	margin-top: 5px;
	background: var(--background-secondary);
	width: min-content;
	border-radius: 4px;
`;

const EmbedHeader = styled.div`
	color: var(--primary-light);
	margin-bottom: 10px;
`;

const EmbedDescription = styled.div`
	margin: 5px 0 5px 0;
`;

const YoutubeEmbed = styled.iframe`
	display: block;
	outline: none;
	border: none;
`;

const createEmbedAttachment = (embed: APIEmbed, contextMenuItems: IContextMenuItem[]) => {
	const url = new URL(embed.url!);
	const fakeAttachment: APIAttachment = {
		id: embed.url as string,
		filename: url.pathname.split("/").reverse()[0],
		size: -1,
		width: embed.thumbnail!.width,
		height: embed.thumbnail!.height,
		proxy_url: embed.thumbnail!.proxy_url!,
		url: embed.thumbnail!.url,
		content_type: "image",
	};

	return <MessageAttachment contextMenuItems={contextMenuItems} attachment={fakeAttachment} />;
};

const createYoutubeEmbed = (embed: APIEmbed) => {
	return <YoutubeEmbed width={500} height={300} src={embed.video!.url} />;
};

export default function MessageEmbed({ embed, contextMenuItems }: EmbedProps) {
	const logger = useLogger("MessageEmbed");

	const thumbnail = embed.thumbnail ? createEmbedAttachment(embed, contextMenuItems) : null;

	if (embed.type == EmbedType.Image) return thumbnail;

	if (embed.type == EmbedType.Video && embed.provider?.name == "YouTube") return createYoutubeEmbed(embed);

	return (
		<EmbedContainer>
			{embed.title && <EmbedHeader>{embed.title}</EmbedHeader>}
			{embed.description && (
				<EmbedDescription>{embed.description.substring(0, DESCRIPTION_MAX_CHARS) + "..."}</EmbedDescription>
			)}
			{thumbnail}
		</EmbedContainer>
	);
}
