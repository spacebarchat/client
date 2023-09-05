import { useModals } from "@mattjennings/react-modal-stack";
import { useAppStore } from "../../stores/AppStore";
import Button from "../Button";
import Icon from "../Icon";
import {
	Modal,
	ModalCloseWrapper,
	ModalFullContent,
	ModalFullSidebar,
	ModalFullSidebarContent,
} from "./ModalComponents";
import { AnimatedModalProps } from "./ModalRenderer";

function SettingsModal(props: AnimatedModalProps) {
	const app = useAppStore();
	const { closeModal } = useModals();

	return (
		<Modal full {...props}>
			<ModalFullSidebar>
				<ModalFullSidebarContent>
					Sidebar
					<div>
						<Button variant="danger" onClick={() => app.logout()}>
							Logout
						</Button>
					</div>
				</ModalFullSidebarContent>
			</ModalFullSidebar>

			<ModalFullContent>
				<ModalCloseWrapper>
					<button
						onClick={closeModal}
						style={{
							background: "none",
							border: "none",
							outline: "none",
						}}
					>
						<Icon
							icon="mdiClose"
							size={1}
							style={{
								cursor: "pointer",
								color: "var(--text)",
							}}
						/>
					</button>
				</ModalCloseWrapper>
				Content
			</ModalFullContent>
		</Modal>
	);
}

export default SettingsModal;
