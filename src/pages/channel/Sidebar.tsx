import React from "react";
import { List, Heading, Box, Center, NativeBaseProvider, HStack, Text } from "native-base";
import { FlatList } from "native-base";
import { FaChevronDown, FaHashtag, FaVolumeUp } from "../../assets/images/icons";

const Sidebar = () => {
	const data = [
		{ id: "1", name: "general", parent_id: "937839374384949", icon: "voice", type: "voice" },
		{ id: "1", name: "general", parent_id: "937839374384949", icon: "voice", type: "voice" },
		{ id: "1", name: "general", parent_id: "937839374384949", icon: "text", type: "text" },
		{ id: "1", name: "general", parent_id: "", icon: "text", type: "text" },
		{
			id: "937839374384949",
			name: "general",
			icon: "category",
			type: "category",
		},
	];

	function renderChannels(d) {
		return (
			<FlatList
				data={d}
				renderItem={({ item }) => (
					<Box
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
			/>
		);
	}

	return (
		<Box
			w="80%"
			style={{
				borderLeftWidth: 1,
				borderLeftColor: "grey",
			}}
		>
			{renderChannels(data.filter((x) => !x.parent_id && x.type !== "category"))}

			<FlatList
				data={data.filter((x) => x.type === "category")}
				renderItem={({ item }) => (
					<Box
						px={5}
						py={1}
						style={{
							flexDirection: "row",
							alignItems: "center",
							borderBottomWidth: 1,
							borderBottomColor: "grey",
						}}
					>
						{item.icon === "text" && <FaHashtag size="18px" />}
						{item.icon === "voice" && <FaVolumeUp size="18px" />}
						<FaChevronDown size="18px" />
						<Text mx={1}>{item.name}</Text>

						{renderChannels(data.filter((x) => x.parent_id === item.id))}
						{/* Horizontal layout */}
					</Box>
				)}
				keyExtractor={(item) => item.id}
			/>
		</Box>
	);
};

export default Sidebar;
