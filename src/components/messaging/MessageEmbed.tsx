// adapted from Revite
// https://github.com/revoltchat/revite/blob/master/src/components/common/messaging/embed/Embed.tsx

import { APIEmbed, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import classNames from "classnames";
import React from "react";
import { decimalColorToHex } from "../../utils/Utils";
import styles from "./Embed.module.css";
import EmbedMedia from "./EmbedMedia";
import { MESSAGE_AREA_PADDING, MessageAreaWidthContext } from "./MessageList";

const MAX_EMBED_WIDTH = 400;
const MAX_EMBED_HEIGHT = 640;
const CONTAINER_PADDING = 24;
const MAX_PREVIEW_SIZE = 150;
const EMBEDDABLE_PROVIDERS = ["Spotify", "Bandcamp"];

interface Props {
	embed: APIEmbed;
}

function MessageEmbed({ embed }: Props) {
	const maxWidth = Math.min(React.useContext(MessageAreaWidthContext) - MESSAGE_AREA_PADDING, MAX_EMBED_WIDTH);

	function calculateSize(w: number, h: number): { width: number; height: number } {
		const limitingWidth = Math.min(maxWidth, w);

		const limitingHeight = Math.min(MAX_EMBED_HEIGHT, h);

		// Calculate smallest possible WxH.
		const width = Math.min(limitingWidth, limitingHeight * (w / h));

		const height = Math.min(limitingHeight, limitingWidth * (h / w));

		return { width, height };
	}

	// Determine special embed size.
	let mw, mh;
	const largeMedia =
		embed.provider?.name === "GitHub" ||
		embed.provider?.name === "Streamable" ||
		embed.type === EmbedType.Video ||
		embed.type === EmbedType.GIFV ||
		embed.type === EmbedType.Image;

	if (embed.image) {
		mw = embed.image?.width ?? MAX_EMBED_WIDTH;
		mh = embed.image?.height ?? 0;
	} else if (embed.thumbnail) {
		mw = embed.thumbnail.width ?? MAX_EMBED_WIDTH;
		mh = embed.thumbnail.height ?? 0;
	} else {
		switch (embed.provider?.name) {
			case "YouTube":
			case "Bandcamp": {
				mw = embed.video?.width ?? 1280;
				mh = embed.video?.height ?? 720;
				break;
			}
			case "Twitch":
			case "Lightspeed":
			case "Streamable": {
				mw = 1280;
				mh = 720;
				break;
			}
			default: {
				mw = MAX_EMBED_WIDTH;
				mh = 1;
			}
		}
	}

	const { width, height } = calculateSize(mw, mh);
	if (embed.type === EmbedType.GIFV || EMBEDDABLE_PROVIDERS.includes(embed.provider?.name ?? "")) {
		return (
			<EmbedMedia
				embed={embed}
				width={height * ((embed.image?.width ?? 0) / (embed.image?.height ?? 0))}
				height={height}
			/>
		);
	}

	return (
		<div
			className={classNames(styles.embed, styles.website)}
			style={{
				borderInlineStartColor: embed.color ? decimalColorToHex(embed.color) : "var(--background-tertiary)",
				maxWidth: width + CONTAINER_PADDING,
			}}
		>
			<div>
				{embed.type !== EmbedType.Rich && embed.provider && (
					<span className={styles.embedProvider}>{embed.provider.name}</span>
				)}

				{embed.author && (
					<div className={styles.embedAuthor}>
						{embed.author.icon_url && (
							<img
								loading="lazy"
								className={styles.embedAuthorIcon}
								src={embed.author.icon_url}
								draggable={false}
								onError={(e) => (e.currentTarget.style.display = "none")}
							/>
						)}
						{embed.author.url ? (
							<a
								href={embed.url}
								target={"_blank"}
								className={classNames(styles.embedAuthorName, styles.embedAuthorNameLink)}
							>
								{embed.author.name}
							</a>
						) : (
							<span className={styles.embedAuthorName}>{embed.author.name}</span>
						)}
					</div>
				)}

				{embed.title && (
					<>
						{embed.url ? (
							<a
								href={embed.url}
								target={"_blank"}
								className={classNames(styles.embedTitle, styles.embedTitleLink)}
							>
								{embed.title}
							</a>
						) : (
							<span className={styles.embedTitle}>{embed.title}</span>
						)}
					</>
				)}

				{embed.description && <div className={styles.embedDescription}>{embed.description}</div>}

				{largeMedia && <EmbedMedia embed={embed} height={height} />}
			</div>

			{!largeMedia && embed.thumbnail && <EmbedMedia embed={embed} height={100} />}
		</div>
	);
}

export default MessageEmbed;
