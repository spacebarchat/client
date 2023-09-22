// adapted from Revite
// https://github.com/revoltchat/revite/blob/master/src/components/common/messaging/embed/Embed.tsx

import { APIEmbed, EmbedType } from "@spacebarchat/spacebar-api-types/v9";
import styles from "./Embed.module.css";

interface Props {
	embed: APIEmbed;
	width?: number;
	height?: number;
	thumbnail?: boolean;
}

function EmbedMedia({ embed, width, height, thumbnail }: Props) {
	switch (embed.provider?.name) {
		case "YouTube": {
			if (!embed.video?.url) return null;
			const url = embed.video.url;

			return <iframe loading="lazy" src={url} allowFullScreen style={{ height }} />;
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
					style={{ borderRadius: "12px", width: "400px", height: "80px" }}
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
					<video
						className={styles.image}
						style={{ width, height }}
						src={url}
						loop={embed.type === EmbedType.GIFV}
						controls={embed.type === EmbedType.GIFV}
						autoPlay={embed.type === EmbedType.GIFV}
						muted={embed.type === EmbedType.GIFV ? true : undefined}
					/>
				);
			} else if (embed.image && !thumbnail) {
				const url = embed.image.url;
				return (
					<img
						className={styles.image}
						src={url}
						loading="lazy"
						style={{ width: "100%", height: "100%" }}
						onClick={() => {
							console.log("preview image");
						}}
						onMouseDown={(ev) => ev.button === 1 && window.open(url, "_blank")}
					/>
				);
			} else if (embed.thumbnail) {
				const url = embed.thumbnail.url;
				return (
					<img
						className={styles.image}
						src={url}
						loading="lazy"
						style={{ width, height }}
						onClick={() => {
							console.log("preview image");
						}}
						onMouseDown={(ev) => ev.button === 1 && window.open(url, "_blank")}
					/>
				);
			}
		}
	}

	return null;
}

export default EmbedMedia;
