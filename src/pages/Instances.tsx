import React, { useEffect, useRef, useState } from "react";
import Modal from "../components/Modal";
import { useHistory } from "react-router";
import { FlatList, Image, Text, TextInput, Pressable, View } from "react-native";
import Button from "../components/Button";

export default function Instances() {
	const history = useHistory();
	const [instances, setInstances] = useState<any>([]);
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
			<View style={{ display: "flex", justifyContent: "space-between", flexDirection: "row" }}>
				<Text>Instances</Text>
				<Pressable onPress={() => history.goBack()}>
					<Text style={{ fontSize: 30 }}>X</Text>
				</Pressable>
			</View>
			<Text style={{ color: "red" }}>{error}</Text>
			<Text style={{ marginTop: 10, fontSize: 30 }}>Explore</Text>
			<FlatList
				style={{ flexShrink: 1, flexGrow: 0, margin: 10 }}
				data={instances}
				horizontal={true}
				renderItem={({ item }) => (
					<Pressable
					// Pressable is needed to fix scroll inside of modal https://github.com/react-native-modal/react-native-modal/issues/236
					>
						<View
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
							<Text style={{ fontSize: 20 }}>{item.name}</Text>
							<Text style={{ fontSize: 15 }}>{item.description}</Text>

							{item.image && (
								<Image
									style={{ width: 100, height: 100, marginTop: 10, borderRadius: 100 }}
									source={{
										uri: item.image,
									}}
								/>
							)}
						</View>
					</Pressable>
				)}
			></FlatList>
			<Text style={{ marginTop: 10, fontSize: 30 }}>Manual</Text>
			<Text>Instance URL</Text>
			<TextInput
				style={{ flexGrow: 1 }}
				ref={instanceInput}
				keyboardType="url"
				textContentType="URL"
				placeholder="Enter instance url"
			/>
			<Button>Connect</Button>
		</Modal>
	);
}
