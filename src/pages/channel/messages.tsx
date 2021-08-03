import { Box, FlatList, Heading, HStack, Image, Pressable, Text } from "native-base";
import React from "react";

import exampleMessages from "../../assets/data/exampleMessages.json";
import { relativeTime } from "../../util/Time";

export default function messages() {
	return <FlatList data={exampleMessages} keyExtractor={(item) => item.id} renderItem={renderMessage}></FlatList>;
}

export function renderMessage({ index, item, seperators }: any) {
	const time = new Date(item.timestamp);
	console.log({ item, time });
	return (
		<Box style={{ borderColor: "white", borderWidth: 1, height: "100%", width: "100%" }} key={item.id}>
			<Heading size="md">{item.author.username}</Heading>
			<Heading size="xs">{relativeTime(item.timestamp)}</Heading>
			<Text>{item.content && item.content}</Text>
			<Text>{item.embeds && item.embeds.map((x: any) => <></>)}</Text>
			{item.attachments &&
				item.attachments.map((x: any) => (
					<Image
						style={{ height: x.height / 3, width: x.width / 3 }}
						alt="Test"
						source={{
							uri: x.url,
						}}
					/>
				))}
			{item.reactions && (
				<HStack>
					{item.reactions.map((x: any) => {
						return (
							<Box mx={2}>
								<Pressable>{x.emoji.id ? x.emoji.id : x.emoji.name}</Pressable>
								<Text>{x.count}</Text>
							</Box>
						);
					})}
				</HStack>
			)}
			{item.embeds &&
				item.embeds.map((embed: any) => {
					return (
						<Box>
							<Heading size="xl">
								<a>{embed.title}</a>
							</Heading>
							<Text>{embed.description}</Text>
						</Box>
					);
				})}
		</Box>
	);
}
