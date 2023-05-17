import styled from "styled-components";
import Channel from "../stores/objects/Channel";

const Wrapper = styled.section`
	display: flex;
	padding: 12px 16px;
	margin-bottom: 1px;
	background-color: var(--background-primary);
	box-shadow: 0 1px 0 hsl(0deg 0% 0% / 0.3);
	align-items: center;
`;

const InnerWrapper = styled.div`
	display: flex;
	flex: 1 1 auto;
	align-items: center;
`;

const NameWrapper = styled.div`
	font-size: 16px;
`;

const Divider = styled.div`
	width: 1px;
	height: 16px;
	margin: 0 8px;
	background-color: var(--text-secondary);
`;

const TopicWrapper = styled.div`
	font-size: 14px;
`;

interface Props {
	channel?: Channel;
}

function ChatHeader({ channel }: Props) {
	return (
		<Wrapper>
			<InnerWrapper>
				{/* // TODO: render a custom bar for the home page */}
				<NameWrapper>#{channel?.name ?? "ChannelName"}</NameWrapper>
				{channel?.topic && (
					<>
						<Divider />
						<TopicWrapper>{channel.topic}</TopicWrapper>
					</>
				)}
			</InnerWrapper>
		</Wrapper>
	);
}

export default ChatHeader;
