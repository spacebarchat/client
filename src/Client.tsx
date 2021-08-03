// import { Client, ClientUser } from "fosscord.js/webpack/fosscord";
// const Discord = require("discord.js/webpack/discord");
// const Discord = require("fosscord.js/dist/index");
import Discord, { Client, Intents } from "fosscord.js";
console.log(Discord);

const client = new Discord.Client({ intents: Intents.ALL });
export default client;

// @ts-ignore
globalThis.client = client;
console.log(client);

client.on("ready", () => console.log("ready " + client.user?.tag));
client.on("message", (msg: any) => console.log(msg.content));
client.on("raw", (event: any) => console.log(event));

