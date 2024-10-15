import { ModalProps, modalController } from "@/controllers/modals";
import MarkdownRenderer from "@components/markdown/MarkdownRenderer";
import styled from "styled-components";
import { Modal } from "./ModalComponents";

const PreviewContainer = styled.div`
	background-color: var(--background-secondary);
	margin-top: 16px;
	box-shadow: 0 0 0 1px var(--background-tertiary), 0 2px 10px 0 var(--background-tertiary);
	border-radius: 4px;
	overflow: hidden;
	padding: 5px 6px;
`;

export  function DeleteMessageModal({ target, ...props }: ModalProps<"delete_message">) {
	return (
		<Modal
			{...props}
			title="Delete Message"
			description="Are you sure you want to delete this message?"
			actions={[
				{
					onClick: () => {
						modalController.pop("close");
					},
					children: <span>Cancel</span>,
					palette: "link",
					size: "small",
					confirmation: true,
				},
				{
					onClick: async () => {
						await target.delete();
						modalController.pop("close");
					},
					children: <span>Delete</span>,
					palette: "danger",
					size: "small",
				},
			]}
		>
			<PreviewContainer>
				<MarkdownRenderer content={target.content} />
			</PreviewContainer>
		</Modal>
	);
}
