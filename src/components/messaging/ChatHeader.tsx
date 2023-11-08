import * as Icons from "@mdi/js";
import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import Channel from "../../stores/objects/Channel";
import Icon from "../Icon";
import { SectionHeader } from "../SectionHeader";
import Tooltip from "../Tooltip";

const IconButton = styled.button`
	margin: 0;
	padding: 0;
	background-color: inherit;
	border: none;

	&:hover {
		color: red;
	}
`;

const CustomIcon = styled(Icon)<{ $active?: boolean }>`
	color: ${(props) => (props.$active ? "#ffffff" : "var(--text-secondary)")};

	&:hover {
		color: var(--text);
	}
`;

const Container = styled(SectionHeader)`
	background-color: var(--background-primary-alt);
`;

const Wrapper = styled.div`
	display: flex;
	flex: 1 1 auto;
	align-items: center;
`;

const ChannelNameText = styled.div`
	font-size: 16px;
	font-weight: var(--font-weight-medium);
`;

const Divider = styled.div`
	width: 1px;
	height: 16px;
	margin: 0 8px;
	background-color: var(--text-secondary);
`;

const TopicWrapper = styled.div`
	display: flex;
	flex: 1 1 auto;
`;

const ChannelTopicText = styled.div`
	font-size: 14px;
	font-weight: var(--font-weight-regular);
	color: var(--text-secondary);
`;

const ActionItemsWrapper = styled.div`
	display: flex;
	flex-direction: row-reverse;
	// margin-right: 15%;

	// remove the temporary padding that moves it over the chat area on smaller screens where the member list is hidden
	@media (max-width: 1050px) {
		margin-right: auto;
	}
`;

const DummySearch = styled.div`
	display: flex;
	flex: 0 0 208px;

	align-items: center;
	border-radius: 4px;
	background-color: var(--background-tertiary);
	margin-left: 8px; // to match the right padding from the main container
	padding: 0 8px;
	user-select: none;
	// cursor: text;
	cursor: not-allowed;
`;

const IconWrapper = styled.div`
	height: 24px;
	margin-left: 8px;
	flex: 0 0 auto;
`;

interface Props {
	channel?: Channel;
}

function ChannelTopic({ channel }: Props) {
	return (
		<TopicWrapper>
			{channel?.topic && (
				<>
					<Divider />
					<ChannelTopicText>{channel.topic}</ChannelTopicText>
				</>
			)}
		</TopicWrapper>
	);
}

interface ActionItemProps {
	icon: keyof typeof Icons;
	active?: boolean;
	ariaLabel?: string;
	tooltip: string;
}

function ActionItem({ icon, active, ariaLabel, tooltip }: ActionItemProps) {
	const logger = useLogger("ChatHeader.tsx:ActionItem");

	return (
		<Tooltip title={tooltip}>
			<IconWrapper>
				<IconButton
					onClick={() => {
						logger.debug("click");
					}}
				>
					<CustomIcon $active={active} icon={icon} size="24px" aria-label={ariaLabel} />
				</IconButton>
			</IconWrapper>
		</Tooltip>
	);
}

/**
 * Top header for channel messages section
 */
function ChatHeader({ channel }: Props) {
	return (
		<Container>
			<Wrapper>
				{/* // TODO: render a custom bar for the home page */}
				<ChannelNameText>#{channel?.name ?? "ChannelName"}</ChannelNameText>
				<ChannelTopic channel={channel} />
				{/* Action Items */}
				<ActionItemsWrapper>
					{/* <ActionItem icon="mdiPound" ariaLabel="Threads" /> */}
					<DummySearch>
						<span>Search</span>
					</DummySearch>
					<ActionItem icon="mdiInbox" tooltip="Inbox" ariaLabel="Inbox" />
					<ActionItem
						icon="mdiAccountMultiple"
						tooltip="Toggle Member List"
						ariaLabel="Toggle Member List"
						active
					/>
					<ActionItem icon="mdiPin" tooltip="Pinned Messages" ariaLabel="Pinned Messages" />
					<ActionItem icon="mdiBellBadge" tooltip="Notification Settings" ariaLabel="Notification Settings" />
				</ActionItemsWrapper>
			</Wrapper>
		</Container>
	);
}

export default ChatHeader;
