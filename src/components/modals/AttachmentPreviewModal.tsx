import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import { Modal } from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

interface Props extends AnimatedModalProps {
	attachment: APIAttachment;
	width?: number;
	height?: number;
}

function AttachmentPreviewModal(props: Props) {
	const width = props.width ?? props.attachment.width ?? 0;
	const height = props.height ?? props.attachment.height ?? 0;

	return (
		<Modal
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "transparent",
			}}
			{...props}
		>
			<img src={props.attachment.url} width={width} height={height} loading="eager" />
		</Modal>
	);
}

export default AttachmentPreviewModal;
