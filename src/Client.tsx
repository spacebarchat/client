import React from "react";
import { Client, Constants } from "fosscord.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ReactNode, useEffect } from "react";
import { useHistory } from "react-router-dom";

const client = new Client({
	intents: [
		"DIRECT_MESSAGES",
		"DIRECT_MESSAGE_REACTIONS",
		"DIRECT_MESSAGE_TYPING",
		"GUILDS",
		"GUILD_BANS",
		"GUILD_EMOJIS_AND_STICKERS",
		"GUILD_INTEGRATIONS",
		"GUILD_INVITES",
		// "GUILD_MEMBERS",
		"GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS",
		"GUILD_MESSAGE_TYPING",
		// "GUILD_PRESENCES",
		"GUILD_VOICE_STATES",
		"GUILD_WEBHOOKS",
	],
});
export default client;

console.log(client);

export function InitClient({ children }: { children?: ReactNode }) {
	let history = useHistory();

	const onInvalidated = () => {
		AsyncStorage.removeItem("token");
		history.push("/login");
	};

	useEffect(() => {
		console.log("Init client");
		client.on("invalidated", onInvalidated);
		AsyncStorage.getItem("token").then((x) => {
			if (!x) return client.emit(Constants.Events.INVALIDATED);
			client.login(x).catch((e) => {});
		});

		return () => {
			client.off("invalidated", onInvalidated);
		};
	}, []);

	return <>{children}</>;
}
