import { ModalProps } from "../../controllers/modals/types";
import { Modal } from "./ModalComponents";

export function ErrorModal({ error, ...props }: ModalProps<"error">) {
	return (
		<Modal
			{...props}
			actions={[
				{
					onClick: () => true,
					confirmation: true,
					children: <span>Dismiss</span>,
					palette: "primary",
					disabled: !(props.recoverable ?? true),
				},
			]}
			nonDismissable={!(props.recoverable ?? true)}
		>
			{error}
		</Modal>
	);
}
