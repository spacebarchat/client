import { Box, FlatList } from "native-base";
import React from "react";

import exampleMessages from "../../assets/data/exampleMessages.json";

export default function messages() {
	return (
		<Box>
			<FlatList data={exampleMessages} keyExtractor={(item) => item.id} renderItem={renderMessage}></FlatList>
		</Box>
	);
}

export function renderMessage({ index, item, seperators }: any) {
	console.log(item);
	return <Box key={item.id}>{item.content}</Box>;
}
