import { useModals } from "@mattjennings/react-modal-stack";
import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import useLogger from "../../hooks/useLogger";
import { calculateImageRatio, calculateScaledDimensions } from "../../utils/Message";
import { IContextMenuItem } from "../ContextMenuItem";
import AttachmentPreviewModal from "../modals/AttachmentPreviewModal";

const Attachment = styled.div<{ withPointer?: boolean }>`
	cursor: ${(props) => (props.withPointer ? "pointer" : "default")};
	width: min-content;
`;

const Image = styled.img`
	border-radius: 4px;
`;

interface AttachmentProps {
	attachment: APIAttachment;
	contextMenuItems: IContextMenuItem[];
	maxWidth?: number;
	maxHeight?: number;
}

export default function MessageAttachment({ attachment, contextMenuItems, maxWidth, maxHeight }: AttachmentProps) {
	const logger = useLogger("MessageAttachment");

	const { openModal } = useModals();
	const contextMenu = React.useContext(ContextMenuContext);

	const url = attachment.proxy_url && attachment.proxy_url.length > 0 ? attachment.proxy_url : attachment.url;

	let finalElement: JSX.Element = <></>;
	if (attachment.content_type?.startsWith("image")) {
		const ratio = calculateImageRatio(attachment.width!, attachment.height!, maxWidth, maxHeight);
		const { scaledWidth, scaledHeight } = calculateScaledDimensions(
			attachment.width!,
			attachment.height!,
			ratio,
			maxWidth,
			maxHeight,
		);
		finalElement = <Image src={url} alt={attachment.filename} width={scaledWidth} height={scaledHeight} />;
	} else if (attachment.content_type?.startsWith("video")) {
		{
			/* TODO: poster thumbnail */
		}
		finalElement = (
			<video playsInline controls preload="metadata" height={200}>
				{/* TODO: the server doesn't return height and width yet for videos */}
				<source src={url} type={attachment.content_type} />
			</video>
		);
	} else {
		logger.warn(`Unknown attachment type: ${attachment.content_type}`);
	}

	return (
		<Attachment
			withPointer={attachment.content_type?.startsWith("image")}
			key={attachment.id}
			onContextMenu={(e) => {
				// prevent propagation to the message container
				e.stopPropagation();
				e.preventDefault();
				contextMenu.open({
					position: {
						x: e.pageX,
						y: e.pageY,
					},
					items: [
						...contextMenuItems,
						{
							label: "Copy Attachment URL",
							onClick: () => {
								navigator.clipboard.writeText(attachment.url);
							},
							iconProps: {
								icon: "mdiLink",
							},
						} as IContextMenuItem,
					],
				});
			}}
			onClick={() => {
				if (!attachment.content_type?.startsWith("image")) return;
				openModal(AttachmentPreviewModal, { attachment });
			}}
		>
			{finalElement}
		</Attachment>
	);
}
