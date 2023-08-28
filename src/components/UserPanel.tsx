import { useModals } from "@mattjennings/react-modal-stack";
import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Avatar from "./Avatar";
import Icon from "./Icon";
import IconButton from "./IconButton";
import Tooltip from "./Tooltip";
import SettingsModal from "./modals/SettingsModal";

const Section = styled.section`
	flex: 0 0 auto;
	background-color: var(--background-secondary-alt);
`;

const Container = styled.div`
	display: flex;
	height: 52px;
	align-items: center;
	padding: 0 8px;
	margin-bottom: 1px;
	background-color: var(--background-secondary-alt);
`;

const AvatarWrapper = styled.div`
	display: flex;
	align-items: center;
	min-width: 120px;
	padding-left: 2px;
	margin-right: 8px;
	border-radius: 4px;

	&:hover {
		background-color: var(--background-primary-alt);
	}
`;

const Name = styled.div`
	padding: 4px 0 4px 8px;
	margin-right: 4px;
`;

const Username = styled.div`
	font-size: 14px;
	font-weight: var(--font-weight-medium);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const Subtext = styled.div`
	font-size: 12px;
	font-weight: var(--font-weight-regular);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`;

const ActionsWrapper = styled.div`
	flex: 1;
	flex-direction: row;
	flex-wrap: no-wrap;
	justify-content: flex-end;
	align-items: stretch;
	display: flex;
`;

function UserPanel() {
	const app = useAppStore();
	const { openModal } = useModals();

	const openSettingsModal = () => {
		openModal(SettingsModal);
	};

	return (
		<Section>
			<Container>
				<AvatarWrapper>
					<Avatar />
					<Name>
						<Username>{app.account?.username}</Username>
						<Subtext>#{app.account?.discriminator}</Subtext>
					</Name>
				</AvatarWrapper>

				<ActionsWrapper>
					<Tooltip title="Settings">
						<IconButton aria-label="settings" color="#fff" onClick={openSettingsModal}>
							<Icon icon="mdiCog" size="20px" />
						</IconButton>
					</Tooltip>
				</ActionsWrapper>
			</Container>
		</Section>
	);
}

export default UserPanel;
