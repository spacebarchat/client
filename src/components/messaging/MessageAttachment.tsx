import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import { calculateImageRatio, calculateScaledDimensions } from "../../utils/Message";
import { getFileDetails, zoomFit } from "../../utils/Utils";
import Audio from "../media/Audio";
import File from "../media/File";
import Video from "../media/Video";

const Attachment = styled.div<{ withPointer?: boolean }>`
	cursor: ${(props) => (props.withPointer ? "pointer" : "default")};
	padding: 2px 0;
	width: min-content;
`;

const Image = styled.img`
	border-radius: 4px;
`;

interface AttachmentProps {
	attachment: APIAttachment;
	maxWidth?: number;
	maxHeight?: number;
}

export default function MessageAttachment({ attachment, maxWidth, maxHeight }: AttachmentProps) {
	const logger = useLogger("MessageAttachment");

	const url = attachment.proxy_url && attachment.proxy_url.length > 0 ? attachment.proxy_url : attachment.url;

	const details = getFileDetails(attachment);
	let finalElement: JSX.Element = <></>;
	if (details.isImage && details.isEmbeddable) {
		const ratio = calculateImageRatio(attachment.width!, attachment.height!, maxWidth, maxHeight);
		const { scaledWidth, scaledHeight } = calculateScaledDimensions(
			attachment.width!,
			attachment.height!,
			ratio,
			maxWidth,
			maxHeight,
		);
		finalElement = (
			<Image src={url} alt={attachment.filename} width={scaledWidth} height={scaledHeight} loading="lazy" />
		);
	} else if (details.isVideo && details.isEmbeddable) {
		finalElement = <Video attachment={attachment} />;
	} else if (details.isAudio && details.isEmbeddable) {
		finalElement = <Audio attachment={attachment} />;
	} else {
		finalElement = <File attachment={attachment} />;
	}

	return (
		<Attachment
			withPointer={attachment.content_type?.startsWith("image")}
			key={attachment.id}
			onClick={() => {
				if (!attachment.content_type?.startsWith("image")) return;
				const { width, height } = zoomFit(attachment.width!, attachment.height!);
				// TODO: preview modal
			}}
		>
			{finalElement}
		</Attachment>
	);
}
