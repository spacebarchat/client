import { ModalProps, modalController } from "@/controllers/modals";
import Button from "@components/Button";
import styled from "styled-components";
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
					grow
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
					grow
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
