import { Box, FlatList, Avatar, Tooltip, Pressable } from "native-base";
import React from "react";
import client from "../../client";
import { useCache } from "../../util/useCache";

const Sidebar = () => {
	const guilds = useCache(client.guilds).array();

	console.log(guilds);

	return (
		<Box height="100%">
			<FlatList
				style={{ flexGrow: 0, height: "100%" }}
				m={1}
				data={guilds}
				renderItem={({ item }) => (
					<Pressable>
						<Tooltip label={item.name} placement={"right"}>
							<Avatar
								my={1}
								source={{
									uri: item.iconURL({ size: 1024 }),
								}}
								_text={{ color: "white" }}
								size={"sm"}
							>
								{!item.iconURL() && item?.nameAcronym}
							</Avatar>
						</Tooltip>
					</Pressable>
				)}
				keyExtractor={(item) => item.id}
			/>
		</Box>
	);
};

export default Sidebar;
