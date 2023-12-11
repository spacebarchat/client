import { PresenceUpdateStatus } from "@spacebarchat/spacebar-api-types/v9";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import GuildMember from "../../stores/objects/GuildMember";
import Avatar from "../Avatar";

const ListItem = styled.div<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: pointer;
`;

const Container = styled.div`
	max-width: 224px;
	background-color: transparent;
	box-sizing: border-box;
	padding: 1px 0;
	border-radius: 4px;

	&:hover {
		background-color: var(--background-primary-alt);
	}
`;

const Wrapper = styled.div<{ offline?: boolean }>`
	display: flex;
	align-items: center;
	border-radius: 4px;
	height: 42px;
	padding: 0 8px;
	opacity: ${(props) => (props.offline ? 0.5 : 1)};
`;

const Text = styled.span<{ color?: string }>`
	font-size: 16px;
	font-weight: var(--font-weight-regular);
	white-space: nowrap;
	color: ${(props) => props.color ?? "var(--text-secondary)"};
`;

const TextWrapper = styled.div`
	min-width: 0;
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const AvatarWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	margin-right: 12px;
`;

interface Props {
	item: GuildMember;
}

function MemberListItem({ item }: Props) {
	const app = useAppStore();

	const presence = app.presences.get(item.guild.id)?.get(item.user!.id);

	return (
		<ListItem
			key={item.user?.id}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
				// TODO: user popout
			}}
		>
			<Container>
				<Wrapper offline={presence?.status === PresenceUpdateStatus.Offline}>
					<AvatarWrapper>
						<Avatar user={item.user!} size={32} presence={presence} />
					</AvatarWrapper>
					<TextWrapper>
						<Text color={item.roleColor}>{item.nick ?? item.user?.username}</Text>
					</TextWrapper>
				</Wrapper>
			</Container>
		</ListItem>
	);
}

export default MemberListItem;
