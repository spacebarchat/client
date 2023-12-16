import styled from "styled-components";
import { ModalProps, modalController } from "../../controllers/modals";
import Button from "../Button";
import { Modal } from "./ModalComponents";

const ActionWrapper = styled.div`
	display: flex;
	flex-direction: column;
	gap: 8px;
`;
export function AddServerModal({ ...props }: ModalProps<"add_server">) {
	return (
		<Modal {...props} title="Add a Guild" description="Lorem ipsum dolor sit amet, consectetur adipiscing elit.">
			<ActionWrapper>
				<Button
					palette="primary"
					onClick={() => {
						modalController.push({
							type: "create_server",
						});
					}}
				>
					Create a Guild
				</Button>

				<Button
					palette="secondary"
					onClick={() => {
						modalController.push({
							type: "join_server",
						});
					}}
				>
					Join a Guild
				</Button>
			</ActionWrapper>
		</Modal>
	);
}
