import { Box, FlatList, Text, Image, HStack, Pressable } from "native-base";
import React from "react";
import { FaCommentsAlt, FaTimes } from "../assets/images/icons";

const Friends = () => {
	const data = [
		{
			bot: true,
			id: "253423543543234324354334324324",
			username: "GitHub",
			avatar: "https://avatars.githubusercontent.com/u/53957363?v=4",
			discriminator: "0000",
		},
		{
			bot: true,
			id: "4324235435234r23452",
			username: "Samuel",
			avatar: "https://avatars.githubusercontent.com/u/53957363?v=4",
			discriminator: "0000",
		},
		{
			bot: true,
			id: "89327483456348932809823ß",
			username: "Stefan",
			avatar: "https://avatars.githubusercontent.com/u/53957363?v=4",
			discriminator: "0000",
		},
		{
			bot: true,
			id: "8061498703fd301837",
			username: "Conner",
			avatar: "https://avatars.githubusercontent.com/u/53957363?v=4",
			discriminator: "0000",
		},
	];

	return (
		<FlatList
			bounces={false}
			style={{
				flexGrow: 0,
			}}
			data={data}
			renderItem={({ item }) => (
				<HStack
					key={item.id}
					style={{
						justifyContent: "space-between",
						alignItems: "center",
						borderBottomColor: "grey",
						borderBottomWidth: 2,
					}}
					px={5}
					py={1}
				>
					<HStack
						style={{
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						<Image
							style={{ width: 50, height: 50, borderRadius: 100 }}
							alt="Profile Image"
							source={{ uri: item.avatar }}
						/>
						<Text mx={1}>{item.username}</Text>
					</HStack>
					<HStack>
						<Pressable>
							<FaCommentsAlt py={1} />
						</Pressable>
						<Pressable>
							<FaTimes py={1} />
						</Pressable>
					</HStack>
				</HStack>
			)}
			keyExtractor={(item) => item.id}
		/>
	);
};

export default Friends;
