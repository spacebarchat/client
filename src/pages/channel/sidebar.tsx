import React from "react";
import { Box, Text, ScrollView, Center, VStack, HStack } from "native-base";
import { FlatList } from "native-base";
import { FaChevronDown, FaHashtag, FaVolumeUp } from "../../assets/images/icons";
import { Pressable } from "react-native";
import useForceUpdate from "../../util/useForceUpdate";
import { Guild, GuildChannel, ThreadChannel } from "fosscord.js";
import { Link } from "../../util/Router";
import { useCache } from "../../util/useCache";

const Sidebar = ({ guild }: { guild?: Guild }) => {
	const forceUpdate = useForceUpdate();

	const data =
		useCache(guild?.channels)
			?.array()
			.filter((x) => x.type === "GUILD_CATEGORY" || guild?.me?.permissionsIn(x).has("VIEW_CHANNEL")) || [];

	// @ts-ignore
	globalThis.test = guild?.channels?.cache?.array();

	function renderChannels(d: (GuildChannel | ThreadChannel)[]) {
		return d.map((item) => (
			<Link to={`/channels/${guild?.id}/${item?.id}`} style={{ textDecoration: "none" }} key={item.id}>
				<HStack px={5} py={1}>
					{item.type === "GUILD_TEXT" && <FaHashtag size="18px" />}
					{item.type === "GUILD_VOICE" && <FaVolumeUp size="18px" />}
					<Text mx={1}>{item.name}</Text>
				</HStack>
			</Link>
		));
	}

	console.log(data);

	return (
		<VStack
			w="80%"
			h="100%"
			style={{
				flexDirection: "row",
				justifyContent: "flex-start",
				alignItems: "flex-start",
				borderLeftWidth: 1,
				borderLeftColor: "grey",
			}}
		>
			<Box
				style={{
					width: "100%",
					height: 30,
					borderBottomColor: "grey",
					borderBottomWidth: 2,
				}}
			>
				<Center style={{ width: "100%", height: "100%" }}>
					<Text>{guild?.name || "Server"}</Text>
				</Center>
			</Box>
			<ScrollView height="100%" bounces={false} persistentScrollbar mt={2}>
				{renderChannels(data.filter((x) => !x.parentId && x.type !== "GUILD_CATEGORY"))}

				{data
					.filter((x) => x.type === "GUILD_CATEGORY")
					.filter(
						(category) =>
							data.find((x) => x.parentId === category.id) ||
							guild?.me?.permissionsIn(category).has("MANAGE_CHANNELS")
					)
					.map((item) => (
						<Box
							key={item.id}
							px={5}
							py={1}
							style={{
								flexDirection: "column",
								justifyContent: "flex-start",
								alignItems: "flex-start",
							}}
						>
							<Pressable
								style={{
									flexDirection: "row",
									alignItems: "center",
								}}
								onPress={() => {
									const i = data.find((x) => x.id === item.id);
									// @ts-ignore
									i.collapsed = !i.collapsed;
									forceUpdate();
								}}
							>
								<FaChevronDown
									size="18px"
									// @ts-ignore
									style={item.collapsed && { transform: [{ rotate: "-90deg" }] }}
								/>
								<Text mx={1}>{item.name}</Text>
							</Pressable>
							{(item as any).collapsed == false &&
								renderChannels(data.filter((x: any) => x.parentId === item.id))}
						</Box>
					))}
			</ScrollView>
		</VStack>
	);
};

export default Sidebar;
