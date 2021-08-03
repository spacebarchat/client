import { Box, FlatList, Image, Tooltip } from "native-base";
import React from "react";

const Sidebar = () => {
	const data = [
		{
			id: "bd7acbea-c1b1-46c2-aed5-3ad53abb28ba",
			title: "First Item",
		},
		{
			id: "3ac68afc-c605-48d3-a4f8-fbd91aa97f63",
			title: "Second Item",
		},
		{
			id: "58694a0f-3da1-471f-bd96-145571e29d72",
			title: "Third Item",
		},
	];

	return (
		<Box h="100%">
			<FlatList
				style={{ flexGrow: 0 }}
				m={1}
				data={data}
				renderItem={({ item }) => (
					<Tooltip label={item.title} placement={"right"}>
						<Image
							my={1}
							source={{
								uri: "https://cdn.discordapp.com/icons/806142446094385153/46c2cc29fb80bd6ce694e67d3580e5be.webp?size=128",
							}}
							borderRadius={100}
							alt="Guild Icon"
							size={"xs"}
						/>
					</Tooltip>
				)}
				keyExtractor={(item) => item.id}
			/>
		</Box>
	);
};

export default Sidebar;
