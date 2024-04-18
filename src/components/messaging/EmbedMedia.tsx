// adapted from Revite
// https://github.com/revoltchat/revite/blob/master/src/components/common/messaging/embed/Embed.tsx

import { APIEmbed, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import { modalController } from "../../controllers/modals";
import Icon from "../Icon";
import styles from "./Embed.module.css";

function getScaledDimensions(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number) {
	const aspectRatio = originalWidth / originalHeight;
	let newWidth = originalWidth;
	let newHeight = originalHeight;

	if (newWidth > maxWidth) {
		newWidth = maxWidth;
		newHeight = newWidth / aspectRatio;
	}

	if (newHeight > maxHeight) {
		newHeight = maxHeight;
		newWidth = newHeight * aspectRatio;
	}

	return { width: Math.round(newWidth), height: Math.round(newHeight) };
}
function shouldScaleImage(originalWidth: number, originalHeight: number, maxWidth: number, maxHeight: number) {
	return originalWidth > maxWidth || originalHeight > maxHeight;
}

interface Props {
	embed: APIEmbed;
	width?: number;
	height?: number;
	thumbnail?: boolean;
}

function EmbedMedia({ embed, width, height, thumbnail }: Props) {
	let maxWidth = 400;
	let maxHeight = 300;

	if (!width || !height) {
		if (embed.video) {
			width = embed.video.width;
			height = embed.video.height;
		} else if (embed.image) {
			width = embed.image.width;
			height = embed.image.height;
		} else if (embed.thumbnail) {
			if (embed.type !== EmbedType.Image && embed.provider?.name !== "GitHub") {
				maxWidth = 80;
				maxHeight = 80;
			}

			width = embed.thumbnail.width;
			height = embed.thumbnail.height;
		} else {
			console.log("No media size provided");
			width = 400;
			height = 300;
		}
	}

	const originalWidth = width;
	const originalHeight = height;

	// Scale image if it's too large
	if (shouldScaleImage(width!, height!, maxWidth, maxHeight)) {
		const { width: newWidth, height: newHeight } = getScaledDimensions(width!, height!, maxWidth, maxHeight);
		width = newWidth;
		height = newHeight;
	}

	console.log(`Original size: ${originalWidth}x${originalHeight} - Scaled size: ${width}x${height}`);

	switch (embed.provider?.name) {
		case "YouTube": {
			if (!embed.video?.url) return null;
			const url = embed.video.url;

			return <iframe loading="lazy" src={url} allowFullScreen style={{ height, width }} />;
		}
		case "Spotify": {
			const url = embed.url;
			if (!url) break;
			// extract type and id from url
			const match = url.match(/https:\/\/open\.spotify\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
			if (!match) break;
			const type = match[1];
			const id = match[2];

			return (
				<iframe
					style={{ width: "400px", height: "80px", borderRadius: 12 }}
					src={`https://open.spotify.com/embed/${type}/${id}`}
					frameBorder="0"
					allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
					loading="lazy"
				></iframe>
			);
		}
		case "Soundcloud":
			return (
				<iframe
					src={`https://w.soundcloud.com/player/?url=${encodeURIComponent(
						embed.url!,
					)}&color=%23FF7F50&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true`}
					frameBorder="0"
					scrolling="no"
					loading="lazy"
					style={{ height }}
				/>
			);
		// not supported by the server
		// case "Bandcamp": {
		// 	const url = embed.url;
		// 	if (!url) break;
		// 	// extract type and id from url
		// 	const match = url.match(/https:\/\/([a-zA-Z0-9-]+)\.bandcamp\.com\/(track|album|playlist)\/([a-zA-Z0-9]+)/);
		// 	if (!match) break;
		// 	const type = match[2];
		// 	const id = match[3];

		// 	return (
		// 		<iframe
		// 			src={`https://bandcamp.com/EmbeddedPlayer/${type.toLowerCase()}=${id}/size=large/bgcol=181a1b/linkcol=056cc4/tracklist=false/transparent=true/`}
		// 			seamless
		// 			loading="lazy"
		// 			style={{ border: "0", height: "42px" }}
		// 		/>
		// 	);
		// }
		case "Streamable": {
			const url = embed.url;
			if (!url) break;
			// extract id from url
			const match = url.match(/https:\/\/streamable\.com\/([a-zA-Z0-9]+)/);
			if (!match) break;
			const id = match[1];
			return (
				<iframe
					src={`https://streamable.com/e/${id}?quality=highest`}
					frameBorder="0"
					allowFullScreen
					seamless
					loading="lazy"
					style={{ height }}
				/>
			);
		}
		default: {
			if (embed.video && !thumbnail) {
				const url = embed.video.url;

				return (
					<div>
						<video
							className={styles.embedImage}
							style={{ width, height }}
							src={url}
							loop={embed.type === EmbedType.GIFV}
							controls={embed.type !== EmbedType.GIFV}
							autoPlay={embed.type === EmbedType.GIFV}
							muted={embed.type === EmbedType.GIFV ? true : undefined}
							onClick={() => {
								modalController.push({
									type: "image_viewer",
									attachment: embed.video!,
									isVideo: true,
								});
							}}
						/>

						{embed.type === EmbedType.GIFV && (
							<div>
								<div className={styles.embedGifIconBg}></div>
								<Icon icon="mdiFileGifBox" size={1} className={styles.embedGifIcon} />
							</div>
						)}
					</div>
				);
			} else if (embed.image && !thumbnail) {
				const url = embed.image.url;

				return (
					<img
						className={styles.embedImage}
						src={url}
						loading="lazy"
						onClick={() => {
							modalController.push({
								type: "image_viewer",
								attachment: embed.image!,
							});
						}}
					/>
				);
			} else if (embed.thumbnail) {
				const url = embed.thumbnail.url;

				return (
					<img
						className={thumbnail ? styles.embedThumbnail : styles.embedImage}
						src={url}
						loading="lazy"
						style={{ height, width }}
						onClick={() => {
							modalController.push({
								type: "image_viewer",
								attachment: embed.thumbnail!,
							});
						}}
					/>
				);
			}
		}
	}

	return null;
}

export default EmbedMedia;
