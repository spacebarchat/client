import styled from "styled-components";
import useLogger from "../../hooks/useLogger";
import GuildMember from "../../stores/objects/GuildMember";
import User from "../../stores/objects/User";
import Snowflake from "../../utils/Snowflake";
import Avatar from "../Avatar";
import { HorizontalDivider } from "../Divider";

import { CDNRoutes, ImageFormat } from "@spacebarchat/spacebar-api-types/v9";
import dayjs from "dayjs";
import { ReactComponent as SpacebarLogoBlue } from "../../assets/images/logo/Spacebar_Icon.svg";
import { useAppStore } from "../../stores/AppStore";
import REST from "../../utils/REST";
import Floating from "./Floating";
import FloatingTrigger from "./FloatingTrigger";

const Container = styled.div`
	background-color: #252525;
	border-radius: 4px;
	display: flex;
	flex-direction: column;
	width: 340px;
	max-height: 600px;
	overflow: hidden;
	box-shadow: 0 0 0 1px rgb(0 0 0 / 15%), 0 4px 8px rgb(0 0 0 / 15%);
	color: var(--text);
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
	gap: 8px;

	& > :first-child {
		padding: 12px 12px 0 12px;
	}

	& > :nth-child(n + 3) {
		padding: 0 12px;
	}

	& > :last-child {
		padding: 0 12px 12px 12px;
	}
`;

const Section = styled.div`
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

const RoleList = styled.div`
	display: flex;
	flex-wrap: wrap;
	position: relative;
	margin-top: 2px;
`;

const RolePillDot = styled.span<{ color?: string }>`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 12px;
	height: 12px;
	border-radius: 50%;
	padding: 0;
	margin: 0 4px;
	background-color: ${(props) => props.color ?? "var(--text-disabled)"};
`;

const RolePill = styled.div`
	display: flex;
	align-items: center;
	font-size: 12px;
	font-weight: var(--font-weight-medium);
	background-color: var(--background-primary-alt);
	border-radius: 12px;
	box-sizing: border-box;
	height: 22px;
	margin: 0 4px 4px 0;
	padding: 8px;
`;

const RoleName = styled.div`
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	max-width: 200px;
`;

interface Props {
	user: User;
	member?: GuildMember;
}

function UserProfilePopout({ user, member }: Props) {
	const app = useAppStore();
	const logger = useLogger("UserProfilePopout");

	const id = user.id;
	const { timestamp: createdAt } = Snowflake.deconstruct(id);
	const presence = app.presences.get(user.id);

	return (
		<Container>
			<Top>
				<Avatar
					style={{ margin: "22px 16px" }}
					size={80}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						// TODO: open profile modal
						logger.debug("open profile modal");
					}}
					user={user}
					presence={presence}
					statusDotStyle={{
						width: 16,
						height: 16,
					}}
					showPresence
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
						<Floating
							placement="top"
							type="tooltip"
							props={{
								content: <span>Spacebar</span>,
							}}
						>
							<FloatingTrigger>
								<div>
									<SpacebarLogoBlue width={16} height={16} style={{ borderRadius: "50%" }} />
								</div>
							</FloatingTrigger>
						</Floating>
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

								<Floating
									placement="top"
									type="tooltip"
									props={{
										content: <span>{member.guild.name}</span>,
									}}
								>
									<FloatingTrigger>
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
									</FloatingTrigger>
								</Floating>
								<MemberSinceText>{dayjs(member.joined_at).format("MMM D, YYYY")}</MemberSinceText>
							</>
						)}
					</MemberSinceContainer>
				</Section>

				{member && (
					<Section>
						<Heading>{member.roles.length ? "Roles" : "No Roles"}</Heading>
						<RoleList>
							{member.roles.map((x, i) => (
								<RolePill key={i}>
									<RolePillDot color={x.color} />
									<RoleName>{x.name}</RoleName>
								</RolePill>
							))}
						</RoleList>
					</Section>
				)}
			</Bottom>
		</Container>
	);
}

export default UserProfilePopout;
