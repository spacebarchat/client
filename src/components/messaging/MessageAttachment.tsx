import { useModals } from "@mattjennings/react-modal-stack";
import { APIAttachment } from "@spacebarchat/spacebar-api-types/v9";
import React from "react";
import styled from "styled-components";
import { ContextMenuContext } from "../../contexts/ContextMenuContext";
import useLogger from "../../hooks/useLogger";
import { calculateImageRatio, calculateScaledDimensions } from "../../utils/Message";
import { IContextMenuItem } from "../ContextMenuItem";
import AttachmentPreviewModal from "../modals/AttachmentPreviewModal";

const Attachment = styled.div`
	cursor: pointer;
`;

interface AttachmentProps {
	attachment: APIAttachment;
	contextMenuItems: IContextMenuItem[];
}

export default function MessageAttachment({ attachment, contextMenuItems }: AttachmentProps) {
	const logger = useLogger("MessageAttachment");

	const { openModal } = useModals();
	const contextMenu = React.useContext(ContextMenuContext);

	const url = attachment.proxy_url && attachment.proxy_url.length > 0 ? attachment.proxy_url : attachment.url;

	let a: JSX.Element = <></>;
	if (attachment.content_type?.startsWith("image")) {
		const ratio = calculateImageRatio(attachment.width!, attachment.height!);
		const { scaledWidth, scaledHeight } = calculateScaledDimensions(attachment.width!, attachment.height!, ratio);
		a = <img src={url} alt={attachment.filename} width={scaledWidth} height={scaledHeight} />;
	} else if (attachment.content_type?.startsWith("video")) {
		{
			/* TODO: poster thumbnail */
		}
		a = (
			<video controls preload="metadata" width={400}>
				{/* TODO: the server doesn't return height and width yet for videos */}
				<source src={url} type={attachment.content_type} />
			</video>
		);
	} else {
		logger.warn(`Unknown attachment type: ${attachment.content_type}`);
	}

	return (
		<Attachment
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
				openModal(AttachmentPreviewModal, { attachment });
			}}
		>
			{a}
		</Attachment>
	);
}
