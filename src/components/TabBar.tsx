import React, { Dispatch, SetStateAction, useState } from "react";
import { HStack, Tooltip } from "native-base";
import { Image, Pressable } from "react-native";
import FosscordLogo from "../assets/images/icon_round_256_blue.png";
import { FaCogs, FaSingOutAlt, FaUserCircle, FaUsers } from "../assets/images/icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DevSettings from "./DevSettings";
import SettingsModal from "../pages/settings/modal";

export default function ({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
	return (
		<HStack
			w="100%"
			style={{
				justifyContent: "space-around",
				borderTopColor: "grey",
				borderTopWidth: 1,
			}}
			p={1}
		>
			{/* <SettingsModal open={settingsModal} setOpen={setSettingsModal} /> */}
			{/* Home */}
			<Tooltip label={"Home"} placement={"top"}>
				<Pressable>
					<Image
						style={{
							width: 40,
							height: 40,
						}}
						// @ts-ignore
						source={FosscordLogo}
						mx={1}
					/>
				</Pressable>
			</Tooltip>
			{/* Friends */}
			<Tooltip label={"Friends"} placement={"top"}>
				<Pressable>
					<FaUsers
						style={{
							width: 40,
							height: 40,
						}}
						mx={1}
					/>
				</Pressable>
			</Tooltip>
			{/* Profile */}
			<Tooltip label={"Profile"} placement={"top"}>
				<Pressable>
					<FaUserCircle
						style={{
							width: 40,
							height: 40,
						}}
						mx={1}
					/>
				</Pressable>
			</Tooltip>
			{/* Settings */}
			<Tooltip label={"Settings"} placement={"top"}>
				<Pressable onPress={() => setOpen(true)}>
					<FaCogs
						style={{
							width: 40,
							height: 40,
						}}
						mx={1}
					/>
				</Pressable>
			</Tooltip>
			{/* Logout */}
			<Tooltip label={"Logout"} placement={"top"}>
				<Pressable
					onPress={() => {
						AsyncStorage.removeItem("token");
						DevSettings.reload();
					}}
				>
					<FaSingOutAlt
						style={{
							width: 40,
							height: 40,
						}}
						mx={1}
					/>
				</Pressable>
			</Tooltip>
		</HStack>
	);
}
