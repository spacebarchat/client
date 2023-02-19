import { observer } from "mobx-react";
import React from "react";
import { Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../constants/Colors";
import Channel from "../stores/Channel";
import Guild from "../stores/Guild";
import Container from "./Container";
import MemberList from "./MemberList";

interface Props {
	guild: Guild;
	channel: Channel;
}

function MembersListMobile({ guild, channel }: Props) {
	const theme = useTheme<CustomTheme>();

	return (
		<Container
			testID="memberListContainer"
			flexOne
			style={{
				borderTopLeftRadius: 10,
				borderTopRightRadius: 10,
				backgroundColor: theme.colors.palette.backgroundPrimary70,
			}}
		>
			<Container
				testID="memberListHeader"
				verticalCenter
				horizontalCenter
				style={{
					height: 74,
					padding: 10,
				}}
			>
				<Text>Member List Header</Text>
			</Container>
			<Container
				testID="memberListListContainer"
				verticalCenter
				flexOne
				style={{
					padding: 10,
					backgroundColor: theme.colors.palette.backgroundPrimary100,
				}}
			>
				<MemberList channel={channel} guild={guild} />
			</Container>
		</Container>
	);
}

export default observer(MembersListMobile);
