import { APIAttachment, APIEmbedImage, APIEmbedThumbnail } from "@spacebarchat/spacebar-api-types/v9";
import styled from "styled-components";
import { Modal } from "./ModalComponents";

const Container = styled.div`
	display: flex;
	overflow: hidden;
	flex-direction: column;
	max-width: 90vw;
	max-height: 75vh;

	img {
		object-fit: contain;
	}
`;

interface Props {
	attachment: APIAttachment | APIEmbedImage | APIEmbedThumbnail;
	width?: number;
	height?: number;
}

export function ImageViewerModal(props: Props) {
	const width = props.width ?? props.attachment.width ?? 0;
	const height = props.height ?? props.attachment.height ?? 0;

	return (
		<Modal {...props} transparent maxWidth="100vw" maxHeight="100vh" withoutCloseButton withEmptyActionBar>
			<Container>
				<img src={props.attachment.url} width={width} height={height} loading="eager" />
			</Container>
		</Modal>
	);
}
