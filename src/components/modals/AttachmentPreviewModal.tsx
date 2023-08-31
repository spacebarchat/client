import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import { calculateImageRatio, calculateScaledDimensions } from "../../utils/Message";
import { Modal } from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

const SCALE_FACTOR = 3.5;

interface Props extends AnimatedModalProps {
	attachment: APIAttachment;
}

function AttachmentPreviewModal(props: Props) {
	const width = props.attachment.width ?? 0;
	const height = props.attachment.height ?? 0;
	const maxWidth = 400 * SCALE_FACTOR;
	const maxHeight = 300 * SCALE_FACTOR;

	const ratio = calculateImageRatio(width, height, maxWidth, maxHeight);
	const { scaledWidth, scaledHeight } = calculateScaledDimensions(width, height, ratio, maxWidth, maxHeight);

	return (
		<Modal
			full
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "transparent",
			}}
			{...props}
		>
			<img src={props.attachment.url} width={scaledWidth} height={scaledHeight} />
		</Modal>
	);
}

export default AttachmentPreviewModal;
