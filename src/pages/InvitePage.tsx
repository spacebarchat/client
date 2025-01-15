import Container from "@components/Container";
import { InviteModal, InviteUnauthedModal } from "@components/modals";
import { useAppStore } from "@hooks/useAppStore";
import { APIInvite, Routes } from "@spacebarchat/spacebar-api-types/v9";
import { REST } from "@utils";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";

function InvitePage() {
	const app = useAppStore();
	const [inviteData, setInviteData] = React.useState<APIInvite>();
	const [error, setError] = React.useState<string>();
	const { code } = useParams<{ code: string }>();

	useEffect(() => {
		if (!code) {
			setError("No invite code provided");
			return;
		}

		console.log("Invite code: ", code);

		// fetch invite data
		app.rest
			.get<APIInvite>(Routes.invite(code))
			.then((data) => setInviteData(data))
			.catch((e) => setError(e.message));
	}, []);

	if (error) {
		return (
			<Container>
				<h1>Error</h1>
				<p>{error}</p>
			</Container>
		);
	}

	if (!inviteData) {
		return (
			<Container>
				<h1>Loading...</h1>
			</Container>
		);
	}

	const splashUrl = REST.makeCDNUrl(`/splashes/${inviteData.guild?.id}/${inviteData.guild?.splash}.png`);

	return (
		<Container
			style={{
				backgroundImage: `url(${splashUrl})`,
				backgroundRepeat: "no-repeat",
				backgroundSize: "cover",
			}}
		>
			{app.token ? (
				<InviteModal type="invite" inviteData={inviteData} onClose={() => {}} />
			) : (
				<InviteUnauthedModal type="invite" inviteData={inviteData} onClose={() => {}} />
			)}
		</Container>
	);
}

export default InvitePage;
