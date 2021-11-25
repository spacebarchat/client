import React, { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import instances, { Instance } from "../reducers/instances";
import { useAppDispatch, useAppSelector } from "../util/Store";
import Image from "../components/Image";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import HeaderScrollView from "../components/HeaderScrollView";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";

export default function Instances() {
	const [edit, setEdit] = useState(false);
	const dispatch = useAppDispatch();
	const data = useAppSelector((state) => state.instances.entities);
	const ref = useRef();
	const text = useRef<string>();

	useEffect(() => {
		dispatch(instances.load());
	}, []);

	function add() {
		if (!text.current) return;
		try {
			let url = new URL(text.current);
			console.log(url);
			dispatch(instances.addOne({ name: url.host, url: text.current }));
			setEdit(false);
			console.log(text.current);
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<KeyboardAvoidingView safeArea behavior="padding" className="page instances">
			<View className="list" style={{ height: "100%", flex: 1 }}>
				<HeaderScrollView
					titleStyle={{ textAlign: "center", width: "100%" }}
					title="Instances"
					contentContainerStyle={{ display: "flex", flexWrap: "wrap", flexDirection: "row", justifyContent: "center" }}
				>
					{Object.values(data).map((x) => (
						<View accessible className="entry" key={x!.name}>
							<Image
								source={x?.image || "https://raw.githubusercontent.com/fosscord/fosscord/master/assets/logo.png"}
								style={{ borderRadius: 500, width: 60, height: 60 }}
							/>
							<Text>{x!.name}</Text>
						</View>
					))}
				</HeaderScrollView>
				<View className="entry" style={{ backgroundColor: "transparent", flexDirection: "row", padding: 0 }}>
					<TextInput onChangeText={(x) => (text.current = x)} ref={ref} onSubmitEditing={add} autoFocus placeholder="URL" />
					<Button onPress={add}>Add</Button>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
