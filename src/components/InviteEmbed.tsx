import Container from "@components/Container";
import { useAppStore } from "@hooks/useAppStore";
import useLogger from "@hooks/useLogger";
import { APIInvite, CDNRoutes, ImageFormat, Routes } from "@spacebarchat/spacebar-api-types/v9";
import { asAcronym, REST } from "@utils";
import { useEffect, useState } from "react";
import styled from "styled-components";
import Button from "./Button";

const MainContainer = styled(Container)`
	background-color: var(--background-secondary);
	border-radius: 8px;
	max-width: 430px;
	min-width: 160px;
	padding: 16px;
	display: flex;
	flex-direction: column;
	justify-self: start;
	align-self: start;
	width: 100%;
`;

const Wrapper = styled.div``;

const Header = styled.h3`
	margin: 0 0 12px 0;
	font-size: 16px;
	font-weight: var(--font-weight-medium);
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	color: var(--text-secondary);
`;

const SplashWrapper = styled.div`
	border-radius: 8px 8px 0 0;
	height: 64px;
	margin: -16px -16px 16px -16px;
	overflow: hidden;
`;

const Splash = styled.img`
	object-fit: cover;
	width: 100%;
	height: 100%;
`;

const ContentWrapper = styled.div`
	display: flex;
	flex-flow: row wrap;
	gap: 16px;
`;

const GuildHeader = styled.div`
	display: flex;
	flex: 1000 0 auto;
	align-items: center;
	max-width: 100%;
	gap: 16px;
`;

const GuildInfo = styled.div`
	display: flex;
	flex: 1;
	min-width: 1px;
	flex-direction: column;
	justify-content: center;
	align-items: stretch;
	flex-wrap: nowrap;
`;

const GuildName = styled.h3`
	margin: 0 0 2px 0;
	font-size: 16px;
	font-weight: var(--font-weight-medium);
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	color: var(--text-header);
`;

const GuildDetailsWrapper = styled.div`
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	column-gap: 12px;
`;

const StatusWrapper = styled.div`
	display: flex;
	flex: 0 1 auto;
	align-items: center;
	flex-flow: nowrap;
	min-width: 0;
`;

const OnlineStatus = styled.div`
	background-color: var(--success);
	border-radius: 50%;
	height: 8px;
	width: 8px;
	margin-right: 4px;
	flex: 0 0 auto;
`;

const OfflineStatus = styled.div`
	background-color: var(--status-offline);
	border-radius: 50%;
	height: 8px;
	width: 8px;
	margin-right: 4px;
	flex: 0 0 auto;
`;

const StatusCount = styled.span`
	margin-right: 0;
	flex: 0 1 auto;
	color: var(--text-header-secondary);
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	font-size: 14px;
`;

const InvalidInviteHeader = styled(GuildName)`
	color: var(--error);
`;

const InvalidInviteDetails = styled.span`
	font-size: 14px;
	color: var(--text-header-secondary);
	font-weight: var(--font-weight-regular);
`;

const JoinButton = styled(Button)`
	height: 40px;
	align-self: center;
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: hidden;
	flex: 1 0 auto;
	width: auto;
`;

interface Props {
	isSelf: boolean;
	code: string;
}

function InviteEmbed({ isSelf, code }: Props) {
	const app = useAppStore();
	const logger = useLogger("InviteEmbed");
	const [data, setData] = useState<APIInvite>();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);

	useEffect(() => {
		app.rest
			.get<APIInvite>(Routes.invite(code), {
				wuth_counts: true,
				with_expiration: true,
			})
			.then((r) => {
				setData(r);
				setLoading(false);
				logger.debug(`Resolved invite: `, r);
			})
			.catch((e) => {
				logger.error(`Error fetching invite: `, e);
				setError(true);
				setLoading(false);
			});
	}, []);

	return (
		<MainContainer>
			{loading && (
				<Wrapper>
					<Header>Resolving Invite</Header>
				</Wrapper>
			)}

			{error && (
				<Wrapper>
					<Header>{isSelf ? "You sent an invite, but..." : "You received an invite, but..."}</Header>
					<ContentWrapper>
						<GuildHeader>
							<div
								style={{
									backgroundColor: "var(--background-secondary-alt)",
									flex: "0 0 auto",
									width: "50px",
									height: "50px",
									borderRadius: "16px",
									backgroundClip: "padding-box",
									backgroundPosition: "center center",
									backgroundSize: "100% 100%",
								}}
							/>
							<GuildInfo>
								<InvalidInviteHeader>Invalid Invite</InvalidInviteHeader>
								<InvalidInviteDetails>Try sending a new invite!</InvalidInviteDetails>
							</GuildInfo>
						</GuildHeader>
					</ContentWrapper>
				</Wrapper>
			)}

			{data && (
				<Wrapper>
					{data.guild!.splash && (
						<SplashWrapper>
							<Splash
								src={REST.makeCDNUrl(
									CDNRoutes.guildSplash(data.guild!.id, data.guild!.splash, ImageFormat.PNG),
								)}
								alt="Guild Splash"
							/>
						</SplashWrapper>
					)}
					<Header>
						{isSelf ? "You sent an invite to join a guild" : "You've been invited to join a guild"}
					</Header>
					<ContentWrapper>
						<GuildHeader>
							<div
								style={{
									backgroundImage: data.guild!.icon
										? `url(${REST.makeCDNUrl(
												CDNRoutes.guildIcon(data.guild!.id, data.guild!.icon, ImageFormat.PNG),
										  )})`
										: asAcronym(data.guild!.name),
									backgroundColor: "var(--background-secondary-alt)",
									flex: "0 0 auto",
									width: "50px",
									height: "50px",
									borderRadius: "16px",
									backgroundClip: "padding-box",
									backgroundPosition: "center center",
									backgroundSize: "100% 100%",
								}}
							/>
							<GuildInfo>
								<GuildName>{data.guild!.name}</GuildName>
								<GuildDetailsWrapper>
									<StatusWrapper>
										<OnlineStatus />
										<StatusCount>
											{/* @ts-expect-error the server is incorrect here */}
											{(data.guild!.presence_count || 0).toLocaleString()} Online
										</StatusCount>
									</StatusWrapper>
									<StatusWrapper>
										<OfflineStatus />
										<StatusCount>
											{/* @ts-expect-error the server is incorrect here */}
											{(data.guild!.member_count || 0).toLocaleString()} Members
										</StatusCount>
									</StatusWrapper>
								</GuildDetailsWrapper>
							</GuildInfo>
						</GuildHeader>
						<JoinButton palette="secondary">Join</JoinButton>
					</ContentWrapper>
				</Wrapper>
			)}
		</MainContainer>
	);
}

export default InviteEmbed;
