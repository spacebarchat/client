import { APIAttachment, APIEmbed, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { decimalColorToHex } from "../../utils/Utils";
import { IContextMenuItem } from "../ContextMenuItem";
import MessageAttachment from "./MessageAttachment";

// TODO: move these to a constants file/configurable
const DESCRIPTION_MAX_CHARS = 345;
const TITLE_MAX_CHARS = 67;

interface EmbedProps {
	embed: APIEmbed;
	contextMenuItems: IContextMenuItem[];
}

const EmbedContainer = styled.div<{ $type: EmbedType; $color?: string }>`
	padding: 10px;
	margin-top: 5px;
	background: var(--background-secondary);
	border-radius: 4px;
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: auto;
	max-width: 500px;
	width: ${(props) => (props.$type == EmbedType.Link ? undefined : "min-content")};

	border-left-width: 5px;
	border-left-color: ${(props) => props.$color ?? "var(--background-tertiary)"};
	border-left-style: solid;
`;

const EmbedProvider = styled.div`
	font-size: 12px;
	font-weight: var(--font-weight-regular);
	margin-top: 10px;
`;

const EmbedHeader = styled.div`
	color: var(--primary-light);
	font-weight: var(--font-weight-regular);
	grid-column: 1/1;
	margin-top: 10px;
`;

const EmbedDescription = styled.div`
	font-weight: var(--font-weight-light);
	font-size: 14px;
	grid-column: 1/1;
	margin-top: 10px;
`;

const EmbedImageArticle = styled.div`
	margin-top: 16px;
	grid-column: 1/1;
`;

const EmbedImageLink = styled.div`
	grid-row: 1/8;
	grid-column: 2/2;
	margin-left: 16px;
	margin-top: 10px;
	justify-self: end;
`;

const EmbedFooter = styled.div`
	display: flex;
	align-items: center;
	grid-row: auto/auto;
	grid-column: 1/1;
	margin-top: 10px;
`;

const EmbedFooterText = styled.span`
	font-size: 12px;
	font-weight: var(--font-weight-regular);
`;

const YoutubeEmbed = styled.iframe`
	display: block;
	outline: none;
	border: none;
	margin-top: 10px;
`;

const createEmbedAttachment = (embed: APIEmbed, contextMenuItems: IContextMenuItem[]) => {
	const url = new URL(embed.url!);
	const image = embed.thumbnail ?? embed.image;
	if (!image) return null;

	const fakeAttachment: APIAttachment = {
		id: embed.url as string,
		filename: url.pathname.split("/").reverse()[0],
		size: -1,
		width: image.width,
		height: image.height,
		proxy_url: image.proxy_url!,
		url: image.url,
		content_type: "image",
	};

	const props = {
		contextMenuItems,
		attachment: fakeAttachment,
	};

	if (embed.type == EmbedType.Link) {
		return (
			<EmbedImageLink>
				<MessageAttachment {...props} maxWidth={160} maxHeight={80} />
			</EmbedImageLink>
		);
	} else if (embed.type == EmbedType.Article || embed.type == EmbedType.Rich) {
		return (
			<EmbedImageArticle>
				<MessageAttachment {...props} />
			</EmbedImageArticle>
		);
	} else
		return (
			<div
				style={{
					marginTop: "10px",
				}}
			>
				<MessageAttachment {...props} />
			</div>
		);
};

const createYoutubeEmbed = (embed: APIEmbed) => {
	return <YoutubeEmbed width={500} height={300} src={embed.video!.url} />;
};

export default function MessageEmbed({ embed, contextMenuItems }: EmbedProps) {
	const logger = useLogger("MessageEmbed");

	// seems like the server sometimes sends thumbnails with 0 width and height, and no urls
	const image = embed.thumbnail ?? embed.image;
	const isYoutubeVideo = embed.type == EmbedType.Video && embed.provider?.name == "YouTube";
	const thumbnail = image && image.url && !isYoutubeVideo ? createEmbedAttachment(embed, contextMenuItems) : null;

	if (embed.type == EmbedType.Image) return thumbnail;

	return (
		<EmbedContainer
			$type={embed.type ?? EmbedType.Link}
			$color={embed.color ? decimalColorToHex(embed.color) : undefined}
		>
			{embed.provider && <EmbedProvider>{embed.provider.name}</EmbedProvider>}
			{embed.title && (
				<EmbedHeader>
					{embed.title.length > TITLE_MAX_CHARS
						? embed.title.substring(0, TITLE_MAX_CHARS) + "..."
						: embed.title}
				</EmbedHeader>
			)}
			{embed.description && !isYoutubeVideo && (
				<EmbedDescription>
					{embed.description.length > DESCRIPTION_MAX_CHARS
						? embed.description.substring(0, DESCRIPTION_MAX_CHARS) + "..."
						: embed.description}
				</EmbedDescription>
			)}
			{thumbnail}
			{isYoutubeVideo && createYoutubeEmbed(embed)}
			{embed.footer && (
				<EmbedFooter>
					<EmbedFooterText>{embed.footer.text}</EmbedFooterText>
				</EmbedFooter>
			)}
		</EmbedContainer>
	);
}
