import { observer } from "mobx-react";
import React from "react";
import { Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../../constants/Colors";
import Channel from "../../stores/Channel";
import Guild from "../../stores/Guild";
import Container from "../Container";
import MemberListComponent from "./MemberList";

interface Props {
	guild: Guild;
	channel: Channel;
}

function MemberList({ guild, channel }: Props) {
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
				<MemberListComponent channel={channel} guild={guild} />
			</Container>
		</Container>
	);
}

export default observer(MemberList);
