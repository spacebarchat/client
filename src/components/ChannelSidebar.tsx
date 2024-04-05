import { useWindowSize } from "@uidotdev/usehooks";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { isDesktop } from "react-device-detect";
import styled from "styled-components";
import { isTouchscreenDevice } from "../utils/isTouchscreenDevice";
import ChannelHeader from "./ChannelHeader";
import ChannelList from "./ChannelList/ChannelList";
import Container from "./Container";
import UserPanel from "./UserPanel";

const Wrapper = styled(Container)`
	display: flex;
	flex-direction: column;
	background-color: var(--background-secondary);
`;

function ChannelSidebar() {
	const windowSize = useWindowSize();
	//const isSmallScreen = useMediaQuery("only screen and (max-width: 810px)");
	const [size, setSize] = useState<number | undefined>();

	useEffect(() => {
		if (!windowSize.width) return;
		const screenPercent = (windowSize.width * 80) / 100;
		setSize(screenPercent - 72);
	}, [windowSize]);

	return (
		<Wrapper
			style={
				!isDesktop
					? {
							width: size,
					  }
					: {
							flex: "0 0 240px",
					  }
			}
		>
			{/* TODO: replace with dm search if no guild */}
			<ChannelHeader />
			<ChannelList />
			{!isTouchscreenDevice && <UserPanel />}
		</Wrapper>
	);
}

export default observer(ChannelSidebar);
