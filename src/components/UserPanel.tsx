import React from "react";
import styled from "styled-components";
import { PopoutContext } from "../contexts/PopoutContext";
import { modalController } from "../controllers/modals/ModalController";
import { useAppStore } from "../stores/AppStore";
import Avatar from "./Avatar";
import Icon from "./Icon";
import IconButton from "./IconButton";
import Tooltip from "./Tooltip";
import UserProfilePopout from "./UserProfilePopout";

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
	const popoutContext = React.useContext(PopoutContext);
	const ref = React.useRef<HTMLDivElement>(null);

	const openSettingsModal = () => {
		modalController.push({
			type: "error",
			title: "File Too Large",
			error: "Max file size is 25MB.",
		});
	};

	const openPopout = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();

		if (!ref.current) return;
		const rect = ref.current.getBoundingClientRect();
		if (!rect) return;

		popoutContext.open({
			element: <UserProfilePopout user={app.account!} />,
			position: rect,
			placement: "top",
		});
	};

	return (
		<Section ref={ref}>
			<Container>
				<AvatarWrapper onClick={openPopout}>
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
	);
}

export default UserPanel;
