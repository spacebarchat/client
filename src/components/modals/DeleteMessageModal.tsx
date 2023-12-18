import { ModalProps, modalController } from "../../controllers/modals";
import { Modal } from "./ModalComponents";

export function DeleteMessageModal({ target, ...props }: ModalProps<"delete_message">) {
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
			<div>message preview</div>
		</Modal>
	);
}
