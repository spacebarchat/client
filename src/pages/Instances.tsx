import React, { useEffect, useRef, useState } from "react";
import { Platform, Text, useWindowDimensions, View } from "react-native";
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
		} catch (error) {}
	}

	return (
		<KeyboardAvoidingView safeArea behavior="padding" className="page instances" style={{ flex: 1, alignItems: "center" }}>
			<View
				className="list"
				style={{ height: "100%", flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center", maxWidth: 600 }}
			>
				<HeaderScrollView
					titleStyle={{ textAlign: "center", width: "100%" }}
					title="Instances"
					contentContainerStyle={{
						display: "flex",
						flexWrap: "wrap",
						flexDirection: "row",
						justifyContent: "center",
						paddingBottom: 10,
					}}
					style={{ flexGrow: 1 }}
				>
					{Object.values(data).map((x) => (
						<View
							accessible
							style={{
								display: "flex",
								alignItems: "center",
								margin: 10,
								paddingHorizontal: 10,
								paddingVertical: 15,
								borderRadius: 10,
								width: 135,
							}}
							className="bg-accent"
							key={x!.name}
						>
							<Image
								source={x?.image || "https://raw.githubusercontent.com/fosscord/fosscord/master/assets/logo.png"}
								style={{ width: 60, height: 60 }}
							/>
							<Text className="text-accent" style={{ textAlign: "center", fontWeight: "300", fontSize: 15, marginTop: 10 }}>
								{x!.name}
							</Text>
						</View>
					))}
				</HeaderScrollView>
				<View style={{ backgroundColor: "transparent", padding: 10, width: "100%", display: "flex" }}>
					<View style={{ display: "flex", flexDirection: "row", width: "100%", justifyContent: "center", alignItems: "center" }}>
						<TextInput
							style={{
								width: useWindowDimensions().width > 435 ? 390 : 235,
								marginRight: 10,
							}}
							onChangeText={(x) => (text.current = x)}
							ref={ref}
							onSubmitEditing={add}
							placeholder="URL"
						/>
						<Button style={{ margin: 0, paddingHorizontal: 10, paddingVertical: 5 }} onPress={add}>
							Add
						</Button>
					</View>
				</View>
			</View>
		</KeyboardAvoidingView>
	);
}
