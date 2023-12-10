import { CDNRoutes, ImageFormat } from "@spacebarchat/spacebar-api-types/v9";
import dayjs from "dayjs";
import styled from "styled-components";
import { ReactComponent as SpacebarLogoBlue } from "../assets/images/logo/Spacebar_Icon.svg";
import useLogger from "../hooks/useLogger";
import AccountStore from "../stores/AccountStore";
import GuildMember from "../stores/objects/GuildMember";
import Presence from "../stores/objects/Presence";
import User from "../stores/objects/User";
import REST from "../utils/REST";
import Snowflake from "../utils/Snowflake";
import Avatar from "./Avatar";
import { HorizontalDivider } from "./Divider";
import Tooltip from "./Tooltip";

const Container = styled.div`
	background-color: #252525;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	width: 340px;
	max-height: 600px;
	overflow: hidden;
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

const Acronym = styled.div`
	font-size: 8px;
	background-image: none;
	background-color: var(--background-secondary);
	text-align: center;
	width: 16px;
	height: 16px;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const AcronymText = styled.div`
	font-weight: var(--font-weight-bold);
	overflow: hidden;
	white-space: nowrap;
`;

interface Props {
	user?: User | AccountStore;
	presence?: Presence;
	member?: GuildMember;
}

function UserProfilePopout({ user, presence, member }: Props) {
	const logger = useLogger("UserProfilePopout");
	if (!user && !member?.user) {
		logger.error("neither user, nor a valid member was provided");
		return null;
	}

	user = user ?? member!.user!;
	const id = user.id;
	const { timestamp: createdAt } = Snowflake.deconstruct(id);

	return (
		<Container>
			<Top>
				<Avatar
					style={{ margin: "22px 16px" }}
					size={80}
					onClick={(e) => {
						// TODO: open profile modal
						e.preventDefault();
						e.stopPropagation();
					}}
					user={user}
					presence={presence}
					statusDotStyle={{
						width: 16,
						height: 16,
					}}
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
						{member && (
							<>
								<div
									style={{
										height: "4px",
										width: "4px",
										borderRadius: "50%",
										backgroundColor: "var(--text-disabled)",
									}}
								/>

								<Tooltip title={member.guild.name} placement="top">
									{member.guild.icon ? (
										<img
											src={REST.makeCDNUrl(
												CDNRoutes.guildIcon(
													member.guild.id,
													member.guild.icon,
													ImageFormat.PNG,
												),
											)}
											width={16}
											height={16}
											loading="lazy"
											style={{
												borderRadius: "50%",
											}}
										/>
									) : (
										<Acronym>
											<AcronymText>{member.guild.acronym}</AcronymText>
										</Acronym>
									)}
								</Tooltip>
								<MemberSinceText>{dayjs(member.joined_at).format("MMM D, YYYY")}</MemberSinceText>
							</>
						)}
					</MemberSinceContainer>
				</Section>
			</Bottom>
		</Container>
	);
}

export default UserProfilePopout;
