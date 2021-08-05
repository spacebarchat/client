// import { Client, ClientUser } from "fosscord.js/webpack/fosscord";
// const Discord = require("discord.js/webpack/discord");
// const Discord = require("fosscord.js/dist/index");
import Discord, { Client } from "fosscord.js";

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
		"GUILD_MEMBERS",
		"GUILD_MESSAGES",
		"GUILD_MESSAGE_REACTIONS",
		"GUILD_MESSAGE_TYPING",
		"GUILD_PRESENCES",
		"GUILD_VOICE_STATES",
		"GUILD_WEBHOOKS",
	],
});
export default client;

// @ts-ignore
globalThis.client = client;
console.log(client);

client.on("ready", () => console.log("ready " + client.user?.tag));
client.on("message", (msg: any) => console.log(msg.content));
client.on("raw", (event: any) => console.log(event));
