import {
	FloatingPortal,
	flip,
	offset,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
	useRole,
} from "@floating-ui/react";
import { PresenceUpdateStatus } from "@spacebarchat/spacebar-api-types/v9";
import { motion } from "framer-motion";
import { useState } from "react";
import styled from "styled-components";
import { useAppStore } from "../../stores/AppStore";
import GuildMember from "../../stores/objects/GuildMember";
import User from "../../stores/objects/User";
import Avatar from "../Avatar";
import UserProfilePopout from "../floating/UserProfilePopout";

const ListItem = styled.div<{ isCategory?: boolean }>`
	padding: ${(props) => (props.isCategory ? "16px 8px 0 0" : "1px 8px 0 0")};
	cursor: pointer;
	user-select: none;
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

	const [open, setOpen] = useState(false);

	const floating = useFloating({
		placement: "right-start",
		open,
		onOpenChange: setOpen,
		// whileElementsMounted: autoUpdate,
		middleware: [offset(5), flip(), shift()],
	});

	const click = useClick(floating.context);
	const dismiss = useDismiss(floating.context);
	const role = useRole(floating.context);
	const interactions = useInteractions([click, dismiss, role]);

	return (
		<>
			<ListItem key={item.user?.id} ref={floating.refs.setReference} {...interactions.getReferenceProps()}>
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

			{open && (
				<FloatingPortal>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.1, easing: [0.87, 0, 0.13, 1] }}
					>
						<div
							ref={floating.refs.setFloating}
							style={floating.floatingStyles}
							{...interactions.getFloatingProps()}
						>
							<UserProfilePopout user={app.account! as unknown as User} member={item} />
						</div>
					</motion.div>
				</FloatingPortal>
			)}
		</>
	);
}

export default MemberListItem;
