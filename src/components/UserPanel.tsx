import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import User from "../stores/objects/User";
import Avatar from "./Avatar";
import Icon from "./Icon";
import IconButton from "./IconButton";
import Tooltip from "./Tooltip";
import Floating from "./floating/Floating";
import FloatingContent from "./floating/FloatingContent";
import FloatingTrigger from "./floating/FloatingTrigger";
import UserProfilePopout from "./floating/UserProfilePopout";

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

const AvatarWrapper = styled(FloatingTrigger)`
	display: flex;
	align-items: center;
	min-width: 120px;
	padding-left: 2px;
	margin-right: 8px;
	border-radius: 4px;
	cursor: default;

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
	cursor: pointer;
`;

const Subtext = styled.div`
	font-size: 12px;
	font-weight: var(--font-weight-regular);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	user-select: none;
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

	const openSettingsModal = () => {};

	return (
		<Floating placement="bottom">
			<Section>
				<Container>
					<AvatarWrapper>
						<Avatar popoutPlacement="top" onClick={null} />
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

			<FloatingContent>
				<UserProfilePopout user={app.account! as unknown as User} />
			</FloatingContent>
		</Floating>
	);
}

export default UserPanel;
