import { Box, Button, FlatList, FormControl, Heading, IconButton, Image, Input, ScrollView, Text, View } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import Styles, { container, relativeScreenHeight } from "../util/Styles";
import { useHistory } from "react-router";
import { TouchableHighlight, TouchableWithoutFeedback } from "react-native";

export default function Instances() {
	const history = useHistory();
	const [instances, setInstances] = useState([]);
	const [error, setError] = useState();
	const instanceInput = useRef<any>();

	useEffect(() => {
		fetch(`https://raw.githubusercontent.com/fosscord/fosscord-community-instances/main/instances.json`)
			.then((x) => x.json())
			.then((x) => setInstances(x))
			.catch((e) => setError(e));
	}, []);

	return (
		<Modal>
			<View display="flex" justifyContent="space-between" flexDirection="row">
				<Heading>Instances</Heading>
				<TouchableWithoutFeedback onPress={() => history.goBack()}>
					<Text fontSize="30">X</Text>
				</TouchableWithoutFeedback>
			</View>
			<Text color="red">{error}</Text>
			<Heading style={{ marginTop: 10 }} size="lg">
				Explore
			</Heading>
			<FlatList
				style={{ flexShrink: 1, flexGrow: 0, margin: 10 }}
				data={instances}
				horizontal={true}
				renderItem={({ item }) => (
					<TouchableWithoutFeedback
					// TouchableWithoutFeedback is needed to fix scroll inside of modal https://github.com/react-native-modal/react-native-modal/issues/236
					>
						<Box
							style={{
								backgroundColor: "#1f1f1f",
								display: "flex",
								margin: 10,
								padding: 10,
								borderRadius: 10,
								maxHeight: 200,
								alignItems: "center",
							}}
						>
							<Text fontSize="20">{item.name}</Text>
							<Text fontSize="15">{item.description}</Text>

							{item.image && (
								<Image
									style={{ width: 100, height: 100, marginTop: 10, borderRadius: 100 }}
									source={{
										uri: item.image,
									}}
									alt={item.name}
								/>
							)}
						</Box>
					</TouchableWithoutFeedback>
				)}
			></FlatList>
			<Heading style={{ marginTop: 10 }} size="lg">
				Manual
			</Heading>
			<FormControl style={{ marginBottom: 20, marginTop: 10 }}>
				<FormControl.Label>Instance URL</FormControl.Label>
				<Input style={{ flexGrow: 1 }} ref={instanceInput} type="url" placeholder="Enter instance url" />
			</FormControl>
			<Button style={{ margin: 0, marginBottom: 20 }}>Connect</Button>
		</Modal>
	);
}
