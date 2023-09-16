import { APIAttachment, APIEmbed, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import { ReactNode } from "react";
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

const Container = styled.div`
	max-width: fit-content;
	background-color: var(--background-secondary);
`;

const Wrapper = styled.div<{ $color?: string }>`
	max-width: 430px;
	justify-self: start;
	border-left-width: 4px;
	border-left-style: solid;
	border-left-color: ${(props) => props.$color ?? "var(--background-tertiary)"};
	display: grid;
	box-sizing: border-box;
	border-radius: 4px;
`;

const EmbedWrapper = styled.div`
	max-width: 500px;
	overflow: hidden;
	padding: 8px 16px 16px 12px;
	display: grid;
	grid-template-columns: auto;
	grid-template-rows: auto;
`;

const EmbedProvider = styled.div`
	font-size: 12px;
	font-weight: var(--font-weight-regular);
	grid-column: 1/1;
	margin-top: 10px;
`;

const EmbedAuthor = styled.div`
	display: flex;
	align-items: center;
	grid-column: 1/1;
	margin-top: 10px;
`;

const EmbedAuthorText = styled.div`
	font-size: 14px;
	font-weight: var(--font-weight-medium);
`;

const EmbedAuthorLink = styled.a`
	font-size: 14px;
	font-weight: var(--font-weight-medium);
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`;

const EmbedTitle = styled.div`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	grid-column: 1/1;
	margin-top: 10px;
`;

const EmbedTitleLink = styled.a`
	color: var(--text-link);
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`;

const EmbedDescription = styled.div`
	font-size: 14px;
	font-weight: var(--font-weight-regular);
	grid-column: 1/1;
	margin-top: 10px;
`;

const EmbedImage = styled.div`
	margin-top: 10px;
	grid-column: 1/1;
	border-radius: 4px;
`;

const EmbedImageContainer = styled.div`
	flex-flow: row nowrap;
	width: 100%;
	height: 100%;
	display: flex;
`;

const EmbedImageWrapper = styled.div`
	max-width: 100%;
	width: 100%;
	overflow: hidden;
	border-radius: 4px;
`;

const EmbedThumbnail = styled.div`
	grid-row: 1/8;
	grid-column: 2/2;
	margin-left: 15px;
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

const EmbedFooterImage = styled.img`
	margin-right: 10px;
	width: 20px;
	height: 20px;
	border-radius: 50%;
`;

const EmbedFooterText = styled.span`
	font-size: 12px;
	font-weight: var(--font-weight-regular);
`;

const YoutubeEmbed = styled.iframe`
	outline: none;
	border: none;
	margin-top: 10px;
	border-radius: 4px;
`;

const WrapImageContent = ({ children }: { children: ReactNode }) => {
	return (
		<EmbedImageContainer>
			<EmbedImageWrapper>{children}</EmbedImageWrapper>
		</EmbedImageContainer>
	);
};

const createEmbedAttachment = (embed: APIEmbed, contextMenuItems: IContextMenuItem[], isYoutubeVideo = false) => {
	const image = embed.thumbnail ?? embed.image;
	if (!image) return null;

	const url = new URL(embed.url!);

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

	if (isYoutubeVideo) return createYoutubeEmbed(embed);

	if (embed.type === EmbedType.Link)
		return (
			<EmbedThumbnail>
				<WrapImageContent>
					<MessageAttachment {...props} maxWidth={70} />
				</WrapImageContent>
			</EmbedThumbnail>
		);
	return (
		<EmbedImage>
			<WrapImageContent>
				<MessageAttachment {...props} />
			</WrapImageContent>
		</EmbedImage>
	);
};

const createYoutubeEmbed = (embed: APIEmbed) => {
	return <YoutubeEmbed width={400} height={225} src={embed.video!.url} />;
};

export default function MessageEmbed({ embed, contextMenuItems }: EmbedProps) {
	const logger = useLogger("MessageEmbed");

	// seems like the server sometimes sends thumbnails with 0 width and height, and no urls
	const isYoutubeVideo = embed.type == EmbedType.Video && embed.provider?.name == "YouTube";
	const thumbnail = createEmbedAttachment(embed, contextMenuItems, isYoutubeVideo);

	if (embed.type == EmbedType.Image) return thumbnail;

	const titleTrimmed = embed.title
		? embed.title?.length > TITLE_MAX_CHARS
			? embed.title.substring(0, TITLE_MAX_CHARS) + "..."
			: embed.title
		: undefined;

	const descriptionTrimmed = embed.description
		? embed.description.length > DESCRIPTION_MAX_CHARS
			? embed.description?.substring(0, DESCRIPTION_MAX_CHARS) + "..."
			: embed.description
		: undefined;

	let title;
	if (titleTrimmed) {
		if (embed.url)
			title = (
				<EmbedTitleLink href={embed.url} rel="noreferrer noopener" target="_blank">
					{titleTrimmed}
				</EmbedTitleLink>
			);
		else title = titleTrimmed;
	} else title = null;

	let author;
	if (embed.author)
		if (embed.author.url)
			author = (
				<EmbedAuthorLink href={embed.author.url} rel="noreferrer noopener" target="_blank">
					{embed.author.name}
				</EmbedAuthorLink>
			);
		else author = <EmbedAuthorText>{embed.author.name}</EmbedAuthorText>;
	else null;

	return (
		<Container>
			<Wrapper $color={embed.color ? decimalColorToHex(embed.color) : undefined}>
				<EmbedWrapper>
					{embed.provider && <EmbedProvider>{embed.provider.name}</EmbedProvider>}
					{author && <EmbedAuthor>{author}</EmbedAuthor>}
					{title && <EmbedTitle>{title}</EmbedTitle>}
					{descriptionTrimmed && !isYoutubeVideo && <EmbedDescription>{descriptionTrimmed}</EmbedDescription>}
					{thumbnail}
					{embed.footer && (
						<EmbedFooter>
							{embed.footer.icon_url && <EmbedFooterImage src={embed.footer.icon_url} />}
							<EmbedFooterText>{embed.footer.text}</EmbedFooterText>
						</EmbedFooter>
					)}
				</EmbedWrapper>
			</Wrapper>
		</Container>
	);
}
