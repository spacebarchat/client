import React, { useState } from "react";
import { List, Heading, Box, Center, NativeBaseProvider, HStack, Text } from "native-base";
import { FlatList } from "native-base";
import { FaChevronDown, FaHashtag, FaVolumeUp } from "../../assets/images/icons";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, withSpring } from "react-native-reanimated";

const Sidebar = () => {
	const [data, setData] = useState([
		{ id: "1", name: "general", parent_id: "937839374384949", icon: "voice", type: "voice" },
		{ id: "2", name: "general", parent_id: "937839374384949", icon: "voice", type: "voice" },
		{ id: "3", name: "general", parent_id: "937839374384949", icon: "text", type: "text" },
		{ id: "4", name: "general", parent_id: "", icon: "text", type: "text" },
		{
			id: "937839374384949",
			name: "general",
			icon: "category",
			type: "category",
			collapsed: false,
		},
	]);

	function renderChannels(d: Array<Object>, props?: any) {
		return (
			<FlatList
				data={d}
				renderItem={({ item }) => (
					<Box
						key={item.id}
						px={5}
						py={1}
						style={{
							flexDirection: "row",
							alignItems: "center",
							borderBottomWidth: 1,
							borderBottomColor: "grey",
						}}
					>
						{item.icon === "text" ? <FaHashtag size="18px" /> : null}
						{item.icon === "voice" ? <FaVolumeUp size="18px" /> : null}
						<Text mx={1}>{item.name}</Text>
					</Box>
				)}
				keyExtractor={(item) => item.id}
				{...props}
			/>
		);
	}

	return (
		<Box
			w="80%"
			style={{
				flexDirection: "column",
				justifyContent: "flex-start",
				borderLeftWidth: 1,
				borderLeftColor: "grey",
			}}
		>
			{renderChannels(data.filter((x) => !x.parent_id && x.type !== "category"))}

			<FlatList
				data={data.filter((x) => x.type === "category")}
				renderItem={({ item }) => (
					<Box
						key={item.id}
						px={5}
						py={1}
						style={{
							flexDirection: "column",
							justifyContent: "flex-start",
							alignItems: "flex-start",
							borderBottomWidth: 1,
							borderBottomColor: "grey",
						}}
					>
						<Pressable
							style={{
								flexDirection: "row",
								alignItems: "center",
								borderBottomWidth: 1,
								borderBottomColor: "grey",
							}}
							onPress={() => {
								const d = [...data];
								const i = d.find((x) => x.id === item.id);
								i.collapsed = !i.collapsed;
								setData(d);
							}}
						>
							<FaChevronDown
								size="18px"
								style={item.collapsed && { transform: [{ rotate: "-90deg" }] }}
							/>
							<Text mx={1}>{item.name}</Text>
						</Pressable>
						{!item.collapsed &&
							renderChannels(
								data.filter((x: any) => x.parent_id === item.id),
								{ ml: 2, id: "category" + item.id }
							)}
					</Box>
				)}
				keyExtractor={(item) => item.id}
			/>
		</Box>
	);
};

export default Sidebar;
