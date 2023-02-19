import { observer } from "mobx-react";
import { Platform } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { CustomTheme } from "../constants/Colors";
import Channel from "../stores/Channel";
import Container from "./Container";

interface Props {
	channel: Channel;
}

function ChannelHeader({ channel }: Props) {
	const theme = useTheme<CustomTheme>();

	const containerProps = Platform.isMobile
		? ({
				testID: "chatHeader",
				style: {
					height: 48,
					padding: 10,
					backgroundColor: theme.colors.palette.backgroundPrimary60,
				},
		  } as const)
		: ({
				testID: "chatHeader",
				verticalCenter: true,
				style: {
					height: 48,
					paddingHorizontal: 10,
					backgroundColor: theme.colors.palette.backgroundPrimary100,
				},
				isSurface: true,
				elevation: 1,
		  } as const);

	return (
		<Container {...containerProps}>
			<Text>#{channel.name}</Text>
		</Container>
	);
}

export default observer(ChannelHeader);
