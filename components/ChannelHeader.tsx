import { observer } from "mobx-react";
import { Platform } from "react-native";
import { Surface, Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../constants/Colors";
import Channel from "../stores/Channel";
import Container from "./Container";

interface Props {
	channel: Channel;
}

function ChannelHeader({ channel }: Props) {
	const theme = useTheme<CustomTheme>();

	const style = Platform.isMobile
		? { backgroundColor: theme.colors.palette.backgroundPrimary60 }
		: { backgroundColor: theme.colors.palette.backgroundPrimary100 };

	return (
		<Container
			testID="chatHeader"
			verticalCenter
			element={Surface}
			elevation={1}
			style={[
				{
					height: 48,
				},
				style,
			]}
		>
			<Text>#{channel.name}</Text>
		</Container>
	);
}

export default observer(ChannelHeader);
