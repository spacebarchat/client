import dayjs from "dayjs";
import styled from "styled-components";
import { ReactComponent as SpacebarLogoBlue } from "../assets/images/logo/Spacebar_Icon.svg";
import useLogger from "../hooks/useLogger";
import AccountStore from "../stores/AccountStore";
import User from "../stores/objects/User";
import Snowflake from "../utils/Snowflake";
import Avatar from "./Avatar";
import { HorizontalDivider } from "./Divider";
import Tooltip from "./Tooltip";

const Container = styled.div`
	background-color: #252525;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	width: 280px;
	max-height: 600px;
	overflow: hidden;
	// heavy shadow
	box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 4px 8px rgb(0 0 0 / 15%);
`;

const Top = styled.div`
	display: flex;
	flex-direction: column;
`;

const Bottom = styled.div`
	display: flex;
	flex-direction: column;
	background-color: var(--background-tertiary);
	border-radius: 4px;
	margin: 0 16px 16px;
	max-height: 340px;
`;

const Section = styled.div`
	padding: 12px;
	display: flex;
	justify-content: space-between;
	display: flex;
	flex-direction: column;
`;

const UsernameWrapper = styled.div`
	text-overflow: clip;
	white-space: nowrap;
	overflow: hidden;
`;

const NicknameText = styled.span`
	font-size: 20px;
	font-weight: var(--font-weight-bold);
`;

const UsernameText = styled.span`
	font-size: 14px;
	font-weight: var(--font-weight-medium);
`;

const Heading = styled.span`
	display: flex;
	font-weight: var(--font-weight-bold);
	margin-bottom: 6px;
	font-size: 12px;
	user-select: none;
`;

const MemberSinceContainer = styled.div`
	display: flex;
	flex-direction: row;
	column-gap: 8px;
	align-items: center;
	user-select: none;
`;

const MemberSinceText = styled.span`
	font-size: 14px;
	font-weight: var(--font-weight-regular);
`;

function UserProfilePopout({ user }: { user: User | AccountStore }) {
	const logger = useLogger("UserProfilePopout");
	// if (!member.user) {
	// 	logger.error("member.user is undefined");
	// 	return null;
	// }
	if (!user) {
		logger.error("user is undefined");
		return null;
	}
	const id = user.id;
	const { timestamp: createdAt } = Snowflake.deconstruct(id);

	return (
		<Container>
			<Top>
				<Avatar
					style={{ margin: "22px 16px" }}
					size={80}
					onClick={() => {
						// TODO: open profile modal
					}}
					user={user}
				/>
			</Top>
			<Bottom>
				<Section>
					<div>
						<UsernameWrapper>
							<NicknameText>{user.username}</NicknameText>
							<div>
								<UsernameText>
									{user.username}#{user.discriminator}
								</UsernameText>
							</div>
						</UsernameWrapper>
					</div>
				</Section>
				<HorizontalDivider
					style={{
						margin: "0 12px",
					}}
				/>
				<Section>
					<Heading>Member Since</Heading>
					<MemberSinceContainer>
						<Tooltip title="Spacebar" placement="top">
							<div>
								<SpacebarLogoBlue width={16} height={16} style={{ borderRadius: "50%" }} />
							</div>
						</Tooltip>
						<MemberSinceText>{dayjs(createdAt).format("MMM D, YYYY")}</MemberSinceText>
						{/* <div
							style={{
								height: "4px",
								width: "4px",
								borderRadius: "50%",
								backgroundColor: "var(--text-disabled)",
							}}
						/> */}

						{/* <Tooltip title={guild.name} placement="top">
							{guild.icon ? (
								<img
									src={REST.makeCDNUrl(CDNRoutes.guildIcon(guild.id, guild.icon, ImageFormat.PNG))}
									width={16}
									height={16}
									loading="lazy"
									style={{
										borderRadius: "50%",
									}}
								/>
							) : (
								<span
									style={{
										fontSize: "16px",
										fontWeight: "bold",
										cursor: "pointer",
									}}
								>
									{guild.acronym}
								</span>
							)}
						</Tooltip>
						<MemberSinceText>{dayjs(member.joined_at).format("MMM D, YYYY")}</MemberSinceText> */}
					</MemberSinceContainer>
				</Section>
			</Bottom>
		</Container>
	);
}

export default UserProfilePopout;
