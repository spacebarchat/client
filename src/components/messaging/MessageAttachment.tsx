import { modalController } from "@/controllers/modals";
import { Audio, File, Video, Text } from "@components/media";
import useLogger from "@hooks/useLogger";
import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import { getFileDetails, zoomFit } from "@utils";
import styled from "styled-components";

const MAX_ATTACHMENT_HEIGHT = 350;

function adjustDimensions(width: number, height: number): { adjustedWidth: number; adjustedHeight: number } {
	const aspectRatio = width / height;

	let adjustedWidth: number = width * aspectRatio;
	let adjustedHeight: number = height * aspectRatio;

	// Ensure the adjusted height does not exceed the maximum height
	if (adjustedHeight > MAX_ATTACHMENT_HEIGHT) {
		const scale = MAX_ATTACHMENT_HEIGHT / adjustedHeight;
		adjustedWidth *= scale;
		adjustedHeight = MAX_ATTACHMENT_HEIGHT;
	}

	return { adjustedWidth: Math.floor(adjustedWidth), adjustedHeight: Math.floor(adjustedHeight) };
}

const Attachment = styled.div<{ withPointer?: boolean }>`
	cursor: ${(props) => (props.withPointer ? "pointer" : "default")};
	padding: 2px 0;
`;

const Image = styled.img`
	border-radius: 4px;
	width: 100%;
	height: auto;
`;

interface AttachmentProps {
	attachment: APIAttachment;
}

export default function MessageAttachment({ attachment }: AttachmentProps) {
	const logger = useLogger("MessageAttachment");

	const url = attachment.proxy_url && attachment.proxy_url.length > 0 ? attachment.proxy_url : attachment.url;

	const details = getFileDetails(attachment);
	let finalElement: JSX.Element = <></>;
	if (details.isImage && details.isEmbeddable) {
		const width = attachment.width!;
		const height = attachment.height!;
		const { adjustedWidth, adjustedHeight } = adjustDimensions(width, height);

		finalElement = (
			<Image
				src={url}
				alt={attachment.filename}
				loading="lazy"
				style={{ maxWidth: adjustedWidth, maxHeight: adjustedHeight }}
			/>
		);
	} else if (details.isVideo && details.isEmbeddable) {
		finalElement = <Video attachment={attachment} />;
	} else if (details.isAudio && details.isEmbeddable) {
		finalElement = <Audio attachment={attachment} />;
	} else if (details.isText && details.isEmbeddable) {
		finalElement = <Text attachment={attachment} />;
	}
	else {
		finalElement = <File attachment={attachment} />;
	}

	return (
		<Attachment
			withPointer={attachment.content_type?.startsWith("image")}
			key={attachment.id}
			onClick={() => {
				if (!attachment.content_type?.startsWith("image")) return;
				const { width, height } = zoomFit(attachment.width!, attachment.height!);
				modalController.push({
					type: "image_viewer",
					attachment,
					width,
					height,
				});
			}}
		>
			{finalElement}
		</Attachment>
	);
}
