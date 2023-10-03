import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import { Modal } from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

interface Props extends AnimatedModalProps {
	attachment: APIAttachment;
}

function AttachmentPreviewModal(props: Props) {
	const width = props.attachment.width ?? 0;
	const height = props.attachment.height ?? 0;

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
			<div
				style={{
					maxWidth: "100vw",
					maxHeight: "100vh",
				}}
			>
				<img src={props.attachment.url} width={width} height={height} loading="eager" />
			</div>
		</Modal>
	);
}

export default AttachmentPreviewModal;
