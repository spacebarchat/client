import React, { useContext, useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, useWindowDimensions, View } from "react-native";
import Image from "../components/Image";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import HeaderScrollView from "../components/HeaderScrollView";
import KeyboardAvoidingView from "../components/KeyboardAvoidingView";
import { observer } from "mobx-react";
import { InstancesContext } from "../data/Instances";
import { runInAction, toJS } from "mobx";

export default observer(function Instances() {
	const instances = useContext(InstancesContext);
	const ref = useRef();
	const text = useRef<string>();

	useEffect(() => {
		if (instances.cache.length) return;
		// setIntervalNow(() => {
		instances.load();
		// }, 1000);
	}, []);

	function add() {
		if (!text.current) return;
		try {
			let url = new URL(text.current);
			runInAction(() => {
				instances.cache.push({ name: url.host, url: text.current });
			});
		} catch (error) {}
	}

	return (
		<KeyboardAvoidingView safeArea behavior="padding" className="page instances" style={{ flex: 1, alignItems: "center" }}>
			<View
				className="list"
				style={{ height: "100%", flex: 1, alignItems: "center", flexDirection: "column", justifyContent: "center", maxWidth: 600 }}
			>
				<HeaderScrollView
					keyboardShouldPersistTaps="always"
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
					{Object.values(instances.cache || {}).map((x) => (
						<Pressable
							onPress={(e) => {
								console.log("press", e);
								runInAction(() => {
									instances.cache.forEach((i) => {
										i.selected = false;
									});
									x.selected = true;
								});
							}}
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
							className={"bg-accent " + (x.selected ? "border" : "")}
							key={x!.name}
						>
							{console.log(x.selected)}
							<Image
								source={x?.image || "https://raw.githubusercontent.com/fosscord/fosscord/master/assets/logo.png"}
								style={{ width: 60, height: 60 }}
							/>
							<Text className="text-accent" style={{ textAlign: "center", fontWeight: "300", fontSize: 15, marginTop: 10 }}>
								{x!.name}
							</Text>
						</Pressable>
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
});
