import React from "react";
import { List, Heading, Box, Center, NativeBaseProvider, HStack, Text } from "native-base";
import { FlatList } from "native-base";
// import { FaHashtag } from "../../assets/images/icons";c

const Sidebar = () => {
	const data = [{ id: "1", name: "general", parent_id: "937839374384949", icon: "" }];

	return (
		<Box w="80%">
			<Heading fontSize={24}>Channel</Heading>
			{/* <FlatList
				data={data}
				renderItem={({ item }) => (
					<HStack px={5} py={2}>
						<FaHashtag />
						<Text>{item.name}</Text>
					</HStack>
				)}
				keyExtractor={(item) => item.id}
			/> */}

			{data.map((item) => {
				return (
					<Box
						px={5}
						py={2}
						style={{
							flexDirection: "row",
							alignItems: "center",
						}}
					>
						{/* <FaHashtag size="1rem" /> */}
						<Text>{item.name}</Text>
					</Box>
				);
			})}
		</Box>
	);
};

export default Sidebar;
