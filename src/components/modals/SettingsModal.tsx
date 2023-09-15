import { useModals } from "@mattjennings/react-modal-stack";
import { useAppStore } from "../../stores/AppStore";
import { GIT_BRANCH, GIT_REVISION, REPO_URL } from "../../utils/revison";
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
	const { closeModal, closeAllModals } = useModals();

	const logout = () => {
		app.logout();
		closeAllModals();
	};

	return (
		<Modal full {...props}>
			<ModalFullSidebar>
				<ModalFullSidebarContent>
					Sidebar
					<div>
						<Button variant="danger" onClick={logout}>
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
				<div>
					<span>Client Version: </span>
					<a href={`${REPO_URL}/commit/${GIT_REVISION}`} target="_blank" rel="noreferrer">
						{GIT_REVISION.substring(0, 7)}
					</a>
					{` `}
					<a
						href={GIT_BRANCH !== "DETACHED" ? `${REPO_URL}/tree/${GIT_BRANCH}` : undefined}
						target="_blank"
						rel="noreferrer"
					>
						({GIT_BRANCH})
					</a>
				</div>
			</ModalFullContent>
		</Modal>
	);
}

export default SettingsModal;
