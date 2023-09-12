import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import { PuffLoader } from "react-spinners";
import styled from "styled-components";
import { calculateImageRatio, calculateScaledDimensions } from "../utils/Message";

const Container = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 300px;
	min-width: 300px;
	background-color: var(--background-primary);
	border-radius: 10px;
`;

interface Props {
	attachment: APIAttachment;
}

function Video({ attachment }: Props) {
	const ref = React.useRef<HTMLVideoElement>(null);
	const [isLoading, setIsLoading] = React.useState(true);
	const [dimensions, setDimensions] = React.useState({ width: 0, height: 0 });

	const url = attachment.proxy_url && attachment.proxy_url.length > 0 ? attachment.proxy_url : attachment.url;

	const onLoadedMetadata = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
		const video = e.target as HTMLVideoElement;
		const width = video.videoWidth;
		const height = video.videoHeight;
		const ratio = calculateImageRatio(width, height, 300, 300);
		const scaledDimensions = calculateScaledDimensions(width, height, ratio, 300, 300);
		setDimensions({ width: scaledDimensions.scaledWidth, height: scaledDimensions.scaledHeight });
	};

	const onLoadedData = () => {
		setIsLoading(false);
	};

	// TODO: poster
	// TODO: the server doesn't return height and width yet for videos
	return (
		<>
			{isLoading && (
				<Container>
					<PuffLoader size={"42px"} color="var(--primary)" />
				</Container>
			)}
			<video
				style={isLoading ? { display: "none" } : {}}
				playsInline
				controls
				preload="metadata"
				width={dimensions.width}
				height={dimensions.height}
				ref={ref}
				onLoadedMetadata={onLoadedMetadata}
				onLoadedData={onLoadedData}
			>
				<source src={url} type={attachment.content_type} />
			</video>
		</>
	);
}

export default Video;
