import styled from "styled-components";
import { useAppStore } from "../stores/AppStore";
import Avatar from "./Avatar";
import Icon from "./Icon";
import IconButton from "./IconButton";
import Tooltip from "./Tooltip";

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

	// &:hover {
	// 	background-color: var(--background-primary-alt);
	// }
`;

const Name = styled.div`
	padding: 4px 0 4px 8px;
	margin-right: 4px;
`;

const Username = styled.div`
	font-size: 14px;
	font-weight: 600;
`;

const Discriminator = styled.div`
	font-size: 12px;
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

	return (
		<Section>
			<Container>
				<AvatarWrapper>
					<Avatar />
					<Name>
						<Username>{app.account?.username}</Username>
						<Discriminator>#{app.account?.discriminator}</Discriminator>
					</Name>
				</AvatarWrapper>

				<ActionsWrapper>
					<Tooltip title="Settings">
						<IconButton aria-label="settings" disabled color="#fff">
							<Icon icon="mdiCog" size="20px" />
						</IconButton>
					</Tooltip>
				</ActionsWrapper>
			</Container>
		</Section>
	);
}

export default UserPanel;
